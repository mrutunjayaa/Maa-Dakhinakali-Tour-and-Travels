/* ==========================================================================
   Maa Dakhinakali Tour and Travels - Main JavaScript
   Interactive functionality matching Tripper Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Toggle (Dark / Light Mode)
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('md-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const applyTheme = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
      themeToggle?.setAttribute('aria-pressed', 'true');
      themeToggle?.setAttribute('title', 'Switch to Light Mode');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
      themeToggle?.setAttribute('aria-pressed', 'false');
      themeToggle?.setAttribute('title', 'Switch to Dark Mode');
    }
  };

  const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  applyTheme(initialDark);

  themeToggle?.addEventListener('click', () => {
    const nowDark = !document.body.classList.contains('dark-theme');
    applyTheme(nowDark);
    localStorage.setItem('md-theme', nowDark ? 'dark' : 'light');
  });

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

  // 4. Quick Tour Customizer Widget
  const setupPillGroup = (groupId) => {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = container.querySelectorAll('.tour-pill-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  };

  setupPillGroup('destPills');
  setupPillGroup('durationPills');
  setupPillGroup('cabPills');

  const sendPlanBtn = document.getElementById('sendWhatsAppPlanBtn');
  sendPlanBtn?.addEventListener('click', () => {
    const dest = document.querySelector('#destPills .tour-pill-btn.is-active')?.getAttribute('data-val') || 'Puri Tour';
    const duration = document.querySelector('#durationPills .tour-pill-btn.is-active')?.getAttribute('data-val') || '1 Day';
    const vehicle = document.querySelector('#cabPills .tour-pill-btn.is-active')?.getAttribute('data-val') || 'AC Sedan';
    const date = document.getElementById('tourPlanDate')?.value || 'Upcoming Dates';
    const persons = document.getElementById('tourPlanPersons')?.value || '2';

    const message = `Namaste Maa Dakhinakali Travels! 🙏%0A%0AI want to plan a custom trip:%0A📍 Destination: ${encodeURIComponent(dest)}%0A⏱️ Duration: ${encodeURIComponent(duration)}%0A🚗 Vehicle: ${encodeURIComponent(vehicle)}%0A📅 Travel Date: ${encodeURIComponent(date)}%0A👥 Guests: ${encodeURIComponent(persons)}%0A%0APlease share the best price quote & itinerary.`;
    window.open(`https://wa.me/918144684608?text=${message}`, '_blank');
  });

  // 5. Car / Fleet Filter Tabs
  const carTabs = document.querySelectorAll('.car-tab');
  const carItems = document.querySelectorAll('.car-grid__item');

  carTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      carTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = (tab.getAttribute('data-filter') || 'all').toLowerCase();
      carItems.forEach(item => {
        const cat = (item.getAttribute('data-cat') || '').toLowerCase();
        const catList = cat.split(/\s+/);
        let isMatch = false;

        if (filter === 'all') {
          isMatch = true;
        } else if (filter === 'car' || filter === 'cars') {
          isMatch = catList.includes('car') || catList.includes('cars') || catList.includes('suv') || catList.includes('sedan');
        } else if (filter === 'bike' || filter === 'bikes') {
          isMatch = catList.includes('bike') || catList.includes('bikes');
        } else if (filter === 'scooter' || filter === 'scooters') {
          isMatch = catList.includes('scooter') || catList.includes('scooters');
        } else {
          isMatch = catList.includes(filter);
        }

        if (isMatch) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. Tours Carousel Navigation & 3D Round Animation (20 Packages)
  const tourGrid = document.querySelector('.tour-grid');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');
  const tourDots = document.getElementById('tourDots');
  const tourCounter = document.getElementById('tourCounter');
  const tourProgressBar = document.getElementById('tourProgressBar');
  const tourCards = tourGrid ? tourGrid.querySelectorAll('.tripper-tour-card') : [];

  if (tourGrid && tourCards.length > 0) {
    const totalCards = tourCards.length;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hasDragged = false;
    let dragVelocity = 0;
    let lastX = 0;
    let rafId = null;

    // Helper: calculate step of exactly one card including gap
    function getCardStep() {
      const firstCard = tourCards[0];
      const style = window.getComputedStyle(tourGrid);
      const gap = parseFloat(style.gap) || 24;
      return (firstCard?.offsetWidth || 285) + gap;
    }

    // 3D Round / Curved Cylinder Animation Engine (Desktop & Mobile Optimized)
    function applyRoundAnimation(dragTilt = 0) {
      const containerWidth = tourGrid.clientWidth;
      const scrollLeft = tourGrid.scrollLeft;
      const containerCenter = scrollLeft + containerWidth / 2;
      const isMobile = window.innerWidth <= 680;

      tourCards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distFromCenter = cardCenter - containerCenter;

        if (isMobile) {
          // Mobile 3D Coverflow Curve
          const normalized = distFromCenter / (containerWidth * 0.44);
          const rotY = Math.max(-26, Math.min(26, normalized * 24)) + dragTilt;
          const transZ = -Math.min(65, Math.pow(Math.abs(normalized), 1.45) * 48);
          const scale = Math.max(0.86, 1 - Math.abs(normalized) * 0.08);
          const opacity = Math.max(0.65, 1 - Math.abs(normalized) * 0.32);

          card.style.transform = `perspective(900px) rotateY(${rotY.toFixed(2)}deg) translateZ(${transZ.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(2);

          if (Math.abs(distFromCenter) < 48) {
            card.classList.add('is-center-card');
          } else {
            card.classList.remove('is-center-card');
          }
        } else {
          // Desktop 3D Cylinder Curve
          const normalized = distFromCenter / (containerWidth * 0.52);
          const rotY = Math.max(-18, Math.min(18, normalized * 16)) + dragTilt;
          const transZ = -Math.min(48, Math.pow(Math.abs(normalized), 1.6) * 36);
          const scale = Math.max(0.93, 1 - Math.abs(normalized) * 0.05);
          const rotZ = dragTilt * 0.12;

          card.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) translateZ(${transZ.toFixed(1)}px) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = '1';
          card.classList.remove('is-center-card');
        }
      });
    }

    // Generate pagination dots (20 dots)
    if (tourDots) {
      tourDots.innerHTML = '';
      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = `tour-slider-dot ${i === 0 ? 'is-active' : ''}`;
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', `Go to Tour ${i + 1}`);
        dot.addEventListener('click', () => {
          stopAutoSlide();
          const targetCard = tourCards[i];
          if (targetCard) {
            const isMobile = window.innerWidth <= 680;
            const offset = isMobile 
              ? targetCard.offsetLeft - (tourGrid.clientWidth - targetCard.offsetWidth) / 2 
              : targetCard.offsetLeft - tourGrid.offsetLeft;
            tourGrid.scrollTo({ left: offset, behavior: 'smooth' });
          }
          setTimeout(startAutoSlide, 4500);
        });
        tourDots.appendChild(dot);
      }
    }

    // Update active dot, progress bar and counter based on scroll position
    function updateActiveState() {
      const step = getCardStep();
      const currentScroll = tourGrid.scrollLeft;
      const maxScroll = Math.max(1, tourGrid.scrollWidth - tourGrid.clientWidth);
      
      let activeIndex = Math.round(currentScroll / step);
      if (activeIndex < 0) activeIndex = 0;
      if (activeIndex >= totalCards) activeIndex = totalCards - 1;

      // Update progress bar width
      if (tourProgressBar) {
        const pct = Math.min(100, Math.max(5, ((currentScroll / maxScroll) * 100)));
        tourProgressBar.style.width = `${pct}%`;
      }

      // Update dots
      if (tourDots) {
        const dots = tourDots.querySelectorAll('.tour-slider-dot');
        dots.forEach((dot, idx) => {
          const isActive = idx === activeIndex;
          dot.classList.toggle('is-active', isActive);
          if (isActive) {
            // Scroll dot into view inside dots container
            const dotOffset = dot.offsetLeft - tourDots.offsetLeft - (tourDots.clientWidth / 2) + (dot.clientWidth / 2);
            tourDots.scrollTo({ left: dotOffset, behavior: 'smooth' });
          }
        });
      }

      // Update counter
      if (tourCounter) {
        tourCounter.innerHTML = `<span>Tour ${activeIndex + 1} of ${totalCards}</span>`;
      }

      // Trigger 3D round curvature
      applyRoundAnimation(isDragging ? dragVelocity * 0.15 : 0);
    }

    // Slide Next: One card at a time from right to left
    function slideNext() {
      const step = getCardStep();
      const maxScroll = tourGrid.scrollWidth - tourGrid.clientWidth - 10;
      if (tourGrid.scrollLeft >= maxScroll) {
        tourGrid.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        tourGrid.scrollBy({ left: step, behavior: 'smooth' });
      }
    }

    // Slide Prev: One card backwards
    function slidePrev() {
      const step = getCardStep();
      if (tourGrid.scrollLeft <= 10) {
        tourGrid.scrollTo({ left: tourGrid.scrollWidth - tourGrid.clientWidth, behavior: 'smooth' });
      } else {
        tourGrid.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        slideNext();
        setTimeout(startAutoSlide, 5000);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        slidePrev();
        setTimeout(startAutoSlide, 5000);
      });
    }

    // Auto Slide Timer (Every 3.8s)
    let autoTimer = null;
    function startAutoSlide() {
      stopAutoSlide();
      autoTimer = setInterval(slideNext, 3800);
    }
    function stopAutoSlide() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Pause on hover
    const wrapper = tourGrid.closest('.home-section') || tourGrid;
    wrapper.addEventListener('mouseenter', stopAutoSlide);
    wrapper.addEventListener('mouseleave', () => {
      if (!isDragging) startAutoSlide();
    });

    // Scroll listener with requestAnimationFrame
    tourGrid.addEventListener('scroll', () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateActiveState();
          rafId = null;
        });
      }
    }, { passive: true });

    // Drag to scroll with mouse ("mouse se right to left pele to round animation")
    tourGrid.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.pageX;
      lastX = e.pageX;
      startScrollLeft = tourGrid.scrollLeft;
      dragVelocity = 0;
      tourGrid.classList.add('is-dragging');
      stopAutoSlide();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        tourGrid.classList.remove('is-dragging');
        // Momentum release: spring back round animation
        applyRoundAnimation(0);
        setTimeout(startAutoSlide, 4500);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.pageX;
      const walk = (x - startX) * 1.35;
      dragVelocity = Math.max(-12, Math.min(12, (lastX - x) * 0.8));
      lastX = x;

      if (Math.abs(x - startX) > 6) {
        hasDragged = true;
      }
      tourGrid.scrollLeft = startScrollLeft - walk;
      // Active dynamic round tilt while pushing/dragging
      applyRoundAnimation(dragVelocity);
    });

    // Touch support for mobile with dynamic haptic-like tactile curve
    let touchStartX = 0;
    let lastTouchX = 0;
    const mobileHint = document.getElementById('tourMobileHint');

    tourGrid.addEventListener('touchstart', (e) => {
      stopAutoSlide();
      touchStartX = e.touches[0].pageX;
      lastTouchX = touchStartX;
      if (mobileHint) {
        mobileHint.style.opacity = '0.35';
      }
    }, { passive: true });

    tourGrid.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].pageX;
      const deltaX = lastTouchX - currentX;
      lastTouchX = currentX;
      const tilt = Math.max(-20, Math.min(20, deltaX * 2.2));
      applyRoundAnimation(tilt);
    }, { passive: true });

    tourGrid.addEventListener('touchend', () => {
      // Smooth spring back to resting 3D angle
      applyRoundAnimation(0);
      setTimeout(startAutoSlide, 4000);
    }, { passive: true });

    // Tap to center: On mobile, clicking a peeking side card smoothly slides it to center
    tourCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          return;
        }
        if (window.innerWidth <= 680) {
          const containerCenter = tourGrid.scrollLeft + tourGrid.clientWidth / 2;
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          if (Math.abs(cardCenter - containerCenter) > 40 && !e.target.closest('button, a')) {
            e.preventDefault();
            const targetOffset = card.offsetLeft - (tourGrid.clientWidth - card.offsetWidth) / 2;
            tourGrid.scrollTo({ left: targetOffset, behavior: 'smooth' });
          }
        }
      });
    });

    // Prevent accidental click on links if user dragged
    tourGrid.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });

    // Wishlist Heart Button Toggling
    tourGrid.querySelectorAll('.tripper-tour-card__fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('is-liked');
        const cardTitle = btn.closest('.tripper-tour-card')?.querySelector('.tripper-tour-card__title a')?.textContent || 'Package';
        if (btn.classList.contains('is-liked')) {
          showToast(`"${cardTitle}" added to your wishlist!`);
        } else {
          showToast(`Removed from your wishlist.`);
        }
      });
    });

    // Initial setup
    updateActiveState();
    startAutoSlide();
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

  // --- About Section Interactive Capsules Deck ---
  const capsulesDeck = document.getElementById('aboutCapsulesDeck');
  if (capsulesDeck) {
    const capsules = capsulesDeck.querySelectorAll('.about-capsule');

    function setActiveCapsule(targetCapsule) {
      capsules.forEach((c) => {
        if (c === targetCapsule) {
          c.classList.add('is-expanded');
          c.setAttribute('aria-expanded', 'true');
        } else {
          c.classList.remove('is-expanded');
          c.setAttribute('aria-expanded', 'false');
        }
      });
    }

    capsules.forEach((capsule) => {
      // Hover interaction on desktop
      capsule.addEventListener('mouseenter', () => {
        setActiveCapsule(capsule);
      });

      // Click / Tap interaction for mobile & tablet
      capsule.addEventListener('click', () => {
        setActiveCapsule(capsule);
      });

      // Keyboard accessibility (Enter or Space)
      capsule.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveCapsule(capsule);
        }
      });
    });
  }

  // 17. Rotating Tour Titles with Hand-Wipe Erase Animation (7s Interval)
  // 17. Rotating Tour Titles with Tour Car Erase Animation (7s Interval)
  initTitleWiper();

  function initTitleWiper() {
    const wipeText = document.getElementById('wipeText');
    const wipeCar = document.getElementById('wipeCar') || document.getElementById('wipeHand');
    if (!wipeText || !wipeCar) return;

    const tourTitles = [
      "Guided Tours & Journeys",
      "Puri Jagannath Dham Yatra",
      "Odisha Heritage & Temple Tours",
      "Kashmir Valley & Snow Escapes",
      "Kerala Backwaters & Hill Stations",
      "Royal Rajasthan Desert Safaris",
      "Custom Family Holiday Packages",
      "Spiritual & Pilgrimage Darshan",
      "Golden Triangle & Sun Temple",
      "All-India Scenic Road Trips"
    ];

    let currentIndex = 0;

    // Car starts parked at the left waiting
    wipeCar.className = 'wipe-car is-parked';

    // Round-trip Car Animation with Roundabout U-Turn:
    // 1. Drives Left to Right erasing previous title (1.2s)
    // 2. Roundabout U-turn loop arc at right edge (750ms)
    // 3. Drives Right to Left (Ulta return) revealing the new title (1.2s)
    // 4. Turns to face forward at parking spot (350ms)
    // 5. Parks and waits!
    function roundTripCar(callback) {
      // Phase 1: Drive Out Left to Right
      wipeCar.className = 'wipe-car is-driving-out';
      wipeText.className = 'wipe-text is-erasing';

      setTimeout(() => {
        // Phase 2: U-Turn Round Cut at right edge
        wipeCar.className = 'wipe-car is-turning-round';
        wipeText.className = 'wipe-text';

        // Prepare new word (hidden initially from left)
        currentIndex = (currentIndex + 1) % tourTitles.length;
        wipeText.textContent = tourTitles[currentIndex];
        wipeText.style.clipPath = 'inset(0 0 0 100%)';

        setTimeout(() => {
          // Phase 3: Drive Back Right to Left (Ulta return, revealing new title)
          wipeCar.className = 'wipe-car is-driving-back';
          wipeText.className = 'wipe-text is-revealing';

          setTimeout(() => {
            // Phase 4: Arrived at left side! Turn to face forward
            wipeCar.className = 'wipe-car is-parking-turn';
            wipeText.className = 'wipe-text';
            wipeText.style.clipPath = 'none';

            setTimeout(() => {
              // Phase 5: Parked and waiting!
              wipeCar.className = 'wipe-car is-parked';
              if (callback) callback();
            }, 350);
          }, 1200);
        }, 750);
      }, 1200);
    }

    // Main cycle: car waits, then takes round-trip when time comes
    function step() {
      roundTripCar(() => {
        // Car waits/parks for 5.5 seconds, then drives again!
        setTimeout(step, 5500);
      });
    }

    // Start first trip after initial 5.5s viewing
    setTimeout(step, 5500);
  }

  // 17. Char Dham 4-Temples Infinite Carousel (Shows 3 on screen, auto-loops every 5 seconds)
  function initCharDhamCarousel() {
    const wrapper = document.getElementById('expCarouselWrapper');
    const track = document.getElementById('expCarouselTrack');
    const prevBtn = document.getElementById('expPrevBtn');
    const nextBtn = document.getElementById('expNextBtn');
    const dotsContainer = document.getElementById('expCarouselDots');
    if (!track || !wrapper) return;

    const originalItems = Array.from(track.querySelectorAll('.exp-carousel__item'));
    const totalOriginal = originalItems.length; // 4
    if (totalOriginal === 0) return;

    // Clone 3 items before and 3 items after for infinite seamless loop
    const cloneCount = 3;
    for (let i = totalOriginal - cloneCount; i < totalOriginal; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      track.insertBefore(clone, track.firstChild);
    }
    for (let i = 0; i < cloneCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    let currentIndex = cloneCount; // points to 1st real item (index 0)
    let isTransitioning = false;
    let autoPlayTimer = null;
    const gap = 26; // match CSS gap

    function getCardWidth() {
      const firstCard = track.querySelector('.exp-carousel__item');
      return firstCard ? firstCard.getBoundingClientRect().width : 340;
    }

    function updateTrackPosition(withTransition = true) {
      const cardWidth = getCardWidth();
      const moveDistance = currentIndex * (cardWidth + gap);
      track.style.transition = withTransition ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
      track.style.transform = `translateX(-${moveDistance}px)`;
      updateDots();
    }

    function updateDots() {
      const realIndex = (currentIndex - cloneCount) % totalOriginal;
      const normalizedIndex = (realIndex + totalOriginal) % totalOriginal;
      const dots = dotsContainer ? dotsContainer.querySelectorAll('.exp-carousel__dot') : [];
      dots.forEach((dot, idx) => {
        if (idx === normalizedIndex) {
          dot.classList.add('is-active');
        } else {
          dot.classList.remove('is-active');
        }
      });
    }

    function moveToNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateTrackPosition(true);
    }

    function moveToPrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateTrackPosition(true);
    }

    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      // Infinite loop boundary jump
      if (currentIndex >= cloneCount + totalOriginal) {
        currentIndex = cloneCount; // Jump seamlessly back to real 1st item
        updateTrackPosition(false);
      } else if (currentIndex < cloneCount) {
        currentIndex = cloneCount + totalOriginal - 1; // Jump seamlessly to real last item
        updateTrackPosition(false);
      }
    });

    // Auto Play (5 seconds interval)
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        moveToNext();
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Pause on hover, resume on mouseleave
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);

    // Prev / Next button clicks
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        moveToNext();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        moveToPrev();
        startAutoPlay();
      });
    }

    // Dot click listeners
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.exp-carousel__dot');
        if (!dot) return;
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (isNaN(targetIndex)) return;
        stopAutoPlay();
        currentIndex = cloneCount + targetIndex;
        updateTrackPosition(true);
        startAutoPlay();
      });
    }

    // Window resize recalculation
    window.addEventListener('resize', () => {
      updateTrackPosition(false);
    });

    // Touch / Swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      stopAutoPlay();
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      if (diffX < -40) {
        moveToNext();
      } else if (diffX > 40) {
        moveToPrev();
      }
      startAutoPlay();
    }, { passive: true });

    // Re-bind booking buttons on clones
    track.querySelectorAll('.exp-card__cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = btn.getAttribute('data-title') || 'Char Dham Darshan';
        const price = btn.getAttribute('data-price') || '';
        if (typeof openBookingModal === 'function') {
          openBookingModal(title, price ? `Package price: ${price}` : '');
        }
      });
    });

    // Initial positioning & start 5s autoplay
    setTimeout(() => {
      updateTrackPosition(false);
      startAutoPlay();
    }, 100);
  }

  initCharDhamCarousel();

  // ==========================================
  // HOLD-TO-CALL BUTTON (RIGHT TO LEFT FILL & REDIRECT)
  // ==========================================
  function initHoldToCallButton() {
    const btn = document.getElementById('holdCallPuriBtn');
    const progress = document.getElementById('holdCallProgress');
    const title = document.getElementById('holdCallBtnTitle');
    const hint = document.getElementById('holdCallBtnHint');
    if (!btn || !progress) return;

    const HOLD_DURATION_MS = 1400; // Time needed to hold before call triggers
    let holdStartTime = null;
    let animFrameId = null;
    let isHolding = false;
    let isTriggered = false;

    function startHold(e) {
      if (isTriggered) return;
      isHolding = true;
      holdStartTime = performance.now();
      btn.classList.add('is-holding');
      if (hint) hint.textContent = 'Keep Holding... Connecting';

      function step(now) {
        if (!isHolding) return;
        const elapsed = now - holdStartTime;
        const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);

        // Fill right to left (increasing width from right edge)
        progress.style.width = pct + '%';

        if (pct >= 100) {
          triggerCall();
        } else {
          animFrameId = requestAnimationFrame(step);
        }
      }

      animFrameId = requestAnimationFrame(step);
    }

    function cancelHold() {
      if (isTriggered) return;
      isHolding = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      btn.classList.remove('is-holding');
      progress.style.width = '0%';
      if (hint) hint.textContent = 'Press & Hold to Connect Call';
    }

    function triggerCall() {
      isTriggered = true;
      isHolding = false;
      btn.classList.remove('is-holding');
      btn.classList.add('is-completed');
      progress.style.width = '100%';
      if (title) title.textContent = 'Connecting Call...';
      if (hint) hint.textContent = 'Calling +91 8144684608 Now';

      // Haptic feedback vibration if supported on mobile
      if (navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }

      // Small delay for smooth visual satisfaction, then redirect to call
      setTimeout(() => {
        window.location.href = 'tel:8144684608';
        // Reset state after 3 seconds so user can use again
        setTimeout(() => {
          isTriggered = false;
          btn.classList.remove('is-completed');
          progress.style.width = '0%';
          if (title) title.textContent = 'Contact Our Puri Team';
          if (hint) hint.textContent = 'Press & Hold to Connect Call';
        }, 3000);
      }, 250);
    }

    // Pointer events (handles Mouse + Touch smoothly without duplicate triggers)
    btn.addEventListener('pointerdown', startHold);
    window.addEventListener('pointerup', cancelHold);
    btn.addEventListener('pointercancel', cancelHold);
    btn.addEventListener('pointerleave', cancelHold);

    // Prevent context menu on long press
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initHoldToCallButton();
});





