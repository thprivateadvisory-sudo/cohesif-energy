"""Pub mobile 9:16 de la boutique Cohesif Energy.

Pilote les vraies pages (boutique -> fiche produit -> commande) dans un
navigateur au format téléphone, image par image, avec zooms et touchers,
puis encode en MP4 1080x1920.

Usage : python3 render.py [sortie.mp4] [--stills=t1,t2,...]
Prérequis : pip install playwright imageio-ffmpeg ; dépôts cohesif-energy et
Cohesif-commerce clonés côte à côte.
"""
import sys, subprocess, pathlib, mimetypes, imageio_ffmpeg
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
ENERGY = HERE.parents[1]
COMMERCE = ENERGY.parent / 'Cohesif-commerce'
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
FPS = 30
W, H = 360, 640            # CSS px ; x3 = 1080x1920

args = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = args[0] if args else str(HERE / 'cohesif-energy-boutique-9x16.mp4')
STILLS = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--stills=')), None)

PAGES = {
    'shop': 'https://cohesifenergy.fr/boutique.html',
    'pdp':  'https://cohesifenergy.fr/boutique-borne-recharge-7kw.html',
    'cmd':  'https://cohesifcommerce.fr/commande.html?produit=CE-AC7-POSE&source=cohesifenergy',
}

# ---------- minutage (secondes) ----------
INTRO_END = 2.4
NAV = [(0, 'shop'), (7.75, 'pdp'), (14.95, 'cmd')]
TL = {
    'introEnd': INTRO_END,
    'captions': [
        {'a': 2.7,  'b': 7.6,  'n': '1', 'text': 'Choisissez votre borne'},
        {'a': 8.0,  'b': 14.8, 'n': '2', 'text': 'Borne seule ou pose incluse'},
        {'a': 15.2, 'b': 21.0, 'n': '3', 'text': 'Payez en toute sécurité'},
    ],
    'badge': [21.2, 23.7],
    'outro': 23.6,
}
END = 28.8
TAPS = [  # (début, durée, page, élément)
    (7.0, 0.75, 'shop', 'details'),
    (12.0, 0.75, 'pdp', 'variant'),
    (14.2, 0.75, 'pdp', 'buy'),
    (20.6, 0.75, 'cmd', 'pay'),
]
CLICK_VARIANT_AT = 12.25

# JS de mesure : positions dans le document (px CSS)
MEASURE = {
    'shop': """() => { const d=document.querySelector('a.btn[href="./boutique-borne-recharge-7kw.html"]');
        const m=document.querySelector('a.product-card-media[href="./boutique-borne-recharge-7kw.html"]');
        const r=e=>{const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+scrollY+b.height/2,top:b.top+scrollY,h:b.height}};
        return {details:r(d), card:r(m)} }""",
    'pdp': """() => { const f=document.querySelector('fieldset.variants');
        const v=document.querySelectorAll('label.variant')[1]; const b=document.querySelector('[data-buy-main]');
        const r=e=>{const q=e.getBoundingClientRect();return {x:q.left+q.width/2,y:q.top+scrollY+q.height/2,top:q.top+scrollY,h:q.height}};
        const res={variants:r(f), variant:r(v)};
        v.querySelector('input').click();          // le bouton descend quand la pose est choisie
        res.buy=r(b); return res }""",
    'cmd': """() => { const t=document.querySelector('.co-total'); const p=document.querySelector('a[data-f="payer"]');
        const h=[...document.querySelectorAll('h3')].find(e=>e.textContent.trim()==='Récapitulatif');
        const r=e=>{const q=e.getBoundingClientRect();return {x:q.left+q.width/2,y:q.top+scrollY+q.height/2,top:q.top+scrollY,h:q.height}};
        return {total:r(t), pay:r(p), recap:r(h)} }""",
}

