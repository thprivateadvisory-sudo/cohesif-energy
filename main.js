/* Cohesif Energy — interactions client */
(function () {
  'use strict';

  // === MOBILE MENU ===
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuClose = document.querySelector('[data-menu-close]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  // Fermer le menu mobile en cliquant sur un lien
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // === FAQ ACCORDION ===
  const faqQuestions = document.querySelectorAll('[data-faq-toggle]');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');

      // Fermer tous les autres
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        if (el !== item) el.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
    });
  });

  // === BANDEAU CANICULE ===
  var bandeau = document.getElementById('bandeau-canicule');
  var bandeauClose = document.getElementById('bandeau-canicule-close');
  if (bandeau && bandeauClose) {
    if (sessionStorage.getItem('bandeau-canicule-dismissed') === '1') {
      bandeau.classList.add('hidden');
    }
    bandeauClose.addEventListener('click', function () {
      bandeau.classList.add('hidden');
      sessionStorage.setItem('bandeau-canicule-dismissed', '1');
    });
  }

  // === HEADER SCROLL EFFECT ===
  const header = document.querySelector('.header');
  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // === FORMULAIRE DE CONTACT (Formspree AJAX) ===
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formspreeId = contactForm.getAttribute('data-formspree-id');
      var submitBtn = document.getElementById('form-submit-btn');
      var errorMsg = document.getElementById('form-error-msg');
      var successDiv = document.getElementById('form-success');

      if (!formspreeId || formspreeId === 'VOTRE_ID_FORMSPREE') {
        errorMsg.classList.add('visible');
        errorMsg.textContent = 'Le formulaire n\'est pas encore configuré. Écrivez-nous directement à cohesifenergy@gmail.com';
        return;
      }

      var originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Envoi en cours...';
      errorMsg.classList.remove('visible');

      fetch('https://formspree.io/f/' + formspreeId, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          contactForm.style.display = 'none';
          if (successDiv) successDiv.style.display = 'block';
        } else {
          return res.json().then(function (data) {
            throw new Error(data.error || 'Erreur serveur');
          });
        }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        errorMsg.classList.add('visible');
      });
    });
  }
})();
