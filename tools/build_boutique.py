#!/usr/bin/env python3
"""Génère la boutique Cohesif Energy à partir de data/boutique.json.

    python3 tools/build_boutique.py

Produit :
  - boutique.html                    (catalogue)
  - boutique-*.html                  (une page par produit)
  - sitemap.xml                      (ajoute les URL boutique si absentes)
  - ../Cohesif-commerce/data/catalogues/cohesif-energy.json (copie lue par la page de commande)

L'en-tête et le pied de page sont repris de bornes-recharge.html pour rester
identiques au reste du site. Le bouton « Acheter » renvoie vers la page de
commande de Cohesif Commerce, qui encaisse via Stripe.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data" / "boutique.json").read_text(encoding="utf-8"))
SITE = DATA["site"]
COMMANDE = DATA["commandeUrl"]
PRODUITS = DATA["produits"]
TVA = 0.20

HYPERWATT = "Hyperwatt (Jsowell New Energy), présent dans plus de 60 pays"
# Libellés propres à chaque gamme (données structurées, fiche produit)
GAMMES = {
    "ac": {"categorie": "Borne de recharge pour véhicule électrique", "marque": "Hyperwatt", "fabricant": HYPERWATT,
           "legende": "Choisissez votre formule", "pourquoi": "Pourquoi cette borne", "dispo": "MadeToOrder"},
    "dc": {"categorie": "Borne de recharge pour véhicule électrique", "marque": "Hyperwatt", "fabricant": HYPERWATT,
           "legende": "Choisissez la puissance", "pourquoi": "Pourquoi cette borne", "dispo": "MadeToOrder"},
    "batterie": {"categorie": "Batterie lithium LiFePO4", "marque": None, "fabricant": None,
                 "legende": "Votre batterie", "pourquoi": "Pourquoi cette batterie", "dispo": "InStock"},
}

ref = (ROOT / "bornes-recharge.html").read_text(encoding="utf-8")
HEADER = ref[ref.index('<header class="header">'):ref.index("<main>")]
FOOTER = ref[ref.index('<footer class="footer">'):ref.index("</footer>") + len("</footer>")]
HEADER = HEADER.replace('class="nav-shop"', 'class="nav-shop active" aria-current="page"')

e = html.escape


def eur(n, decimals=False):
    if decimals and round(n, 2) != int(n):
        s = f"{n:,.2f}".replace(",", " ").replace(".", ",")
    else:
        s = f"{round(n):,}".replace(",", " ")
    return s + " €"


def prix_min(p):
    return min(v["prix"] for v in p["variantes"])


def ttc(p, prix):
    return prix if p["affichage"] == "TTC" else prix * (1 + TVA)


def buy_url(vid):
    return f"{COMMANDE}?produit={vid}&amp;source=cohesifenergy"


ICON = {
    "truck": '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    "lock": '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    "tool": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "check": '<polyline points="20 6 9 17 4 12"/>',
    "bolt": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "arrow": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    "cart": '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    "sun": '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    "van": '<path d="M2 17V7a2 2 0 0 1 2-2h11l5 5v7h-2"/><path d="M15 5v5h5"/><line x1="9" y1="17" x2="14" y2="17"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
    "anchor": '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
    "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    "euro":'<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
}


def icon(name, size=18, sw=2):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICON[name]}</svg>')


def head(title, desc, path, image, jsonld):
    url = f"{SITE}/{path}"
    blocks = "\n".join(
        f'  <script type="application/ld+json">{json.dumps(j, ensure_ascii=False)}</script>' for j in jsonld)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}" />
  <meta property="og:title" content="{e(title)}" />
  <meta property="og:description" content="{e(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{url}" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Cohesif Energy" />
  <meta property="og:image" content="{SITE}/{image}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="{url}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./main.css" />
  <link rel="stylesheet" href="./boutique.css" />
  <meta name="author" content="Cohesif Energy" />
  <meta name="theme-color" content="#0f7c4a" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{e(title)}" />
  <meta name="twitter:description" content="{e(desc)}" />
  <meta name="twitter:image" content="{SITE}/{image}" />
  <link rel="icon" type="image/png" href="./logo.png" />
{blocks}
</head>
<body>

{HEADER}<main>
"""


TAIL = f"""
</main>

{FOOTER}
<script src="./main.js"></script>
<script src="./boutique.js"></script>
<script src="./chat-widget.js"></script>
</body></html>
"""

