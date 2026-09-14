(() => {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const productFiles = new Set([
    'gearless-elevator.html','gearbox-elevator.html','gearbox-automatic-doors.html',
    'electric-elevator.html','hydraulic-panoramic-elevator.html','outdoor-elevator.html',
    'hospital-elevator.html','elevator-maintenance.html'
  ]);

  document.querySelectorAll('[data-nav-page]').forEach((link) => {
    if ((link.dataset.navPage || '').toLowerCase() === file) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('[data-product-page]').forEach((link) => {
    if ((link.dataset.productPage || '').toLowerCase() === file) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const mega = document.querySelector('[data-nav-products]');
  const trigger = mega?.querySelector('.mega-trigger');
  if (mega && productFiles.has(file)) mega.classList.add('is-active');

  if (mega && trigger) {
    const setOpen = (open) => {
      mega.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      setOpen(!mega.classList.contains('is-open'));
    });
    document.addEventListener('click', (event) => {
      if (!mega.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.focus();
      }
    });
  }

  const mobileProducts = document.querySelector('.mobile-products');
  if (mobileProducts && productFiles.has(file)) mobileProducts.open = true;

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = link.closest('.mobile-menu');
      if (menu) menu.open = false;
    });
  });
})();
