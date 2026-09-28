/* Cohesif Energy — boutique : choix de la variante, galerie, barre d'achat mobile */
(function () {
  'use strict';

  function eur(n, decimals) {
    return n.toLocaleString('fr-FR', {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0
    }) + ' €';
  }

  function buyUrl(base, id) {
    return base + '?produit=' + encodeURIComponent(id) + '&source=cohesifenergy';
  }

  // === GALERIE ===
  var main = document.querySelector('[data-gallery-main]');
  function markPhoto(img) {
    img.classList.toggle('is-photo', /\/vie-/.test(img.getAttribute('src')));
  }
  if (main) {
    markPhoto(main);
    document.querySelectorAll('[data-gallery-thumb]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        main.setAttribute('src', btn.getAttribute('data-gallery-thumb'));
        markPhoto(main);
        document.querySelectorAll('[data-gallery-thumb]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
      });
    });
  }

  // === VARIANTES ===
  var product = document.querySelector('[data-product]');
  if (!product) return;

  var tax = product.getAttribute('data-tax');
  var tva = parseFloat(product.getAttribute('data-tva'));
  var base = product.getAttribute('data-commande');
  var priceBlock = product.querySelector('[data-price-block]');
  var buyMain = product.querySelector('[data-buy-main]');
  var buySticky = document.querySelector('[data-buy-sticky]');
  var stickyPrice = document.querySelector('[data-sticky-price]');
  var poseBox = product.querySelector('[data-pose-box]');
  var deposit = product.querySelector('[data-deposit]');

  function render() {
    var input = product.querySelector('input[name="variante"]:checked');
    if (!input) return;
    // Prix pas encore en ligne : le bouton mène à la demande de prix de la version choisie
    if (product.getAttribute('data-vendu') === '0') {
      var devis = input.getAttribute('data-devis');
      if (buyMain) buyMain.setAttribute('href', devis);
      if (buySticky) buySticky.setAttribute('href', devis);
      return;
    }
    var prix = parseFloat(input.getAttribute('data-prix'));
    var id = input.value;
    var html = '<span class="price-main">' + eur(prix) + '</span><span class="price-tax">' + tax + '</span>';
    if (tax === 'HT') html += '<span class="price-sub">soit ' + eur(prix * (1 + tva)) + ' TTC</span>';
    priceBlock.innerHTML = html;
    if (stickyPrice) stickyPrice.textContent = eur(prix) + ' ' + tax;
    var url = buyUrl(base, id);
    if (buyMain) buyMain.setAttribute('href', url);
    if (buySticky) buySticky.setAttribute('href', url);
    if (poseBox) poseBox.hidden = !/-POSE$/.test(id);
    if (deposit) {
      var pct = parseFloat(deposit.getAttribute('data-pct')) / 100;
      var ttc = tax === 'HT' ? prix * (1 + tva) : prix;
      deposit.querySelector('[data-deposit-amount]').textContent = eur(Math.round(ttc * pct * 100) / 100, true);
    }
  }
  product.querySelectorAll('input[name="variante"]').forEach(function (r) {
    r.addEventListener('change', render);
  });
  render();

  // === BARRE D'ACHAT MOBILE (apparaît quand le bouton principal sort de l'écran) ===
  var sticky = document.querySelector('[data-sticky-buy]');
  if (sticky && buyMain && 'IntersectionObserver' in window) {
    var footer = document.querySelector('.footer');
    var buyVisible = true, footerVisible = false;
    function update() { sticky.classList.toggle('visible', !buyVisible && !footerVisible); }
    new IntersectionObserver(function (entries) {
      buyVisible = entries[0].isIntersecting || entries[0].boundingClientRect.top > 0;
      update();
    }).observe(buyMain);
    if (footer) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        update();
      }).observe(footer);
    }
  }
})();