TRUST = [
    ("truck", "Livraison offerte", "Bornes maison, France métropolitaine"),
    ("lock", "Paiement sécurisé", "CB, Apple Pay, Google Pay via Stripe"),
    ("shield", "Garantie 2 ans", "SAV assuré en France"),
    ("tool", "Pose IRVE en option", "Par nos électriciens qualifiés"),
]


def trust_strip():
    items = "".join(
        f'<li><span class="shop-trust-icon">{icon(i, 20)}</span><span><strong>{e(t)}</strong><small>{e(s)}</small></span></li>'
        for i, t, s in TRUST)
    return f'<ul class="shop-trust">{items}</ul>'


def price_block(p, prix):
    if p["affichage"] == "TTC":
        return f'<span class="price-main">{eur(prix)}</span><span class="price-tax">TTC</span>'
    return (f'<span class="price-main">{eur(prix)}</span><span class="price-tax">HT</span>'
            f'<span class="price-sub">soit {eur(prix * (1 + TVA))} TTC</span>')


def card(p):
    first = p["variantes"][0]
    n = len(p["variantes"])
    frm = "À partir de " if n > 1 else ""
    pts = "".join(f"<li>{icon('check', 14, 2.5)}{e(x)}</li>" for x in p["points"][:3])
    tax = "TTC" if p["affichage"] == "TTC" else "HT"
    variants = ""
    if p["gamme"] == "dc" and n > 1:
        variants = '<div class="card-variants">' + "".join(
            f'<span>{e(v["label"])}</span>' for v in p["variantes"]) + "</div>"
    return f"""
      <article class="product-card" data-gamme="{p['gamme']}">
        <a href="./{p['slug']}.html" class="product-card-media" aria-label="{e(p['nom'])}">
          <span class="product-badge">{e(p['badge'])}</span>
          <img src="./{p['image']}" alt="{e(p['nom'])}" loading="lazy" width="1000" height="1000" />
        </a>
        <div class="product-card-body">
          <div class="product-card-target">{e(p['cible'])}</div>
          <h3><a href="./{p['slug']}.html">{e(p['nom'])}</a></h3>
          {variants}
          <ul class="product-card-points">{pts}</ul>
          <div class="product-card-foot">
            <div class="product-card-price"><small>{frm}</small><strong>{eur(prix_min(p))}</strong> <span>{tax}</span></div>
            <div class="product-card-ctas">
              <a href="./{p['slug']}.html" class="btn btn-outline btn-sm">Détails</a>
              <a href="{buy_url(first['id'])}" class="btn btn-primary btn-sm" data-buy>Acheter</a>
            </div>
          </div>
          <div class="product-card-delivery">{icon('truck', 14)} {e(p['livraison'])}</div>
        </div>
      </article>"""


def faq_html(items):
    out = []
    for q, a in items:
        out.append(f'<div class="faq-item"><button class="faq-question" data-faq-toggle>{e(q)}'
                   f'<span class="faq-icon">+</span></button><div class="faq-answer"><p>{a}</p></div></div>')
    return '<div class="faq">' + "".join(out) + "</div>"