INIT = r"""
(() => {
  if (location.host === 'pub.local') return;
  const css = `#cohesif-ai-widget,#cohesif-ai-agent-btn,[class^="cohesif-ai"]{display:none!important}
    html{scroll-behavior:auto!important}
    *,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}`;
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
  });
})();
"""


def ease(p):
    p = min(1, max(0, p))
    return 4 * p * p * p if p < .5 else 1 - (-2 * p + 2) ** 3 / 2


def track(keys, t):
    """keys: [(temps, valeur|tuple)] ; interpolation easeInOut."""
    if t <= keys[0][0]:
        return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t < t1:
            p = ease((t - t0) / (t1 - t0)) if t1 > t0 else 1
            if isinstance(v0, tuple):
                return tuple(a + (b - a) * p for a, b in zip(v0, v1))
            return v0 + (v1 - v0) * p
    return keys[-1][1]


def page_at(t):
    cur = NAV[0][1]
    for t0, name in NAV:
        if t >= t0:
            cur = name
    return cur


def build_tracks(M):
    """Défilement et caméra (échelle, point visé en coordonnées écran du site)."""
    y_shop = M['shop']['card']['top'] - 90
    y_pdp = M['pdp']['variants']['top'] - 100
    y_cmd = M['cmd']['recap']['top'] - 110
    c = (W / 2, H / 2)
    scroll = {
        'shop': [(2.6, 0), (5.4, y_shop)],
        'pdp':  [(9.2, 0), (10.8, y_pdp), (13.3, y_pdp), (14.0, max(y_pdp, M['pdp']['buy']['top'] - 400))],
        'cmd':  [(16.0, 0), (17.8, y_cmd)],
    }
    det = M['shop']['details']; var = M['pdp']['variant']; tot = M['cmd']['total']
    f_det = (W / 2, det['y'] - y_shop - 40)
    f_var = (W / 2, var['y'] - y_pdp - 20)
    f_tot = (W / 2, tot['y'] - y_cmd + 20)
    cam = {
        'shop': [(0, (1, *c)), (5.8, (1, *c)), (6.8, (1.3, *f_det))],
        'pdp':  [(7.75, (1.0, *c)), (9.2, (1.06, *c)), (9.4, (1, *c)),
                 (11.0, (1, *c)), (11.8, (1.12, *f_var)), (13.3, (1.12, *f_var)), (14.0, (1, *c))],
        'cmd':  [(14.95, (1, *c)), (18.0, (1, *c)), (18.8, (1.12, *f_tot)), (19.8, (1.12, *f_tot)), (20.4, (1, *c))],
    }
    return scroll, cam


def cam_transform(s, fx, fy):
    tx = W / 2 - fx * s
    ty = H * 0.52 - fy * s
    tx = min(0, max(W - W * s, tx))
    ty = min(0, max(H - H * s, ty))
    return tx, ty


