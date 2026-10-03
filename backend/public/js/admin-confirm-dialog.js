/**
 * Wire [data-confirm-open] buttons to a <dialog class="modal-card"> confirm form.
 * Expected dialog ids (defaults): #admin-confirm-dialog
 * Button attrs: data-action, data-title, data-body, data-ok, data-ok-class (optional)
 */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var dialog = document.getElementById('admin-confirm-dialog');
    if (!dialog || typeof dialog.showModal !== 'function') {
      return;
    }

    var form = document.getElementById('admin-confirm-form');
    var titleEl = document.getElementById('admin-confirm-title');
    var bodyEl = document.getElementById('admin-confirm-body');
    var okBtn = document.getElementById('admin-confirm-ok');
    if (!form || !titleEl || !bodyEl || !okBtn) {
      return;
    }

    function closeDialog() {
      if (dialog.open) {
        dialog.close();
      }
    }

    document.querySelectorAll('[data-confirm-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action') || '';
        var title = btn.getAttribute('data-title') || 'Confirm';
        var body = btn.getAttribute('data-body') || '';
        var ok = btn.getAttribute('data-ok') || 'Confirm';
        var okClass = btn.getAttribute('data-ok-class') || 'btn-primary';

        form.setAttribute('action', action);
        titleEl.textContent = title;
        bodyEl.textContent = body;
        okBtn.textContent = ok;
        okBtn.className = 'btn ' + okClass;
        dialog.showModal();
        okBtn.focus();
      });
    });

    dialog.querySelectorAll('[data-confirm-close]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeDialog();
      });
    });

    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDialog();
    });
  });
})();
