/**
 * THE DIGITAL MARKETINGS - Agency Core Interaction Script
 * Features:
 * - Live Google SERP Keyword Simulator
 * - Interactive SEO & Traffic Pipeline Calculator
 * - Mobile Drawer & Sticky Navigation
 * - FAQ Accordion Engine
 * - Audit Modals & Multi-Channel Lead Dispatcher (WhatsApp / Email)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroDynamicEngine();
  initCounters();
  initPricingPackageBuilder();
  initMobileNavigation();
  initDropdownMenus();
  initPortfolioFilter();
  initFaqAccordion();
  initAuditModals();
  initLeadForms();
  initScrollEffects();
  initSiteAnalyticsTracker();
});

/* --------------------------------------------------------------------------
   1. Dynamic Interactive Hero Multi-Channel Simulator Engine
   -------------------------------------------------------------------------- */
function initHeroDynamicEngine() {
  const keywordEl = document.getElementById('typingKeyword');
  const previewBox = document.getElementById('heroDynamicPreview');
  const liveTagEl = document.getElementById('heroLiveTag');
  const pillBtns = document.querySelectorAll('.hero-pill-btn');

  const channels = [
    {
      id: '360',
      keyword: '360 digital marketing agency ahmedabad',
      tag: '🌟 OMNICHANNEL ENGINE',
      rankNum: '360°',
      rankLabel: 'SUITE',
      url: 'https://yourbrand.com <span class="url-crumb">› 360-digital-growth</span>',
      badge: '⭐ Full Omnichannel Scale',
      title: 'The #1 360° Digital Marketing & Revenue Growth Partner',
      snippet: 'Engineered by <strong>The Digital Marketings</strong>. Integrated organic SEO, viral social media funnels, high-ROAS Google Ads, and lightning Core Web Vitals for maximum revenue.',
      sitelinks: ['Omnichannel Funnels', 'Meta & Google Ads', 'Page 1 SEO Sprint', 'Fast CRO'],
      metrics: [
        { val: '+340%', label: 'Total Revenue Surge' },
        { val: '6.8x', label: 'Blended Ad ROAS' },
        { val: 'Top 1%', label: 'Growth Velocity' }
      ]
    },
    {
      id: 'seo',
      keyword: 'fast google keyword ranking company',
      tag: '⚡ GOOGLE SERP #1',
      rankNum: '#1',
      rankLabel: 'POSITION',
      url: 'https://yourbrand.com <span class="url-crumb">› fast-google-seo</span>',
      badge: '⭐ 1st Page Rank Guaranteed',
      title: 'Rank #1 on Google in 30-60 Days — Fast Sprint SEO',
      snippet: 'Accelerated keyword indexing, CTR-engineered title tags & meta descriptions, schema JSON-LD, and high-domain editorial backlinks that outrank fierce competitors.',
      sitelinks: ['Keyword Sprints', 'Meta Optimization', 'Backlink Authority', 'Core Web Vitals'],
      metrics: [
        { val: '+482%', label: 'Organic Clicks' },
        { val: '#1 in 28d', label: 'Avg Page 1 Time' },
        { val: '99.8%', label: 'Google Health Score' }
      ]
    },
    {
      id: 'google-ads',
      keyword: 'high roas google ads ppc management',
      tag: '🎯 SPONSORED ADS',
      rankNum: 'AD #1',
      rankLabel: 'GOOGLE PPC',
      url: 'https://yourbrand.com <span class="url-crumb">› google-ads-management</span>',
      badge: '⚡ Instant Day-1 Traffic',
      title: 'High-ROAS Google Ads Search, Shopping & Performance Max',
      snippet: 'Capture high-intent ready-to-buy customers at the exact moment they search. Strict negative keyword sculpting, 10/10 quality scores, and real-time conversion tracking.',
      sitelinks: ['P-Max Campaigns', 'Negative Keyword Audit', 'High-Intent Search', 'Lower CPC'],
      metrics: [
        { val: '7.4x', label: 'Search Ad ROAS' },
        { val: '-42%', label: 'Lower Cost Per Click' },
        { val: '180+', label: 'Monthly Leads' }
      ]
    },
    {
      id: 'meta-ads',
      keyword: 'meta ads facebook instagram growth agency',
      tag: '🚀 PAID SOCIAL',
      rankNum: 'REEL',
      rankLabel: 'VIRAL ADS',
      url: 'https://yourbrand.com <span class="url-crumb">› meta-ads-funnels</span>',
      badge: '🔥 CAPI 100% Tracking',
      title: 'Meta Ads & High-Converting Facebook & Instagram Funnels',
      snippet: 'Thumb-stopping vertical video creatives, custom lookalike prospecting, dynamic retargeting, and Meta Conversions API (CAPI) setup for predictable e-commerce and B2B growth.',
      sitelinks: ['UGC Video Creatives', 'Lookalike Audiences', 'Dynamic Retargeting', 'Direct DMs'],
      metrics: [
        { val: '8.2x', label: 'E-Com ROAS' },
        { val: '1.4M+', label: 'Target Impressions' },
        { val: '+520%', label: 'Engagement Surge' }
      ]
    },
    {
      id: 'gmb',
      keyword: 'google my business gmb 3 pack ranking ahmedabad',
      tag: '📍 GOOGLE MAPS',
      rankNum: 'MAPS',
      rankLabel: '3-PACK',
      url: 'https://yourbrand.com <span class="url-crumb">› gmb-local-seo</span>',
      badge: '⭐ 5.0 Rating (140+ Reviews)',
      title: 'Dominate Google Maps 3-Pack & Local Customer Inquiries',
      snippet: 'Capture nearby buyers searching with local commercial intent. Google Business Profile optimization, review acceleration, geotagged photos, and surge in phone inquiries.',
      sitelinks: ['Maps 3-Pack Rank', 'Review Acceleration', 'Direct Phone Calls', 'Local Citations'],
      metrics: [
        { val: '+410%', label: 'Direct Phone Calls' },
        { val: '#1 Spot', label: 'Maps 3-Pack' },
        { val: '2.8x', label: 'Local In-Store Visits' }
      ]
    },
    {
      id: 'web-cro',
      keyword: 'website speed optimization core web vitals cro',
      tag: '💻 SPEED & CRO',
      rankNum: '99',
      rankLabel: 'PAGESPEED',
      url: 'https://yourbrand.com <span class="url-crumb">› website-cro-speed</span>',
      badge: '⚡ Green Core Web Vitals',
      title: 'Sub-Second Load Speed & Frictionless Conversion Funnels',
      snippet: 'Pass Google Core Web Vitals with 90+ green scores. Eliminate bloat, compress media, streamline mobile UX, and turn search visitors into immediate WhatsApp leads.',
      sitelinks: ['0.6s Load Time', 'Mobile-First UX', 'WhatsApp CTA Triggers', 'Zero Bloat'],
      metrics: [
        { val: '0.6s', label: 'Mobile Load Time' },
        { val: '99/100', label: 'PageSpeed Score' },
        { val: '+68%', label: 'Form Inquiries' }
      ]
    }
  ];

  if (!keywordEl) return;

  let currentIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 75;
  let isPausedByUser = false;
  let pauseTimer = null;
  let typeTimeout = null;

  function renderChannelPreview(channel) {
    if (!previewBox) return;

    // Update Live Tag
    if (liveTagEl) {
      liveTagEl.textContent = channel.tag;
    }

    // Update active pill button
    pillBtns.forEach(btn => {
      if (btn.getAttribute('data-service') === channel.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const sitelinksHtml = channel.sitelinks.map(s => `<span>${s}</span>`).join(' • ');
    const metricsHtml = channel.metrics.map(m => `
      <div class="metric-box">
        <div class="metric-val text-lime">${m.val}</div>
        <div class="metric-label">${m.label}</div>
      </div>
    `).join('');

    previewBox.innerHTML = `
      <div class="serp-item preview-fade-in">
        <div class="rank-badge">
          <span class="rank-num">${channel.rankNum}</span>
          <span class="rank-label">${channel.rankLabel}</span>
        </div>
        <div class="serp-body">
          <div class="serp-url">
            <span class="url-protocol">https://</span>${channel.url}
            <span class="verified-pill">${channel.badge}</span>
          </div>
          <h3 class="serp-title">${channel.title}</h3>
          <p class="serp-snippet">${channel.snippet}</p>
          <div class="serp-sitelinks">${sitelinksHtml}</div>
        </div>
      </div>
      <div class="serp-live-metrics preview-fade-in">${metricsHtml}</div>
    `;
  }

  function typeLoop() {
    if (isPausedByUser) return;

    const currentChannel = channels[currentIdx];
    const fullText = currentChannel.keyword;

    if (isDeleting) {
      keywordEl.textContent = fullText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      keywordEl.textContent = fullText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    // When typing completes full text
    if (!isDeleting && charIdx === fullText.length) {
      renderChannelPreview(currentChannel);
      isDeleting = true;
      typingSpeed = 2800; // Pause to let user read preview
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentIdx = (currentIdx + 1) % channels.length;
      typingSpeed = 400;
    }

    typeTimeout = setTimeout(typeLoop, typingSpeed);
  }

  // Interactive keyword pills click handling
  pillBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const serviceId = btn.getAttribute('data-service');
      const targetIdx = channels.findIndex(c => c.id === serviceId);
      if (targetIdx === -1) return;

      clearTimeout(typeTimeout);
      clearTimeout(pauseTimer);

      currentIdx = targetIdx;
      const targetChannel = channels[targetIdx];
      keywordEl.textContent = targetChannel.keyword;
      charIdx = targetChannel.keyword.length;
      isDeleting = true;

      renderChannelPreview(targetChannel);

      // Pause auto typing for 6 seconds when clicked
      isPausedByUser = true;
      pauseTimer = setTimeout(() => {
        isPausedByUser = false;
        typeLoop();
      }, 6000);
    });
  });

  // Initial render and start typing loop
  renderChannelPreview(channels[0]);
  typeLoop();
}

