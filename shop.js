(function () {
  'use strict';

  var carousel = document.querySelector('.beanie-carousel');
  if (carousel) {
    var track = carousel.querySelector('.beanie-track');
    var slides = track.querySelectorAll('img');
    var position = document.querySelector('.beanie-position');
    var colours = ['Yellow', 'Blue', 'Black'];
    var current = 0;
    var touchStart = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      slides.forEach(function (slide, i) {
        slide.setAttribute('aria-hidden', String(i !== current));
      });
      position.textContent = colours[current] + ' · ' + (current + 1) + ' / ' + slides.length;
    }

    carousel.querySelectorAll('.beanie-arrow').forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        showSlide(current + (button.classList.contains('beanie-next') ? 1 : -1));
      });
    });
    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    carousel.addEventListener('touchstart', function (event) {
      touchStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    carousel.addEventListener('touchend', function (event) {
      if (!touchStart) return;
      var dx = event.changedTouches[0].clientX - touchStart.x;
      var dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        showSlide(current + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
    carousel.addEventListener('touchcancel', function () { touchStart = null; }, { passive: true });
  }

  // Keep the Shopify configuration below for launch; toggle it in shop.html.
  if (document.body.dataset.shopifyEnabled !== 'true') return;

  document.getElementById('shop-preview').hidden = true;
  document.getElementById('shop-storefront').hidden = false;

  var node = document.getElementById('product-component-1790601866334');
  var status = document.getElementById('shop-status');
  var retry = document.getElementById('shop-retry');
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  var buttonStyles = {
    'font-family': 'Arial, Helvetica, sans-serif',
    'background-color': '#8b7108',
    'border-radius': '100px',
    ':hover': { 'background-color': '#7d6607' },
    ':focus': { 'background-color': '#7d6607' }
  };

  function loadSDK() {
    if (window.ShopifyBuy && window.ShopifyBuy.UI) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.async = true;
      script.src = scriptURL;
      script.onload = resolve;
      script.onerror = function () {
        script.remove();
        reject(new Error('Shopify could not load.'));
      };
      document.head.appendChild(script);
    });
  }

  function initShop() {
    status.hidden = false;
    status.textContent = 'Loading the KOVA beanie\u2026';
    retry.hidden = true;
    return loadSDK().then(function () {
      var client = window.ShopifyBuy.buildClient({
        domain: 'u9a2s6-r9.myshopify.com',
        storefrontAccessToken: '986e4d4cece14b9062a06cb5c9529afa'
      });
      return window.ShopifyBuy.UI.onReady(client);
    }).then(function (ui) {
      return ui.createComponent('product', {
        id: '16595156140422',
        node: node,
        moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
        options: {
          product: {
            styles: {
              product: {
                '@media (min-width: 601px)': {
                  'max-width': '100%', 'margin-left': '0', 'margin-bottom': '0'
                },
                'text-align': 'left',
                'background-color': '#22281f'
              },
              imgWrapper: { 'background-color': '#22281f' },
              img: { 'background-color': '#22281f' },
              title: { 'font-size': '26px', color: '#f5f4ef' },
              description: { color: '#adb0a7', 'line-height': '1.7' },
              button: buttonStyles,
              price: { 'font-size': '18px', color: '#f5f4ef' },
              compareAt: { 'font-size': '15px', color: '#adb0a7' },
              unitPrice: { 'font-size': '15px', color: '#adb0a7' }
            },
            layout: 'horizontal',
            contents: { img: false, imgWithCarousel: true, description: true },
            width: '100%',
            text: { button: 'Add to cart' }
          },
          option: {
            styles: { label: { color: '#adb0a7' } }
          },
          modalProduct: {
            contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
            styles: { button: buttonStyles },
            text: { button: 'Add to cart' }
          },
          cart: {
            styles: { button: buttonStyles },
            text: { total: 'Subtotal', button: 'Checkout' }
          },
          toggle: {
            styles: {
              toggle: {
                'background-color': '#8b7108',
                ':hover': { 'background-color': '#7d6607' },
                ':focus': { 'background-color': '#7d6607' }
              }
            }
          }
        }
      });
    }).then(function () {
      status.hidden = true;
    }).catch(function () {
      status.textContent = 'The shop could not load. Please check your connection and try again.';
      retry.hidden = false;
    });
  }

  retry.addEventListener('click', initShop);
  initShop();
})();
