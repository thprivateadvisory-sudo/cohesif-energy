/**
 * Cohesif Energy - Assistant IA "Alex"
 * Widget de chat alimenté par Claude AI (Anthropic)
 * Configuration : remplacer ANTHROPIC_API_KEY par votre clé API
 */

(function () {
  const API_KEY = 'VOTRE_CLE_API_ICI'; // Remplacer par votre clé Anthropic

  const SYSTEM_PROMPT = `Tu es Alex, le conseiller expert de Cohesif Energy. Tu es chaleureux, professionnel et orienté conversion.
Tu réponds en français, de façon concise et claire. Tu aides les visiteurs à comprendre les solutions et à passer à l'action.

## À propos du Groupe Cohesif
Le Groupe Cohesif est un groupe français spécialisé dans la transition énergétique et la rénovation du bâtiment, avec 5 pôles :
1. **Cohesif Energy** – Énergies renouvelables : panneaux solaires, bornes de recharge, pompes à chaleur
2. **Cohesif BTP** – Rénovation globale et travaux du bâtiment
3. **Cohesif Piscines** – Construction et rénovation de piscines
4. **Cohesif Confort** – Climatisation, ventilation, plomberie
5. **Cohesif Immobilier** – Gestion et transaction immobilière

Siège social : 200 rue de la Croix Nivert, 75015 Paris
SIRET : 889 287 462 00036
Contact : cohesifenergy@gmail.com

## Cohesif Energy – Solutions

### 🔆 Panneaux Solaires
- Installation de panneaux photovoltaïques pour particuliers et entreprises
- Garantie RGE QualiPV
- Aide disponible : MaPrimeRénov' selon les revenus
- **Important (juin 2026)** : La prime à l'autoconsommation a été SUPPRIMÉE le 5 juin 2026
- Tarif de rachat EDF OA : **0,011 €/kWh** pour les nouvelles demandes depuis le 5 juin 2026 (les anciens contrats conservent leur tarif de 0,04 €/kWh)
- Avec ce tarif bas, l'autoconsommation maximale est désormais la stratégie la plus rentable
- Les batteries de stockage sont fortement recommandées pour maximiser l'autoconsommation
- Démarches : déclaration préalable mairie + Consuel + raccordement Enedis (sans prime autoconsommation)

### 🔌 Bornes de Recharge

**Pour particuliers (résidences) :**
- Borne 7 kW en résidence principale ou secondaire
- Crédit d'impôt : jusqu'à 500 € (75% du coût, max 300 € équipement + 200 € pose)
- ADVENIR résidentiel : aide disponible selon profil

**Pour copropriétés :**
- Programme ADVENIR (taux avril 2026) :
  - Infrastructure collective : jusqu'à 12 500 €
  - Bornes individuelles : jusqu'à 1 000 €/borne
- Aide FACE : financement complémentaire possible

**Pour entreprises :**
- Bornes pour flottes et parkings professionnels
- Avantages fiscaux : déduction charges, amortissement accéléré
- Exonération cotisations sociales salarié pour la recharge
- Devis gratuit avec étude personnalisée

### 🌡️ Pompes à Chaleur (PAC)
- PAC air/eau pour chauffage et eau chaude sanitaire
- MaPrimeRénov' 2026 (montants actuels) :
  - Ménages très modestes : **5 000 €**
  - Ménages modestes : **4 000 €**
  - Ménages intermédiaires : **3 000 €**
- CEE "Coup de Pouce" PAC : prime supplémentaire toujours active
- Obligatoire : logement construit avant 2021, audit énergétique préalable requis
- RGE QualiPAC obligatoire → Cohesif Energy est certifié

## Conseils de conversion
- Toujours proposer le devis gratuit et sans engagement
- Mettre en avant les aides financières disponibles
- Insister sur l'économie sur la facture d'énergie
- Rassurer sur l'installation clé en main par des experts certifiés RGE
- Si la question dépasse ton domaine, diriger vers cohesifenergy@gmail.com

## Format de réponses
- Réponses courtes et percutantes (3-6 phrases max)
- Utilise des emojis avec parcimonie pour aérer
- Termine souvent par une invitation à demander un devis ou à poser une autre question
- Ne jamais inventer de prix ou de chiffres non fournis ci-dessus`;

  const BRAND_GREEN = '#0f7c4a';
  const BRAND_LIGHT = '#e8f5ee';

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
      overflow: hidden; max-height: 520px;
      animation: cohesif-slide-up 0.25s ease;
    }
    @keyframes cohesif-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    #cohesif-panel.open { display: flex; }

    #cohesif-header {
      background: ${BRAND_GREEN}; padding: 16px 18px;
      display: flex; align-items: center; gap: 12px;
    }
    #cohesif-avatar-wrap {
      width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
      background: #fff; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.5);
    }
    #cohesif-header-text { flex: 1; }
    #cohesif-header-name { color: #fff; font-weight: 700; font-size: 15px; }
    #cohesif-header-status { color: rgba(255,255,255,0.8); font-size: 12px; display: flex; align-items: center; gap: 4px; }
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

    .cohesif-msg { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }
    .cohesif-msg.user { flex-direction: row-reverse; }
    .cohesif-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; overflow: hidden;
      background: ${BRAND_GREEN}; flex-shrink: 0;
    }
    .cohesif-msg-bubble {
      padding: 10px 13px; border-radius: 16px; font-size: 14px; line-height: 1.45;
      max-width: calc(100% - 42px); word-break: break-word;
    }
    .cohesif-msg.bot .cohesif-msg-bubble { background: ${BRAND_LIGHT}; color: #1a1a1a; border-bottom-left-radius: 4px; }
    .cohesif-msg.user .cohesif-msg-bubble { background: ${BRAND_GREEN}; color: #fff; border-bottom-right-radius: 4px; }

    .cohesif-typing { display: flex; gap: 4px; padding: 12px 14px; }
    .cohesif-typing span {
      width: 7px; height: 7px; background: #aaa; border-radius: 50%;
      animation: cohesif-bounce 1.2s infinite;
    }
    .cohesif-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cohesif-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cohesif-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    #cohesif-suggestions { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 6px; }
    .cohesif-suggestion {
      background: ${BRAND_LIGHT}; color: ${BRAND_GREEN}; border: 1px solid rgba(15,124,74,0.25);
      border-radius: 20px; padding: 5px 12px; font-size: 12px; cursor: pointer;
      transition: background 0.15s; white-space: nowrap;
    }
    .cohesif-suggestion:hover { background: #d1ead9; }

    #cohesif-input-row {
      border-top: 1px solid #f0f0f0; padding: 12px 14px;
      display: flex; gap: 8px; align-items: center;
    }
    #cohesif-input {
      flex: 1; border: 1.5px solid #e0e0e0; border-radius: 22px;
      padding: 9px 14px; font-size: 14px; outline: none;
      transition: border-color 0.15s; resize: none; max-height: 80px;
    }
    #cohesif-input:focus { border-color: ${BRAND_GREEN}; }
    #cohesif-send {
      width: 38px; height: 38px; border-radius: 50%;
      background: ${BRAND_GREEN}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s;
    }
    #cohesif-send:hover { background: #0a6038; }
    #cohesif-send:disabled { background: #ccc; cursor: default; }

    #cohesif-footer { text-align: center; padding: 6px 0 10px; font-size: 10px; color: #bbb; }

    @media (max-width: 480px) {
      #cohesif-chat-widget { bottom: 16px; right: 16px; }
      #cohesif-panel { width: calc(100vw - 32px); right: -16px; }
    }
  `;

  const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="22" fill="#0f7c4a"/>
    <!-- Corps -->
    <path d="M8 44c0-8.8 6.3-16 14-16s14 7.2 14 16" fill="#0a6038"/>
    <!-- Veste -->
    <path d="M14 30 L22 28 L30 30 L30 44 L14 44Z" fill="#1a9960"/>
    <!-- Chemise col -->
    <path d="M19 29 L22 32 L25 29 L22 28Z" fill="#fff"/>
    <!-- Cravate ou badge -->
    <rect x="21" y="29" width="2" height="6" rx="1" fill="#4ade80" opacity="0.8"/>
    <!-- Tête -->
    <circle cx="22" cy="16" r="9" fill="#f5c5a0"/>
    <!-- Cheveux -->
    <path d="M13 14c0-5 4-9 9-9s9 4 9 9v1c-1-3-3-5-9-5s-8 2-9 5z" fill="#2d1b00"/>
    <!-- Yeux -->
    <circle cx="18.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="25.5" cy="16" r="1.3" fill="#2d1b00"/>
    <circle cx="19" cy="15.5" r="0.4" fill="#fff"/>
    <circle cx="26" cy="15.5" r="0.4" fill="#fff"/>
    <!-- Sourire -->
    <path d="M18.5 19.5 Q22 22 25.5 19.5" stroke="#c47a4a" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <!-- Nez -->
    <ellipse cx="22" cy="18" rx="1" ry="0.6" fill="#c47a4a" opacity="0.5"/>
  </svg>`;

  const AVATAR_SVG_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#0f7c4a"/>
    <path d="M5 28c0-5.5 4-10 9-10s9 4.5 9 10" fill="#0a6038"/>
    <circle cx="14" cy="11" r="6" fill="#f5c5a0"/>
    <path d="M8 9c0-3.3 2.7-6 6-6s6 2.7 6 6v.5c-.7-2-2-3.2-6-3.2S8.7 7 8 9z" fill="#2d1b00"/>
    <circle cx="12" cy="11" r="0.9" fill="#2d1b00"/>
    <circle cx="16" cy="11" r="0.9" fill="#2d1b00"/>
    <path d="M11.5 13.5 Q14 15.5 16.5 13.5" stroke="#c47a4a" stroke-width="1" stroke-linecap="round" fill="none"/>
  </svg>`;

  const SUGGESTIONS = [
    "💰 Aides disponibles en 2026 ?",
    "☀️ Panneaux solaires, quel prix ?",
    "🔌 Borne recharge copropriété",
    "🌡️ Pompe à chaleur, combien ?",
    "📞 Obtenir un devis gratuit",
  ];

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
            <div id="cohesif-header-status">En ligne · Réponse immédiate</div>
          </div>
          <button id="cohesif-close" title="Fermer">✕</button>
        </div>
        <div id="cohesif-messages"></div>
        <div id="cohesif-suggestions"></div>
        <div id="cohesif-input-row">
          <input id="cohesif-input" type="text" placeholder="Posez votre question à Alex…" autocomplete="off" maxlength="500"/>
          <button id="cohesif-send" title="Envoyer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div id="cohesif-footer">Propulsé par Claude AI · Cohesif Energy</div>
      </div>
      <button id="cohesif-bubble" class="pulse" title="Parler à Alex, notre conseiller">
        ${AVATAR_SVG}
        <div id="cohesif-badge" style="display:none">1</div>
      </button>
    `;
    document.body.appendChild(widget);

    const panel = document.getElementById('cohesif-panel');
    const bubble = document.getElementById('cohesif-bubble');
    const closeBtn = document.getElementById('cohesif-close');
    const messagesEl = document.getElementById('cohesif-messages');
    const inputEl = document.getElementById('cohesif-input');
    const sendBtn = document.getElementById('cohesif-send');
    const suggestionsEl = document.getElementById('cohesif-suggestions');
    const badge = document.getElementById('cohesif-badge');

    let messages = [];
    let isOpen = false;
    let hasUnread = false;

    function showSuggestions() {
      suggestionsEl.innerHTML = '';
      if (messages.length > 2) return;
      SUGGESTIONS.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'cohesif-suggestion';
        btn.textContent = s;
        btn.addEventListener('click', () => { sendMessage(s); suggestionsEl.innerHTML = ''; });
        suggestionsEl.appendChild(btn);
      });
    }

    function addMessage(role, text) {
      messages.push({ role, content: text });
      const msgEl = document.createElement('div');
      msgEl.className = `cohesif-msg ${role === 'assistant' ? 'bot' : 'user'}`;
      const avatarEl = document.createElement('div');
      avatarEl.className = 'cohesif-msg-avatar';
      if (role === 'assistant') avatarEl.innerHTML = AVATAR_SVG_SMALL;
      const bubbleEl = document.createElement('div');
      bubbleEl.className = 'cohesif-msg-bubble';
      bubbleEl.textContent = text;
      if (role === 'assistant') {
        msgEl.appendChild(avatarEl);
        msgEl.appendChild(bubbleEl);
      } else {
        msgEl.appendChild(bubbleEl);
      }
      messagesEl.appendChild(msgEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addTyping() {
      const el = document.createElement('div');
      el.className = 'cohesif-msg bot';
      el.id = 'cohesif-typing';
      el.innerHTML = `<div class="cohesif-msg-avatar">${AVATAR_SVG_SMALL}</div><div class="cohesif-msg-bubble cohesif-typing"><span></span><span></span><span></span></div>`;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      const el = document.getElementById('cohesif-typing');
      if (el) el.remove();
    }

    async function sendMessage(text) {
      text = text.trim();
      if (!text) return;
      inputEl.value = '';
      sendBtn.disabled = true;
      suggestionsEl.innerHTML = '';
      addMessage('user', text);
      addTyping();

      try {
        const apiMessages = messages.slice(0, -1).concat([{ role: 'user', content: text }]);
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages: apiMessages.map(m => ({ role: m.role, content: m.content })),
          }),
        });

        removeTyping();

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const reply = data.content?.[0]?.text || "Je n'ai pas pu générer de réponse. Veuillez réessayer.";
        addMessage('assistant', reply);

        if (!isOpen) {
          hasUnread = true;
          badge.style.display = 'flex';
        }
      } catch (err) {
        removeTyping();
        console.error('[Cohesif Chat]', err);
        addMessage('assistant', "Désolé, je rencontre un problème technique. Contactez-nous directement à cohesifenergy@gmail.com ou demandez un devis sur notre site. 😊");
      }

      sendBtn.disabled = false;
      inputEl.focus();
      showSuggestions();
    }

    function open() {
      isOpen = true;
      panel.classList.add('open');
      bubble.classList.remove('pulse');
      badge.style.display = 'none';
      hasUnread = false;
      if (messages.length === 0) {
        setTimeout(() => {
          addMessage('assistant', "Bonjour ! 👋 Je suis Alex, votre conseiller Cohesif Energy. Je peux répondre à toutes vos questions sur nos solutions solaires, bornes de recharge, pompes à chaleur et les aides financières disponibles. Comment puis-je vous aider ?");
          showSuggestions();
        }, 300);
      }
      inputEl.focus();
    }

    function close() {
      isOpen = false;
      panel.classList.remove('open');
      if (messages.length > 0) bubble.classList.remove('pulse');
    }

    bubble.addEventListener('click', () => isOpen ? close() : open());
    closeBtn.addEventListener('click', close);

    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputEl.value); }
    });

    // Auto-open hint after 8 seconds on first visit
    if (!sessionStorage.getItem('cohesif_chat_seen')) {
      setTimeout(() => {
        if (!isOpen) {
          badge.style.display = 'flex';
          hasUnread = true;
          sessionStorage.setItem('cohesif_chat_seen', '1');
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
