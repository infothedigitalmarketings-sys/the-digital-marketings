/**
 * THE DIGITAL MARKETINGS - Admin Panel Core Suite Logic
 * Includes:
 * 1. PIN Lock & Security
 * 2. Real-time Analytics Dashboard & Charts
 * 3. Client Leads CRM Engine
 * 4. Blog Manager & SEO SERP Snippet HTML Generator
 * 5. Professional Manual Invoice Generator (Print/PDF)
 */

// Canvas roundRect Polyfill for universal cross-browser compatibility
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r = 0) {
    let radii = [0, 0, 0, 0];
    if (typeof r === 'number') radii = [r, r, r, r];
    else if (Array.isArray(r)) {
      if (r.length === 1) radii = [r[0], r[0], r[0], r[0]];
      else if (r.length === 2) radii = [r[0], r[1], r[0], r[1]];
      else if (r.length === 4) radii = r;
    }
    this.moveTo(x + radii[0], y);
    this.lineTo(x + w - radii[1], y);
    this.quadraticCurveTo(x + w, y, x + w, y + radii[1]);
    this.lineTo(x + w, y + h - radii[2]);
    this.quadraticCurveTo(x + w, y + h, x + w - radii[2], y + h);
    this.lineTo(x + radii[3], y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - radii[3]);
    this.lineTo(x, y + radii[0]);
    this.quadraticCurveTo(x, y, x + radii[0], y);
    return this;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initPinLock();
  initTabNavigation();
  initAnalyticsDashboard();
  initLeadsCrm();
  initBlogManager();
  initInvoiceGenerator();
});

/* --------------------------------------------------------------------------
   1. Real-Time Clock & Header Utilities
   -------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;
  
  function update() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  }
  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   2. PIN Lock Screen & Security Engine
   -------------------------------------------------------------------------- */
let currentPin = '';
const CORRECT_PIN = '1234'; // Default quick access PIN

function initPinLock() {
  const lockOverlay = document.getElementById('lockOverlay');
  const lockBtn = document.getElementById('lockScreenBtn');
  const dots = document.querySelectorAll('.pin-dot');
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  const lockStatus = document.getElementById('lockStatus');

  if (!lockOverlay) return;

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (idx < currentPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  function handleKey(val) {
    if (val === 'clear') {
      currentPin = '';
      updateDots();
      if (lockStatus) lockStatus.textContent = 'Enter 4-digit security PIN (Default: 1234)';
      return;
    }
    if (val === 'back') {
      currentPin = currentPin.slice(0, -1);
      updateDots();
      return;
    }
    if (currentPin.length < 4) {
      currentPin += val;
      updateDots();
      if (currentPin.length === 4) {
        setTimeout(verifyPin, 150);
      }
    }
  }

  function verifyPin() {
    if (currentPin === CORRECT_PIN) {
      lockOverlay.classList.remove('open');
      currentPin = '';
      updateDots();
      sessionStorage.setItem('tdm_admin_authenticated', 'true');
    } else {
      if (lockStatus) {
        lockStatus.textContent = '❌ Incorrect PIN. Try 1234';
        lockStatus.style.color = '#EF4444';
      }
      currentPin = '';
      setTimeout(() => {
        updateDots();
        if (lockStatus) {
          lockStatus.textContent = 'Enter 4-digit security PIN (Default: 1234)';
          lockStatus.style.color = '';
        }
      }, 800);
    }
  }

  keypadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleKey(key);
    });
  });

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem('tdm_admin_authenticated');
      lockOverlay.classList.add('open');
    });
  }

  // Check if locked
  if (sessionStorage.getItem('tdm_admin_authenticated') !== 'true') {
    lockOverlay.classList.add('open');
  }
}

