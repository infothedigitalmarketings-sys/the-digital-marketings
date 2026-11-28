/**
 * THE DIGITAL MARKETINGS - Admin Panel Core Suite Logic
 * Includes:
 * 1. PIN Lock & Security (Customizable 4-digit PIN)
 * 2. Real-time Analytics Dashboard & Charts
 * 3. Client Leads CRM Engine (LocalStorage + GitHub Repo Sync)
 * 4. Live Website Rates & Pricing Manager (Synced to Public Site)
 * 5. Blog Manager, SEO SERP Snippet & Live Publishing
 * 6. Professional Manual Invoice Generator (Print/PDF + Live Service Rates)
 * 7. Persistent Storage & GitHub Repository Sync + JSON Backup/Restore
 */

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

const TDM_ADMIN_KEYS = {
  PIN: 'tdm_admin_pin',
  AUTH: 'tdm_admin_authenticated',
  ANALYTICS: 'tdm_analytics_v1',
  LEADS: 'tdm_leads_v1',
  SITE_CONFIG: 'tdm_site_config_v1',
  BLOGS: 'tdm_blogs_v1',
  INVOICES: 'tdm_invoices_v1',
  GH_SYNC: 'tdm_github_sync_v1'
};

const DEFAULT_SITE_CONFIG = {
  version: 1,
  updatedAt: '2026-11-28T10:00:00.000Z',
  currency: '₹',
  bundleDiscountPercent: 15,
  seoSprintPrice: 14999,
  leadWebhookUrl: '',
  services: [
    {
      id: 'smm',
      name: 'Social Media Marketing',
      builderName: 'Social Media Marketing (SMM)',
      price: 3999,
      unit: '/ monthly',
      shortUnit: '/mo',
      prefix: '',
      note: ''
    },
    {
      id: 'gmb',
      name: 'Google Business Profile (GMB)',
      builderName: 'Google Business Profile (GMB) Optimization',
      price: 2499,
      unit: '/ monthly',
      shortUnit: '/mo',
      prefix: '',
      note: ''
    },
    {
      id: 'google-ads',
      name: 'Google Ads Management',
      builderName: 'Google Ads Campaign Management',
      price: 2499,
      unit: '/ monthly',
      shortUnit: '/mo',
      prefix: '',
      note: '(Ad Budget Excluded)'
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads (FB & Instagram)',
      builderName: 'Meta Ads (Facebook & Instagram)',
      price: 2499,
      unit: '/ monthly',
      shortUnit: '/mo',
      prefix: '',
      note: '(Ad Budget Excluded)'
    },
    {
      id: 'seo',
      name: 'Website SEO (Search Engine)',
      builderName: 'Website SEO & Fast Keyword Ranking',
      price: 4999,
      unit: '/ monthly',
      shortUnit: '/mo',
      prefix: 'Starting from ',
      note: ''
    },
    {
      id: 'website',
      name: 'Website Creation (User Side)',
      builderName: 'Website Creation (User-Side Frontend)',
      price: 5999,
      unit: 'starting',
      shortUnit: ' starting',
      prefix: '',
      note: '(Domain, Hosting & Admin Panel Excluded)'
    }
  ],
  bundles: [
    {
      id: 'local-social-duo',
      name: 'Local & Social Growth Duo',
      price: 5499,
      originalPrice: 6498,
      unit: '/ month'
    },
    {
      id: 'ads-duo',
      name: 'Google + Meta Ads Duo',
      price: 4249,
      originalPrice: 4998,
      unit: '/ month'
    },
    {
      id: 'complete-360',
      name: 'Complete 360° Suite',
      price: 16499,
      originalPrice: 19494,
      unit: '/ month'
    }
  ]
};

const DEFAULT_LEADS = [
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

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showAdminToast(message, isError = false) {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `admin-toast${isError ? ' error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4200);
}

/* --------------------------------------------------------------------------
   Global Helpers for Shared Data (Config, Leads, Analytics, Blogs, GitHub)
   -------------------------------------------------------------------------- */
function getSiteConfig() {
  const stored = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.SITE_CONFIG), null);
  if (stored && Array.isArray(stored.services) && Array.isArray(stored.bundles)) {
    return stored;
  }
  return JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG));
}

function saveSiteConfigLocal(config) {
  config.updatedAt = new Date().toISOString();
  localStorage.setItem(TDM_ADMIN_KEYS.SITE_CONFIG, JSON.stringify(config));
  populateInvoiceServicePicker();
}

function getAnalyticsData() {
  return safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.ANALYTICS), {
    version: 1,
    updatedAt: new Date().toISOString(),
    totalViews: 1420,
    uniqueVisitors: 890,
    pageViews: {},
    whatsappClicks: 164,
    callClicks: 98,
    auditModalOpens: 122,
    serviceClicks: 215,
    events: []
  });
}

function getLeadsData() {
  const stored = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.LEADS), null);
  if (Array.isArray(stored)) return stored;
  return JSON.parse(JSON.stringify(DEFAULT_LEADS));
}

function saveLeadsData(leads, triggerAutoSync = true) {
  localStorage.setItem(TDM_ADMIN_KEYS.LEADS, JSON.stringify(leads));
  initAnalyticsDashboard();
  if (triggerAutoSync) {
    maybeAutoSyncFile('data/leads.json', {
      version: 1,
      updatedAt: new Date().toISOString(),
      leads
    }, 'Update CRM leads from Admin');
  }
}

function getBlogsData() {
  const stored = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.BLOGS), null);
  if (stored && Array.isArray(stored.posts)) return stored;
  return { version: 1, updatedAt: new Date().toISOString(), posts: [] };
}

function saveBlogsDataLocal(blogsData) {
  blogsData.updatedAt = new Date().toISOString();
  localStorage.setItem(TDM_ADMIN_KEYS.BLOGS, JSON.stringify(blogsData));
}

function getInvoicesData() {
  const stored = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.INVOICES), null);
  if (Array.isArray(stored)) return stored;
  return [];
}

function saveInvoicesData(invoices, triggerAutoSync = true) {
  localStorage.setItem(TDM_ADMIN_KEYS.INVOICES, JSON.stringify(invoices));
  if (triggerAutoSync) {
    maybeAutoSyncFile('data/invoices.json', {
      version: 1,
      updatedAt: new Date().toISOString(),
      invoices
    }, 'Update Estimates & Invoices history from Admin');
  }
}

let TDM_DIRECT_SERVER = false;

async function detectDirectServer() {
  if (window.location.protocol === 'file:') {
    TDM_DIRECT_SERVER = false;
    return false;
  }
  try {
    const res = await fetch('/api/health', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      TDM_DIRECT_SERVER = Boolean(data && data.ok);
      return TDM_DIRECT_SERVER;
    }
  } catch (e) {}
  TDM_DIRECT_SERVER = false;
  return false;
}

async function postDirectApi(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Direct server save failed (${res.status})`);
  }
  return data;
}

function getGhSettings() {
  return safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.GH_SYNC), {
    owner: 'infothedigitalmarketings-sys',
    repo: 'the-digital-marketings',
    branch: 'main',
    token: '',
    autoSync: false
  });
}

function saveGhSettings(settings) {
  localStorage.setItem(TDM_ADMIN_KEYS.GH_SYNC, JSON.stringify(settings));
  updateSyncStatusUI();
}

function updateSyncStatusUI() {
  const cfg = getGhSettings();
  const hasToken = Boolean(cfg.token && cfg.token.trim());
  const navBadge = document.getElementById('navSyncBadge');
  const sidebarStatus = document.getElementById('sidebarSyncStatus');
  const pill = document.getElementById('ghConnectionPill');

  if (TDM_DIRECT_SERVER) {
    if (navBadge) navBadge.textContent = 'Direct';
    if (sidebarStatus) sidebarStatus.textContent = '● Direct Server Active';
    if (pill) {
      pill.textContent = 'Direct Server (No Token)';
      pill.className = 'status-badge status-converted';
    }
    return;
  }

  if (navBadge) {
    navBadge.textContent = hasToken ? (cfg.autoSync ? 'Auto' : 'GitHub') : 'Local';
  }
  if (sidebarStatus) {
    sidebarStatus.textContent = hasToken
      ? `● GitHub Sync ${cfg.autoSync ? '(Auto)' : '(Manual)'}`
      : '● Local Storage Only';
  }
  if (pill) {
    pill.textContent = hasToken ? 'Token Configured' : 'Not Connected';
    pill.className = `status-badge ${hasToken ? 'status-converted' : 'status-new'}`;
  }
}

