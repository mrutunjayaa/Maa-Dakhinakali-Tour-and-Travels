/* ==========================================================================
   Maa Dakhinakali Tour and Travels - Main JavaScript
   Interactive functionality matching Tripper Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('[data-back-to-top]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }

    if (window.scrollY > 350) {
      backToTopBtn?.classList.add('is-visible');
    } else {
      backToTopBtn?.classList.remove('is-visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-navigation');

  menuToggle?.addEventListener('click', () => {
    mainNav?.classList.toggle('is-open');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);
  });

  // 3. Multi-Search Tab Switcher
  const searchTabs = document.querySelectorAll('.tp-msearch__tab');
  const searchPanels = document.querySelectorAll('.tp-msearch__panel');

  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('is-active'));
      searchPanels.forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      const target = tab.getAttribute('data-target');
      const activePanel = document.querySelector(`.tp-msearch__panel--${target}`);
      if (activePanel) {
        activePanel.classList.add('is-active');
      }
    });
  });

  // Search forms action handler
  document.querySelectorAll('.tp-msearch__panel').forEach(panel => {
    panel.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = panel.getAttribute('data-search-type') || 'Tour';
      const inputs = panel.querySelectorAll('input, select');
      let details = [];
      inputs.forEach(input => {
        if (input.value) {
          const segLabel = input.closest('.tp-msearch__seg')?.querySelector('.tp-msearch__seg-label')?.textContent;
          const label = segLabel || input.previousElementSibling?.textContent || input.getAttribute('name');
          details.push(`${label}: ${input.value}`);
        }
      });
      const queryStr = details.join(' | ');
      openBookingModal(`Custom ${type} Search Inquiry`, `Interested in ${type} with details: ${queryStr}`);
    });
  });

  // Route Swap Buttons
  document.querySelectorAll('.tp-msearch__swap-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = btn.closest('.tp-msearch__panel');
      const fromInput = panel?.querySelector('[name="from_location"], [name="pickup_location"]');
      const toInput = panel?.querySelector('[name="destination"], [name="trip_type"]');
      if (fromInput && toInput) {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
      }
    });
  });

  // 4. Hotel Filter Tabs
  const hotelTabs = document.querySelectorAll('.hotel-tab');
  const hotelItems = document.querySelectorAll('.hotel-grid__item');

  hotelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      hotelTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.getAttribute('data-filter');
      hotelItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 5. Car / Fleet Filter Tabs
  const carTabs = document.querySelectorAll('.car-tab');
  const carItems = document.querySelectorAll('.car-grid__item');

  carTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      carTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.getAttribute('data-filter');
      carItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. Tours Carousel Navigation
  const tourGrid = document.querySelector('.tour-grid');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');

  if (tourGrid && prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      tourGrid.scrollBy({ left: 320, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      tourGrid.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  // 7. Interactive Booking Modal
  const modalOverlay = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const bookingForm = document.getElementById('quickBookingForm');
  const modalPackageName = document.getElementById('modalPackageName');
  const modalPackageInput = document.getElementById('bookingPackage');
  const modalNotesInput = document.getElementById('bookingNotes');

  window.openBookingModal = function(title = 'Custom Travel Package', notes = '') {
    if (modalOverlay) {
      if (modalPackageName) modalPackageName.textContent = title;
      if (modalPackageInput) modalPackageInput.value = title;
      if (modalNotesInput && notes) modalNotesInput.value = notes;
      modalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  };

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Trigger modal on any button with data-book
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packageName = btn.getAttribute('data-title') || 'Tour Booking';
      const price = btn.getAttribute('data-price') || '';
      openBookingModal(packageName, price ? `Selected Rate: ${price}` : '');
    });
  });

  // Handle Booking Form Submission -> WhatsApp Link
  bookingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookingName')?.value || '';
    const phone = document.getElementById('bookingPhone')?.value || '';
    const date = document.getElementById('bookingDate')?.value || '';
    const travelers = document.getElementById('bookingTravelers')?.value || '2';
    const pkg = modalPackageInput?.value || 'Travel Tour Package';
    const notes = modalNotesInput?.value || '';

    const textMsg = `*Namaste Maa Dakhinakali Tour & Travels!*\nI want to book/enquire about:\n- *Package/Service*: ${pkg}\n- *My Name*: ${name}\n- *Phone*: ${phone}\n- *Travel Date*: ${date}\n- *Number of Persons*: ${travelers}\n- *Special Requests*: ${notes}\n\nPlease share availability & best quote. Thank you!`;

    const encoded = encodeURIComponent(textMsg);
    const whatsappUrl = `https://wa.me/918144684608?text=${encoded}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    closeModal();
    showToast('Your booking inquiry has been forwarded to WhatsApp! We will connect with you immediately.');
  });

  // 8. Newsletter Subscription
  const newsForm = document.querySelector('[data-subscribe-form]');
  newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('footer-subscribe')?.value;
    if (email) {
      showToast('Thank you! You have been subscribed to Maa Dakhinakali Travel specials.');
      newsForm.reset();
    }
  });

  // 9. Toast Helper
  function showToast(msg) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00b8a9" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> <span>${msg}</span>`;
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 4500);
  }

  // 10. Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 11. Interactive Click Shockwave & Ripple for Split Book Now Button
  const splitBookBtns = document.querySelectorAll('.nav-book-split');
  splitBookBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      this.classList.remove('is-clicked');
      void this.offsetWidth; // Force reflow
      this.classList.add('is-clicked');

      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height) * 1.6;
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${(e.clientX || (rect.left + rect.width / 2)) - rect.left - radius}px`;
      circle.style.top = `${(e.clientY || (rect.top + rect.height / 2)) - rect.top - radius}px`;
      circle.classList.add('book-ripple');

      const oldRipple = this.querySelector('.book-ripple');
      if (oldRipple) oldRipple.remove();

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
        this.classList.remove('is-clicked');
      }, 550);
    });
  });

  // 12. Hero Scenic Photo Slideshow (10 Photos Auto-slide & Interactive)
  const scenicSlider = document.getElementById('heroScenicSlider');
  if (scenicSlider) {
    const slides = scenicSlider.querySelectorAll('.tp-mhero__scenic-slide');
    const dots = scenicSlider.querySelectorAll('.tp-mhero__dot');
    const prevBtn = scenicSlider.querySelector('.tp-mhero__slider-btn--prev');
    const nextBtn = scenicSlider.querySelector('.tp-mhero__slider-btn--next');
    let currentIndex = 0;
    let autoSlideTimer = null;

    function goToSlide(index) {
      if (slides.length === 0) return;
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 3800);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      startAutoSlide();
    });

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      startAutoSlide();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
        startAutoSlide();
      });
    });

    scenicSlider.addEventListener('mouseenter', stopAutoSlide);
    scenicSlider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }
});