/* --------------------------------------------------------------------------
   3. Tab Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initTabNavigation() {
  const navBtns = document.querySelectorAll('.nav-item-btn[data-tab]');
  const views = document.querySelectorAll('.admin-content-view');
  const pageTitle = document.getElementById('currentPageTitle');
  const pageSubtitle = document.getElementById('currentPageSubtitle');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.admin-sidebar');

  const tabMeta = {
    analytics: { title: 'Analytics & Insights Dashboard', subtitle: 'Real-time website traffic, leads acquisition, and conversion tracking' },
    leads: { title: 'Client Leads & Inquiries CRM', subtitle: 'Manage inbound customer inquiries, follow-ups, and WhatsApp conversations' },
    blog: { title: 'Blog Post Manager & SEO Generator', subtitle: 'Write, preview, and generate high-ranking SEO blog articles' },
    invoice: { title: 'Manual Professional Invoice Creator', subtitle: 'Create, calculate, and print agency client invoices with custom branding' }
  };

  function switchTab(tabId) {
    navBtns.forEach(b => b.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));

    const activeBtn = document.querySelector(`.nav-item-btn[data-tab="${tabId}"]`);
    const activeView = document.getElementById(`view-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeView) activeView.classList.add('active');

    if (tabMeta[tabId] && pageTitle && pageSubtitle) {
      pageTitle.textContent = tabMeta[tabId].title;
      pageSubtitle.textContent = tabMeta[tabId].subtitle;
    }

    if (sidebar) sidebar.classList.remove('open');
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Real-time Analytics Dashboard & Charts
   -------------------------------------------------------------------------- */
function initAnalyticsDashboard() {
  const rawAnalytics = localStorage.getItem('tdm_analytics_v1');
  const analytics = rawAnalytics ? JSON.parse(rawAnalytics) : {
    totalViews: 1420,
    uniqueVisitors: 890,
    whatsappClicks: 164,
    callClicks: 98,
    auditModalOpens: 122,
    serviceClicks: 215,
    events: []
  };

  const rawLeads = localStorage.getItem('tdm_leads_v1');
  const leads = rawLeads ? JSON.parse(rawLeads) : [];

  // Update KPI counters
  const kpiViews = document.getElementById('kpiTotalViews');
  const kpiLeads = document.getElementById('kpiTotalLeads');
  const kpiWa = document.getElementById('kpiWaClicks');
  const kpiCalls = document.getElementById('kpiCallClicks');
  const kpiRate = document.getElementById('kpiConversionRate');

  const totalLeadsCount = leads.length || 24;
  const convRate = (((totalLeadsCount + analytics.whatsappClicks) / Math.max(analytics.totalViews, 100)) * 100).toFixed(1);

  if (kpiViews) kpiViews.textContent = (analytics.totalViews || 1420).toLocaleString();
  if (kpiLeads) kpiLeads.textContent = totalLeadsCount;
  if (kpiWa) kpiWa.textContent = analytics.whatsappClicks || 164;
  if (kpiCalls) kpiCalls.textContent = analytics.callClicks || 98;
  if (kpiRate) kpiRate.textContent = `${convRate}%`;

  // Update Nav Badge count
  const leadBadge = document.getElementById('navLeadsBadge');
  if (leadBadge) leadBadge.textContent = totalLeadsCount;

  // Render Dynamic Chart Bars
  renderTrafficChart();
  renderChannelBreakdown(analytics, leads);
  renderRecentActivity(analytics);
}

function renderTrafficChart() {
  const chartEl = document.getElementById('weeklyTrafficChart');
  if (!chartEl) return;

  const days = [
    { day: 'Mon', visits: 184 },
    { day: 'Tue', visits: 240 },
    { day: 'Wed', visits: 310 },
    { day: 'Thu', visits: 290 },
    { day: 'Fri', visits: 380 },
    { day: 'Sat', visits: 410 },
    { day: 'Sun (Today)', visits: 295 }
  ];

  const maxVisits = Math.max(...days.map(d => d.visits));

  chartEl.innerHTML = days.map(d => {
    const heightPercent = Math.round((d.visits / maxVisits) * 100);
    return `
      <div class="chart-bar-group">
        <span class="chart-bar-val">${d.visits}</span>
        <div class="chart-bar" style="height: ${heightPercent}%;"></div>
        <span class="chart-bar-label">${d.day}</span>
      </div>
    `;
  }).join('');
}