def faq_ld(items):
    return {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": re.sub("<[^>]+>", "", a)}} for q, a in items]}


FAQ_BOUTIQUE = [
    ("Qui vend et expédie les produits ?",
     "Les bornes et batteries sont sélectionnées par Cohesif Energy et vendues par <strong>Cohesif Commerce</strong>, la société de commerce du Groupe Cohesif. "
     "Lorsque vous cliquez sur « Acheter », vous êtes dirigé vers la page de commande sécurisée de Cohesif Commerce, puis vers le paiement Stripe."),
    ("Le paiement est-il sécurisé ?",
     "Oui. Le paiement est traité par <strong>Stripe</strong>, qui gère aussi les paiements d'Amazon, Uber ou Decathlon. "
     "Vos données bancaires ne transitent jamais par nos serveurs. Vous pouvez payer par carte bancaire, Apple Pay ou Google Pay."),
    ("Puis-je installer la borne moi-même ?",
     "Au-delà de 3,7 kW, la réglementation impose une installation par un électricien <strong>qualifié IRVE</strong>, "
     "c'est aussi une condition de votre assurance. Choisissez l'option « Borne + pose IRVE » et nos électriciens s'occupent de tout, ou faites appel à l'installateur IRVE de votre choix."),
    ("7 kW ou 22 kW, laquelle choisir ?",
     "Si votre maison est en <strong>monophasé</strong> (le cas le plus courant), choisissez la 7 kW : elle recharge une voiture en une nuit. "
     "La 22 kW demande une alimentation <strong>triphasée</strong> et un véhicule capable de charger à 22 kW en AC. En cas de doute, notre équipe vous conseille gratuitement."),
    ("Quels sont les délais de livraison ?",
     "Bornes maison : expédition sous 7 à 12 jours ouvrés, livraison offerte en France métropolitaine. "
     "Bornes rapides DC : livraison sur palette sous 6 à 8 semaines, incluse en France métropolitaine. "
     "Batteries lithium : livraison offerte sous 7 à 10 jours ouvrés."),
    ("Comment fonctionne l'acompte sur les bornes rapides ?",
     "Pour les bornes DC, vous réglez un <strong>acompte de 30 %</strong> en ligne pour réserver votre borne. "
     "Le solde est payable avant expédition, par virement. La facture avec TVA est émise au nom de votre entreprise."),
    ("Que se passe-t-il si la pose sort du forfait standard ?",
     "Après la commande, un technicien vous contacte sous 48 h ouvrées pour valider votre installation sur photos. "
     "Si des travaux supplémentaires sont nécessaires (câble plus long, tableau à remplacer…), nous vous proposons un devis complémentaire. "
     "Vous êtes libre de le refuser : la pose vous est alors intégralement remboursée."),
    ("Puis-je retourner ma borne ?",
     "Oui : en tant que particulier, vous disposez de <strong>14 jours</strong> après réception pour vous rétracter, conformément au Code de la consommation. "
     "La borne doit être retournée non installée, dans son emballage d'origine."),
    ("Proposez-vous un financement ou des tarifs par quantité ?",
     "Oui. Pour les entreprises, les bornes peuvent être financées en location via <a href=\"https://cohesifleasing.fr\" target=\"_blank\" rel=\"noopener noreferrer\">Cohesif Leasing</a>. "
     "À partir de 3 bornes, <a href=\"./contact-devis.html\">demandez un devis</a> : nous appliquons un tarif dégressif."),
]


def build_boutique():
    ac = [p for p in PRODUITS if p["gamme"] == "ac"]
    dc = [p for p in PRODUITS if p["gamme"] == "dc"]
    bat = [p for p in PRODUITS if p["gamme"] == "batterie"]
    min_ac = min(prix_min(p) for p in ac)
    min_bat = min(prix_min(p) for p in bat)
    itemlist = {
        "@context": "https://schema.org", "@type": "ItemList", "name": "Boutique Cohesif Energy — bornes de recharge et batteries",
        "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{SITE}/{p['slug']}.html", "name": p["nom"]}
                            for i, p in enumerate(PRODUITS)]}
    title = "Boutique bornes de recharge et batteries lithium — achat en ligne | Cohesif Energy"
    desc = (f"Achetez votre borne de recharge en ligne dès {round(min_ac)} € TTC : 7 kW, 22 kW, bornes rapides DC jusqu'à 240 kW. "
            f"Batteries lithium LiFePO4 dès {round(min_bat)} € TTC. Livraison offerte, paiement sécurisé, garantie 2 ans.")
    out = head(title, desc, "boutique.html", "img/boutique/gamme.webp", [itemlist, faq_ld(FAQ_BOUTIQUE)])
    out += f"""
<section class="shop-hero">
  <div class="container shop-hero-grid">
    <div class="shop-hero-text">
      <div class="eyebrow">Boutique en ligne</div>
      <h1>Votre borne de recharge, <span class="gradient-text">livrée chez vous</span>, posée si vous le souhaitez.</h1>
      <p class="shop-hero-desc">Bornes maison 7 et 22 kW, bornes rapides DC jusqu'à 240 kW pour les professionnels, batteries lithium pour le solaire et les loisirs. Prix affichés, paiement sécurisé en quelques clics, sans attendre de devis.</p>
      <div class="shop-hero-price">{icon('bolt', 18)}<span>Borne maison dès <strong>{eur(min_ac)} TTC</strong> · <a href="#batteries">batterie lithium</a> dès <strong>{eur(min_bat)} TTC</strong></span></div>
      <div class="hero-ctas shop-hero-ctas">
        <a href="#maison" class="btn btn-primary btn-lg btn-arrow">Bornes pour la maison {icon('arrow', 14, 2.5)}</a>
        <a href="#pro" class="btn btn-outline btn-lg">Bornes rapides pro</a>
      </div>
    </div>
    <div class="shop-hero-visual">
      <img src="./img/boutique/gamme.webp" alt="Gamme de bornes de recharge AC et DC" width="1400" height="1187" />
    </div>
  </div>
  <div class="container">{trust_strip()}</div>
</section>

<section class="section shop-section" id="maison">
  <div class="container">
    <div class="shop-section-head">
      <div>
        <div class="eyebrow">Pour la maison et les petits sites</div>
        <h2>Bornes de recharge AC</h2>
        <p>Rechargez votre véhicule pendant la nuit ou au bureau. Avec l'option pose, nos électriciens IRVE s'occupent de tout : protections, raccordement, mise en service.</p>
      </div>
    </div>
    <div class="product-grid product-grid-2">{''.join(card(p) for p in ac)}
    </div>
    <div class="pose-explainer">
      <div class="pose-explainer-col">
        <h3>Borne seule</h3>
        <p>Vous avez déjà un électricien qualifié IRVE ? Commandez la borne seule, elle est livrée chez vous gratuitement.</p>
      </div>
      <div class="pose-explainer-col highlighted">
        <span class="badge"><span class="badge-dot"></span>Le plus choisi</span>
        <h3>Borne + pose IRVE</h3>
        <p>Un prix tout compris, sans mauvaise surprise : un technicien valide votre installation sur photos sous 48 h, puis nos électriciens posent et mettent en service votre borne.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-subtle shop-section" id="pro">
  <div class="container">
    <div class="shop-section-head">
      <div>
        <div class="eyebrow">Pour les professionnels</div>
        <h2>Bornes rapides DC, de 20 à 240 kW</h2>
        <p>Concessions, flottes, hôtels, commerces, stations : équipez-vous de bornes rapides CCS2 compatibles OCPP. Réservez en ligne avec un acompte de 30 %, livraison sur palette incluse.</p>
      </div>
    </div>
    <div class="product-grid product-grid-2">{''.join(card(p) for p in dc)}
    </div>
    <div class="pro-band">
      <div>
        <h3>Plusieurs bornes, installation, financement ?</h3>
        <p>Étude de puissance, raccordement, génie civil, supervision : nous chiffrons votre projet clé en main. Financement en location possible via Cohesif Leasing.</p>
      </div>
      <div class="pro-band-ctas">
        <a href="./contact-devis.html" class="btn btn-primary btn-arrow">Devis projet sous 48 h {icon('arrow', 14, 2.5)}</a>
        <a href="https://cohesifleasing.fr" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Financer avec Cohesif Leasing</a>
      </div>
    </div>
  </div>
</section>

<section class="section shop-section" id="batteries">
  <div class="container">
    <div class="shop-section-head">
      <div>
        <div class="eyebrow">Stockage d'énergie</div>
        <h2>Batteries lithium LiFePO4</h2>
        <p>Stockez l'énergie de vos panneaux solaires, partez en camping-car ou en bateau en toute autonomie. Une batterie qui dure plus de 10 ans, deux fois plus légère qu'une batterie plomb.</p>
      </div>
    </div>
    <div class="product-grid product-grid-2">{''.join(card(p) for p in bat)}
      <div class="battery-uses">
        <h3>Pour quels usages ?</h3>
        <ul>
          <li>{icon('sun', 20)}<span><strong>Installation solaire</strong><small>Stockez votre production pour la consommer le soir</small></span></li>
          <li>{icon('van', 20)}<span><strong>Camping-car, van, fourgon</strong><small>Frigo, éclairage, écrans : l'autonomie sans groupe électrogène</small></span></li>
          <li>{icon('anchor', 20)}<span><strong>Bateau</strong><small>Batterie de service légère, sans entretien</small></span></li>
          <li>{icon('home', 20)}<span><strong>Cabanon, site isolé, secours</strong><small>Une réserve d'énergie en cas de coupure</small></span></li>
        </ul>
        <p class="battery-uses-note">Vous remplacez une batterie plomb ou AGM ? Vérifiez que votre chargeur ou régulateur dispose d'un profil lithium. <a href="./contact-devis.html">Un conseiller vérifie gratuitement.</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-intro">
      <div class="eyebrow">Simple et rapide</div>
      <h2>Commander en 4 étapes</h2>
    </div>
    <ol class="shop-steps">
      <li><span>1</span><h3>Choisissez votre borne</h3><p>Borne seule ou avec pose, en fonction de votre installation.</p></li>
      <li><span>2</span><h3>Payez en ligne</h3><p>Paiement sécurisé Stripe : CB, Apple Pay, Google Pay. Facture envoyée par e-mail.</p></li>
      <li><span>3</span><h3>Livraison ou pose</h3><p>Livraison offerte, ou visite de nos électriciens IRVE pour l'installation.</p></li>
      <li><span>4</span><h3>Rechargez</h3><p>Branchez votre véhicule. Notre SAV reste joignable pendant toute la garantie.</p></li>
    </ol>
  </div>
</section>

<section class="section section-subtle">
  <div class="container">
    <div class="section-intro">
      <div class="eyebrow">Quelle borne choisir ?</div>
      <h2>Le bon choix en 10 secondes</h2>
    </div>
    <div class="choose-table-wrap">
      <table class="choose-table">
        <thead><tr><th>Votre situation</th><th>Notre conseil</th><th>Temps de recharge*</th></tr></thead>
        <tbody>
          <tr><td>Maison, compteur monophasé</td><td><a href="./boutique-borne-recharge-7kw.html">Borne 7 kW</a></td><td>Une nuit (≈ 8 h)</td></tr>
          <tr><td>Maison en triphasé, entreprise, hôtel</td><td><a href="./boutique-borne-recharge-22kw.html">Borne 22 kW</a></td><td>3 à 8 h selon le véhicule</td></tr>
          <tr><td>Concession, flotte, commerce</td><td><a href="./boutique-borne-rapide-dc-murale.html">DC murale 20 à 40 kW</a></td><td>1 à 2 h</td></tr>
          <tr><td>Parking, 2 véhicules à la fois</td><td><a href="./boutique-borne-rapide-dc-sur-pied.html">DC sur pied 40 à 80 kW</a></td><td>30 min à 1 h 30</td></tr>
          <tr><td>Station, axe routier, hub de flotte</td><td><a href="./boutique-borne-ultra-rapide-dc.html">DC 120 à 240 kW</a></td><td>≈ 20 à 30 min</td></tr>
        </tbody>
      </table>
      <p class="choose-note">* Ordre de grandeur pour une batterie de 60 kWh, selon le véhicule, la température et l'état de charge.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-intro">
      <div class="eyebrow">Questions fréquentes</div>
      <h2>Tout savoir avant d'acheter</h2>
    </div>
    {faq_html(FAQ_BOUTIQUE)}
  </div>
</section>

<section class="section-sm">
  <div class="container">
    <div class="cta-band">
      <h2>Un doute sur votre installation ?</h2>
      <p>Envoyez-nous une photo de votre tableau électrique : un conseiller vous indique la borne adaptée, gratuitement et sans engagement.</p>
      <div class="hero-ctas">
        <a href="./contact-devis.html" class="btn btn-primary btn-lg btn-arrow">Être conseillé gratuitement {icon('arrow', 14, 2.5)}</a>
      </div>
    </div>
  </div>
</section>
"""
    out += TAIL
    (ROOT / "boutique.html").write_text(out, encoding="utf-8")


