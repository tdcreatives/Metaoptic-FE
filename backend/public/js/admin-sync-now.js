/**
 * Sync-runs “Sync data now”: confirm → AJAX busy → result.
 * Expects window.ADMIN_SYNC_NOW = { url, csrfName, csrfHash }
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
    var cfg = window.ADMIN_SYNC_NOW;
    var dialog = document.getElementById('sync-now-dialog');
    var openBtn = document.getElementById('sync-now-open');
    if (!cfg || !cfg.url || !dialog || !openBtn || typeof dialog.showModal !== 'function') {
      return;
    }

    var titleEl = document.getElementById('sync-now-title');
    var leadEl = document.getElementById('sync-now-desc');
    var stepConfirm = document.getElementById('sync-now-step-confirm');
    var stepBusy = document.getElementById('sync-now-step-busy');
    var stepDone = document.getElementById('sync-now-step-done');
    var resultBox = document.getElementById('sync-now-result');
    var resultLabel = document.getElementById('sync-now-result-label');
    var resultMessage = document.getElementById('sync-now-result-message');
    var confirmBtn = document.getElementById('sync-now-confirm');
    var reloadBtn = document.getElementById('sync-now-reload');
    var busy = false;

    function showStep(step) {
      if (stepConfirm) stepConfirm.hidden = step !== 'confirm';
      if (stepBusy) stepBusy.hidden = step !== 'busy';
      if (stepDone) stepDone.hidden = step !== 'done';
      dialog.classList.toggle('is-busy', step === 'busy');
      dialog.classList.toggle('is-done', step === 'done');
    }

    function setIdleUi() {
      busy = false;
      if (titleEl) titleEl.textContent = 'Run SGX sync now?';
      if (leadEl) {
        leadEl.textContent = 'Pull the live SGX feed into this CMS.';
        leadEl.hidden = false;
      }
      dialog.classList.remove('is-error');
      if (confirmBtn) confirmBtn.disabled = false;
      showStep('confirm');
    }

    function setBusyUi() {
      busy = true;
      if (titleEl) titleEl.textContent = 'Syncing announcements';
      if (leadEl) leadEl.hidden = true;
      dialog.classList.remove('is-error');
      showStep('busy');
    }

    function setDoneUi(ok, message) {
      busy = false;
      if (titleEl) titleEl.textContent = ok ? 'Sync finished' : 'Sync did not complete';
      if (leadEl) leadEl.hidden = true;
      if (resultLabel) resultLabel.textContent = ok ? 'Success' : 'Could not finish';
      if (resultMessage) {
        resultMessage.textContent = message || (ok ? 'Done.' : 'Something went wrong.');
      }
      if (resultBox) {
        resultBox.className = 'sync-callout ' + (ok ? 'sync-callout-ok' : 'sync-callout-error');
      }
      dialog.classList.toggle('is-error', !ok);
      showStep('done');
      if (reloadBtn) reloadBtn.focus();
    }

    openBtn.addEventListener('click', function () {
      setIdleUi();
      dialog.showModal();
      if (confirmBtn) confirmBtn.focus();
    });

    dialog.querySelectorAll('[data-sync-close]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (busy) return;
        if (dialog.open) dialog.close();
      });
    });

    dialog.addEventListener('cancel', function (e) {
      if (busy) {
        e.preventDefault();
      }
    });

    if (reloadBtn) {
      reloadBtn.addEventListener('click', function () {
        window.location.reload();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (busy) return;
        setBusyUi();

        var body = new URLSearchParams();
        body.set(cfg.csrfName, cfg.csrfHash);

        fetch(cfg.url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: body.toString(),
          credentials: 'same-origin',
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { res: res, data: data };
            }).catch(function () {
              return { res: res, data: null };
            });
          })
          .then(function (pack) {
            var data = pack.data || {};
            var ok = !!data.ok;
            var message = data.message || (ok ? 'Sync OK' : 'Sync failed (HTTP ' + pack.res.status + ').');
            setDoneUi(ok, message);
          })
          .catch(function () {
            setDoneUi(
              false,
              'Network error while syncing. Check the server before starting another sync.'
            );
          });
      });
    }
  });
})();
