/**
 * Cohesif Energy - Assistant "Alex" (mode FAQ local - sans API)
 */
(function () {

  const BRAND_GREEN = '#0f7c4a';
  const BRAND_LIGHT = '#e8f5ee';

  const FAQ = [
    {
      keys: ['prime','autoconsommation','aide solaire','subvention solaire'],
      q: 'Quelles aides pour les panneaux solaires ?',
      a: 'La prime à l\'autoconsommation a été supprimée le 5 juin 2026. Aujourd\'hui les aides disponibles sont MaPrimeRénov\' et les CEE selon votre profil. Demandez votre devis gratuit, on calcule tout pour vous ! 🌞'
    },
    {
      keys: ['prix panneau','coût solaire','tarif solaire','combien solaire','quel prix solaire','panneau solaire prix'],
      q: 'Quel est le prix des panneaux solaires ?',
      a: 'Le prix dépend de la puissance installée et de votre toiture. En général entre 8 000 € et 20 000 € pour un particulier, avec des aides qui réduisent votre reste à charge. Demandez un devis gratuit pour une estimation personnalisée ! 📋'
    },
    {
      keys: ['panneau solaire','solaire','photovoltaïque','photovoltaique'],
      q: 'Comment fonctionnent les panneaux solaires ?',
      a: 'Nos panneaux photovoltaïques convertissent la lumière du soleil en électricité. Vous consommez l\'énergie produite directement et réduisez votre facture. Avec une batterie de stockage, vous maximisez votre autonomie. Installation certifiée RGE QualiPV. ☀️'
    },
    {
      keys: ['edf','rachat','revente','tarif rachat','injection'],
      q: 'Quel est le tarif de rachat EDF ?',
      a: 'Depuis le 5 juin 2026, le tarif de rachat EDF OA est de 0,011 €/kWh pour les nouvelles installations. C\'est pourquoi l\'autoconsommation maximale avec batterie est aujourd\'hui la stratégie la plus rentable. 💡'
    },
    {
      keys: ['batterie','stockage','autonomie'],
      q: 'Faut-il une batterie de stockage ?',
      a: 'Avec le nouveau tarif de rachat à 0,011 €/kWh, la batterie est fortement recommandée. Elle vous permet de stocker l\'énergie produite le jour pour la consommer le soir, et maximise votre retour sur investissement. 🔋'
    },
    {
      keys: ['borne recharge','borne électrique','voiture électrique','ve','irve'],
      q: 'Quelles bornes de recharge proposez-vous ?',
      a: 'Nous installons des bornes de recharge pour particuliers, copropriétés et entreprises. Bornes 7 kW à 22 kW selon vos besoins. Des aides ADVENIR et crédits d\'impôt sont disponibles selon votre situation. 🔌'
    },
    {
      keys: ['borne particulier','maison individuelle','résidence principale','credit impot borne'],
      q: 'Borne recharge pour particulier : quelles aides ?',
      a: 'Pour une borne en résidence principale ou secondaire, vous bénéficiez d\'un crédit d\'impôt jusqu\'à 500 € (75% du coût). Installation rapide et certifiée par nos techniciens. 🏠'
    },
    {
      keys: ['borne copropriété','copropriete','immeuble','résidents'],
      q: 'Borne recharge en copropriété ?',
      a: 'Le programme ADVENIR (taux avril 2026) finance jusqu\'à 12 500 € pour l\'infrastructure collective et 1 000 € par borne individuelle. Nous gérons toutes les démarches avec le syndic. 🏢'
    },
    {
      keys: ['borne entreprise','parking professionnel','flotte'],
      q: 'Bornes de recharge pour entreprise ?',
      a: 'Pour les entreprises, nous installons des bornes pour flottes et parkings. Avantages fiscaux, déductions charges, amortissement accéléré. Étude personnalisée gratuite avec chiffrage complet. 🏭'
    },
    {
      keys: ['pompe à chaleur','pac','pompe a chaleur','chauffage','climatisation'],
      q: 'Quelles aides pour une pompe à chaleur ?',
      a: 'MaPrimeRénov\' 2026 : jusqu\'à 5 000 € pour les ménages très modestes, 4 000 € pour les ménages modestes, 3 000 € pour les ménages intermédiaires. CEE Coup de Pouce PAC toujours actif en complément ! 🌡️'
    },
    {
      keys: ['maprimerenov','mpr','maprime'],
      q: 'Comment fonctionne MaPrimeRénov\' ?',
      a: 'MaPrimeRénov\' est une aide de l\'État calculée selon vos revenus. Pour une PAC air/eau : 3 000 € à 5 000 € selon votre foyer. Cohesif Energy gère le dossier pour vous, de A à Z. 📄'
    },
    {
      keys: ['rge','qualipv','qualipac','certification','certifié'],
      q: 'Êtes-vous certifiés RGE ?',
      a: 'Oui, Cohesif Energy est certifié RGE QualiPV (solaire) et QualiPAC (pompes à chaleur). Cette certification est obligatoire pour accéder aux aides de l\'État. Vous êtes entre de bonnes mains ! ✅'
    },
    {
      keys: ['groupe cohesif','cohesif btp','cohesif auto','cohesif commerce','cohesif sport','cohesif agro','cohesif negoce','cohesif négoce','cohesif access','groupe'],
      q: 'C\'est quoi le Groupe Cohesif ?',
      a: 'Le Groupe Cohesif est un groupe français multi-métiers avec 8 pôles : Cohesif Energy (solaire, bornes, PAC), Cohesif BTP (rénovation), Cohesif Auto, Cohesif Commerce, Cohesif Sport, Cohesif Agro, Cohesif Négoce et Cohesif Access. Un interlocuteur unique pour tous vos projets ! 🏗️'
    },
    {
      keys: ['délai','installation','durée travaux','quand'],
      q: 'Quel est le délai d\'installation ?',
      a: 'En général 4 à 8 semaines entre la signature et l\'installation, selon les démarches administratives et notre planning. Nous vous tenons informé à chaque étape. 📅'
    },
    {
      keys: ['garantie','sav','après-vente','maintenance'],
      q: 'Quelle garantie sur les installations ?',
      a: 'Nos installations bénéficient des garanties fabricant (10 à 25 ans sur les panneaux, 5 à 10 ans sur les onduleurs) et de notre garantie main d\'œuvre. SAV réactif assuré par Cohesif Energy. 🛡️'
    },
    {
      keys: ['devis','gratuit','contact','rendez-vous','rdv','rappel'],
      q: 'Comment obtenir un devis gratuit ?',
      a: 'Notre devis est 100% gratuit et sans engagement ! Remplissez le formulaire sur notre page Contact, ou appelez-nous. Un conseiller vous rappelle sous 24h pour une étude personnalisée. 📞'
    },
    {
      keys: ['aides','subvention','financement','crédit','pret','prêt'],
      q: 'Quelles aides financières sont disponibles ?',
      a: 'Selon votre projet : MaPrimeRénov\', CEE Coup de Pouce, crédit d\'impôt borne de recharge, programme ADVENIR. Nous optimisons toutes les aides disponibles pour maximiser votre économie. Notre équipe gère les dossiers pour vous ! 💰'
    },
    {
      keys: ['bonjour','salut','hello','bonsoir','coucou'],
      q: '',
      a: 'Bonjour ! 😊 Je suis Alex, votre conseiller Cohesif Energy. Je peux vous renseigner sur nos panneaux solaires, bornes de recharge, pompes à chaleur et les aides financières disponibles. Comment puis-je vous aider ?'
    },
    {
      keys: ['merci','super','parfait','nickel','top'],
      q: '',
      a: 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Et si vous souhaitez aller plus loin, demandez votre devis gratuit — c\'est sans engagement ! 🌿'
    },
  ];

  const DEFAULT_REPLY = "Je ne suis pas sûr de comprendre votre question. Pour une réponse précise, contactez-nous à cohesifenergy@gmail.com ou demandez votre <a href='contact-devis.html' style='color:#0f7c4a;font-weight:600'>devis gratuit</a> — un conseiller vous rappelle sous 24h ! 📞";

  const SUGGESTIONS = [
    "💰 Aides disponibles en 2026 ?",
    "☀️ Prix panneaux solaires ?",
    "🔌 Borne copropriété",
    "🌡️ Pompe à chaleur",
    "📋 Devis gratuit",
  ];

  function findAnswer(text) {
    const t = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    for (const item of FAQ) {
      if (item.keys.some(k => {
        const kn = k.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return t.includes(kn);
      })) {
        return item.a;
      }
    }
    return null;
  }

  const CSS = `
    #cohesif-chat-widget * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #cohesif-chat-widget { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }

    #cohesif-bubble {
      width: 64px; height: 64px; border-radius: 50%;
      background: ${BRAND_GREEN}; cursor: pointer; border: none;
      box-shadow: 0 4px 20px rgba(15,124,74,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative; overflow: visible;
    }
    #cohesif-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(15,124,74,0.55); }
    #cohesif-bubble.pulse::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 50%; background: rgba(15,124,74,0.35);
      animation: cohesif-pulse 2s ease-out infinite;
    }
    @keyframes cohesif-pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.7); opacity: 0; }
    }

    #cohesif-badge {
      position: absolute; top: -4px; right: -4px;
      background: #e53e3e; color: #fff; border-radius: 50%;
      width: 20px; height: 20px; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
    }

    #cohesif-panel {
      position: absolute; bottom: 80px; right: 0;
      width: 360px; max-width: calc(100vw - 32px);
      background: #fff; border-radius: 20px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      display: none; flex-direction: column;
      overflow: hidden;
      height: 520px; max-height: calc(var(--cohesif-available-height, 100vh) - 120px);
      animation: cohesif-slide-up 0.25s ease;
    }
    @keyframes cohesif-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #cohesif-panel.open { display: flex; }

    #cohesif-header {
      background: ${BRAND_GREEN}; padding: 16px 18px;
      display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    }
    #cohesif-avatar-wrap {
      width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
      background: #fff; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.5);
    }
    #cohesif-header-text { flex: 1; }
    #cohesif-header-name { color: #fff; font-weight: 700; font-size: 15px; }
    #cohesif-header-status { color: rgba(255,255,255,0.85); font-size: 12px; display: flex; align-items: center; gap: 5px; }
    #cohesif-header-status::before { content: ''; width: 7px; height: 7px; background: #4ade80; border-radius: 50%; display: inline-block; }
    #cohesif-close {
      background: none; border: none; color: rgba(255,255,255,0.8);
      cursor: pointer; padding: 4px; border-radius: 4px; font-size: 20px; line-height: 1;
    }
    #cohesif-close:hover { color: #fff; }

    #cohesif-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      scroll-behavior: smooth;
    }
    #cohesif-messages::-webkit-scrollbar { width: 4px; }
    #cohesif-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

    .cohesif-msg { display: flex; gap: 8px; align-items: flex-end; }
    .cohesif-msg.user { flex-direction: row-reverse; }
    .cohesif-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; overflow: hidden;
      flex-shrink: 0;
    }
    .cohesif-msg-bubble {
      padding: 10px 13px; border-radius: 16px; font-size: 14px; line-height: 1.5;
      max-width: calc(100% - 42px); word-break: break-word;
    }
    .cohesif-msg.bot .cohesif-msg-bubble { background: ${BRAND_LIGHT}; color: #1a1a1a; border-bottom-left-radius: 4px; }
    .cohesif-msg.user .cohesif-msg-bubble { background: ${BRAND_GREEN}; color: #fff; border-bottom-right-radius: 4px; }

    .cohesif-typing { display: flex; gap: 4px; padding: 12px 14px; align-items: center; }
    .cohesif-typing span {
      width: 7px; height: 7px; background: #aaa; border-radius: 50%;
      animation: cohesif-bounce 1.1s infinite;
    }
    .cohesif-typing span:nth-child(2) { animation-delay: 0.18s; }
    .cohesif-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes cohesif-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    #cohesif-suggestions { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 6px; flex-shrink: 0; }
    .cohesif-suggestion {
      background: ${BRAND_LIGHT}; color: ${BRAND_GREEN}; border: 1px solid rgba(15,124,74,0.25);
      border-radius: 20px; padding: 5px 12px; font-size: 12px; cursor: pointer;
      transition: background 0.15s; white-space: nowrap;
    }
    .cohesif-suggestion:hover { background: #c8e6d4; }

    #cohesif-input-row {
      border-top: 1px solid #f0f0f0; padding: 12px 14px;
      display: flex; gap: 8px; align-items: center; flex-shrink: 0;
      position: sticky; bottom: 0; background: #fff;
    }
    #cohesif-input {
      flex: 1; border: 1.5px solid #e0e0e0; border-radius: 22px;
      padding: 9px 14px; font-size: 14px; outline: none;
      transition: border-color 0.15s;
    }
    #cohesif-input:focus { border-color: ${BRAND_GREEN}; }
    #cohesif-send {
      width: 38px; height: 38px; border-radius: 50%;
      background: ${BRAND_GREEN}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s;
    }
    #cohesif-send:hover { background: #0a6038; }

    #cohesif-footer { text-align: center; padding: 6px 0 10px; font-size: 10px; color: #bbb; flex-shrink: 0; }

    @media (max-width: 480px) {
      #cohesif-chat-widget { bottom: 16px; right: 16px; }
      #cohesif-panel { width: calc(100vw - 32px); right: -16px; }
    }
  `;

  const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="#0f7c4a"/>
    <path d="M8 44c0-8.8 6.3-16 14-16s14 7.2 14 16" fill="#0a6038"/>
    <path d="M14 30 L22 28 L30 30 L30 44 L14 44Z" fill="#1a9960"/>
    <path d="M19 29 L22 32 L25 29 L22 28Z" fill="#fff"/>
    <rect x="21" y="29" width="2" height="5" rx="1" fill="#4ade80" opacity="0.8"/>
    <circle cx="22" cy="16" r="9" fill="#f5c5a0"/>
    <path d="M13 14c0-5 4-9 9-9s9 4 9 9v1c-1-3-3-5-9-5s-8 2-9 5z" fill="#2d1b00"/>
    <circle cx="18.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="25.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="19" cy="15.5" r="0.4" fill="#fff"/>
    <circle cx="26" cy="15.5" r="0.4" fill="#fff"/>
    <path d="M18.5 19.5 Q22 22 25.5 19.5" stroke="#c47a4a" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  </svg>`;

  const AVATAR_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#0f7c4a"/>
    <path d="M5 28c0-5.5 4-10 9-10s9 4.5 9 10" fill="#0a6038"/>
    <circle cx="14" cy="11" r="6" fill="#f5c5a0"/>
    <path d="M8 9c0-3.3 2.7-6 6-6s6 2.7 6 6v.5c-.7-2-2-3-6-3s-5.3 1-6 2.5z" fill="#2d1b00"/>
    <circle cx="12" cy="11" r="0.9" fill="#2d1b00"/>
    <circle cx="16" cy="11" r="0.9" fill="#2d1b00"/>
    <path d="M11.5 13.5 Q14 15.5 16.5 13.5" stroke="#c47a4a" stroke-width="1" stroke-linecap="round" fill="none"/>
  </svg>`;

  function init() {
    if (document.getElementById('cohesif-chat-widget')) return;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'cohesif-chat-widget';
    widget.innerHTML = `
      <div id="cohesif-panel">
        <div id="cohesif-header">
          <div id="cohesif-avatar-wrap">${AVATAR_SVG}</div>
          <div id="cohesif-header-text">
            <div id="cohesif-header-name">Alex — Conseiller Cohesif</div>
            <div id="cohesif-header-status">En ligne · Répond instantanément</div>
          </div>
          <button id="cohesif-close" title="Fermer">✕</button>
        </div>
        <div id="cohesif-messages"></div>
        <div id="cohesif-suggestions"></div>
        <div id="cohesif-input-row">
          <input id="cohesif-input" type="text" placeholder="Posez votre question…" autocomplete="off" maxlength="300"/>
          <button id="cohesif-send" title="Envoyer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div id="cohesif-footer">Conseiller Cohesif Energy · Réponse instantanée</div>
      </div>
      <button id="cohesif-bubble" class="pulse" title="Parler à Alex">
        ${AVATAR_SVG}
        <div id="cohesif-badge" style="display:none">1</div>
      </button>
    `;
    document.body.appendChild(widget);

    const panel    = document.getElementById('cohesif-panel');
    const bubble   = document.getElementById('cohesif-bubble');
    const closeBtn = document.getElementById('cohesif-close');
    const messagesEl    = document.getElementById('cohesif-messages');
    const inputEl       = document.getElementById('cohesif-input');
    const sendBtn       = document.getElementById('cohesif-send');
    const suggestionsEl = document.getElementById('cohesif-suggestions');
    const badge         = document.getElementById('cohesif-badge');

    let isOpen = false;
    let msgCount = 0;

    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addMsg(role, html) {
      msgCount++;
      const el = document.createElement('div');
      el.className = `cohesif-msg ${role === 'bot' ? 'bot' : 'user'}`;
      const avatarEl = document.createElement('div');
      avatarEl.className = 'cohesif-msg-avatar';
      if (role === 'bot') avatarEl.innerHTML = AVATAR_SMALL;
      const bubbleEl = document.createElement('div');
      bubbleEl.className = 'cohesif-msg-bubble';
      if (role === 'bot') bubbleEl.innerHTML = html;
      else bubbleEl.textContent = html;
      if (role === 'bot') { el.appendChild(avatarEl); el.appendChild(bubbleEl); }
      else { el.appendChild(bubbleEl); }
      messagesEl.appendChild(el);
      scrollBottom();
    }

    function showTyping() {
      const el = document.createElement('div');
      el.id = 'cohesif-typing-row';
      el.className = 'cohesif-msg bot';
      el.innerHTML = `<div class="cohesif-msg-avatar">${AVATAR_SMALL}</div><div class="cohesif-msg-bubble cohesif-typing"><span></span><span></span><span></span></div>`;
      messagesEl.appendChild(el);
      scrollBottom();
    }

    function hideTyping() {
      const el = document.getElementById('cohesif-typing-row');
      if (el) el.remove();
    }

    function showSuggestions() {
      suggestionsEl.innerHTML = '';
      if (msgCount > 4) return;
      SUGGESTIONS.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'cohesif-suggestion';
        btn.textContent = s;
        btn.addEventListener('click', () => { send(s); });
        suggestionsEl.appendChild(btn);
      });
    }

    function send(text) {
      text = text.trim();
      if (!text) return;
      inputEl.value = '';
      suggestionsEl.innerHTML = '';
      addMsg('user', text);
      showTyping();
      setTimeout(() => {
        hideTyping();
        const answer = findAnswer(text) || DEFAULT_REPLY;
        addMsg('bot', answer);
        showSuggestions();
        if (!isOpen) {
          badge.style.display = 'flex';
        }
      }, 600 + Math.random() * 400);
    }

    function open() {
      isOpen = true;
      panel.classList.add('open');
      bubble.classList.remove('pulse');
      badge.style.display = 'none';
      if (msgCount === 0) {
        setTimeout(() => {
          addMsg('bot', "Bonjour ! 👋 Je suis Alex, votre conseiller Cohesif Energy. Je peux vous renseigner sur nos panneaux solaires, bornes de recharge, pompes à chaleur et toutes les aides disponibles. Comment puis-je vous aider ?");
          showSuggestions();
        }, 250);
      }
      inputEl.focus();
    }

    function close() {
      isOpen = false;
      panel.classList.remove('open');
    }

    bubble.addEventListener('click', () => isOpen ? close() : open());
    closeBtn.addEventListener('click', close);
    sendBtn.addEventListener('click', () => send(inputEl.value));
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); send(inputEl.value); }
    });

    // Remonte le widget au-dessus du clavier iOS/Android via visualViewport
    function adjustForViewport() {
      const vv = window.visualViewport;
      if (!vv) return;
      // Hauteur du clavier = différence entre la fenêtre et le viewport visible
      const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
      const lift = Math.max(keyboardHeight, 0);
      widget.style.transform = lift > 0 ? `translateY(-${lift}px)` : '';
      // Adapte la hauteur max du panel à l'espace disponible au-dessus du widget
      const available = vv.height - 24 - 80;
      panel.style.maxHeight = Math.max(available, 220) + 'px';
    }
    function resetViewport() {
      widget.style.transform = '';
      panel.style.maxHeight = '';
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustForViewport);
      window.visualViewport.addEventListener('scroll', adjustForViewport);
    }
    inputEl.addEventListener('blur', resetViewport);

    // Badge after 8s on first visit
    if (!sessionStorage.getItem('cohesif_seen')) {
      setTimeout(() => {
        if (!isOpen) {
          badge.style.display = 'flex';
          sessionStorage.setItem('cohesif_seen', '1');
        }
      }, 8000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
