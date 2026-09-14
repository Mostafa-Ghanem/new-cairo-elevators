(() => {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const productFiles = new Set([
    'gearless-elevator.html',
    'gearbox-elevator.html',
    'gearbox-automatic-doors.html',
    'electric-elevator.html',
    'hydraulic-panoramic-elevator.html',
    'outdoor-elevator.html',
    'hospital-elevator.html',
    'elevator-maintenance.html'
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
  const desktopQuery = window.matchMedia('(min-width: 1181px)');

  if (mega && productFiles.has(file)) {
    mega.classList.add('is-active');
  }

  if (mega && trigger) {
    const setOpen = (open) => {
      const shouldOpen = Boolean(open && desktopQuery.matches);
      mega.classList.toggle('is-open', shouldOpen);
      trigger.setAttribute('aria-expanded', String(shouldOpen));
    };

    trigger.addEventListener('click', (event) => {
      if (!desktopQuery.matches) return;
      event.preventDefault();
      setOpen(!mega.classList.contains('is-open'));
    });

    mega.addEventListener('pointerenter', () => {
      if (desktopQuery.matches) setOpen(true);
    });

    mega.addEventListener('pointerleave', () => {
      if (desktopQuery.matches && !mega.contains(document.activeElement)) {
        setOpen(false);
      }
    });

    mega.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (desktopQuery.matches && !mega.contains(document.activeElement)) {
          setOpen(false);
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (desktopQuery.matches && !mega.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mega.classList.contains('is-open')) {
        setOpen(false);
        trigger.focus({ preventScroll: true });
      }
    });

    desktopQuery.addEventListener?.('change', () => setOpen(false));
  }

  const previewItems = [...document.querySelectorAll('.mega-product[data-preview-title]')];
  const previewMedia = document.querySelector('.mega-preview-media');
  const previewImage = document.querySelector('[data-mega-preview-image]');
  const previewTitle = document.querySelector('[data-mega-preview-title]');
  const previewDesc = document.querySelector('[data-mega-preview-desc]');
  const previewLabel = document.querySelector('[data-mega-preview-label]');
  const previewLink = document.querySelector('[data-mega-preview-link]');
  let previewRequest = 0;

  const updatePreview = (item) => {
    if (!item || !previewImage || !previewTitle || !previewDesc || !previewLabel || !previewLink) return;

    previewItems.forEach((entry) => {
      entry.classList.toggle('is-preview-active', entry === item);
    });

    previewTitle.textContent = item.dataset.previewTitle || '';
    previewDesc.textContent = item.dataset.previewDesc || '';
    previewLabel.textContent = item.dataset.previewLabel || '';
    previewLink.href = item.getAttribute('href') || 'services.html';

    const nextSrc = item.dataset.previewImage || '';
    if (!nextSrc || previewImage.getAttribute('src') === nextSrc) {
      previewImage.alt = item.dataset.previewTitle || '';
      return;
    }

    const requestId = ++previewRequest;
    previewMedia?.classList.add('is-changing');
    const preload = new Image();

    preload.onload = () => {
      if (requestId !== previewRequest) return;
      previewImage.src = nextSrc;
      previewImage.alt = item.dataset.previewTitle || '';
      requestAnimationFrame(() => previewMedia?.classList.remove('is-changing'));
    };

    preload.onerror = () => {
      if (requestId === previewRequest) {
        previewMedia?.classList.remove('is-changing');
      }
    };

    preload.src = nextSrc;
  };

  previewItems.forEach((item) => {
    item.addEventListener('mouseenter', () => updatePreview(item));
    item.addEventListener('focus', () => updatePreview(item));
  });

  const currentProduct = previewItems.find((item) => item.classList.contains('is-active'));
  if (currentProduct) updatePreview(currentProduct);

  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileProducts = document.querySelector('.mobile-products');

  if (mobileProducts && productFiles.has(file)) {
    mobileProducts.open = true;
  }

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.open = false;
    });
  });
})();