POSE_INCLUS = [
    "Déplacement et intervention d'un électricien qualifié IRVE",
    "Jusqu'à 15 m de câble entre votre tableau et la borne",
    "Protections électriques dédiées (disjoncteur et différentiel adaptés)",
    "Fixation murale, raccordement, tests et mise en service",
    "Attestation de conformité et prise en main de la borne",
]


def product_faq(p):
    if p["gamme"] == "batterie":
        return [
            ("Puis-je remplacer ma batterie plomb ou AGM par celle-ci ?",
             "Oui dans la plupart des cas : même tension 12 V et un format proche d'une batterie plomb 100 Ah. "
             "Vérifiez simplement que votre chargeur, votre régulateur solaire ou votre convertisseur dispose d'un <strong>profil lithium / LiFePO4</strong> "
             "(tension de charge de 14,2 à 14,6 V). En cas de doute, envoyez-nous la référence de votre matériel : nous vérifions gratuitement."),
            ("Combien de temps tient une charge ?",
             "La batterie stocke <strong>1 280 Wh</strong>. Par exemple : environ 24 h pour un réfrigérateur de camping-car (≈ 50 W), "
             "une centaine d'heures pour un éclairage LED de 10 W. Elle se recharge en ≈ 5 h avec un chargeur LiFePO4 de 20 A, ou avec vos panneaux solaires."),
            ("Peut-on l'utiliser en hiver ?",
             "Elle fonctionne de -10 °C à +60 °C. Comme toutes les batteries LiFePO4, elle ne doit pas être rechargée en dessous de 0 °C : "
             "en hiver, installez-la dans un endroit abrité, à l'intérieur du véhicule ou du local technique."),
            ("Puis-je me rétracter ?",
             "Oui, les particuliers disposent de 14 jours après réception pour se rétracter. La batterie doit être retournée non utilisée, dans son emballage d'origine."),
        ]
    if p["gamme"] == "ac":
        return [
            ("La borne est-elle compatible avec ma voiture ?",
             "Oui : le connecteur <strong>Type 2</strong> est le standard européen. Il équipe tous les véhicules électriques et hybrides rechargeables vendus en France (Tesla, Renault, Peugeot, Volkswagen, Kia, Hyundai, BYD, MG…)."),
            ("Quel abonnement électrique faut-il ?",
             "En général 9 à 12 kVA pour une borne 7 kW en monophasé, et un abonnement triphasé pour la 22 kW. Lors de la validation sur photos, notre technicien vérifie votre installation et vous conseille."),
            ("Que comprend l'option pose ?",
             "La pose standard comprend : " + ", ".join(x[0].lower() + x[1:] for x in POSE_INCLUS) + ". Si votre installation sort du forfait, nous vous proposons un devis complémentaire ; vous pouvez le refuser et être intégralement remboursé de la pose."),
            ("Puis-je me rétracter ?",
             "Oui, les particuliers disposent de 14 jours après réception pour se rétracter. La borne doit être retournée non installée, dans son emballage d'origine."),
        ]
    return [
        ("Comment se passe la commande d'une borne rapide ?",
         "Vous réglez un acompte de 30 % en ligne pour réserver la borne. Nous vous contactons sous 48 h ouvrées pour confirmer la configuration (connecteurs, câbles, paiement, supervision). Le solde est réglé par virement avant expédition."),
        ("L'installation est-elle incluse ?",
         "Le prix comprend la borne et sa livraison sur palette en France métropolitaine. Le raccordement (puissance disponible, câblage, socle, protections) dépend de votre site : nous le chiffrons gratuitement, installation réalisée par nos électriciens IRVE."),
        ("Puis-je facturer la recharge à mes clients ?",
         "Oui. La borne accepte le badge RFID, l'application et le QR code, et elle est compatible OCPP 1.6J : elle se connecte aux plateformes de supervision et de facturation du marché."),
        ("Proposez-vous un financement ?",
         "Oui, via <a href=\"https://cohesifleasing.fr\" target=\"_blank\" rel=\"noopener noreferrer\">Cohesif Leasing</a>, la solution de location financière du Groupe Cohesif. À partir de 3 bornes, demandez un devis pour un tarif dégressif."),
    ]


