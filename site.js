(function () {
  'use strict';

  var dialog = document.getElementById('app-coming-soon');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  document.querySelectorAll('[data-app-coming-soon]').forEach(function (button) {
    button.addEventListener('click', function () {
      dialog.showModal();
    });
    button.disabled = false;
  });

  dialog.addEventListener('click', function (event) {
    var bounds = dialog.getBoundingClientRect();
    if (event.target === dialog &&
        (event.clientX < bounds.left || event.clientX > bounds.right ||
         event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });
})();