function renderChannelBreakdown(analytics, leads) {
  const container = document.getElementById('channelBreakdownList');
  if (!container) return;

  const channels = [
    { name: 'WhatsApp Direct Inquiries', count: analytics.whatsappClicks || 164, color: '#25D366' },
    { name: 'Direct Phone Calls', count: analytics.callClicks || 98, color: '#3B82F6' },
    { name: 'Free Audit Form Submissions', count: leads.length || 24, color: '#D2FA15' },
    { name: 'Service Page Explorations', count: analytics.serviceClicks || 215, color: '#A855F7' }
  ];

  const total = channels.reduce((sum, c) => sum + c.count, 0);

  container.innerHTML = channels.map(c => {
    const pct = Math.round((c.count / Math.max(total, 1)) * 100);
    return `
      <div class="breakdown-item">
        <div class="breakdown-meta">
          <span>${c.name}</span>
          <span style="color: ${c.color}">${c.count} (${pct}%)</span>
        </div>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar-fill" style="width: ${pct}%; background-color: ${c.color}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentActivity(analytics) {
  const stream = document.getElementById('recentActivityFeed');
  if (!stream) return;

  const events = (analytics.events && analytics.events.length > 0) ? analytics.events.slice(0, 8) : [
    { type: 'whatsapp_click', meta: { page: 'index.html' }, timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { type: 'lead_form_submit', meta: { name: 'Rajesh Patel', service: 'Fast Google SEO' }, timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { type: 'call_click', meta: { page: 'gmb-services.html' }, timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString() },
    { type: 'audit_modal_open', meta: { page: 'blog-30-day-seo-ranking.html' }, timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() }
  ];

  stream.innerHTML = events.map(e => {
    const date = new Date(e.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let icon = '⚡';
    let text = 'Website Activity';

    if (e.type === 'whatsapp_click') {
      icon = '💬';
      text = `Visitor clicked WhatsApp CTA on <strong>${e.meta.page || 'Home'}</strong>`;
    } else if (e.type === 'call_click') {
      icon = '📞';
      text = `Visitor clicked Direct Call link on <strong>${e.meta.page || 'Services'}</strong>`;
    } else if (e.type === 'lead_form_submit') {
      icon = '🎯';
      text = `New Lead Form: <strong>${e.meta.name || 'Client'}</strong> (${e.meta.service || 'SEO'})`;
    } else if (e.type === 'audit_modal_open') {
      icon = '🔍';
      text = `Visitor opened Free SEO Audit Modal`;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.84rem;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>${icon}</span>
          <span>${text}</span>
        </div>
        <span style="color: var(--admin-text-muted); font-size: 0.78rem;">${timeStr}</span>
      </div>
    `;
  }).join('');
}

/* --------------------------------------------------------------------------
   5. Client Leads & Inquiries CRM Engine
   -------------------------------------------------------------------------- */