/* --------------------------------------------------------------------------
   GitHub REST API Sync Engine
   -------------------------------------------------------------------------- */
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const clean = b64.replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function ghGetFile(path) {
  const { owner, repo, branch, token } = getGhSettings();
  if (!token) throw new Error('GitHub token configure nahi hai. "Storage & GitHub Sync" tab me token dalein.');

  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}?ref=${encodeURIComponent(branch || 'main')}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub GET failed (${res.status})`);
  }

  const data = await res.json();
  return {
    sha: data.sha,
    content: base64ToUtf8(data.content || '')
  };
}

async function ghPutFile(path, contentStr, message) {
  const { owner, repo, branch, token } = getGhSettings();
  if (!token) throw new Error('GitHub token save nahi hai. "Storage & GitHub Sync" tab me jaakar Token dalein.');

  const existing = await ghGetFile(path);
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`;

  const body = {
    message: message || `Admin update: ${path}`,
    content: utf8ToBase64(contentStr),
    branch: branch || 'main'
  };
  if (existing && existing.sha) {
    body.sha = existing.sha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub PUT failed (${res.status})`);
  }
  return res.json();
}

async function maybeAutoSyncFile(path, payloadObj, message) {
  if (TDM_DIRECT_SERVER && path === 'data/leads.json') {
    try {
      await postDirectApi('/api/save-leads', payloadObj);
      showAdminToast('✓ CRM Leads direct server par save ho gayi');
    } catch (err) {
      showAdminToast(`Direct save failed: ${err.message}`, true);
    }
    return;
  }
  if (TDM_DIRECT_SERVER && path === 'data/blogs.json') {
    try {
      await postDirectApi('/api/delete-blog', { blogsCatalog: payloadObj });
    } catch (err) {}
    return;
  }
  if (TDM_DIRECT_SERVER && path === 'data/invoices.json') {
    try {
      await postDirectApi('/api/save-invoices', payloadObj);
      showAdminToast('✓ Estimate/Invoice history direct server par save ho gayi');
    } catch (err) {
      showAdminToast(`Direct save failed: ${err.message}`, true);
    }
    return;
  }
  const cfg = getGhSettings();
  if (!cfg.token || !cfg.autoSync) return;
  try {
    await ghPutFile(path, JSON.stringify(payloadObj, null, 2) + '\n', message);
    showAdminToast(`✓ Auto-synced ${path} to GitHub`);
  } catch (err) {
    showAdminToast(`Auto-sync failed (${path}): ${err.message}`, true);
  }
}

async function fetchRepoJsonRelative(path) {
  try {
    const res = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function bootstrapRepoData() {
  const [repoConfig, repoLeads, repoAnalytics, repoBlogs, repoInvoices] = await Promise.all([
    fetchRepoJsonRelative('data/site-config.json'),
    fetchRepoJsonRelative('data/leads.json'),
    fetchRepoJsonRelative('data/analytics.json'),
    fetchRepoJsonRelative('data/blogs.json'),
    fetchRepoJsonRelative('data/invoices.json')
  ]);

  if (repoConfig && Array.isArray(repoConfig.services)) {
    const localCfg = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.SITE_CONFIG), null);
    if (!localCfg || new Date(repoConfig.updatedAt || 0) > new Date(localCfg.updatedAt || 0)) {
      localStorage.setItem(TDM_ADMIN_KEYS.SITE_CONFIG, JSON.stringify(repoConfig));
    }
  }

  if (repoLeads && Array.isArray(repoLeads.leads)) {
    const localLeads = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.LEADS), null);
    if (!Array.isArray(localLeads) || localLeads.length === 0) {
      localStorage.setItem(TDM_ADMIN_KEYS.LEADS, JSON.stringify(repoLeads.leads));
    }
  }

  if (repoAnalytics && typeof repoAnalytics.totalViews === 'number') {
    const localAna = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.ANALYTICS), null);
    if (!localAna) {
      localStorage.setItem(TDM_ADMIN_KEYS.ANALYTICS, JSON.stringify(repoAnalytics));
    }
  }

  if (repoBlogs && Array.isArray(repoBlogs.posts)) {
    const localBlogs = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.BLOGS), null);
    if (!localBlogs || new Date(repoBlogs.updatedAt || 0) > new Date(localBlogs.updatedAt || 0)) {
      localStorage.setItem(TDM_ADMIN_KEYS.BLOGS, JSON.stringify(repoBlogs));
    }
  }

  if (repoInvoices && Array.isArray(repoInvoices.invoices)) {
    const localInvs = safeJsonParse(localStorage.getItem(TDM_ADMIN_KEYS.INVOICES), null);
    if (!Array.isArray(localInvs) || localInvs.length === 0) {
      localStorage.setItem(TDM_ADMIN_KEYS.INVOICES, JSON.stringify(repoInvoices.invoices));
    }
  }
}

/* --------------------------------------------------------------------------
   App Initialization
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  initClock();
  initPinLock();
  initTabNavigation();
  await detectDirectServer();
  updateSyncStatusUI();

  await bootstrapRepoData();

  initAnalyticsDashboard();
  initLeadsCrm();
  initPricingManager();
  initBlogManager();
  initInvoiceGenerator();
  initStorageAndBackup();
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

function getAdminPin() {
  return localStorage.getItem(TDM_ADMIN_KEYS.PIN) || '1234';
}

function initPinLock() {
  const lockOverlay = document.getElementById('lockOverlay');
  const lockBtn = document.getElementById('lockScreenBtn');
  const dots = document.querySelectorAll('.pin-dot');
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  const lockStatus = document.getElementById('lockStatus');

  if (!lockOverlay) return;

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (idx < currentPin.length) dot.classList.add('filled');
      else dot.classList.remove('filled');
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
    if (currentPin === getAdminPin()) {
      lockOverlay.classList.remove('open');
      currentPin = '';
      updateDots();
      sessionStorage.setItem(TDM_ADMIN_KEYS.AUTH, 'true');
    } else {
      if (lockStatus) {
        lockStatus.textContent = '❌ Incorrect PIN. Try again';
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
      handleKey(btn.getAttribute('data-key'));
    });
  });

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem(TDM_ADMIN_KEYS.AUTH);
      lockOverlay.classList.add('open');
    });
  }

  if (sessionStorage.getItem(TDM_ADMIN_KEYS.AUTH) !== 'true') {
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
    pricing: { title: 'Live Website Rates & Pricing Manager', subtitle: 'Edit rates for all 6 services & 3 bundles — live site automatically syncs' },
    blog: { title: 'Blog Post Manager & Live Publisher', subtitle: 'Write, preview SERP snippets, and publish SEO articles directly to website' },
    invoice: { title: 'Estimate & Professional Invoice Studio', subtitle: 'Start with an Estimate or switch to Invoice/Tax Invoice — send directly on WhatsApp & Email' },
    storage: { title: 'Persistent Storage & GitHub Sync', subtitle: 'Sync Rates, Leads, Analytics & Blogs with your GitHub repository + JSON backups' }
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
      switchTab(btn.getAttribute('data-tab'));
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
  const analytics = getAnalyticsData();
  const leads = getLeadsData();

  const kpiViews = document.getElementById('kpiTotalViews');
  const kpiLeads = document.getElementById('kpiTotalLeads');
  const kpiWa = document.getElementById('kpiWaClicks');
  const kpiCalls = document.getElementById('kpiCallClicks');
  const kpiRate = document.getElementById('kpiConversionRate');

  const totalLeadsCount = leads.length;
  const convRate = (((totalLeadsCount + (analytics.whatsappClicks || 0)) / Math.max(analytics.totalViews || 100, 100)) * 100).toFixed(1);

  if (kpiViews) kpiViews.textContent = (analytics.totalViews || 0).toLocaleString();
  if (kpiLeads) kpiLeads.textContent = totalLeadsCount;
  if (kpiWa) kpiWa.textContent = analytics.whatsappClicks || 0;
  if (kpiCalls) kpiCalls.textContent = analytics.callClicks || 0;
  if (kpiRate) kpiRate.textContent = `${convRate}%`;

  const leadBadge = document.getElementById('navLeadsBadge');
  if (leadBadge) leadBadge.textContent = totalLeadsCount;

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
    { name: 'WhatsApp Direct Inquiries', count: analytics.whatsappClicks || 0, color: '#25D366' },
    { name: 'Direct Phone Calls', count: analytics.callClicks || 0, color: '#3B82F6' },
    { name: 'Free Audit Form Submissions', count: leads.length, color: '#D2FA15' },
    { name: 'Service Page Explorations', count: analytics.serviceClicks || 0, color: '#A855F7' }
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
      text = `Visitor clicked WhatsApp CTA on <strong>${escapeHtml((e.meta && e.meta.page) || 'Home')}</strong>`;
    } else if (e.type === 'call_click') {
      icon = '📞';
      text = `Visitor clicked Direct Call link on <strong>${escapeHtml((e.meta && e.meta.page) || 'Services')}</strong>`;
    } else if (e.type === 'lead_form_submit' || e.type === 'audit_modal_submit') {
      icon = '🎯';
      text = `New Lead Form: <strong>${escapeHtml((e.meta && e.meta.name) || 'Client')}</strong> (${escapeHtml((e.meta && e.meta.service) || 'SEO')})`;
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
let renderLeadsFn = () => {};

function initLeadsCrm() {
  const tableBody = document.getElementById('leadsTableBody');
  const searchInput = document.getElementById('leadSearchInput');
  const statusFilter = document.getElementById('leadStatusFilter');
  const exportBtn = document.getElementById('exportLeadsCsvBtn');
  const syncGithubBtn = document.getElementById('syncLeadsGithubBtn');
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
      const matchesStatus = filter === 'all' || (item.status || '').toLowerCase() === filter.toLowerCase();
      return matchesQuery && matchesStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: var(--admin-text-muted);">
            No client leads found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(lead => {
      const dateStr = new Date(lead.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name || '')}%2C%20thank%20you%20for%20contacting%20The%20Digital%20Marketings.%20I%20am%20Sabir%20Ajmeri%20(Founder).%20Let's%20discuss%20your%20${encodeURIComponent(lead.service || 'Digital Marketing')}%20growth%20roadmap.`;

      return `
        <tr>
          <td>
            <div class="lead-name-cell">
              <span class="lead-name">${escapeHtml(lead.name)}</span>
              <span class="lead-email">${escapeHtml(lead.email || 'No email provided')}</span>
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--admin-text-main);">${escapeHtml(lead.phone)}</div>
            <a href="${escapeHtml(lead.website || '#')}" target="_blank" style="font-size: 0.75rem; color: var(--admin-primary);">${escapeHtml(lead.website || 'N/A')}</a>
          </td>
          <td>
            <div style="font-weight: 600;">${escapeHtml(lead.service)}</div>
            <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${escapeHtml(lead.keywords || 'No keywords')}</div>
          </td>
          <td>
            <span style="font-size: 0.78rem;">${dateStr}</span>
            <div style="font-size: 0.72rem; color: var(--admin-text-muted);">Page: ${escapeHtml(lead.source || 'Direct')}</div>
          </td>
          <td>
            <select class="admin-select lead-status-select" data-id="${escapeHtml(lead.id)}" style="padding: 4px 8px; font-size: 0.78rem; width: auto;">
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
              <button class="btn-secondary delete-lead-btn" data-id="${escapeHtml(lead.id)}" style="padding: 4px 8px; font-size: 0.78rem; color: #EF4444;" title="Delete Lead">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.lead-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        const current = getLeadsData();
        const found = current.find(l => l.id === id);
        if (found) {
          found.status = newStatus;
          saveLeadsData(current);
          showAdminToast(`Updated status for ${found.name} → ${newStatus}`);
        }
      });
    });

    document.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this lead record?')) {
          let current = getLeadsData();
          current = current.filter(l => l.id !== id);
          saveLeadsData(current);
          renderLeads();
          showAdminToast('Lead deleted.');
        }
      });
    });
  }

  renderLeadsFn = renderLeads;
  renderLeads();

  if (searchInput) searchInput.addEventListener('input', renderLeads);
  if (statusFilter) statusFilter.addEventListener('change', renderLeads);

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const leads = getLeadsData();
      if (!leads.length) {
        showAdminToast('No leads data to export.', true);
        return;
      }
      const headers = ['ID', 'Name', 'Phone', 'Email', 'Website', 'Service', 'Keywords', 'Notes', 'Date', 'Status'];
      const rows = leads.map(l => [
        `"${l.id}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.website || '').replace(/"/g, '""')}"`,
        `"${(l.service || '').replace(/"/g, '""')}"`,
        `"${(l.keywords || '').replace(/"/g, '""')}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
        `"${l.date}"`,
        `"${l.status}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `TDM_Client_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (syncGithubBtn) {
    syncGithubBtn.addEventListener('click', async () => {
      try {
        syncGithubBtn.disabled = true;
        syncGithubBtn.textContent = '⏳ Syncing...';
        const leads = getLeadsData();
        const payload = {
          version: 1,
          updatedAt: new Date().toISOString(),
          leads
        };
        if (TDM_DIRECT_SERVER) {
          await postDirectApi('/api/save-leads', payload);
          showAdminToast('✓ CRM Leads direct server par save ho gayi (No Token)!');
        } else {
          await ghPutFile('data/leads.json', JSON.stringify(payload, null, 2) + '\n', 'Sync CRM leads from Admin');
          showAdminToast('✓ CRM Leads GitHub repo me save ho gayi!');
        }
      } catch (err) {
        showAdminToast(err.message, true);
      } finally {
        syncGithubBtn.disabled = false;
        syncGithubBtn.textContent = '☁️ Sync to GitHub';
      }
    });
  }

  if (manualLeadForm) {
    manualLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('manualName').value.trim();
      const phone = document.getElementById('manualPhone').value.trim();
      const email = document.getElementById('manualEmail').value.trim();
      const service = document.getElementById('manualService').value;
      const notes = document.getElementById('manualNotes').value.trim();

      if (!name || !phone) {
        showAdminToast('Please provide at least Client Name and Phone number.', true);
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
      populateInvoiceCrmPicker();
      manualLeadForm.reset();
      showAdminToast('✓ Client lead added to CRM!');
    });
  }
}

