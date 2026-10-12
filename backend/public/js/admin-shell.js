(function () {
  var app = document.getElementById('admin-app');
  if (!app) return;

  var side = document.getElementById('admin-side');
  var backdrop = app.querySelector('[data-side-close]');
  var toggle = app.querySelector('[data-side-toggle]');
  var mq = window.matchMedia('(max-width: 900px)');

  function firstNavLink() {
    return side ? side.querySelector('a.nav-item') : null;
  }

  function syncSideA11y(open) {
    if (!side || !mq.matches) {
      if (side) {
        side.removeAttribute('aria-hidden');
        side.removeAttribute('inert');
      }
      return;
    }
    if (open) {
      side.removeAttribute('aria-hidden');
      side.removeAttribute('inert');
    } else {
      side.setAttribute('aria-hidden', 'true');
      side.setAttribute('inert', '');
    }
  }

  function setOpen(open) {
    app.classList.toggle('side-open', open);
    if (backdrop) backdrop.hidden = !open;
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    document.body.style.overflow = open ? 'hidden' : '';
    syncSideA11y(open);
    if (open) {
      var link = firstNavLink();
      if (link) link.focus();
    } else if (toggle && document.activeElement && side && side.contains(document.activeElement)) {
      toggle.focus();
    }
  }

  syncSideA11y(false);

  if (toggle) {
    toggle.addEventListener('click', function () {
      setOpen(!app.classList.contains('side-open'));
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', function () { setOpen(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (!mq.matches) setOpen(false);
    else syncSideA11y(app.classList.contains('side-open'));
  });

  // Bulk approve bar on announcements list
  var bulkbar = document.getElementById('bulkbar');
  var selcount = document.getElementById('selcount');
  var boxes = document.querySelectorAll('.selbox');
  if (!bulkbar || !boxes.length) return;

  function updBulk() {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    bulkbar.hidden = n === 0;
    if (selcount) selcount.textContent = String(n);
  }

  boxes.forEach(function (b) {
    b.addEventListener('change', updBulk);
  });
  var clearBtn = document.querySelector('[data-bulk-clear]');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      boxes.forEach(function (b) { b.checked = false; });
      updBulk();
    });
  }
  updBulk();
})();