def build_product(p):
    # Sélection par défaut : la variante la moins chère, cohérente avec le « à partir de » des cartes
    rec = min(p["variantes"], key=lambda v: v["prix"])
    tax = p["affichage"]
    url = f"{SITE}/{p['slug']}.html"
    g = GAMMES[p["gamme"]]
    offers = []
    for v in p["variantes"]:
        offers.append({
            "@type": "Offer", "sku": v["id"], "name": f"{p['nom']} — {v['label']}",
            "price": f"{ttc(p, v['prix']):.2f}", "priceCurrency": "EUR",
            "availability": f"https://schema.org/{g['dispo']}", "url": url,
            "seller": {"@type": "Organization", "name": DATA["vendeur"]},
        })
    product_ld = {
        "@context": "https://schema.org", "@type": "Product", "name": p["nom"], "description": p["accroche"],
        "image": [f"{SITE}/{img}" for img in p["galerie"]], "sku": rec["id"],
    }
    if g["marque"]:
        product_ld["brand"] = {"@type": "Brand", "name": g["marque"]}
    product_ld.update({"category": g["categorie"], "offers": offers})
    crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Accueil", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": "Boutique", "item": f"{SITE}/boutique.html"},
        {"@type": "ListItem", "position": 3, "name": p["nom"], "item": url}]}
    faq = product_faq(p)
    price_txt = f"dès {round(prix_min(p))} € {tax}"
    title = f"{p['nom']} — {price_txt}, achat en ligne | Cohesif Energy"
    desc = f"{p['accroche']} {p['livraison']}. {p['garantie']}. Paiement sécurisé."
    out = head(title, desc, f"{p['slug']}.html", p["image"], [product_ld, crumbs, faq_ld(faq)])

    thumbs = "".join(
        f'<button type="button" class="gallery-thumb{" active" if i == 0 else ""}" data-gallery-thumb="./{g}" aria-label="Photo {i + 1}">'
        f'<img src="./{g}" alt="" loading="lazy" /></button>' for i, g in enumerate(p["galerie"]))

    vopts = []
    for v in p["variantes"]:
        checked = " checked" if v is rec else ""
        data = (f'data-id="{v["id"]}" data-prix="{v["prix"]}" data-label="{e(v["label"])}"')
        tag = '<span class="variant-tag">Recommandé</span>' if v.get("recommande") and len(p["variantes"]) > 1 else ""
        vopts.append(f"""
          <label class="variant">
            <input type="radio" name="variante" value="{v['id']}" {data}{checked} />
            <span class="variant-box">
              <span class="variant-top"><strong>{e(v['label'])}</strong>{tag}</span>
              <span class="variant-detail">{e(v['detail'])}</span>
              <span class="variant-price">{eur(v['prix'])} {tax}</span>
            </span>
          </label>""")

    pose_block = ""
    if any(v["id"].endswith("-POSE") for v in p["variantes"]):
        li = "".join(f"<li>{icon('check', 16, 2.5)}{e(x)}</li>" for x in POSE_INCLUS)
        pose_block = f"""
        <div class="pose-box" data-pose-box>
          <div class="pose-box-title">{icon('tool', 18)} La pose standard comprend</div>
          <ul>{li}</ul>
          <p>Un technicien vous contacte sous 48 h ouvrées après la commande pour valider votre installation sur photos. Si elle sort du forfait, nous vous proposons un devis : vous restez libre de le refuser et d'être remboursé de la pose.</p>
        </div>"""

    if p["paiement"] == "acompte":
        pay_note = (f'<div class="deposit-note" data-deposit data-pct="{p["acomptePct"]}">{icon("euro", 16)} '
                    f'<span>Acompte de {p["acomptePct"]} % à la commande : <strong data-deposit-amount></strong> TTC. '
                    f'Solde par virement avant expédition.</span></div>')
        buy_label = "Réserver ma borne"
    else:
        pay_note = ""
        buy_label = "Acheter maintenant"

    points = "".join(f"<li>{icon('check', 18, 2.5)}<span>{e(x)}</span></li>" for x in p["points"])
    specs = "".join(f"<tr><th>{e(k)}</th><td>{e(v)}</td></tr>" for k, v in p["specs"].items())
    others = [o for o in PRODUITS if o is not p]
    others = sorted(others, key=lambda o: (o["gamme"] != p["gamme"]))[:3]
    bornes = [o for o in others + [p] if o["gamme"] != "batterie"]
    autres = "Les autres bornes" if len(bornes) == len(others) + 1 else "Nos autres produits"
    fabricant = f"\n        <tr><th>Fabricant</th><td>{e(g['fabricant'])}</td></tr>" if g["fabricant"] else ""

    reassurance = [
        ("truck", p["livraison"]),
        ("clock", p["delai"]),
        ("shield", p["garantie"]),
        ("lock", "Paiement sécurisé Stripe : CB, Apple Pay, Google Pay"),
    ]
    reass = "".join(f"<li>{icon(i, 18)}<span>{e(t)}</span></li>" for i, t in reassurance)

    out += f"""
<nav class="breadcrumb container" aria-label="Fil d'Ariane">
  <a href="./index.html">Accueil</a><span>/</span><a href="./boutique.html">Boutique</a><span>/</span><span aria-current="page">{e(p['nom'])}</span>
</nav>

<section class="pdp" data-product data-tax="{tax}" data-tva="{TVA}" data-commande="{COMMANDE}">
  <div class="container pdp-grid">
    <div class="pdp-gallery">
      <div class="gallery-main">
        <span class="product-badge">{e(p['badge'])}</span>
        <img src="./{p['image']}" alt="{e(p['nom'])}" data-gallery-main width="1000" height="1000" />
      </div>
      <div class="gallery-thumbs">{thumbs}</div>
    </div>

    <div class="pdp-info">
      <div class="product-card-target">{e(p['cible'])}</div>
      <h1 class="pdp-title">{e(p['nom'])}</h1>
      <p class="pdp-lead">{e(p['accroche'])}</p>
      <div class="pdp-range">{icon('bolt', 16)} {e(p['autonomie'])}</div>

      <div class="pdp-price" data-price-block>{price_block(p, rec['prix'])}</div>
      {pay_note}

      <fieldset class="variants">
        <legend>{g['legende']}</legend>
        {''.join(vopts)}
      </fieldset>
      {pose_block}

      <a href="{buy_url(rec['id'])}" class="btn btn-primary btn-lg btn-block pdp-buy" data-buy-main>{icon('cart', 18)} {buy_label}</a>
      <p class="pdp-seller">Vendu et expédié par <strong>Cohesif Commerce</strong>, société du Groupe Cohesif. Vous finaliserez votre commande sur sa page de paiement sécurisée.</p>
      <a href="./contact-devis.html" class="pdp-help">{icon('phone', 16)} Une question avant d'acheter ? Un conseiller vous répond sous 48 h</a>

      <ul class="pdp-reassurance">{reass}</ul>
    </div>
  </div>
</section>

<section class="section section-subtle">
  <div class="container pdp-details">
    <div>
      <div class="eyebrow">{g['pourquoi']}</div>
      <h2>Les points forts</h2>
      <ul class="pdp-points">{points}</ul>
    </div>
    <div>
      <div class="eyebrow">Fiche technique</div>
      <h2>Caractéristiques</h2>
      <table class="spec-table"><tbody>{specs}{fabricant}
      </tbody></table>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-intro">
      <div class="eyebrow">Questions fréquentes</div>
      <h2>Avant de commander</h2>
    </div>
    {faq_html(faq)}
  </div>
</section>

<section class="section section-subtle">
  <div class="container">
    <div class="shop-section-head"><div><div class="eyebrow">Vous aimerez aussi</div><h2>{autres}</h2></div>
    <a href="./boutique.html" class="btn btn-outline">Toute la boutique</a></div>
    <div class="product-grid">{''.join(card(o) for o in others)}
    </div>
  </div>
</section>

<div class="sticky-buy" data-sticky-buy>
  <div class="sticky-buy-info"><strong>{e(p['nom'])}</strong><span data-sticky-price>{eur(rec['prix'])} {tax}</span></div>
  <a href="{buy_url(rec['id'])}" class="btn btn-primary" data-buy-sticky>{buy_label}</a>
</div>
"""
    out += TAIL
    (ROOT / f"{p['slug']}.html").write_text(out, encoding="utf-8")