def main():
    with sync_playwright() as pw:
        # iframe dans le même processus : sinon Chrome le rend en basse résolution puis l'agrandit (flou)
        b = pw.chromium.launch(executable_path=CHROME, args=[
            '--disable-site-isolation-trials', '--disable-features=IsolateOrigins,site-per-process'])
        ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=3,
                            is_mobile=True, has_touch=True, locale='fr-FR')
        ctx.add_init_script(INIT)

        roots = {'cohesifenergy.fr': ENERGY, 'cohesifcommerce.fr': COMMERCE, 'pub.local': HERE}

        def serve(route):
            u = urlparse(route.request.url)
            path = u.path.lstrip('/') or 'index.html'
            f = roots[u.hostname] / path
            if f.is_file():
                route.fulfill(status=200, body=f.read_bytes(),
                              content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
            else:
                route.fulfill(status=404, body=b'')
        for host in roots:
            ctx.route(f'**://{host}/**', serve)
        # polices Google du site : téléchargées une fois via curl (le navigateur n'a pas
        # d'accès direct), mises en cache dans .cache/ puis servies localement
        cache = HERE / '.cache'
        cache.mkdir(exist_ok=True)

        def fonts(route):
            url = route.request.url
            f = cache / __import__('hashlib').sha1(url.encode()).hexdigest()
            if not f.exists():
                subprocess.run(['curl', '-sSfL', '-o', str(f), '-A',
                                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                                '(KHTML, like Gecko) Chrome/120 Safari/537.36', url], check=True)
            ctype = 'text/css' if 'googleapis' in url else 'font/woff2'
            route.fulfill(status=200, body=f.read_bytes(), content_type=ctype,
                          headers={'Access-Control-Allow-Origin': '*'})
        ctx.route('https://fonts.googleapis.com/**', fonts)
        ctx.route('https://fonts.gstatic.com/**', fonts)
        # pas d'analytics ni de scripts tiers pendant le tournage
        ctx.route('**/*googletagmanager*/**', lambda r: r.abort())

        pg = ctx.new_page()
        pg.goto('https://pub.local/pub.html')
        pg.evaluate(f'window.TL = {__import__("json").dumps(TL)}')
        pg.evaluate('document.fonts.ready')

        def site():
            return pg.query_selector('#site').content_frame()

        def load(name):
            pg.evaluate(f'document.querySelector("#site").src = {PAGES[name]!r}')
            pg.wait_for_timeout(300)
            fr = site()
            fr.wait_for_load_state('load')
            fr.wait_for_function('[...document.images].every(i => i.complete)', timeout=15000)
            fr.evaluate('document.fonts.ready')
            pg.wait_for_timeout(400)
            return fr

        # passe de mesure
        M = {}
        for name in PAGES:
            fr = load(name)
            fr.evaluate('scrollTo(0,0)')
            M[name] = fr.evaluate(MEASURE[name])
        print('mesures', M, flush=True)
        scroll, cam = build_tracks(M)

        state = {'page': None, 'clicked': False}
        fr = None

        def frame(t):
            nonlocal fr
            name = page_at(t)
            if name != state['page']:
                fr = load(name)
                state['page'] = name
            if name == 'pdp' and t >= CLICK_VARIANT_AT and not state['clicked']:
                fr.evaluate("document.querySelectorAll('label.variant input')[1].click()")
                state['clicked'] = True
            y = track(scroll[name], t)
            fr.evaluate(f'scrollTo(0,{y:.2f})')
            s, fx, fy = track(cam[name], t)
            tx, ty = cam_transform(s, fx, fy)
            tap = None
            for t0, d, pgname, key in TAPS:
                if pgname == name and t0 <= t < t0 + d:
                    e = M[name][key]
                    x, yy = e['x'], e['y'] - y
                    tap = {'x': tx + x * s, 'y': ty + yy * s, 'p': (t - t0) / d}
            flash = 0
            for t0, _ in NAV[1:]:
                dt = t - t0
                if -0.12 <= dt < 0:
                    flash = (dt + 0.12) / 0.12 * 0.9
                elif 0 <= dt < 0.35:
                    flash = 0.9 * (1 - dt / 0.35)
            pg.evaluate('([t,c,tap,f]) => seek(t,c,tap,f)',
                        [t, {'tx': tx, 'ty': ty, 's': s}, tap, flash])

        if STILLS:
            for t in sorted(float(x) for x in STILLS.split(',')):
                frame(t)
                pg.screenshot(path=f'{OUT}_{t}.jpg', type='jpeg', quality=85)
            return

        n = int(END * FPS)
        ff = subprocess.Popen([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error',
            '-f', 'image2pipe', '-framerate', str(FPS), '-i', '-',
            '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-tune', 'animation', '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
        for i in range(n):
            frame(i / FPS)
            ff.stdin.write(pg.screenshot(type='png'))
            if i % 150 == 0:
                print(f'{i}/{n}', flush=True)
        ff.stdin.close(); ff.wait()
        print('ok', OUT)


if __name__ == '__main__':
    main()