/* --------------------------------------------------------------------------
   2. Animated Number Counters (93.4%, 360°, 12M+, 24/7)
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.getElementById('statsBar') || counters[0];
  observer.observe(statsBar);

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Service & Pricing Custom Package Builder
   -------------------------------------------------------------------------- */
function initPricingPackageBuilder() {
  const cards = document.querySelectorAll('.service-checkbox-card');
  const subtotalEl = document.getElementById('pricingSubtotal');
  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('pricingDiscount');
  const totalEl = document.getElementById('pricingTotal');
  const selectedListEl = document.getElementById('selectedServicesList');
  const bookBtn = document.getElementById('bookPackageWaBtn');

  if (!cards.length || !totalEl) return;

  function updatePricing() {
    let subtotal = 0;
    let selectedCount = 0;
    const selectedItems = [];

    cards.forEach(card => {
      const checkbox = card.querySelector('.service-check');
      const price = parseInt(card.getAttribute('data-price'), 10) || 0;
      const name = card.getAttribute('data-name') || '';

      if (checkbox && checkbox.checked) {
        card.classList.add('selected');
        subtotal += price;
        selectedCount++;
        selectedItems.push({ name, price });
      } else {
        card.classList.remove('selected');
      }
    });

    // 15% bundle discount if 2 or more services selected
    let discount = 0;
    if (selectedCount >= 2) {
      discount = Math.round(subtotal * 0.15);
      if (discountRow) discountRow.style.display = 'flex';
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    const total = subtotal - discount;

    // Update UI elements
    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
    if (discountEl) discountEl.textContent = '-₹' + discount.toLocaleString('en-IN');
    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');

    // Populate selected services list
    if (selectedListEl) {
      if (selectedItems.length === 0) {
        selectedListEl.innerHTML = '<span style="color:var(--color-text-muted);font-size:0.85rem;">Please select at least 1 service above.</span>';
      } else {
        selectedListEl.innerHTML = selectedItems.map(item => `
          <div class="selected-item-row">
            <span>• ${item.name}</span>
            <strong>₹${item.price.toLocaleString('en-IN')}</strong>
          </div>
        `).join('');
      }
    }

    // Configure WhatsApp Booking link
    if (bookBtn) {
      bookBtn.onclick = () => {
        if (selectedItems.length === 0) {
          alert('Please select at least one service to book.');
          return;
        }
        const serviceNames = selectedItems.map(i => `• ${i.name} (₹${i.price.toLocaleString('en-IN')})`).join('\n');
        const message = `Hi Sabir Ajmeri / The Digital Marketings,%0A%0AI want to book this Custom Growth Package:%0A${encodeURIComponent(serviceNames)}%0A%0A*Total Estimated Investment:* ₹${total.toLocaleString('en-IN')}%0A%0APlease share the onboarding process and timeline.`;
        window.open(`https://wa.me/919316954389?text=${message}`, '_blank');
      };
    }
  }

  cards.forEach(card => {
    const checkbox = card.querySelector('.service-check');
    if (checkbox) {
      checkbox.addEventListener('change', updatePricing);
    }
  });

  // Initial calculation
  updatePricing();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle') || document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-toggle');
  const closeBtn = document.getElementById('mobileMenuClose') || document.getElementById('drawerCloseBtn') || document.querySelector('.mobile-close') || document.querySelector('.drawer-close');
  const drawer = document.getElementById('mobileDrawer');
  const accordionBtns = document.querySelectorAll('#mobileServicesBtn, .mobile-accordion-btn, .drawer-accordion-toggle');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleDrawer() {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Toggle Services accordion in mobile drawer
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = btn.closest('.mobile-accordion-item, .drawer-accordion-item');
      if (parentItem) {
        const isActive = parentItem.classList.toggle('active');
        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      }
    });
  });

  // Close drawer on clicking any navigational link inside drawer
  const allDrawerLinks = drawer.querySelectorAll('a');
  allDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   Desktop Dropdown & Click Outside Handlers
   -------------------------------------------------------------------------- */