def update_sitemap():
    path = ROOT / "sitemap.xml"
    xml = path.read_text(encoding="utf-8")
    urls = ["boutique.html"] + [f"{p['slug']}.html" for p in PRODUITS]
    add = ""
    for u in urls:
        loc = f"{SITE}/{u}"
        if loc not in xml:
            prio = "0.9" if u == "boutique.html" else "0.8"
            add += (f"  <url><loc>{loc}</loc><lastmod>{DATA['misAJour']}</lastmod>"
                    f"<priority>{prio}</priority><changefreq>weekly</changefreq></url>\n")
    if add:
        path.write_text(xml.replace("</urlset>", add + "</urlset>"), encoding="utf-8")
    txt = ROOT / "sitemap.txt"
    lines = txt.read_text(encoding="utf-8").split()
    new = [f"{SITE}/{u}" for u in urls if f"{SITE}/{u}" not in lines]
    if new:
        txt.write_text("\n".join(lines + new) + "\n", encoding="utf-8")


def sync_commerce():
    """Copie le catalogue vers Cohesif Commerce (page de commande) si le dépôt est à côté."""
    dest = ROOT.parent / "Cohesif-commerce" / "data" / "catalogues"
    if dest.parent.parent.exists():
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "cohesif-energy.json").write_text(
            json.dumps(DATA, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Catalogue copié vers {dest / 'cohesif-energy.json'}")


if __name__ == "__main__":
    build_boutique()
    sync_commerce()
    for prod in PRODUITS:
        build_product(prod)
    update_sitemap()
    print(f"Boutique générée : {len(PRODUITS)} produits.")