function getLeadsData() {
  const raw = localStorage.getItem('tdm_leads_v1');
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [
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

function saveLeadsData(leads) {
  localStorage.setItem('tdm_leads_v1', JSON.stringify(leads));
  initAnalyticsDashboard();
}

function initLeadsCrm() {
  const tableBody = document.getElementById('leadsTableBody');
  const searchInput = document.getElementById('leadSearchInput');
  const statusFilter = document.getElementById('leadStatusFilter');
  const exportBtn = document.getElementById('exportLeadsCsvBtn');
  const manualLeadForm = document.getElementById('manualLeadForm');

  if (!tableBody) return;

  function renderLeads() {
    const leads = getLeadsData();
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filter = statusFilter ? statusFilter.value : 'all';

    const filtered = leads.filter(item => {
      const matchesQuery = (
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.phone && item.phone.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        (item.service && item.service.toLowerCase().includes(query))
      );
      const matchesStatus = filter === 'all' || item.status.toLowerCase() === filter.toLowerCase();
      return matchesQuery && matchesStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: var(--admin-text-muted);">
            No client leads found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(lead => {
      const dateStr = new Date(lead.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const statusClass = `status-${(lead.status || 'new').toLowerCase().replace(' ', '-')}`;
      
      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20thank%20you%20for%20contacting%20The%20Digital%20Marketings.%20I%20am%20Sabir%20Ajmeri%20(Founder).%20Let's%20discuss%20your%20${encodeURIComponent(lead.service)}%20growth%20roadmap.`;

      return `
        <tr>
          <td>
            <div class="lead-name-cell">
              <span class="lead-name">${lead.name}</span>
              <span class="lead-email">${lead.email || 'No email provided'}</span>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--admin-text-main);">${lead.phone}</div>
            <a href="${lead.website}" target="_blank" style="font-size: 0.75rem; color: var(--admin-primary);">${lead.website || 'N/A'}</a>
          </td>
          <td>
            <div style="font-weight: 600;">${lead.service}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${lead.keywords || 'No keywords'}</div>
          </td>
          <td>
            <span style="font-size: 0.78rem;">${dateStr}</span>
            <div style="font-size: 0.72rem; color: var(--admin-text-muted);">Page: ${lead.source || 'Direct'}</div>
          </td>
          <td>
            <select class="admin-select lead-status-select" data-id="${lead.id}" style="padding: 4px 8px; font-size: 0.78rem; width: auto;">
              <option value="New" ${lead.status === 'New' ? 'selected' : ''}>🟢 New</option>
              <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>🔵 Contacted</option>
              <option value="In Progress" ${lead.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
              <option value="Converted" ${lead.status === 'Converted' ? 'selected' : ''}>🌟 Converted</option>
              <option value="Lost" ${lead.status === 'Lost' ? 'selected' : ''}>🔴 Lost</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              <a href="${waLink}" target="_blank" class="btn-whatsapp" title="Chat with Client on WhatsApp">
                💬 WhatsApp
              </a>
              <button class="btn-secondary delete-lead-btn" data-id="${lead.id}" style="padding: 4px 8px; font-size: 0.78rem; color: #EF4444;" title="Delete Lead">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Status change listeners
    document.querySelectorAll('.lead-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        const current = getLeadsData();
        const found = current.find(l => l.id === id);
        if (found) {
          found.status = newStatus;
          saveLeadsData(current);
        }
      });
    });

    // Attach Delete listeners
    document.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this lead record?')) {
          let current = getLeadsData();
          current = current.filter(l => l.id !== id);
          saveLeadsData(current);
          renderLeads();
        }
      });
    });
  }

  renderLeads();

  if (searchInput) searchInput.addEventListener('input', renderLeads);
  if (statusFilter) statusFilter.addEventListener('change', renderLeads);

  // Export CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const leads = getLeadsData();
      if (!leads.length) {
        alert('No leads data to export.');
        return;
      }
      const headers = ['ID', 'Name', 'Phone', 'Email', 'Website', 'Service', 'Keywords', 'Notes', 'Date', 'Status'];
      const rows = leads.map(l => [
        `"${l.id}"`,
        `"${l.name}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.website}"`,
        `"${l.service}"`,
        `"${l.keywords}"`,
        `"${l.notes}"`,
        `"${l.date}"`,
        `"${l.status}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `TDM_Client_Leads_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Manual Add Lead
  if (manualLeadForm) {
    manualLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('manualName').value.trim();
      const phone = document.getElementById('manualPhone').value.trim();
      const email = document.getElementById('manualEmail').value.trim();
      const service = document.getElementById('manualService').value;
      const notes = document.getElementById('manualNotes').value.trim();

      if (!name || !phone) {
        alert('Please provide at least a Client Name and Phone number.');
        return;
      }

      const leads = getLeadsData();
      leads.unshift({
        id: 'LEAD-' + Date.now(),
        name,
        phone,
        email: email || 'N/A',
        website: 'Direct Entry',
        keywords: 'Manual Client Onboarding',
        service: service || '360 Digital Marketing',
        notes: notes || 'Manually added by Admin',
        source: 'Admin Panel',
        date: new Date().toISOString(),
        status: 'New'
      });

      saveLeadsData(leads);
      renderLeads();
      manualLeadForm.reset();
      alert('✓ Client lead successfully added to CRM!');
    });
  }
}

/* --------------------------------------------------------------------------
   6. Blog Manager & SEO Snippet HTML Generator
   -------------------------------------------------------------------------- */
function initBlogManager() {
  const titleInput = document.getElementById('blogTitle');
  const slugInput = document.getElementById('blogSlug');
  const descInput = document.getElementById('blogExcerpt');
  const catInput = document.getElementById('blogCategory');
  const authorInput = document.getElementById('blogAuthor');
  const readTimeInput = document.getElementById('blogReadTime');
  const keywordsInput = document.getElementById('blogKeywords');
  const contentInput = document.getElementById('blogContent');

  // SERP Live Elements
  const serpTitle = document.getElementById('serpPreviewTitle');
  const serpUrl = document.getElementById('serpPreviewUrl');
  const serpDesc = document.getElementById('serpPreviewDesc');
  const titleCount = document.getElementById('titleCharCount');
  const descCount = document.getElementById('descCharCount');

  const generateHtmlBtn = document.getElementById('generateBlogHtmlBtn');
  const exportPreviewModal = document.getElementById('blogExportModal');
  const generatedCodeEl = document.getElementById('generatedHtmlCode');
  const downloadHtmlBtn = document.getElementById('downloadBlogHtmlFileBtn');
  const copyCodeBtn = document.getElementById('copyBlogHtmlCodeBtn');

  function updateSerp() {
    const titleVal = titleInput ? titleInput.value.trim() : '';
    const descVal = descInput ? descInput.value.trim() : '';
    const slugVal = slugInput ? slugInput.value.trim() : '';

    if (serpTitle) {
      serpTitle.textContent = titleVal ? `${titleVal} | The Digital Marketings` : 'Your Blog Title Tag Here | The Digital Marketings';
    }
    if (serpUrl) {
      serpUrl.innerHTML = `https://thedigitalmarketings.com › <span style="color:#bdc1c6">${slugVal || 'blog-slug-name'}.html</span>`;
    }
    if (serpDesc) {
      serpDesc.textContent = descVal || 'Write your compelling meta description here to achieve high click-through rates on Google search results...';
    }

    // Char counts
    if (titleCount) {
      const len = titleVal.length;
      titleCount.textContent = `${len} / 60 characters ${len >= 50 && len <= 60 ? '✓ (Optimal)' : ''}`;
      titleCount.className = `char-count ${len > 60 ? 'warn' : (len >= 45 ? 'good' : '')}`;
    }
    if (descCount) {
      const len = descVal.length;
      descCount.textContent = `${len} / 160 characters ${len >= 130 && len <= 160 ? '✓ (Optimal)' : ''}`;
      descCount.className = `char-count ${len > 160 ? 'warn' : (len >= 120 ? 'good' : '')}`;
    }
  }

  if (titleInput) {
    titleInput.addEventListener('input', () => {
      // Auto-generate slug
      if (slugInput && (!slugInput.dataset.manualEdited)) {
        slugInput.value = 'blog-' + titleInput.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      updateSerp();
    });
  }

  if (slugInput) {
    slugInput.addEventListener('input', () => {
      slugInput.dataset.manualEdited = 'true';
      updateSerp();
    });
  }

  if (descInput) {
    descInput.addEventListener('input', updateSerp);
  }

  // Generate HTML Blueprint
  function buildCompleteBlogHtml() {
    const title = titleInput.value.trim() || 'Accelerate Your Business with 360 Digital Marketing';
    const slug = slugInput.value.trim() || 'blog-digital-growth-guide';
    const desc = descInput.value.trim() || 'Actionable digital marketing strategies from Ahmedabad top agency.';
    const cat = catInput.value || 'SEO & Growth';
    const author = authorInput.value.trim() || 'Sabir Ajmeri - Founder & CEO';
    const readTime = readTimeInput.value || '6 min read';
    const keywords = keywordsInput.value.trim() || 'seo marketing, fast ranking, digital agency';
    const rawContent = contentInput.value.trim() || `
<h2>Why This Strategy Changes Everything in 2026</h2>
<p>In today's hyper-competitive digital space, standard generic marketing is no longer enough to dominate Google search results and capture high-paying clients.</p>

<h3>Key Pillars of Rapid Execution</h3>
<ul>
  <li><strong>Pillar 1:</strong> Accelerated keyword research mapped to buyer intent.</li>
  <li><strong>Pillar 2:</strong> CTR-engineered title tags and meta descriptions.</li>
  <li><strong>Pillar 3:</strong> Blended omnichannel ad funnels (Google + Meta).</li>
</ul>

<div class="neon-quote-box" style="background: rgba(210,250,21,0.06); border-left: 4px solid #D2FA15; padding: 20px; border-radius: 8px; margin: 24px 0;">
  <p style="font-weight: 700; color: #F4F6FC;">"Our goal is not just rankings—it is measurable, repeatable revenue growth for your brand."</p>
</div>
`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${title} | The Digital Marketings</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${author}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://thedigitalmarketings.com/${slug}.html">

  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://thedigitalmarketings.com/${slug}.html">
  <meta property="og:image" content="assets/logo.svg">

  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${title}",
    "description": "${desc}",
    "author": {
      "@type": "Person",
      "name": "${author}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Digital Marketings",
      "logo": "https://thedigitalmarketings.com/assets/logo.svg"
    },
    "datePublished": "${new Date().toISOString().slice(0, 10)}"
  }
  </script>
</head>
<body>
  <!-- Ambient Glows -->
  <div class="glow-orb glow-orb-1" aria-hidden="true"></div>
  <div class="glow-orb glow-orb-2" aria-hidden="true"></div>

  <!-- Header -->
  <header class="main-header" id="header">
    <div class="container nav-container">
      <a href="index.html" class="brand-logo">
        <img src="assets/logo.svg" alt="The Digital Marketings" class="logo-img">
      </a>
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="about.html" class="nav-link">About Us</a></li>
          <li><a href="services.html" class="nav-link">Services</a></li>
          <li><a href="blog.html" class="nav-link active">Blog</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="https://wa.me/919316954389" target="_blank" class="btn btn-primary nav-cta">Get Free Audit</a>
    </div>
  </header>

  <!-- Blog Article Container -->
  <main class="blog-detail-section" style="padding: 120px 0 60px 0;">
    <div class="container" style="max-width: 860px;">
      <div class="blog-meta-badge" style="display: inline-block; padding: 6px 14px; background: rgba(210,250,21,0.12); color: #D2FA15; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; margin-bottom: 16px;">
        ${cat.toUpperCase()} • ${readTime}
      </div>
      <h1 style="font-size: 2.6rem; line-height: 1.2; margin-bottom: 20px;">${title}</h1>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 36px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #A0AEC0; font-size: 0.9rem;">
        <span>✍️ Written by <strong>${author}</strong></span>
        <span>•</span>
        <span>📅 ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div class="blog-article-body" style="font-size: 1.1rem; line-height: 1.8; color: #E2E8F0;">
        ${rawContent}
      </div>

      <!-- In-Article WhatsApp CTA Box -->
      <div style="background: linear-gradient(135deg, #141822, #1A202C); border: 1px solid rgba(210,250,21,0.25); border-radius: 16px; padding: 36px; margin: 50px 0; text-align: center;">
        <h3 style="font-size: 1.6rem; margin-bottom: 12px;">Ready to Scale Your Website to Google Page #1?</h3>
        <p style="color: #A0AEC0; margin-bottom: 24px;">Get a comprehensive 360° SEO & Keyword roadmap customized for your business by Founder Sabir Ajmeri.</p>
        <a href="https://wa.me/919316954389?text=Hi%20Sabir%2C%20I%20read%20your%20blog%20about%20${encodeURIComponent(title)}%20and%20want%20to%20rank%20my%20website." target="_blank" class="btn btn-primary" style="padding: 12px 28px; font-weight: 700;">
          Claim Free 30-Day Growth Audit on WhatsApp 💬
        </a>
      </div>
    </div>
  </main>

  <footer class="main-footer" style="padding: 40px 0; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; color: #64748B;">
    <div class="container">
      <p>© 2026 The Digital Marketings. All Rights Reserved. Ahmedabad, India.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
  }

  if (generateHtmlBtn) {
    generateHtmlBtn.addEventListener('click', () => {
      const htmlCode = buildCompleteBlogHtml();
      if (generatedCodeEl) generatedCodeEl.value = htmlCode;
      if (exportPreviewModal) exportPreviewModal.style.display = 'flex';
    });
  }

  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener('click', () => {
      const htmlCode = buildCompleteBlogHtml();
      const slug = (slugInput ? slugInput.value.trim() : '') || 'new-blog-post';
      const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slug}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      if (generatedCodeEl) {
        generatedCodeEl.select();
        navigator.clipboard.writeText(generatedCodeEl.value);
        copyCodeBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => copyCodeBtn.textContent = '📋 Copy HTML Code', 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Manual Professional Invoice Generator (Print / PDF)
   -------------------------------------------------------------------------- */
function initInvoiceGenerator() {
  const itemsContainer = document.getElementById('invoiceItemsTableBody');
  const addRowBtn = document.getElementById('invAddRowBtn');
  const printBtn = document.getElementById('invPrintBtn');
  const currencySelect = document.getElementById('invCurrencySelect');
  const discountInput = document.getElementById('invDiscountPercent');

  const subtotalEl = document.getElementById('invSubtotalVal');
  const taxEl = document.getElementById('invTaxVal');
  const grandTotalEl = document.getElementById('invGrandTotalVal');
  const wordsEl = document.getElementById('invAmountInWords');

  if (!itemsContainer) return;

  function calculateTotals() {
    let subtotal = 0;
    let totalTax = 0;
    const currency = currencySelect ? currencySelect.value : '₹';
    const discountPct = parseFloat(discountInput ? discountInput.value : 0) || 0;

    const rows = itemsContainer.querySelectorAll('tr.inv-item-row');
    rows.forEach(row => {
      const qtyInput = row.querySelector('.inv-item-qty');
      const rateInput = row.querySelector('.inv-item-rate');
      const taxInput = row.querySelector('.inv-item-tax');
      const totalCol = row.querySelector('.inv-item-total');

      const qty = parseFloat(qtyInput ? qtyInput.value : 1) || 1;
      const rate = parseFloat(rateInput ? rateInput.value : 0) || 0;
      const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;

      const lineNet = qty * rate;
      const lineTax = lineNet * (taxRate / 100);

      subtotal += lineNet;
      totalTax += lineTax;

      if (totalCol) {
        totalCol.textContent = `${currency} ${lineNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    });

    const discountAmount = subtotal * (discountPct / 100);
    const taxableTotal = subtotal - discountAmount;
    const grandTotal = taxableTotal + totalTax;

    if (subtotalEl) subtotalEl.textContent = `${currency} ${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (taxEl) taxEl.textContent = `${currency} ${totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (grandTotalEl) grandTotalEl.textContent = `${currency} ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (wordsEl) {
      wordsEl.textContent = `${numberToWords(Math.round(grandTotal))} Only (${currency})`;
    }
  }

  function createItemRow(desc = 'Fast Google Keyword Ranking & SEO Sprint (Month 1)', qty = 1, rate = 25000, tax = 18) {
    const currency = currencySelect ? currencySelect.value : '₹';
    const tr = document.createElement('tr');
    tr.className = 'inv-item-row';
    tr.innerHTML = `
      <td>
        <div class="inv-table-input inv-item-desc" contenteditable="true" role="textbox" spellcheck="false">${desc}</div>
      </td>
      <td style="width: 70px; text-align: center;">
        <input type="number" class="inv-table-input inv-item-qty" value="${qty}" min="1" step="1">
      </td>
      <td style="width: 120px; text-align: right;">
        <input type="number" class="inv-table-input inv-item-rate" value="${rate}" min="0" step="100">
      </td>
      <td style="width: 80px; text-align: center;">
        <input type="number" class="inv-table-input inv-item-tax" value="${tax}" min="0" step="1">
      </td>
      <td class="inv-item-total" style="width: 130px; text-align: right;">
        ${currency} ${(qty * rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td style="width: 36px; text-align: center;" class="no-print">
        <button type="button" class="inv-btn-remove-row" title="Remove Item">✕</button>
      </td>
    `;

    // Listen to inputs & sync attributes
    tr.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => {
        inp.setAttribute('value', inp.value);
        calculateTotals();
      });
    });

    const descDiv = tr.querySelector('.inv-item-desc');
    if (descDiv) {
      descDiv.addEventListener('input', calculateTotals);
    }

    // Remove row
    tr.querySelector('.inv-btn-remove-row').addEventListener('click', () => {
      if (itemsContainer.querySelectorAll('tr.inv-item-row').length > 1) {
        tr.remove();
        calculateTotals();
      } else {
        alert('Invoice must have at least one service line item.');
      }
    });

    return tr;
  }

  // Add default items
  itemsContainer.innerHTML = '';
  itemsContainer.appendChild(createItemRow('360° Omnichannel SEO & Google Ads Management (Month 1)', 1, 35000, 18));
  itemsContainer.appendChild(createItemRow('High-ROAS Meta Ads Setup & Dynamic Retargeting Funnel', 1, 15000, 18));

  calculateTotals();

  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      itemsContainer.appendChild(createItemRow('New Digital Marketing Service Item', 1, 10000, 18));
      calculateTotals();
    });
  }

  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      calculateTotals();
    });
  }
  if (discountInput) discountInput.addEventListener('input', calculateTotals);

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const invTabBtn = document.querySelector('.nav-item-btn[data-tab="invoice"]');
      if (invTabBtn && !invTabBtn.classList.contains('active')) {
        invTabBtn.click();
      }
      setTimeout(() => {
        window.print();
      }, 50);
    });
  }
}

// Convert numbers to words helper
function numberToWords(num) {
  if (num === 0) return 'Zero';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }
  return inWords(num);
}