/* --------------------------------------------------------------------------
   6. Live Website Rates & Pricing Manager
   -------------------------------------------------------------------------- */
let renderPricingEditorFn = () => {};

function initPricingManager() {
  const currencyEl = document.getElementById('cfgCurrency');
  const discountEl = document.getElementById('cfgBundleDiscount');
  const seoSprintEl = document.getElementById('cfgSeoSprintPrice');
  const webhookEl = document.getElementById('cfgLeadWebhook');
  const servicesGrid = document.getElementById('coreServicesRatesGrid');
  const bundlesGrid = document.getElementById('comboBundlesRatesGrid');
  const lastUpdatedEl = document.getElementById('pricingLastUpdatedNote');

  const saveLocalBtn = document.getElementById('saveRatesLocalBtn');
  const publishLiveBtn = document.getElementById('publishRatesLiveBtn');
  const resetRatesBtn = document.getElementById('resetRatesBtn');

  if (!servicesGrid || !bundlesGrid) return;

  function renderPricingEditor() {
    const cfg = getSiteConfig();
    if (currencyEl) currencyEl.value = cfg.currency || '₹';
    if (discountEl) discountEl.value = cfg.bundleDiscountPercent ?? 15;
    if (seoSprintEl) seoSprintEl.value = cfg.seoSprintPrice ?? 14999;
    if (webhookEl) webhookEl.value = cfg.leadWebhookUrl || '';
    if (lastUpdatedEl) {
      const ghCfg = getGhSettings();
      const ghNote = TDM_DIRECT_SERVER
        ? '✅ Direct Server Mode Active — Bina kisi GitHub Token ke seedha save hoga.'
        : (ghCfg.token
          ? '✅ GitHub Sync Connected — "Save & Publish Live" dabane par live website par sabhi visitors ko dikhega.'
          : '⚠️ Sirf is browser me save hoga (Bina token ke direct chalane ke liye start-admin.bat chalayein, ya GitHub Token me Contents: Read & write on karein).');
      const timeNote = cfg.updatedAt
        ? `Last updated: ${new Date(cfg.updatedAt).toLocaleString('en-IN')}`
        : 'Default configuration loaded';
      lastUpdatedEl.innerHTML = `${escapeHtml(timeNote)} • <span>${ghNote}</span>`;
    }

    const cur = cfg.currency || '₹';

    servicesGrid.innerHTML = cfg.services.map((srv, idx) => `
      <div class="rate-editor-card" data-service-idx="${idx}">
        <div class="rate-card-top">
          <span class="rate-card-id">${escapeHtml(srv.id)}</span>
          <span class="rate-card-preview" id="srvPreview-${idx}">${escapeHtml(srv.prefix || '')}${escapeHtml(cur)}${Number(srv.price || 0).toLocaleString('en-IN')} <small style="font-size:0.74rem; color:var(--admin-text-muted);">${escapeHtml(srv.unit || '')}</small></span>
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
          <label class="admin-label">Service Title</label>
          <input type="text" class="admin-input srv-name-input" value="${escapeHtml(srv.name)}">
        </div>
        <div class="form-grid-2">
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Rate (${escapeHtml(cur)})</label>
            <input type="number" class="admin-input srv-price-input" min="0" step="1" value="${Number(srv.price || 0)}">
          </div>
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Billing Unit</label>
            <input type="text" class="admin-input srv-unit-input" value="${escapeHtml(srv.unit || '/ monthly')}">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Prefix (optional)</label>
            <input type="text" class="admin-input srv-prefix-input" placeholder="e.g. Starting from " value="${escapeHtml(srv.prefix || '')}">
          </div>
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Note (optional)</label>
            <input type="text" class="admin-input srv-note-input" placeholder="(Ad Budget Excluded)" value="${escapeHtml(srv.note || '')}">
          </div>
        </div>
      </div>
    `).join('');

    bundlesGrid.innerHTML = cfg.bundles.map((bnd, idx) => `
      <div class="rate-editor-card" data-bundle-idx="${idx}">
        <div class="rate-card-top">
          <span class="rate-card-id">${escapeHtml(bnd.id)}</span>
          <span class="rate-card-preview" id="bndPreview-${idx}">${escapeHtml(cur)}${Number(bnd.price || 0).toLocaleString('en-IN')} <span style="text-decoration:line-through; opacity:0.5; font-size:0.8rem;">${escapeHtml(cur)}${Number(bnd.originalPrice || 0).toLocaleString('en-IN')}</span></span>
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
          <label class="admin-label">Bundle Name</label>
          <input type="text" class="admin-input bnd-name-input" value="${escapeHtml(bnd.name)}">
        </div>
        <div class="form-grid-3">
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Offer Price</label>
            <input type="number" class="admin-input bnd-price-input" min="0" step="1" value="${Number(bnd.price || 0)}">
          </div>
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">MRP (Strike)</label>
            <input type="number" class="admin-input bnd-orig-input" min="0" step="1" value="${Number(bnd.originalPrice || 0)}">
          </div>
          <div class="admin-form-group" style="margin-bottom:0;">
            <label class="admin-label">Unit</label>
            <input type="text" class="admin-input bnd-unit-input" value="${escapeHtml(bnd.unit || '/ month')}">
          </div>
        </div>
      </div>
    `).join('');

    let autoSaveTimer = null;
    function scheduleAutoSaveLocal() {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        const cfg = collectPricingFormData();
        saveSiteConfigLocal(cfg);
      }, 200);
    }

    // Live preview updates + auto-save locally as user types
    servicesGrid.querySelectorAll('.rate-editor-card').forEach(card => {
      const idx = card.getAttribute('data-service-idx');
      const updateCardPreview = () => {
        const curSym = currencyEl ? currencyEl.value : '₹';
        const price = Number(card.querySelector('.srv-price-input').value || 0);
        const unit = card.querySelector('.srv-unit-input').value;
        const prefix = card.querySelector('.srv-prefix-input').value;
        const pv = document.getElementById(`srvPreview-${idx}`);
        if (pv) {
          pv.innerHTML = `${escapeHtml(prefix)}${escapeHtml(curSym)}${price.toLocaleString('en-IN')} <small style="font-size:0.74rem; color:var(--admin-text-muted);">${escapeHtml(unit)}</small>`;
        }
        scheduleAutoSaveLocal();
      };
      card.querySelectorAll('input').forEach(inp => inp.addEventListener('input', updateCardPreview));
    });

    bundlesGrid.querySelectorAll('.rate-editor-card').forEach(card => {
      const idx = card.getAttribute('data-bundle-idx');
      const updateBundlePreview = () => {
        const curSym = currencyEl ? currencyEl.value : '₹';
        const price = Number(card.querySelector('.bnd-price-input').value || 0);
        const orig = Number(card.querySelector('.bnd-orig-input').value || 0);
        const pv = document.getElementById(`bndPreview-${idx}`);
        if (pv) {
          pv.innerHTML = `${escapeHtml(curSym)}${price.toLocaleString('en-IN')} <span style="text-decoration:line-through; opacity:0.5; font-size:0.8rem;">${escapeHtml(curSym)}${orig.toLocaleString('en-IN')}</span>`;
        }
        scheduleAutoSaveLocal();
      };
      card.querySelectorAll('input').forEach(inp => inp.addEventListener('input', updateBundlePreview));
    });

    [discountEl, seoSprintEl, webhookEl].forEach(el => {
      if (el) el.addEventListener('input', scheduleAutoSaveLocal);
    });
  }

  function collectPricingFormData() {
    const baseCfg = getSiteConfig();
    baseCfg.currency = currencyEl ? currencyEl.value : '₹';
    baseCfg.bundleDiscountPercent = Math.max(0, Math.min(90, Number(discountEl ? discountEl.value : 15) || 0));
    baseCfg.seoSprintPrice = Math.max(0, Number(seoSprintEl ? seoSprintEl.value : 14999) || 0);
    baseCfg.leadWebhookUrl = webhookEl ? webhookEl.value.trim() : '';

    servicesGrid.querySelectorAll('.rate-editor-card').forEach(card => {
      const idx = Number(card.getAttribute('data-service-idx'));
      if (!baseCfg.services[idx]) return;
      baseCfg.services[idx].name = card.querySelector('.srv-name-input').value.trim() || baseCfg.services[idx].name;
      baseCfg.services[idx].price = Math.max(0, Number(card.querySelector('.srv-price-input').value || 0));
      baseCfg.services[idx].unit = card.querySelector('.srv-unit-input').value.trim();
      baseCfg.services[idx].shortUnit = baseCfg.services[idx].unit === 'starting' ? ' starting' : '/mo';
      baseCfg.services[idx].prefix = card.querySelector('.srv-prefix-input').value;
      baseCfg.services[idx].note = card.querySelector('.srv-note-input').value.trim();
    });

    bundlesGrid.querySelectorAll('.rate-editor-card').forEach(card => {
      const idx = Number(card.getAttribute('data-bundle-idx'));
      if (!baseCfg.bundles[idx]) return;
      baseCfg.bundles[idx].name = card.querySelector('.bnd-name-input').value.trim() || baseCfg.bundles[idx].name;
      baseCfg.bundles[idx].price = Math.max(0, Number(card.querySelector('.bnd-price-input').value || 0));
      baseCfg.bundles[idx].originalPrice = Math.max(0, Number(card.querySelector('.bnd-orig-input').value || 0));
      baseCfg.bundles[idx].unit = card.querySelector('.bnd-unit-input').value.trim();
    });

    return baseCfg;
  }

  renderPricingEditorFn = renderPricingEditor;
  renderPricingEditor();

  if (currencyEl) {
    currencyEl.addEventListener('change', () => {
      const cfg = collectPricingFormData();
      saveSiteConfigLocal(cfg);
      renderPricingEditor();
    });
  }

  if (saveLocalBtn) {
    saveLocalBtn.addEventListener('click', () => {
      const cfg = collectPricingFormData();
      saveSiteConfigLocal(cfg);
      renderPricingEditor();
      showAdminToast('✓ Rates saved locally! Public website pages is browser me turant update ho gayi.');
    });
  }

  if (publishLiveBtn) {
    publishLiveBtn.addEventListener('click', async () => {
      const statusBox = document.getElementById('pricingPublishStatus');
      const setStatus = (msg, type) => {
        if (!statusBox) return;
        statusBox.style.display = 'block';
        if (type === 'loading') {
          statusBox.style.background = 'rgba(59, 130, 246, 0.12)';
          statusBox.style.border = '1px solid rgba(59, 130, 246, 0.35)';
          statusBox.style.color = '#93C5FD';
        } else if (type === 'error') {
          statusBox.style.background = 'rgba(239, 68, 68, 0.12)';
          statusBox.style.border = '1px solid rgba(239, 68, 68, 0.35)';
          statusBox.style.color = '#FCA5A5';
        } else {
          statusBox.style.background = 'rgba(16, 185, 129, 0.12)';
          statusBox.style.border = '1px solid rgba(16, 185, 129, 0.35)';
          statusBox.style.color = '#6EE7B7';
        }
        statusBox.textContent = msg;
      };

      const cfg = collectPricingFormData();
      saveSiteConfigLocal(cfg);
      renderPricingEditor();
      try {
        publishLiveBtn.disabled = true;
        publishLiveBtn.textContent = '⏳ Publishing...';
        if (TDM_DIRECT_SERVER) {
          setStatus('⏳ Direct server par rates save ho rahe hain...', 'loading');
          await postDirectApi('/api/save-config', cfg);
          setStatus('✅ Direct Server par rates save ho gaye! Bina kisi token ke website turant update ho gayi.', 'success');
          showAdminToast('✅ Rates direct server par save ho gaye!');
        } else {
          setStatus('⏳ GitHub par live rates save ho rahe hain...', 'loading');
          await ghPutFile(
            'data/site-config.json',
            JSON.stringify(cfg, null, 2) + '\n',
            'Update live service rates & pricing via Admin Panel'
          );
          setStatus('✅ Live Website par publish ho gaya! GitHub Pages 30–60 seconds me update ho jayega, phir sabhi devices par naye rates dikhenge.', 'success');
          showAdminToast('🚀 Live Rates GitHub repo me publish ho gaye!');
        }
      } catch (err) {
        setStatus(`❌ Publish nahi hua: ${err.message}`, 'error');
        showAdminToast(`Publish failed: ${err.message}`, true);
      } finally {
        publishLiveBtn.disabled = false;
        publishLiveBtn.innerHTML = '<span>🚀 Save &amp; Publish Live (GitHub)</span>';
      }
    });
  }

  if (resetRatesBtn) {
    resetRatesBtn.addEventListener('click', async () => {
      const repoCfg = await fetchRepoJsonRelative('data/site-config.json');
      if (repoCfg && Array.isArray(repoCfg.services)) {
        localStorage.setItem(TDM_ADMIN_KEYS.SITE_CONFIG, JSON.stringify(repoCfg));
        renderPricingEditor();
        populateInvoiceServicePicker();
        showAdminToast('✓ Repo ke latest rates reload ho gaye.');
      } else {
        showAdminToast('data/site-config.json load nahi ho paya (live server ya GitHub pull use karein).', true);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. Blog Manager, SEO SERP Snippet & Live Publishing
   -------------------------------------------------------------------------- */
let renderPublishedBlogsFn = () => {};

function initBlogManager() {
  const titleInput = document.getElementById('blogTitle');
  const slugInput = document.getElementById('blogSlug');
  const descInput = document.getElementById('blogExcerpt');
  const catInput = document.getElementById('blogCategory');
  const authorInput = document.getElementById('blogAuthor');
  const readTimeInput = document.getElementById('blogReadTime');
  const keywordsInput = document.getElementById('blogKeywords');
  const imageInput = document.getElementById('blogImage');
  const contentInput = document.getElementById('blogContent');

  const serpTitle = document.getElementById('serpPreviewTitle');
  const serpUrl = document.getElementById('serpPreviewUrl');
  const serpDesc = document.getElementById('serpPreviewDesc');
  const titleCount = document.getElementById('titleCharCount');
  const descCount = document.getElementById('descCharCount');

  const publishLiveBtn = document.getElementById('publishBlogLiveBtn');
  const generateHtmlBtn = document.getElementById('generateBlogHtmlBtn');
  const exportPreviewModal = document.getElementById('blogExportModal');
  const generatedCodeEl = document.getElementById('generatedHtmlCode');
  const downloadHtmlBtn = document.getElementById('downloadBlogHtmlFileBtn');
  const copyCodeBtn = document.getElementById('copyBlogHtmlCodeBtn');
  const dynamicListEl = document.getElementById('dynamicPublishedBlogsList');

  function updateSerp() {
    const titleVal = titleInput ? titleInput.value.trim() : '';
    const descVal = descInput ? descInput.value.trim() : '';
    const slugVal = slugInput ? slugInput.value.trim() : '';

    if (serpTitle) {
      serpTitle.textContent = titleVal ? `${titleVal} | The Digital Marketings` : 'Your Blog Title Tag Here | The Digital Marketings';
    }
    if (serpUrl) {
      serpUrl.innerHTML = `https://thedigitalmarketings.com › <span style="color:#bdc1c6">${escapeHtml(slugVal || 'blog-slug-name')}.html</span>`;
    }
    if (serpDesc) {
      serpDesc.textContent = descVal || 'Write your compelling meta description here to achieve high click-through rates on Google search results...';
    }

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
      if (slugInput && !slugInput.dataset.manualEdited) {
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

  if (descInput) descInput.addEventListener('input', updateSerp);

  function getFormBlogMeta() {
    const title = (titleInput ? titleInput.value.trim() : '') || 'Accelerate Your Business with 360 Digital Marketing';
    const rawSlug = (slugInput ? slugInput.value.trim() : '') || 'blog-digital-growth-guide';
    const slug = rawSlug.replace(/\.html$/i, '').replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
    const desc = (descInput ? descInput.value.trim() : '') || 'Actionable digital marketing strategies from Ahmedabad top agency.';
    const cat = (catInput ? catInput.value : '') || 'SEO & Growth';
    const author = (authorInput ? authorInput.value.trim() : '') || 'Sabir Ajmeri - Founder & CEO';
    const readTime = (readTimeInput ? readTimeInput.value.trim() : '') || '6 min read';
    const keywords = (keywordsInput ? keywordsInput.value.trim() : '') || 'seo marketing, fast ranking, digital agency';
    const image = (imageInput ? imageInput.value : '') || 'assets/seo_ranking_guide.jpg';
    const rawContent = (contentInput ? contentInput.value.trim() : '') || `
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
    const plainWords = rawContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    return { title, slug, desc, cat, author, readTime, keywords, image, rawContent, wordCount: plainWords };
  }

  function buildCompleteBlogHtml() {
    const b = getFormBlogMeta();
    const schemaJson = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.desc,
      image: `https://thedigitalmarketings.com/${b.image}`,
      author: { '@type': 'Person', name: b.author },
      publisher: {
        '@type': 'Organization',
        name: 'The Digital Marketings',
        logo: 'https://thedigitalmarketings.com/assets/logo.png'
      },
      datePublished: new Date().toISOString().slice(0, 10)
    }, null, 2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${escapeHtml(b.title)} | The Digital Marketings</title>
  <meta name="description" content="${escapeHtml(b.desc)}">
  <meta name="keywords" content="${escapeHtml(b.keywords)}">
  <meta name="author" content="${escapeHtml(b.author)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://thedigitalmarketings.com/${escapeHtml(b.slug)}.html">

  <meta property="og:title" content="${escapeHtml(b.title)}">
  <meta property="og:description" content="${escapeHtml(b.desc)}">
  <meta property="og:url" content="https://thedigitalmarketings.com/${escapeHtml(b.slug)}.html">
  <meta property="og:image" content="https://thedigitalmarketings.com/${escapeHtml(b.image)}">

  <link rel="icon" type="image/png" href="assets/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">

  <script type="application/ld+json">
  ${schemaJson}
  </script>
</head>
<body>
  <div class="glow-orb glow-orb-1" aria-hidden="true"></div>
  <div class="glow-orb glow-orb-2" aria-hidden="true"></div>

  <header class="main-header" id="header">
    <div class="container nav-container">
      <a href="index.html" class="brand-logo">
        <img src="assets/logo.png" alt="The Digital Marketings" class="logo-img" onerror="this.src='assets/logo.svg'">
      </a>
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="about.html" class="nav-link">About Us</a></li>
          <li><a href="services.html" class="nav-link">Services</a></li>
          <li><a href="blog.html" class="nav-link active">Blog</a></li>
          <li><a href="pricing.html" class="nav-link">Pricing</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <a href="https://wa.me/919316954389" target="_blank" rel="noopener" class="btn btn-primary nav-cta">Get Free Audit</a>
    </div>
  </header>

  <main class="blog-detail-section" style="padding: 120px 0 60px 0;">
    <div class="container" style="max-width: 860px;">
      <div class="blog-meta-badge" style="display: inline-block; padding: 6px 14px; background: rgba(210,250,21,0.12); color: #D2FA15; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; margin-bottom: 16px;">
        ${escapeHtml(b.cat.toUpperCase())} • ${escapeHtml(b.readTime)}
      </div>
      <h1 style="font-size: 2.6rem; line-height: 1.2; margin-bottom: 20px;">${escapeHtml(b.title)}</h1>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #A0AEC0; font-size: 0.9rem;">
        <span>✍️ Written by <strong>${escapeHtml(b.author)}</strong></span>
        <span>•</span>
        <span>📅 ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" style="width: 100%; border-radius: 16px; margin-bottom: 32px; max-height: 420px; object-fit: cover;">

      <div class="blog-article-body" style="font-size: 1.1rem; line-height: 1.8; color: #E2E8F0;">
        ${b.rawContent}
      </div>

      <div style="background: linear-gradient(135deg, #141822, #1A202C); border: 1px solid rgba(210,250,21,0.25); border-radius: 16px; padding: 36px; margin: 50px 0; text-align: center;">
        <h3 style="font-size: 1.6rem; margin-bottom: 12px;">Ready to Scale Your Website to Google Page #1?</h3>
        <p style="color: #A0AEC0; margin-bottom: 24px;">Get a comprehensive 360° SEO & Keyword roadmap customized for your business by Founder Sabir Ajmeri.</p>
        <a href="https://wa.me/919316954389?text=Hi%20Sabir%2C%20I%20read%20your%20blog%20about%20${encodeURIComponent(b.title)}%20and%20want%20to%20rank%20my%20website." target="_blank" rel="noopener" class="btn btn-primary" style="padding: 12px 28px; font-weight: 700;">
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

  function renderPublishedBlogsList() {
    if (!dynamicListEl) return;
    const blogsData = getBlogsData();
    const posts = blogsData.posts || [];
    if (!posts.length) {
      dynamicListEl.innerHTML = `<div style="font-size:0.8rem; color:var(--admin-text-muted);">No custom blogs published yet. Upar form bhar kar "Publish Live to Website" par click karein.</div>`;
      return;
    }

    dynamicListEl.innerHTML = posts.map(post => `
      <div class="dynamic-blog-item">
        <div style="min-width:0;">
          <a href="${escapeHtml(post.url)}" target="_blank" style="color:var(--admin-primary); font-weight:700; text-decoration:none; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            🚀 ${escapeHtml(post.title)}
          </a>
          <span style="font-size:0.74rem; color:var(--admin-text-muted);">${escapeHtml(post.category)} • ${escapeHtml(post.url)}</span>
        </div>
        <button type="button" class="btn-secondary delete-dynamic-blog-btn" data-id="${escapeHtml(post.id)}" style="padding:4px 8px; color:#EF4444;">🗑️</button>
      </div>
    `).join('');

    dynamicListEl.querySelectorAll('.delete-dynamic-blog-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Remove this blog post from website listing?')) return;
        const data = getBlogsData();
        data.posts = data.posts.filter(p => p.id !== id);
        saveBlogsDataLocal(data);
        renderPublishedBlogsList();
        await maybeAutoSyncFile('data/blogs.json', data, 'Remove blog post from listing');
        showAdminToast('Blog removed from listing.');
      });
    });
  }

  renderPublishedBlogsFn = renderPublishedBlogsList;
  renderPublishedBlogsList();

  if (publishLiveBtn) {
    publishLiveBtn.addEventListener('click', async () => {
      const b = getFormBlogMeta();
      const htmlCode = buildCompleteBlogHtml();
      const postEntry = {
        id: 'BLOG-' + Date.now(),
        slug: b.slug,
        url: `${b.slug}.html`,
        title: b.title,
        excerpt: b.desc,
        category: b.cat,
        author: b.author,
        readTime: b.readTime,
        image: b.image,
        wordCount: b.wordCount,
        date: new Date().toISOString(),
        htmlContent: htmlCode
      };

      const blogsData = getBlogsData();
      const existingIdx = blogsData.posts.findIndex(p => p.slug === b.slug);
      if (existingIdx >= 0) {
        blogsData.posts[existingIdx] = postEntry;
      } else {
        blogsData.posts.unshift(postEntry);
      }

      // Store lightweight listing metadata in repo blogs.json (HTML gets its own file)
      const repoBlogsPayload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        posts: blogsData.posts.map(({ htmlContent, ...meta }) => meta)
      };

      saveBlogsDataLocal({ ...repoBlogsPayload, posts: blogsData.posts });
      renderPublishedBlogsList();

      if (TDM_DIRECT_SERVER) {
        try {
          publishLiveBtn.disabled = true;
          publishLiveBtn.textContent = '⏳ Publishing...';
          await postDirectApi('/api/publish-blog', {
            slug: b.slug,
            htmlContent: htmlCode,
            blogsCatalog: repoBlogsPayload
          });
          showAdminToast(`🚀 Blog "${b.slug}.html" bina token ke direct server par publish ho gaya!`);
        } catch (err) {
          showAdminToast(`Direct blog publish fail hua: ${err.message}`, true);
        } finally {
          publishLiveBtn.disabled = false;
          publishLiveBtn.innerHTML = '<span>🚀 Publish Live to Website</span>';
        }
        return;
      }

      const ghCfg = getGhSettings();
      if (!ghCfg.token) {
        showAdminToast('✓ Blog saved locally (blog.html par dikhega). Live sabhi visitors ke liye GitHub Sync tab me token add karein.');
        return;
      }

      try {
        publishLiveBtn.disabled = true;
        publishLiveBtn.textContent = '⏳ Publishing to GitHub...';
        await ghPutFile(`${b.slug}.html`, htmlCode, `Publish blog article: ${b.title}`);
        await ghPutFile('data/blogs.json', JSON.stringify(repoBlogsPayload, null, 2) + '\n', `Update blog catalog with ${b.slug}`);
        showAdminToast(`🚀 Blog "${b.slug}.html" aur blog.html live website par publish ho gaya!`);
      } catch (err) {
        showAdminToast(`Local saved, lekin GitHub publish fail hua: ${err.message}`, true);
      } finally {
        publishLiveBtn.disabled = false;
        publishLiveBtn.innerHTML = '<span>🚀 Publish Live to Website</span>';
      }
    });
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
      const b = getFormBlogMeta();
      const htmlCode = buildCompleteBlogHtml();
      const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${b.slug}.html`;
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
        setTimeout(() => { copyCodeBtn.textContent = '📋 Copy HTML Code'; }, 2000);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Estimate & Professional Invoice Studio (CRM + WhatsApp + Email + PDF)
   -------------------------------------------------------------------------- */
let renderSavedInvoicesFn = () => {};

function populateInvoiceServicePicker() {
  const picker = document.getElementById('invLoadServiceSelect');
  if (!picker) return;
  const cfg = getSiteConfig();

  const serviceOptions = cfg.services.map(s => `<option value="srv:${escapeHtml(s.id)}">${escapeHtml(s.name)} (${escapeHtml(cfg.currency)}${Number(s.price).toLocaleString('en-IN')})</option>`).join('');
  const bundleOptions = cfg.bundles.map(b => `<option value="bnd:${escapeHtml(b.id)}">${escapeHtml(b.name)} (${escapeHtml(cfg.currency)}${Number(b.price).toLocaleString('en-IN')})</option>`).join('');

  picker.innerHTML = `
    <option value="">+ Quick Add Live Service Rate...</option>
    <optgroup label="6 Core Services">${serviceOptions}</optgroup>
    <optgroup label="Combo Bundles">${bundleOptions}</optgroup>
  `;
}

function populateInvoiceCrmPicker() {
  const crmPicker = document.getElementById('invCrmClientSelect');
  if (!crmPicker) return;
  const leads = getLeadsData();
  const options = leads.map(l => `<option value="${escapeHtml(l.id)}">${escapeHtml(l.name)} (${escapeHtml(l.phone || 'No phone')})</option>`).join('');
  crmPicker.innerHTML = `<option value="">-- Select CRM Lead --</option>${options}`;
}

function formatInvoiceDate(date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initInvoiceGenerator() {
  const itemsContainer = document.getElementById('invoiceItemsTableBody');
  const addRowBtn = document.getElementById('invAddRowBtn');
  const printBtn = document.getElementById('invPrintBtn');
  const docTypeSelect = document.getElementById('invDocTypeSelect');
  const crmClientSelect = document.getElementById('invCrmClientSelect');
  const currencySelect = document.getElementById('invCurrencySelect');
  const discountInput = document.getElementById('invDiscountPercent');
  const advanceInput = document.getElementById('invAdvancePaidInput');
  const statusSelect = document.getElementById('invPaymentStatusSelect');
  const includeTaxToggle = document.getElementById('invIncludeTaxToggle');
  const servicePicker = document.getElementById('invLoadServiceSelect');

  const newDocBtn = document.getElementById('invNewDocBtn');
  const saveDocBtn = document.getElementById('invSaveDocBtn');
  const sendWaBtn = document.getElementById('invSendWhatsAppBtn');
  const sendEmailBtn = document.getElementById('invSendEmailBtn');

  const badgeTitleEl = document.getElementById('invDocBadgeTitle');
  const paperStatusPill = document.getElementById('invPaperStatusPill');
  const numberLabelEl = document.getElementById('invNumberLabel');
  const docNumberEl = document.getElementById('invDocNumber');
  const dateLabelEl = document.getElementById('invDateLabel');
  const docDateEl = document.getElementById('invDocDate');
  const dueLabelEl = document.getElementById('invDueLabel');
  const dueDateEl = document.getElementById('invDueDate');
  const gstinRowEl = document.getElementById('invGstinRow');
  const gstinValEl = document.getElementById('invGstinVal');
  const billToHeadingEl = document.getElementById('invBillToHeading');
  const footerDocNoteEl = document.getElementById('invFooterDocNote');

  const clientNameEl = document.getElementById('invClientName');
  const clientAttnEl = document.getElementById('invClientAttn');
  const clientAddressEl = document.getElementById('invClientAddress');
  const clientPhoneEl = document.getElementById('invClientPhone');
  const clientEmailEl = document.getElementById('invClientEmail');
  const projectTitleEl = document.getElementById('invProjectTitle');
  const paymentModeEl = document.getElementById('invPaymentMode');
  const paymentTermsEl = document.getElementById('invPaymentTerms');

  const subtotalEl = document.getElementById('invSubtotalVal');
  const discountRowEl = document.getElementById('invDiscountRow');
  const discountPctLabelEl = document.getElementById('invDiscountPctLabel');
  const discountValEl = document.getElementById('invDiscountVal');
  const taxableRowEl = document.getElementById('invTaxableRow');
  const taxableValEl = document.getElementById('invTaxableVal');
  const taxSummaryRowEl = document.getElementById('invTaxSummaryRow');
  const taxEl = document.getElementById('invTaxVal');
  const grandTotalLabelEl = document.getElementById('invGrandTotalLabel');
  const grandTotalEl = document.getElementById('invGrandTotalVal');
  const advanceRowEl = document.getElementById('invAdvanceRow');
  const advanceValEl = document.getElementById('invAdvanceVal');
  const balanceRowEl = document.getElementById('invBalanceRow');
  const balanceValEl = document.getElementById('invBalanceVal');
  const wordsEl = document.getElementById('invAmountInWords');
  const savedTableBody = document.getElementById('savedInvoicesTableBody');

  if (!itemsContainer) return;

  const DOC_TYPE_META = {
    ESTIMATE: {
      badge: 'ESTIMATE',
      prefix: 'TDM-EST',
      numberLabel: 'Estimate #:',
      dateLabel: 'Estimate Date:',
      dueLabel: 'Valid Until:',
      billHeading: 'Prepared For (Client Details)',
      totalLabel: 'Estimated Total:',
      footerNote: 'This is an estimate valid for 7 days. Final invoice will be issued upon project confirmation.',
      defaultTerms: 'Valid for 7 days • 50% Advance to Start',
      defaultStatus: 'ESTIMATE',
      defaultTax: false
    },
    PROFORMA: {
      badge: 'PROFORMA INVOICE',
      prefix: 'TDM-PI',
      numberLabel: 'Proforma #:',
      dateLabel: 'Issue Date:',
      dueLabel: 'Due Date:',
      billHeading: 'Billed To (Client Details)',
      totalLabel: 'Proforma Total:',
      footerNote: 'Proforma invoice for advance initiation. Final invoice will follow upon payment.',
      defaultTerms: '50% Advance Payment • Net 7 Days',
      defaultStatus: 'UNPAID',
      defaultTax: false
    },
    INVOICE: {
      badge: 'INVOICE',
      prefix: 'TDM-INV',
      numberLabel: 'Invoice #:',
      dateLabel: 'Invoice Date:',
      dueLabel: 'Due Date:',
      billHeading: 'Billed To (Client Details)',
      totalLabel: 'Grand Total:',
      footerNote: 'Thank you for your business! Please share payment screenshot on +91 9316954389.',
      defaultTerms: 'Net 7 Days from invoice date',
      defaultStatus: 'UNPAID',
      defaultTax: false
    },
    TAX_INVOICE: {
      badge: 'TAX INVOICE',
      prefix: 'TDM-TAX',
      numberLabel: 'Tax Invoice #:',
      dateLabel: 'Invoice Date:',
      dueLabel: 'Due Date:',
      billHeading: 'Billed To (Client Details)',
      totalLabel: 'Grand Total:',
      footerNote: 'Tax invoice issued under GST. For billing support contact +91 9316954389.',
      defaultTerms: 'Net 7 Days from invoice date',
      defaultStatus: 'UNPAID',
      defaultTax: true
    }
  };

  let activeEditingDocId = null;

  populateInvoiceServicePicker();
  populateInvoiceCrmPicker();

  function generateNextDocNumber(docType) {
    const meta = DOC_TYPE_META[docType] || DOC_TYPE_META.ESTIMATE;
    const year = new Date().getFullYear();
    const count = getInvoicesData().filter(d => d.docType === docType).length + 1;
    return `${meta.prefix}-${year}-${String(count).padStart(3, '0')}`;
  }

  function applyTaxVisibility() {
    const taxOn = Boolean(includeTaxToggle && includeTaxToggle.checked);
    document.querySelectorAll('.inv-tax-col').forEach(el => {
      el.style.display = taxOn ? '' : 'none';
    });
    if (gstinRowEl) gstinRowEl.style.display = taxOn ? '' : 'none';
    if (taxSummaryRowEl) taxSummaryRowEl.style.display = taxOn ? 'flex' : 'none';
  }

  function syncStatusPill() {
    if (!paperStatusPill || !statusSelect) return;
    const st = statusSelect.value;
    const labels = {
      ESTIMATE: 'ESTIMATE',
      UNPAID: 'UNPAID',
      PARTIAL: 'PARTIAL PAID',
      PAID: 'PAID'
    };
    paperStatusPill.textContent = labels[st] || st;
    paperStatusPill.className = 'inv-paper-status-pill';
    if (st === 'PAID') paperStatusPill.classList.add('paid');
    else if (st === 'UNPAID') paperStatusPill.classList.add('unpaid');
    else if (st === 'ESTIMATE') paperStatusPill.classList.add('estimate');
  }

  function applyDocTypeUI(docType, resetNumberAndTax = true) {
    const meta = DOC_TYPE_META[docType] || DOC_TYPE_META.ESTIMATE;
    if (badgeTitleEl) badgeTitleEl.textContent = meta.badge;
    if (numberLabelEl) numberLabelEl.textContent = meta.numberLabel;
    if (dateLabelEl) dateLabelEl.textContent = meta.dateLabel;
    if (dueLabelEl) dueLabelEl.textContent = meta.dueLabel;
    if (billToHeadingEl) billToHeadingEl.textContent = meta.billHeading;
    if (grandTotalLabelEl) grandTotalLabelEl.textContent = meta.totalLabel;
    if (footerDocNoteEl) footerDocNoteEl.textContent = meta.footerNote;

    if (resetNumberAndTax) {
      if (docNumberEl) docNumberEl.textContent = generateNextDocNumber(docType);
      if (paymentTermsEl) paymentTermsEl.textContent = meta.defaultTerms;
      if (statusSelect) statusSelect.value = meta.defaultStatus;
      if (includeTaxToggle) includeTaxToggle.checked = meta.defaultTax;
    }

    syncStatusPill();
    applyTaxVisibility();
    calculateTotals();
  }

  function calculateTotals() {
    let subtotal = 0;
    let rawTaxTotal = 0;
    const currency = currencySelect ? currencySelect.value : '₹';
    const discountPct = Math.max(0, Math.min(100, parseFloat(discountInput ? discountInput.value : 0) || 0));
    const advancePaid = Math.max(0, parseFloat(advanceInput ? advanceInput.value : 0) || 0);
    const taxEnabled = Boolean(includeTaxToggle && includeTaxToggle.checked);

    const rows = itemsContainer.querySelectorAll('tr.inv-item-row');
    const items = [];
    rows.forEach(row => {
      const descEl = row.querySelector('.inv-item-desc');
      const qtyInput = row.querySelector('.inv-item-qty');
      const rateInput = row.querySelector('.inv-item-rate');
      const taxInput = row.querySelector('.inv-item-tax');
      const totalCol = row.querySelector('.inv-item-total');

      const desc = descEl ? descEl.textContent.trim() : 'Service';
      const qty = Math.max(1, parseFloat(qtyInput ? qtyInput.value : 1) || 1);
      const rate = Math.max(0, parseFloat(rateInput ? rateInput.value : 0) || 0);
      const taxRate = taxEnabled ? Math.max(0, parseFloat(taxInput ? taxInput.value : 0) || 0) : 0;

      const lineNet = qty * rate;
      const discountedLineNet = lineNet * (1 - discountPct / 100);
      const lineTax = discountedLineNet * (taxRate / 100);

      subtotal += lineNet;
      rawTaxTotal += lineTax;

      items.push({ desc, qty, rate, tax: parseFloat(taxInput ? taxInput.value : 0) || 0, lineNet });

      if (totalCol) {
        totalCol.textContent = `${currency} ${lineNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    });

    const discountAmount = subtotal * (discountPct / 100);
    const taxableTotal = Math.max(0, subtotal - discountAmount);
    const totalTax = taxEnabled ? rawTaxTotal : 0;
    const grandTotal = taxableTotal + totalTax;
    const balanceDue = Math.max(0, grandTotal - advancePaid);

    const fmt = (n) => `${currency} ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    if (discountRowEl) discountRowEl.style.display = discountPct > 0 ? 'flex' : 'none';
    if (discountPctLabelEl) discountPctLabelEl.textContent = String(discountPct);
    if (discountValEl) discountValEl.textContent = `- ${fmt(discountAmount)}`;

    if (taxableRowEl) taxableRowEl.style.display = (taxEnabled && discountPct > 0) ? 'flex' : 'none';
    if (taxableValEl) taxableValEl.textContent = fmt(taxableTotal);

    if (taxSummaryRowEl) taxSummaryRowEl.style.display = taxEnabled ? 'flex' : 'none';
    if (taxEl) taxEl.textContent = fmt(totalTax);

    if (grandTotalEl) grandTotalEl.textContent = fmt(grandTotal);

    if (advanceRowEl) advanceRowEl.style.display = advancePaid > 0 ? 'flex' : 'none';
    if (advanceValEl) advanceValEl.textContent = `- ${fmt(advancePaid)}`;
    if (balanceRowEl) balanceRowEl.style.display = advancePaid > 0 ? 'flex' : 'none';
    if (balanceValEl) balanceValEl.textContent = fmt(balanceDue);

    const wordsTarget = advancePaid > 0 ? balanceDue : grandTotal;
    if (wordsEl) {
      wordsEl.textContent = `${numberToWords(Math.round(wordsTarget))} Only (${currency})`;
    }

    return { subtotal, discountPct, discountAmount, taxableTotal, totalTax, grandTotal, advancePaid, balanceDue, currency, taxEnabled, items };
  }

  function createItemRow(desc = 'Website SEO (Search Engine Optimization)', qty = 1, rate = 4999, tax = 18) {
    const currency = currencySelect ? currencySelect.value : '₹';
    const taxOn = Boolean(includeTaxToggle && includeTaxToggle.checked);
    const tr = document.createElement('tr');
    tr.className = 'inv-item-row';
    tr.innerHTML = `
      <td>
        <div class="inv-table-input inv-item-desc" contenteditable="true" role="textbox" spellcheck="false">${escapeHtml(desc)}</div>
      </td>
      <td style="width: 70px; text-align: center;">
        <input type="number" class="inv-table-input inv-item-qty" value="${qty}" min="1" step="1">
      </td>
      <td style="width: 120px; text-align: right;">
        <input type="number" class="inv-table-input inv-item-rate" value="${rate}" min="0" step="100">
      </td>
      <td class="inv-tax-col" style="width: 80px; text-align: center; ${taxOn ? '' : 'display: none;'}">
        <input type="number" class="inv-table-input inv-item-tax" value="${tax}" min="0" step="1">
      </td>
      <td class="inv-item-total" style="width: 130px; text-align: right;">
        ${currency} ${(qty * rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td style="width: 36px; text-align: center;" class="no-print">
        <button type="button" class="inv-btn-remove-row" title="Remove Item">✕</button>
      </td>
    `;

    tr.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', () => {
        inp.setAttribute('value', inp.value);
        calculateTotals();
      });
    });

    const descDiv = tr.querySelector('.inv-item-desc');
    if (descDiv) descDiv.addEventListener('input', calculateTotals);

    tr.querySelector('.inv-btn-remove-row').addEventListener('click', () => {
      if (itemsContainer.querySelectorAll('tr.inv-item-row').length > 1) {
        tr.remove();
        calculateTotals();
      } else {
        showAdminToast('Kam se kam 1 service item hona zaroori hai.', true);
      }
    });

    return tr;
  }

  function setTodayDates() {
    const today = new Date();
    const due = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (docDateEl) docDateEl.textContent = formatInvoiceDate(today);
    if (dueDateEl) dueDateEl.textContent = formatInvoiceDate(due);
  }

  function getCurrentDocSnapshot() {
    const calc = calculateTotals();
    return {
      id: activeEditingDocId || ('DOC-' + Date.now()),
      docType: docTypeSelect ? docTypeSelect.value : 'ESTIMATE',
      docNumber: docNumberEl ? docNumberEl.textContent.trim() : '',
      docDate: docDateEl ? docDateEl.textContent.trim() : '',
      dueDate: dueDateEl ? dueDateEl.textContent.trim() : '',
      gstin: gstinValEl ? gstinValEl.textContent.trim() : '',
      clientName: clientNameEl ? clientNameEl.textContent.trim() : '',
      clientAttn: clientAttnEl ? clientAttnEl.textContent.trim() : '',
      clientAddress: clientAddressEl ? clientAddressEl.textContent.trim() : '',
      clientPhone: clientPhoneEl ? clientPhoneEl.textContent.trim() : '',
      clientEmail: clientEmailEl ? clientEmailEl.textContent.trim() : '',
      projectTitle: projectTitleEl ? projectTitleEl.textContent.trim() : '',
      paymentMode: paymentModeEl ? paymentModeEl.textContent.trim() : '',
      paymentTerms: paymentTermsEl ? paymentTermsEl.textContent.trim() : '',
      currency: calc.currency,
      discountPct: calc.discountPct,
      advancePaid: calc.advancePaid,
      paymentStatus: statusSelect ? statusSelect.value : 'ESTIMATE',
      includeTax: calc.taxEnabled,
      items: calc.items,
      subtotal: calc.subtotal,
      totalTax: calc.totalTax,
      grandTotal: calc.grandTotal,
      balanceDue: calc.balanceDue,
      savedAt: new Date().toISOString()
    };
  }

  function loadSnapshotIntoEditor(doc) {
    activeEditingDocId = doc.id || null;
    if (docTypeSelect) docTypeSelect.value = doc.docType || 'ESTIMATE';
    if (currencySelect) currencySelect.value = doc.currency || '₹';
    if (discountInput) discountInput.value = doc.discountPct ?? 0;
    if (advanceInput) advanceInput.value = doc.advancePaid ?? 0;
    if (statusSelect) statusSelect.value = doc.paymentStatus || 'ESTIMATE';
    if (includeTaxToggle) includeTaxToggle.checked = Boolean(doc.includeTax);

    applyDocTypeUI(doc.docType || 'ESTIMATE', false);

    if (docNumberEl && doc.docNumber) docNumberEl.textContent = doc.docNumber;
    if (docDateEl && doc.docDate) docDateEl.textContent = doc.docDate;
    if (dueDateEl && doc.dueDate) dueDateEl.textContent = doc.dueDate;
    if (gstinValEl && doc.gstin) gstinValEl.textContent = doc.gstin;
    if (clientNameEl) clientNameEl.textContent = doc.clientName || '';
    if (clientAttnEl) clientAttnEl.textContent = doc.clientAttn || '';
    if (clientAddressEl) clientAddressEl.textContent = doc.clientAddress || '';
    if (clientPhoneEl) clientPhoneEl.textContent = doc.clientPhone || '';
    if (clientEmailEl) clientEmailEl.textContent = doc.clientEmail || '';
    if (projectTitleEl) projectTitleEl.textContent = doc.projectTitle || '';
    if (paymentModeEl) paymentModeEl.textContent = doc.paymentMode || 'Bank NEFT / RTGS / UPI';
    if (paymentTermsEl) paymentTermsEl.textContent = doc.paymentTerms || '';

    itemsContainer.innerHTML = '';
    const items = Array.isArray(doc.items) && doc.items.length ? doc.items : [{ desc: 'Digital Marketing Service', qty: 1, rate: 4999, tax: 18 }];
    items.forEach(it => {
      itemsContainer.appendChild(createItemRow(it.desc, it.qty, it.rate, it.tax ?? 18));
    });
    applyTaxVisibility();
    calculateTotals();
  }

  function renderSavedInvoicesHistory() {
    if (!savedTableBody) return;
    const list = getInvoicesData();
    if (!list.length) {
      savedTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 22px; color: var(--admin-text-muted);">
            Abhi koi Estimate ya Invoice save nahi hua hai. Upar "💾 Save to History" par click karein.
          </td>
        </tr>
      `;
      return;
    }

    savedTableBody.innerHTML = list.map(doc => {
      const meta = DOC_TYPE_META[doc.docType] || DOC_TYPE_META.ESTIMATE;
      const canConvert = doc.docType === 'ESTIMATE' || doc.docType === 'PROFORMA';
      const cur = doc.currency || '₹';
      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--admin-text-main);">${escapeHtml(doc.docNumber || doc.id)}</div>
            <span style="font-size: 0.74rem; color: var(--admin-primary); font-weight: 700;">${escapeHtml(meta.badge)}</span>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--admin-text-main);">${escapeHtml(doc.clientName || 'Client')}</div>
            <div style="font-size: 0.74rem; color: var(--admin-text-muted);">${escapeHtml(doc.clientPhone || '')}</div>
          </td>
          <td style="font-weight: 800; color: var(--admin-primary);">
            ${escapeHtml(cur)}${Number(doc.grandTotal || 0).toLocaleString('en-IN')}
          </td>
          <td>
            <div style="font-size: 0.8rem; font-weight: 700;">${escapeHtml(doc.paymentStatus || 'ESTIMATE')}</div>
            <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${escapeHtml(doc.docDate || '')}</div>
          </td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn-secondary inv-load-doc-btn" data-id="${escapeHtml(doc.id)}" style="padding: 5px 10px; font-size: 0.76rem;">📂 Open</button>
              ${canConvert ? `<button type="button" class="btn-outline-cyber inv-convert-doc-btn" data-id="${escapeHtml(doc.id)}" style="padding: 5px 10px; font-size: 0.76rem;">🔄 Convert to Tax Invoice</button>` : ''}
              <button type="button" class="btn-secondary inv-del-doc-btn" data-id="${escapeHtml(doc.id)}" style="padding: 5px 8px; font-size: 0.76rem; color: #EF4444;">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    savedTableBody.querySelectorAll('.inv-load-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const doc = getInvoicesData().find(d => d.id === btn.getAttribute('data-id'));
        if (doc) {
          loadSnapshotIntoEditor(doc);
          showAdminToast(`Loaded ${doc.docNumber}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    savedTableBody.querySelectorAll('.inv-convert-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const doc = getInvoicesData().find(d => d.id === btn.getAttribute('data-id'));
        if (!doc) return;
        const converted = {
          ...doc,
          id: 'DOC-' + Date.now(),
          docType: 'TAX_INVOICE',
          docNumber: generateNextDocNumber('TAX_INVOICE'),
          docDate: formatInvoiceDate(new Date()),
          dueDate: formatInvoiceDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
          paymentStatus: 'UNPAID',
          includeTax: true,
          paymentTerms: DOC_TYPE_META.TAX_INVOICE.defaultTerms
        };
        loadSnapshotIntoEditor(converted);
        activeEditingDocId = null;
        showAdminToast(`🔄 Estimate converted to ${converted.docNumber} — review & save!`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    savedTableBody.querySelectorAll('.inv-del-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Delete this saved document from history?')) return;
        const next = getInvoicesData().filter(d => d.id !== id);
        saveInvoicesData(next);
        renderSavedInvoicesHistory();
        showAdminToast('Document deleted.');
      });
    });
  }

  renderSavedInvoicesFn = renderSavedInvoicesHistory;

  function buildShareMessage() {
    const snap = getCurrentDocSnapshot();
    const meta = DOC_TYPE_META[snap.docType] || DOC_TYPE_META.ESTIMATE;
    const cur = snap.currency || '₹';
    const f = (n) => `${cur}${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

    const itemLines = snap.items.map((it, i) => `${i + 1}. ${it.desc} (Qty: ${it.qty} × ${f(it.rate)}) = ${f(it.lineNet)}`).join('\n');

    const lines = [
      `*${meta.badge} — ${snap.docNumber}*`,
      `*The Digital Marketings* (Ahmedabad HQ)`,
      `Date: ${snap.docDate} | ${meta.dueLabel.replace(':', '')}: ${snap.dueDate}`,
      ``,
      `*Client:* ${snap.clientName}${snap.clientAttn ? ` (${snap.clientAttn})` : ''}`,
      `*Project:* ${snap.projectTitle}`,
      ``,
      `*Services Breakdown:*`,
      itemLines,
      ``,
      `Subtotal: ${f(snap.subtotal)}`
    ];

    if (snap.discountPct > 0) {
      lines.push(`Discount (${snap.discountPct}%): -${f(snap.subtotal * (snap.discountPct / 100))}`);
    }
    if (snap.includeTax) {
      lines.push(`GST / Tax: ${f(snap.totalTax)}`);
    }
    lines.push(`*${meta.totalLabel.replace(':', '')}: ${f(snap.grandTotal)}*`);
    if (snap.advancePaid > 0) {
      lines.push(`Advance Paid: -${f(snap.advancePaid)}`);
      lines.push(`*Balance Due: ${f(snap.balanceDue)}*`);
    }
    lines.push(``);
    lines.push(`*Payment Details:*`);
    lines.push(`UPI ID: 9316954389@paytm / sabirajmeri@okhdfcbank`);
    lines.push(`Bank: HDFC Bank Ltd | A/C: 50200084729104 | IFSC: HDFC0001234`);
    lines.push(``);
    lines.push(`For any query, reply here or call +91 9316954389 — Sabir Ajmeri`);

    return { snap, meta, text: lines.join('\n') };
  }

  // Initial Setup: Default to ESTIMATE with live rates & today's date
  const cfg = getSiteConfig();
  const seoPrice = (cfg.services.find(s => s.id === 'seo') || {}).price || 4999;
  const metaPrice = (cfg.services.find(s => s.id === 'meta-ads') || {}).price || 2499;

  if (currencySelect && cfg.currency) currencySelect.value = cfg.currency;
  setTodayDates();
  itemsContainer.innerHTML = '';
  itemsContainer.appendChild(createItemRow('Website SEO (Search Engine Optimization Sprint)', 1, seoPrice, 18));
  itemsContainer.appendChild(createItemRow('Meta Ads (FB & Instagram Management)', 1, metaPrice, 18));
  applyDocTypeUI(docTypeSelect ? docTypeSelect.value : 'ESTIMATE', true);
  renderSavedInvoicesHistory();

  if (docTypeSelect) {
    docTypeSelect.addEventListener('change', () => {
      applyDocTypeUI(docTypeSelect.value, true);
    });
  }

  if (includeTaxToggle) {
    includeTaxToggle.addEventListener('change', () => {
      applyTaxVisibility();
      calculateTotals();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', syncStatusPill);
  }

  if (crmClientSelect) {
    crmClientSelect.addEventListener('change', () => {
      const leadId = crmClientSelect.value;
      if (!leadId) return;
      const lead = getLeadsData().find(l => l.id === leadId);
      if (!lead) return;
      if (clientNameEl) clientNameEl.textContent = lead.name || '';
      if (clientAttnEl) clientAttnEl.textContent = lead.website && lead.website !== 'N/A' ? `Website: ${lead.website}` : 'Direct Client';
      if (clientAddressEl) clientAddressEl.textContent = lead.source ? `Source: ${lead.source}` : 'India';
      if (clientPhoneEl) clientPhoneEl.textContent = lead.phone || '';
      if (clientEmailEl) clientEmailEl.textContent = (lead.email && lead.email !== 'N/A' && lead.email !== 'Via Modal Inquire') ? lead.email : '';
      if (projectTitleEl) projectTitleEl.textContent = lead.service || '360° Digital Marketing Growth';
      showAdminToast(`✓ Loaded client details for ${lead.name}`);
    });
  }

  if (servicePicker) {
    servicePicker.addEventListener('change', () => {
      const val = servicePicker.value;
      if (!val) return;
      const latestCfg = getSiteConfig();
      const [kind, id] = val.split(':');
      let item = null;
      if (kind === 'srv') item = latestCfg.services.find(s => s.id === id);
      else if (kind === 'bnd') item = latestCfg.bundles.find(b => b.id === id);
      if (item) {
        itemsContainer.appendChild(createItemRow(item.name, 1, Number(item.price || 0), 18));
        applyTaxVisibility();
        calculateTotals();
        showAdminToast(`Added "${item.name}" at live rate`);
      }
      servicePicker.value = '';
    });
  }

  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      itemsContainer.appendChild(createItemRow('New Digital Marketing Service Item', 1, 2499, 18));
      applyTaxVisibility();
      calculateTotals();
    });
  }

  if (newDocBtn) {
    newDocBtn.addEventListener('click', () => {
      activeEditingDocId = null;
      if (docTypeSelect) docTypeSelect.value = 'ESTIMATE';
      if (discountInput) discountInput.value = '0';
      if (advanceInput) advanceInput.value = '0';
      setTodayDates();
      itemsContainer.innerHTML = '';
      itemsContainer.appendChild(createItemRow('Website SEO (Search Engine Optimization Sprint)', 1, seoPrice, 18));
      applyDocTypeUI('ESTIMATE', true);
      showAdminToast('🆕 Ready for new Estimate');
    });
  }

  if (saveDocBtn) {
    saveDocBtn.addEventListener('click', () => {
      const snap = getCurrentDocSnapshot();
      const list = getInvoicesData();
      const idx = list.findIndex(d => d.id === snap.id);
      if (idx >= 0) list[idx] = snap;
      else list.unshift(snap);
      activeEditingDocId = snap.id;
      saveInvoicesData(list);
      renderSavedInvoicesHistory();
      showAdminToast(`💾 Saved ${snap.docNumber} to history!`);
    });
  }

  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const { snap, text } = buildShareMessage();
      let digits = (snap.clientPhone || '').replace(/[^0-9]/g, '');
      if (digits.length === 10) digits = '91' + digits;
      if (!digits || digits.length < 10) {
        showAdminToast('Client ka WhatsApp phone number sahi se dalein (e.g. +91 98250 12345).', true);
        return;
      }
      window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank');
      showAdminToast(`💬 Opening WhatsApp for ${snap.clientName}`);
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const { snap, meta, text } = buildShareMessage();
      const email = (snap.clientEmail || '').trim();
      if (!email || !email.includes('@')) {
        showAdminToast('Client ka valid Email address dalein.', true);
        return;
      }
      const subject = `${meta.badge} #${snap.docNumber} — The Digital Marketings`;
      const plainBody = text.replace(/\*/g, '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(plainBody).catch(() => {});
      }
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
      showAdminToast(`✉️ Opening Email client for ${email}`);
    });
  }

  if (currencySelect) currencySelect.addEventListener('change', calculateTotals);
  if (discountInput) discountInput.addEventListener('input', calculateTotals);
  if (advanceInput) advanceInput.addEventListener('input', calculateTotals);

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const invTabBtn = document.querySelector('.nav-item-btn[data-tab="invoice"]');
      if (invTabBtn && !invTabBtn.classList.contains('active')) invTabBtn.click();
      setTimeout(() => window.print(), 50);
    });
  }
}