function initDropdownMenus() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const items = dropdown.querySelectorAll('.dropdown-item, .dropdown-menu a');

    // Remove any lingering active/menu-open state on initialization
    dropdown.classList.remove('menu-open');

    // Toggle on click (for touch or desktop click)
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 1140) return; // Managed by mobile drawer
        // If user clicks the toggle link itself, allow normal navigation or toggle
        if (dropdown.classList.contains('menu-open')) {
          dropdown.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          // close other dropdowns first
          dropdowns.forEach(d => d.classList.remove('menu-open'));
          dropdown.classList.add('menu-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Automatically clean up on mouseleave
    dropdown.addEventListener('mouseleave', () => {
      dropdown.classList.remove('menu-open');
      dropdown.classList.remove('is-closing');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });

    // Close immediately when any item inside dropdown is clicked
    items.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.add('is-closing');
        dropdown.classList.remove('menu-open');
        dropdown.classList.remove('active');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.blur();
        }
        if (document.activeElement) document.activeElement.blur();
        
        // Ensure drawer closes if inside or open
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.classList.contains('open')) {
          drawer.classList.remove('open');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }

        setTimeout(() => {
          dropdown.classList.remove('is-closing');
        }, 300);
      });
    });
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach(d => {
      if (!d.contains(e.target)) {
        d.classList.remove('menu-open');
        const toggle = d.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion Engine
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Audit Modals Handling
   -------------------------------------------------------------------------- */
function initAuditModals() {
  const modal = document.getElementById('auditModal');
  const openButtons = document.querySelectorAll('.open-audit-modal, [data-open-modal="auditModal"]');
  const closeButtons = document.querySelectorAll('#closeModalBtn, #closeAuditModal, .modal-close');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Ensure mobile drawer closes if currently open
      const drawer = document.getElementById('mobileDrawer');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      openModal();
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Lead Forms & WhatsApp Dispatcher + Analytics & CRM Logger
   -------------------------------------------------------------------------- */
function initLeadForms() {
  // Main Page Lead Form
  const leadForm = document.getElementById('auditLeadForm');
  const formFeedback = document.getElementById('formFeedback');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('fullName');
      const phoneEl = document.getElementById('phoneNumber');
      const emailEl = document.getElementById('emailAddress');
      const websiteEl = document.getElementById('websiteUrl');
      const keywordsEl = document.getElementById('targetKeywords');
      const serviceEl = document.getElementById('serviceInterest');
      const notesEl = document.getElementById('projectDetails');

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const website = websiteEl ? websiteEl.value.trim() : 'Not specified';
      const keywords = keywordsEl ? keywordsEl.value.trim() : 'General 360 Marketing';
      const service = serviceEl ? serviceEl.value : '360 Digital Marketing';
      const notes = notesEl ? notesEl.value.trim() : 'None';

      if (!name || !phone || !email) {
        showFeedback(formFeedback, 'Please fill in your name, phone number, and email address.', 'error');
        return;
      }

      // Record lead in CRM Database
      recordCrmLead({
        name,
        phone,
        email,
        website,
        keywords,
        service: service || 'General 360 Marketing',
        notes,
        source: window.location.pathname.split('/').pop() || 'index.html'
      });

      // Increment conversion event
      recordAnalyticsEvent('lead_form_submit', { name, service });

      // Format WhatsApp message string
      const waMessage = `*New 360° SEO Audit Request - The Digital Marketings*%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
        `✉️ *Email:* ${encodeURIComponent(email)}%0A` +
        `🌐 *Website:* ${encodeURIComponent(website)}%0A` +
        `🎯 *Target Keywords:* ${encodeURIComponent(keywords)}%0A` +
        `💼 *Service:* ${encodeURIComponent(service)}%0A` +
        `📝 *Notes:* ${encodeURIComponent(notes)}`;

      const waUrl = `https://wa.me/919316954389?text=${waMessage}`;

      showFeedback(
        formFeedback,
        `✓ Thank you, ${name}! Your audit request has been recorded. Redirecting you to WhatsApp to receive your audit roadmap instantly...`,
        'success'
      );

      setTimeout(() => {
        window.open(waUrl, '_blank');
        leadForm.reset();
      }, 1500);
    });
  }

  // Popup Modal Form
  const modalForm = document.getElementById('modalAuditForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('mName');
      const phoneEl = document.getElementById('mPhone');
      const websiteEl = document.getElementById('mWebsite');
      const serviceEl = document.getElementById('mService');
      const keywordsEl = document.getElementById('mKeywords');

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const website = websiteEl ? websiteEl.value.trim() : 'Direct Inquiry';
      const service = serviceEl ? serviceEl.value : '360 Digital Marketing';
      const keywords = keywordsEl ? keywordsEl.value.trim() : service;

      if (!name || !phone) {
        return;
      }

      // Record modal lead in CRM
      recordCrmLead({
        name,
        phone,
        email: 'Via Modal Inquire',
        website: website || 'Direct Inquiry',
        keywords,
        service: service || 'Fast Keyword & SEO Audit',
        notes: 'Modal Popup Fast Audit Request',
        source: window.location.pathname.split('/').pop() || 'Modal'
      });

      recordAnalyticsEvent('audit_modal_submit', { name, phone, service });

      const waMessage = `*Quick SEO Audit Request*%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
        `🌐 *Website:* ${encodeURIComponent(website)}%0A` +
        `💼 *Service:* ${encodeURIComponent(service)}%0A` +
        `🎯 *Keywords:* ${encodeURIComponent(keywords)}`;

      const waUrl = `https://wa.me/919316954389?text=${waMessage}`;

      const modal = document.getElementById('auditModal');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';

      window.open(waUrl, '_blank');
      modalForm.reset();
    });
  }

  function showFeedback(element, message, type) {
    if (!element) return;
    element.className = `form-feedback ${type}`;
    element.textContent = message;
    element.style.display = 'block';
  }
}

