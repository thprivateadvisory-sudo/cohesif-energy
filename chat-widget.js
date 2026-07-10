/**
 * Cohesif Energy - Assistant "Alex"
 * Structure inspirée de Cohesif BTP
 */
(function () {
  'use strict';

  const BRAND_GREEN = '#0f7c4a';
  const BRAND_SOFT  = '#e8f5ee';

  // ─── FAQ avec suggestions de navigation ───────────────────────────────────
  const faqData = [
    {
      id: 'solaire',
      question: 'Panneaux solaires',
      answer: 'Nos panneaux photovoltaïques convertissent la lumière du soleil en électricité. Vous consommez l\'énergie produite directement et réduisez votre facture. Avec une batterie de stockage, vous maximisez votre autonomie. Installation certifiée RGE QualiPV. ☀️',
      suggestions: ['Prix panneaux solaires', 'Aides solaires', 'Batterie de stockage', 'Certifications RGE']
    },
    {
      id: 'prix_solaire',
      question: 'Prix panneaux solaires',
      answer: 'Le prix dépend de la puissance installée et de votre toiture. En général entre 8 000 € et 20 000 € pour un particulier, avec des aides qui réduisent votre reste à charge. Demandez un devis gratuit pour une estimation personnalisée ! 📋',
      suggestions: ['Aides solaires', 'Devis gratuit', 'Délai installation']
    },
    {
      id: 'aides_solaires',
      question: 'Aides solaires',
      answer: 'La prime à l\'autoconsommation a été supprimée le 5 juin 2026. Aujourd\'hui les aides disponibles sont MaPrimeRénov\' et les CEE selon votre profil. Demandez votre devis gratuit, on calcule tout pour vous ! 🌞',
      suggestions: ['Prix panneaux solaires', 'Tarif rachat EDF', 'Devis gratuit']
    },
    {
      id: 'edf',
      question: 'Tarif rachat EDF',
      answer: 'Depuis le 5 juin 2026, le tarif de rachat EDF OA est de 0,011 €/kWh pour les nouvelles installations. C\'est pourquoi l\'autoconsommation maximale avec batterie est aujourd\'hui la stratégie la plus rentable. 💡',
      suggestions: ['Batterie de stockage', 'Panneaux solaires', 'Devis gratuit']
    },
    {
      id: 'batterie',
      question: 'Batterie de stockage',
      answer: 'Avec le tarif de rachat à 0,011 €/kWh, la batterie est fortement recommandée. Elle vous permet de stocker l\'énergie produite le jour pour la consommer le soir, et maximise votre retour sur investissement. 🔋',
      suggestions: ['Panneaux solaires', 'Prix panneaux solaires', 'Devis gratuit']
    },
    {
      id: 'bornes',
      question: 'Bornes de recharge',
      answer: 'Nous installons des bornes de recharge pour particuliers, copropriétés et entreprises. Bornes 7 kW à 22 kW selon vos besoins. Des aides ADVENIR et crédits d\'impôt sont disponibles selon votre situation. 🔌',
      suggestions: ['Borne particulier', 'Borne copropriété', 'Borne entreprise']
    },
    {
      id: 'borne_particulier',
      question: 'Borne particulier',
      answer: 'Pour une borne en résidence principale ou secondaire, vous bénéficiez d\'un crédit d\'impôt jusqu\'à 500 € (75% du coût). Installation rapide et certifiée par nos techniciens. 🏠',
      suggestions: ['Bornes de recharge', 'Devis gratuit', 'Délai installation']
    },
    {
      id: 'borne_copropriete',
      question: 'Borne copropriété',
      answer: 'Le programme ADVENIR (taux avril 2026) finance jusqu\'à 12 500 € pour l\'infrastructure collective et 1 000 € par borne individuelle. Nous gérons toutes les démarches avec le syndic. 🏢',
      suggestions: ['Bornes de recharge', 'Devis gratuit', 'Contact']
    },
    {
      id: 'borne_entreprise',
      question: 'Borne entreprise',
      answer: 'Pour les entreprises, nous installons des bornes pour flottes et parkings. Avantages fiscaux, déductions charges, amortissement accéléré. Étude personnalisée gratuite avec chiffrage complet. 🏭',
      suggestions: ['Bornes de recharge', 'Devis gratuit', 'Contact']
    },
    {
      id: 'pac',
      question: 'Pompe à chaleur',
      answer: 'MaPrimeRénov\' 2026 : jusqu\'à 5 000 € pour les ménages très modestes, 4 000 € pour les ménages modestes, 3 000 € pour les ménages intermédiaires. CEE Coup de Pouce PAC toujours actif en complément ! 🌡️',
      suggestions: ['MaPrimeRénov\'', 'Aides disponibles', 'Devis gratuit']
    },
    {
      id: 'maprimerenov',
      question: 'MaPrimeRénov\'',
      answer: 'MaPrimeRénov\' est une aide de l\'État calculée selon vos revenus. Pour une PAC air/eau : 3 000 € à 5 000 € selon votre foyer. Cohesif Energy gère le dossier pour vous, de A à Z. 📄',
      suggestions: ['Pompe à chaleur', 'Aides disponibles', 'Devis gratuit']
    },
    {
      id: 'aides',
      question: 'Aides disponibles',
      answer: 'Selon votre projet : MaPrimeRénov\', CEE Coup de Pouce, crédit d\'impôt borne de recharge, programme ADVENIR. Nous optimisons toutes les aides pour maximiser votre économie. Notre équipe gère les dossiers pour vous ! 💰',
      suggestions: ['MaPrimeRénov\'', 'Aides solaires', 'Bornes de recharge']
    },
    {
      id: 'rge',
      question: 'Certifications RGE',
      answer: 'Oui, Cohesif Energy est certifié RGE QualiPV (solaire) et QualiPAC (pompes à chaleur). Cette certification est obligatoire pour accéder aux aides de l\'État. Vous êtes entre de bonnes mains ! ✅',
      suggestions: ['Panneaux solaires', 'Pompe à chaleur', 'Devis gratuit']
    },
    {
      id: 'delai',
      question: 'Délai installation',
      answer: 'En général 4 à 8 semaines entre la signature et l\'installation, selon les démarches administratives et notre planning. Nous vous tenons informé à chaque étape. 📅',
      suggestions: ['Garantie', 'Devis gratuit', 'Contact']
    },
    {
      id: 'garantie',
      question: 'Garantie',
      answer: 'Nos installations bénéficient des garanties fabricant (10 à 25 ans sur les panneaux, 5 à 10 ans sur les onduleurs) et de notre garantie main d\'œuvre. SAV réactif assuré par Cohesif Energy. 🛡️',
      suggestions: ['Certifications RGE', 'Devis gratuit', 'Contact']
    },
    {
      id: 'devis',
      question: 'Devis gratuit',
      answer: 'Notre devis est 100% gratuit et sans engagement ! Remplissez le formulaire sur notre page Contact, ou appelez-nous. Un conseiller vous rappelle sous 24h pour une étude personnalisée. 📞',
      suggestions: ['Panneaux solaires', 'Bornes de recharge', 'Pompe à chaleur']
    },
    {
      id: 'contact',
      question: 'Contact',
      answer: 'Contactez-nous par email : cohesifenergy@gmail.com ou via notre <a href="contact-devis.html" style="color:#0f7c4a;font-weight:600">formulaire de contact</a>. Un conseiller vous rappelle sous 24h ! 📞',
      suggestions: ['Devis gratuit', 'Panneaux solaires', 'Bornes de recharge']
    },
    {
      id: 'groupe',
      question: 'Groupe Cohesif',
      answer: 'Le Groupe Cohesif est un groupe français multi-métiers avec 8 pôles : Cohesif Energy (solaire, bornes, PAC), Cohesif BTP (rénovation), Cohesif Auto, Cohesif Commerce, Cohesif Sport, Cohesif Agro, Cohesif Négoce et Cohesif Access. Un interlocuteur unique pour tous vos projets ! 🏗️',
      suggestions: ['Panneaux solaires', 'Bornes de recharge', 'Contact']
    },
  ];

  const INITIAL_SUGGESTIONS = [
    '☀️ Panneaux solaires',
    '🔌 Bornes de recharge',
    '🌡️ Pompe à chaleur',
    '💰 Aides disponibles',
    '📋 Devis gratuit',
  ];

  // ─── Avatar SVG (Alex, conseiller Cohesif Energy) ─────────────────────────
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

  // ─── CSS ───────────────────────────────────────────────────────────────────
  const CSS = `
    /* ──────────── ASSISTANT IA COHESIF ENERGY */
    .cohesif-ai-assistant {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    /* Bulle d'invitation */
    .cohesif-ai-bubble {
      position: absolute;
      bottom: 88px;
      right: 0;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 18px 18px 4px 18px;
      padding: 16px 20px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      width: 260px;
      opacity: 0;
      transform: translateY(10px) scale(0.95);
      transition: opacity 0.4s, transform 0.4s;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .cohesif-ai-bubble.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .cohesif-ai-bubble-close {
      position: absolute;
      top: 8px; right: 8px;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: #6b7280;
      border: none;
      transition: background 0.15s;
      line-height: 1;
    }
    .cohesif-ai-bubble-close:hover { background: #e5e7eb; }
    .cohesif-ai-bubble-name {
      font-size: 12px; font-weight: 700;
      color: ${BRAND_GREEN};
      letter-spacing: 1px; text-transform: uppercase;
      margin-bottom: 4px;
    }
    .cohesif-ai-bubble-text {
      font-size: 14px;
      color: #111;
      line-height: 1.45;
    }

    /* Avatar bouton */
    .cohesif-ai-avatar {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8f5ee 0%, #c8e6d4 100%);
      border: 3px solid #fff;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 28px rgba(15,124,74,0.25),
                  0 0 0 1px rgba(15,124,74,0.15);
      transition: transform 0.25s, box-shadow 0.25s;
      position: relative;
      overflow: hidden;
      padding: 0;
    }
    .cohesif-ai-avatar:hover {
      transform: scale(1.08) rotate(-3deg);
      box-shadow: 0 14px 36px rgba(15,124,74,0.4),
                  0 0 0 1px rgba(15,124,74,0.3);
    }
    .cohesif-ai-avatar svg { width: 90%; height: auto; }
    .cohesif-ai-avatar-status {
      position: absolute;
      bottom: 4px; right: 4px;
      width: 16px; height: 16px;
      background: #16a34a;
      border: 3px solid #fff;
      border-radius: 50%;
      animation: cohesif-ai-pulse 2s infinite;
      z-index: 2;
    }
    @keyframes cohesif-ai-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.5); }
      70%  { box-shadow: 0 0 0 10px rgba(22,163,74,0); }
      100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
    }

    /* Fenêtre de chat */
    .cohesif-ai-chat {
      position: absolute;
      bottom: 88px;
      right: 0;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 120px);
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .cohesif-ai-chat.open {
      display: flex;
      animation: cohesif-ai-chat-open 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes cohesif-ai-chat-open {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header */
    .cohesif-ai-chat-header {
      background: #111;
      color: #fff;
      padding: 18px 20px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .cohesif-ai-chat-mini-avatar {
      width: 44px; height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e8f5ee 0%, #c8e6d4 100%);
      flex-shrink: 0;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .cohesif-ai-chat-mini-avatar svg { width: 90%; height: auto; }
    .cohesif-ai-chat-info { flex: 1; line-height: 1.2; }
    .cohesif-ai-chat-name { font-size: 15px; font-weight: 700; color: #fff; }
    .cohesif-ai-chat-status {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      display: flex; align-items: center; gap: 6px;
      margin-top: 2px;
    }
    .cohesif-ai-chat-status::before {
      content: '';
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
    }
    .cohesif-ai-chat-close {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: #fff;
      font-size: 18px;
      border: none;
      transition: background 0.15s;
      line-height: 1;
    }
    .cohesif-ai-chat-close:hover { background: rgba(255,255,255,0.2); }

    /* Body */
    .cohesif-ai-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex; flex-direction: column;
      gap: 14px;
      background: #f9fafb;
    }
    .cohesif-ai-chat-body::-webkit-scrollbar { width: 6px; }
    .cohesif-ai-chat-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

    /* Messages */
    .cohesif-ai-msg {
      max-width: 85%;
      padding: 11px 15px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: cohesif-ai-msg-in 0.3s ease both;
    }
    @keyframes cohesif-ai-msg-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cohesif-ai-msg-bot {
      background: #fff;
      border: 1px solid #e5e7eb;
      color: #111;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .cohesif-ai-msg-user {
      background: ${BRAND_GREEN};
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .cohesif-ai-msg-bot a {
      color: ${BRAND_GREEN};
      text-decoration: underline;
      font-weight: 600;
    }

    /* Indicateur de frappe */
    .cohesif-ai-typing {
      display: inline-flex;
      gap: 4px;
      padding: 4px 0;
    }
    .cohesif-ai-typing span {
      width: 7px; height: 7px;
      background: #9ca3af;
      border-radius: 50%;
      animation: cohesif-ai-typing-anim 1.2s infinite;
    }
    .cohesif-ai-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cohesif-ai-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cohesif-ai-typing-anim {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-3px); }
    }

    /* Suggestions */
    .cohesif-ai-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 4px;
    }
    .cohesif-ai-suggestion {
      background: #fff;
      border: 1px solid #d1d5db;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 13px;
      color: #111;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, transform 0.15s;
      font-family: inherit;
    }
    .cohesif-ai-suggestion:hover {
      border-color: ${BRAND_GREEN};
      background: ${BRAND_SOFT};
      transform: translateY(-1px);
    }

    /* Footer */
    .cohesif-ai-chat-footer {
      padding: 14px 16px;
      border-top: 1px solid #e5e7eb;
      background: #fff;
      flex-shrink: 0;
    }
    .cohesif-ai-chat-footer-text {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      letter-spacing: 0.3px;
    }
    .cohesif-ai-chat-footer-cta {
      display: block;
      background: #111;
      color: #fff;
      text-align: center;
      padding: 12px;
      border-radius: 999px;
      font-weight: 600; font-size: 14px;
      margin-top: 8px;
      transition: background 0.15s;
      text-decoration: none;
    }
    .cohesif-ai-chat-footer-cta:hover { background: ${BRAND_GREEN}; color: #fff; }

    /* Mobile sticky CTA */
    .cohesif-mobile-sticky-cta { display: none; }

    @media (max-width: 768px) {
      .cohesif-ai-assistant { bottom: 90px; right: 16px; }
      .cohesif-ai-avatar { width: 56px; height: 56px; }
      .cohesif-ai-bubble { bottom: 72px; width: 240px; }
      .cohesif-ai-chat { bottom: 72px; width: calc(100vw - 32px); height: 70vh; }

      .cohesif-mobile-sticky-cta {
        display: flex;
        position: fixed;
        bottom: 16px; left: 16px; right: 16px;
        z-index: 9998;
        background: #111;
        border-radius: 999px;
        padding: 4px 4px 4px 20px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.25),
                    0 0 0 1px rgba(255,255,255,0.05);
        transform: translateY(120%);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        text-decoration: none;
      }
      .cohesif-mobile-sticky-cta.visible { transform: translateY(0); }
      .cohesif-mobile-sticky-cta-text {
        color: #fff;
        font-size: 14px; font-weight: 600;
        line-height: 1.2;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .cohesif-mobile-sticky-cta-text small {
        display: block;
        color: rgba(255,255,255,0.6);
        font-size: 11px; font-weight: 500;
        margin-top: 2px; letter-spacing: 0.5px;
      }
      .cohesif-mobile-sticky-cta-btn {
        background: ${BRAND_GREEN};
        color: #fff;
        font-size: 13px; font-weight: 700;
        padding: 12px 18px;
        border-radius: 999px;
        white-space: nowrap; flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
    }
  `;

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('cohesif-ai-widget')) return;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'cohesif-ai-widget';
    widget.innerHTML = `
      <div class="cohesif-ai-assistant">

        <div class="cohesif-ai-bubble">
          <button class="cohesif-ai-bubble-close" title="Fermer">&#x2715;</button>
          <div class="cohesif-ai-bubble-name">COHESIF ENERGY</div>
          <div class="cohesif-ai-bubble-text">Besoin d'aide ? Posez vos questions !</div>
        </div>

        <button class="cohesif-ai-avatar" title="Parler à Alex">
          ${AVATAR_SVG}
          <div class="cohesif-ai-avatar-status"></div>
        </button>

        <div class="cohesif-ai-chat">
          <div class="cohesif-ai-chat-header">
            <div class="cohesif-ai-chat-mini-avatar">${AVATAR_SVG}</div>
            <div class="cohesif-ai-chat-info">
              <div class="cohesif-ai-chat-name">Alex &mdash; Conseiller Cohesif Energy</div>
              <div class="cohesif-ai-chat-status">En ligne &middot; R&eacute;pond instantan&eacute;ment</div>
            </div>
            <button class="cohesif-ai-chat-close" title="Fermer">&#x2715;</button>
          </div>

          <div class="cohesif-ai-chat-body"></div>

          <div class="cohesif-ai-chat-footer">
            <div class="cohesif-ai-chat-footer-text">Propuls&eacute; par IA &middot; Cohesif Energy</div>
            <a href="contact-devis.html" class="cohesif-ai-chat-footer-cta">Demander un devis gratuit</a>
          </div>
        </div>

      </div>

      <a href="contact-devis.html" class="cohesif-mobile-sticky-cta">
        <div class="cohesif-mobile-sticky-cta-text">
          Besoin d'aide ?
          <small>Cliquez ici</small>
        </div>
        <div class="cohesif-mobile-sticky-cta-btn">Devis gratuit</div>
      </a>
    `;
    document.body.appendChild(widget);

    const bubble      = widget.querySelector('.cohesif-ai-bubble');
    const bubbleClose = widget.querySelector('.cohesif-ai-bubble-close');
    const avatar      = widget.querySelector('.cohesif-ai-avatar');
    const chatWindow  = widget.querySelector('.cohesif-ai-chat');
    const chatClose   = widget.querySelector('.cohesif-ai-chat-close');
    const chatBody    = widget.querySelector('.cohesif-ai-chat-body');
    const mobileCta   = widget.querySelector('.cohesif-mobile-sticky-cta');

    let chatOpen = false;

    // Bulle invitation après 3s
    setTimeout(() => {
      if (!chatOpen) bubble.classList.add('show');
    }, 3000);

    bubbleClose.addEventListener('click', function (e) {
      e.stopPropagation();
      bubble.classList.remove('show');
    });

    avatar.addEventListener('click', function () {
      chatOpen = !chatOpen;
      if (chatOpen) {
        chatWindow.classList.add('open');
        bubble.classList.remove('show');
        initChat();
      } else {
        chatWindow.classList.remove('open');
      }
    });

    chatClose.addEventListener('click', function () {
      chatOpen = false;
      chatWindow.classList.remove('open');
    });

    function initChat() {
      if (chatBody.children.length === 0) {
        addBotMsg('Bonjour ! 👋 Je suis Alex, votre conseiller Cohesif Energy. Comment puis-je vous aider ?');
        setTimeout(function () { showSuggestions(INITIAL_SUGGESTIONS); }, 400);
      }
    }

    function addBotMsg(html) {
      var el = document.createElement('div');
      el.className = 'cohesif-ai-msg cohesif-ai-msg-bot';
      el.innerHTML = html;
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addUserMsg(text) {
      var el = document.createElement('div');
      el.className = 'cohesif-ai-msg cohesif-ai-msg-user';
      el.textContent = text;
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
      var el = document.createElement('div');
      el.id = 'cohesif-typing-indicator';
      el.className = 'cohesif-ai-msg cohesif-ai-msg-bot';
      el.innerHTML = '<div class="cohesif-ai-typing"><span></span><span></span><span></span></div>';
      chatBody.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTyping() {
      var el = document.getElementById('cohesif-typing-indicator');
      if (el) el.remove();
    }

    function showSuggestions(list) {
      var container = document.createElement('div');
      container.className = 'cohesif-ai-suggestions';
      list.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'cohesif-ai-suggestion';
        btn.textContent = text;
        btn.addEventListener('click', function () { handleInput(text); });
        container.appendChild(btn);
      });
      chatBody.appendChild(container);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleInput(text) {
      addUserMsg(text);
      showTyping();

      // Nettoyage pour la recherche
      var clean = text.replace(/[\u{1F300}-\u{1FFFF}]|\p{Emoji}/gu, '').trim().toLowerCase();
      var faq = null;
      for (var i = 0; i < faqData.length; i++) {
        var q = faqData[i].question.toLowerCase();
        if (clean.includes(q) || q.includes(clean)) { faq = faqData[i]; break; }
      }

      setTimeout(function () {
        hideTyping();
        if (faq) {
          addBotMsg(faq.answer);
          setTimeout(function () { showSuggestions(faq.suggestions); }, 300);
        } else {
          addBotMsg('Je ne suis pas sûr de comprendre. Voici les sujets sur lesquels je peux vous aider :');
          setTimeout(function () { showSuggestions(INITIAL_SUGGESTIONS); }, 300);
        }
      }, 700 + Math.random() * 300);
    }

    // Mobile sticky CTA au scroll
    function toggleMobileCta() {
      if (!mobileCta) return;
      if (window.scrollY > 300) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleMobileCta, { passive: true });
    toggleMobileCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