/* --------------------------------------------------------------------------
   9. Persistent Storage, GitHub Sync UI, Full Backup & PIN Update
   -------------------------------------------------------------------------- */
function initStorageAndBackup() {
  const ownerInput = document.getElementById('ghOwner');
  const repoInput = document.getElementById('ghRepo');
  const branchInput = document.getElementById('ghBranch');
  const tokenInput = document.getElementById('ghToken');
  const autoSyncInput = document.getElementById('ghAutoSync');
  const saveGhBtn = document.getElementById('saveGhConfigBtn');
  const pullAllBtn = document.getElementById('pullAllGithubBtn');
  const pushAllBtn = document.getElementById('pushAllGithubBtn');
  const syncLogEl = document.getElementById('ghSyncLog');

  const downloadBackupBtn = document.getElementById('downloadFullBackupBtn');
  const restoreBackupInput = document.getElementById('restoreBackupInput');
  const newPinInput = document.getElementById('newAdminPinInput');
  const updatePinBtn = document.getElementById('updatePinBtn');

  function logSync(msg) {
    if (syncLogEl) {
      syncLogEl.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    }
  }

  const savedGh = getGhSettings();
  if (ownerInput) ownerInput.value = savedGh.owner || 'infothedigitalmarketings-sys';
  if (repoInput) repoInput.value = savedGh.repo || 'the-digital-marketings';
  if (branchInput) branchInput.value = savedGh.branch || 'main';
  if (tokenInput) tokenInput.value = savedGh.token || '';
  if (autoSyncInput) autoSyncInput.checked = Boolean(savedGh.autoSync);

  function readGhForm() {
    return {
      owner: (ownerInput ? ownerInput.value.trim() : '') || 'infothedigitalmarketings-sys',
      repo: (repoInput ? repoInput.value.trim() : '') || 'the-digital-marketings',
      branch: (branchInput ? branchInput.value.trim() : '') || 'main',
      token: tokenInput ? tokenInput.value.trim() : '',
      autoSync: Boolean(autoSyncInput && autoSyncInput.checked)
    };
  }

  // Auto-save GitHub settings on input/change so token is never lost even if user forgets to click Save
  [ownerInput, repoInput, branchInput, tokenInput, autoSyncInput].forEach(el => {
    if (!el) return;
    const evt = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, () => {
      saveGhSettings(readGhForm());
      renderPricingEditorFn();
    });
  });

  if (saveGhBtn) {
    saveGhBtn.addEventListener('click', async () => {
      const cfg = readGhForm();
      saveGhSettings(cfg);
      renderPricingEditorFn();

      if (!cfg.token) {
        logSync('Saved settings (Local Only — token empty).');
        showAdminToast('Settings saved (Token empty — Local mode).');
        return;
      }

      try {
        saveGhBtn.disabled = true;
        saveGhBtn.textContent = '⏳ Testing...';
        const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`, {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${cfg.token}`
          }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }
        const repoInfo = await res.json();
        const canPush = repoInfo.permissions ? repoInfo.permissions.push : true;
        logSync(`Connected to ${repoInfo.full_name} (Write permission: ${canPush ? 'YES' : 'READ-ONLY'})`);
        showAdminToast(`✓ Connected to GitHub repo: ${repoInfo.full_name}`);
      } catch (err) {
        logSync(`Connection failed: ${err.message}`);
        showAdminToast(`GitHub connection failed: ${err.message}`, true);
      } finally {
        saveGhBtn.disabled = false;
        saveGhBtn.innerHTML = '<span>💾 Save &amp; Test Connection</span>';
      }
    });
  }

  if (pullAllBtn) {
    pullAllBtn.addEventListener('click', async () => {
      const cfg = readGhForm();
      saveGhSettings(cfg);
      try {
        pullAllBtn.disabled = true;
        pullAllBtn.textContent = '⏳ Pulling...';
        logSync('Pulling data/site-config.json, leads.json, analytics.json, blogs.json...');

        const readFileJson = async (path) => {
          if (cfg.token) {
            const f = await ghGetFile(path);
            return f ? safeJsonParse(f.content, null) : null;
          }
          return await fetchRepoJsonRelative(path);
        };

        const [remoteConfig, remoteLeads, remoteAnalytics, remoteBlogs, remoteInvoices] = await Promise.all([
          readFileJson('data/site-config.json'),
          readFileJson('data/leads.json'),
          readFileJson('data/analytics.json'),
          readFileJson('data/blogs.json'),
          readFileJson('data/invoices.json')
        ]);

        if (remoteConfig && Array.isArray(remoteConfig.services)) {
          localStorage.setItem(TDM_ADMIN_KEYS.SITE_CONFIG, JSON.stringify(remoteConfig));
        }

        if (remoteLeads && Array.isArray(remoteLeads.leads)) {
          const localLeads = getLeadsData();
          const mergedMap = new Map();
          remoteLeads.leads.forEach(l => mergedMap.set(l.id, l));
          localLeads.forEach(l => {
            if (!mergedMap.has(l.id)) mergedMap.set(l.id, l);
          });
          localStorage.setItem(TDM_ADMIN_KEYS.LEADS, JSON.stringify(Array.from(mergedMap.values())));
        }

        if (remoteAnalytics && typeof remoteAnalytics.totalViews === 'number') {
          localStorage.setItem(TDM_ADMIN_KEYS.ANALYTICS, JSON.stringify(remoteAnalytics));
        }

        if (remoteBlogs && Array.isArray(remoteBlogs.posts)) {
          localStorage.setItem(TDM_ADMIN_KEYS.BLOGS, JSON.stringify(remoteBlogs));
        }

        if (remoteInvoices && Array.isArray(remoteInvoices.invoices)) {
          localStorage.setItem(TDM_ADMIN_KEYS.INVOICES, JSON.stringify(remoteInvoices.invoices));
        }

        initAnalyticsDashboard();
        renderLeadsFn();
        renderPricingEditorFn();
        renderPublishedBlogsFn();
        populateInvoiceServicePicker();
        populateInvoiceCrmPicker();
        renderSavedInvoicesFn();

        logSync('✓ All data pulled & synced into Admin Panel!');
        showAdminToast('✓ GitHub repo se sara data pull ho gaya!');
      } catch (err) {
        logSync(`Pull failed: ${err.message}`);
        showAdminToast(`Pull failed: ${err.message}`, true);
      } finally {
        pullAllBtn.disabled = false;
        pullAllBtn.innerHTML = '<span>⬇️ Pull All Data from GitHub</span>';
      }
    });
  }

  if (pushAllBtn) {
    pushAllBtn.addEventListener('click', async () => {
      const cfg = readGhForm();
      saveGhSettings(cfg);
      try {
        pushAllBtn.disabled = true;
        pushAllBtn.textContent = '⏳ Pushing...';
        logSync('Pushing site-config.json, leads.json, analytics.json, blogs.json to GitHub...');

        const siteConfig = getSiteConfig();
        const leadsPayload = { version: 1, updatedAt: new Date().toISOString(), leads: getLeadsData() };
        const analyticsPayload = getAnalyticsData();
        const rawBlogs = getBlogsData();
        const blogsPayload = {
          version: 1,
          updatedAt: new Date().toISOString(),
          posts: (rawBlogs.posts || []).map(({ htmlContent, ...meta }) => meta)
        };
        const invoicesPayload = { version: 1, updatedAt: new Date().toISOString(), invoices: getInvoicesData() };

        await ghPutFile('data/site-config.json', JSON.stringify(siteConfig, null, 2) + '\n', 'Sync site-config.json from Admin');
        await ghPutFile('data/leads.json', JSON.stringify(leadsPayload, null, 2) + '\n', 'Sync leads.json from Admin');
        await ghPutFile('data/analytics.json', JSON.stringify(analyticsPayload, null, 2) + '\n', 'Sync analytics.json from Admin');
        await ghPutFile('data/blogs.json', JSON.stringify(blogsPayload, null, 2) + '\n', 'Sync blogs.json from Admin');
        await ghPutFile('data/invoices.json', JSON.stringify(invoicesPayload, null, 2) + '\n', 'Sync invoices.json from Admin');

        logSync('✓ All 5 JSON files successfully committed to GitHub!');
        showAdminToast('🚀 Sara data (Rates, Leads, Analytics, Blogs, Invoices) GitHub repo me save ho gaya!');
      } catch (err) {
        logSync(`Push failed: ${err.message}`);
        showAdminToast(`Push failed: ${err.message}`, true);
      } finally {
        pushAllBtn.disabled = false;
        pushAllBtn.innerHTML = '<span>⬆️ Push All Data to GitHub</span>';
      }
    });
  }

  if (downloadBackupBtn) {
    downloadBackupBtn.addEventListener('click', () => {
      const bundle = {
        exportedAt: new Date().toISOString(),
        siteConfig: getSiteConfig(),
        leads: getLeadsData(),
        analytics: getAnalyticsData(),
        blogs: getBlogsData(),
        invoices: getInvoicesData()
      };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TDM_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showAdminToast('✓ Full JSON backup downloaded.');
    });
  }

  if (restoreBackupInput) {
    restoreBackupInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = safeJsonParse(reader.result, null);
        if (!parsed) {
          showAdminToast('Invalid JSON backup file.', true);
          return;
        }
        if (parsed.siteConfig) localStorage.setItem(TDM_ADMIN_KEYS.SITE_CONFIG, JSON.stringify(parsed.siteConfig));
        if (Array.isArray(parsed.leads)) localStorage.setItem(TDM_ADMIN_KEYS.LEADS, JSON.stringify(parsed.leads));
        if (parsed.analytics) localStorage.setItem(TDM_ADMIN_KEYS.ANALYTICS, JSON.stringify(parsed.analytics));
        if (parsed.blogs) localStorage.setItem(TDM_ADMIN_KEYS.BLOGS, JSON.stringify(parsed.blogs));
        if (Array.isArray(parsed.invoices)) localStorage.setItem(TDM_ADMIN_KEYS.INVOICES, JSON.stringify(parsed.invoices));

        initAnalyticsDashboard();
        renderLeadsFn();
        renderPricingEditorFn();
        renderPublishedBlogsFn();
        populateInvoiceServicePicker();
        populateInvoiceCrmPicker();
        renderSavedInvoicesFn();
        showAdminToast('✓ Full backup restored!');
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  if (updatePinBtn && newPinInput) {
    updatePinBtn.addEventListener('click', () => {
      const pin = newPinInput.value.trim();
      if (!/^\d{4}$/.test(pin)) {
        showAdminToast('PIN exactly 4 digits ka hona chahiye (e.g. 5678).', true);
        return;
      }
      localStorage.setItem(TDM_ADMIN_KEYS.PIN, pin);
      newPinInput.value = '';
      showAdminToast('🔐 Admin PIN successfully updated!');
    });
  }
}

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