/* --------------------------------------------------------------------------
   7. Scroll Effects & Sticky Navbar Shadow
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (header) {
      if (window.scrollY > 40) {
        header.style.borderBottomColor = 'rgba(210, 250, 21, 0.2)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
      } else {
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        header.style.boxShadow = 'none';
      }
    }

    // Scroll-Spy for active link highlight
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   Portfolio Filter Function
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Live Site Analytics & Lead Capture Synchronizer
   -------------------------------------------------------------------------- */
const TDM_STORAGE_KEYS = {
  ANALYTICS: 'tdm_analytics_v1',
  LEADS: 'tdm_leads_v1'
};

function getStoredAnalytics() {
  try {
    const raw = localStorage.getItem(TDM_STORAGE_KEYS.ANALYTICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read analytics from localStorage', e);
  }
  return {
    totalViews: 1420,
    uniqueVisitors: 890,
    pageViews: {},
    whatsappClicks: 164,
    callClicks: 98,
    auditModalOpens: 122,
    serviceClicks: 215,
    events: [],
    lastUpdated: new Date().toISOString()
  };
}

function saveStoredAnalytics(data) {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(TDM_STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save analytics', e);
  }
}

function recordAnalyticsEvent(type, meta = {}) {
  const data = getStoredAnalytics();
  
  if (type === 'whatsapp_click') data.whatsappClicks = (data.whatsappClicks || 0) + 1;
  else if (type === 'call_click') data.callClicks = (data.callClicks || 0) + 1;
  else if (type === 'audit_modal_open') data.auditModalOpens = (data.auditModalOpens || 0) + 1;
  else if (type === 'service_click') data.serviceClicks = (data.serviceClicks || 0) + 1;
  
  data.events = data.events || [];
  data.events.unshift({
    type,
    meta,
    url: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (data.events.length > 200) data.events = data.events.slice(0, 200);
  saveStoredAnalytics(data);
}

function recordCrmLead(leadData) {
  try {
    let leads = [];
    const raw = localStorage.getItem(TDM_STORAGE_KEYS.LEADS);
    if (raw) {
      leads = JSON.parse(raw);
    } else {
      // Sample starter leads for immediate presentation
      leads = [
        {
          id: 'LEAD-1001',
          name: 'Rajesh Patel',
          phone: '+91 98250 12345',
          email: 'rajesh@pateltextiles.com',
          website: 'https://pateltextiles.com',
          keywords: 'textile exporter ahmedabad, cotton fabrics bulk',
          service: 'Fast Google Keyword Ranking & SEO',
          notes: 'Wants #1 position in 45 days for B2B export keywords.',
          source: 'index.html',
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: 'New'
        },
        {
          id: 'LEAD-1002',
          name: 'Pooja Shah',
          phone: '+91 99090 98765',
          email: 'pooja@shahluxurydental.com',
          website: 'https://shahluxurydental.in',
          keywords: 'best dental clinic ahmedabad, smile makeover',
          service: 'Google My Business (GMB 3-Pack)',
          notes: 'Wants more direct phone calls & Google Maps ranking.',
          source: 'gmb-services.html',
          date: new Date(Date.now() - 3600000 * 22).toISOString(),
          status: 'Contacted'
        },
        {
          id: 'LEAD-1003',
          name: 'Amit Verma',
          phone: '+91 97240 55443',
          email: 'amit@vermatechsolutions.com',
          website: 'https://vermatech.io',
          keywords: 'saas software development, custom erp india',
          service: 'Google Ads & PPC Management',
          notes: 'High intent leads needed, starting budget 50k/mo.',
          source: 'google-ads.html',
          date: new Date(Date.now() - 3600000 * 48).toISOString(),
          status: 'Converted'
        }
      ];
    }

    const newLead = {
      id: 'LEAD-' + Date.now(),
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email || 'N/A',
      website: leadData.website || 'N/A',
      keywords: leadData.keywords || 'N/A',
      service: leadData.service || '360 Digital Marketing',
      notes: leadData.notes || 'Inquiry from website',
      source: leadData.source || window.location.pathname.split('/').pop() || 'Home',
      date: new Date().toISOString(),
      status: 'New'
    };

    leads.unshift(newLead);
    localStorage.setItem(TDM_STORAGE_KEYS.LEADS, JSON.stringify(leads));
  } catch (e) {
    console.warn('Could not record CRM lead', e);
  }
}

function initSiteAnalyticsTracker() {
  // 1. Record Page View
  const analytics = getStoredAnalytics();
  analytics.totalViews = (analytics.totalViews || 0) + 1;
  
  const curPage = window.location.pathname.split('/').pop() || 'index.html';
  analytics.pageViews = analytics.pageViews || {};
  analytics.pageViews[curPage] = (analytics.pageViews[curPage] || 0) + 1;
  
  saveStoredAnalytics(analytics);

  // 2. Track WhatsApp Clicks
  document.querySelectorAll('a[href*="wa.me"], .whatsapp-top, .whatsapp-btn, .floating-whatsapp-widget').forEach(el => {
    el.addEventListener('click', () => {
      recordAnalyticsEvent('whatsapp_click', { page: curPage });
    });
  });

  // 3. Track Call Clicks
  document.querySelectorAll('a[href^="tel:"], .call-btn').forEach(el => {
    el.addEventListener('click', () => {
      recordAnalyticsEvent('call_click', { page: curPage });
    });
  });

  // 4. Track Audit Modal Triggers
  document.querySelectorAll('.open-audit-modal, .audit-btn').forEach(el => {
    el.addEventListener('click', () => {
      recordAnalyticsEvent('audit_modal_open', { page: curPage });
    });
  });

  // 5. Track Service Links
  document.querySelectorAll('.dropdown-item, .service-card a').forEach(el => {
    el.addEventListener('click', () => {
      recordAnalyticsEvent('service_click', { page: curPage, href: el.getAttribute('href') });
    });
  });
}

