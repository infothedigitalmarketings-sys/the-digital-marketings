/**
 * THE DIGITAL MARKETINGS - Zero-Dependency Direct Storage Server
 * Run: node server.js (or double-click start-admin.bat)
 * Saves Live Rates, Client Leads CRM, Analytics, and Blog Posts directly to disk
 * with NO GitHub token required.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.resolve(__dirname);
const DATA_DIR = path.join(ROOT, 'data');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const BLOCKED_FILES = new Set(['server.js', 'package.json', 'start-admin.bat']);

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function writeJsonFile(fileName, payload) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, fileName);
  fs.writeFileSync(target, JSON.stringify(payload, null, 2) + '\n', 'utf8');
}

function readJsonFile(fileName, fallback) {
  const target = path.join(DATA_DIR, fileName);
  try {
    if (!fs.existsSync(target)) return fallback;
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (e) {
    return fallback;
  }
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, mode: 'direct-server' });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);

    if (pathname === '/api/save-config') {
      if (!body || !Array.isArray(body.services) || !Array.isArray(body.bundles)) {
        return sendJson(res, 400, { ok: false, error: 'Invalid site config format' });
      }
      body.updatedAt = new Date().toISOString();
      writeJsonFile('site-config.json', body);
      return sendJson(res, 200, { ok: true, updatedAt: body.updatedAt });
    }

    if (pathname === '/api/save-leads') {
      const leads = Array.isArray(body.leads) ? body.leads : [];
      const payload = { version: 1, updatedAt: new Date().toISOString(), leads };
      writeJsonFile('leads.json', payload);
      return sendJson(res, 200, { ok: true, count: leads.length });
    }

    if (pathname === '/api/record-lead') {
      if (!body || !body.name || !body.phone) {
        return sendJson(res, 400, { ok: false, error: 'Name and phone required' });
      }
      const existing = readJsonFile('leads.json', { version: 1, updatedAt: new Date().toISOString(), leads: [] });
      const leads = Array.isArray(existing.leads) ? existing.leads : [];
      if (!leads.some(l => l.id === body.id)) {
        leads.unshift(body);
      }
      writeJsonFile('leads.json', { version: 1, updatedAt: new Date().toISOString(), leads });
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/save-analytics') {
      body.updatedAt = new Date().toISOString();
      writeJsonFile('analytics.json', body);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/record-analytics') {
      const current = readJsonFile('analytics.json', {
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
      if (body.type === 'page_view') {
        current.totalViews = (current.totalViews || 0) + 1;
        const page = String(body.page || 'index.html');
        current.pageViews = current.pageViews || {};
        current.pageViews[page] = (current.pageViews[page] || 0) + 1;
      } else if (body.type) {
        if (body.type === 'whatsapp_click') current.whatsappClicks = (current.whatsappClicks || 0) + 1;
        else if (body.type === 'call_click') current.callClicks = (current.callClicks || 0) + 1;
        else if (body.type === 'audit_modal_open') current.auditModalOpens = (current.auditModalOpens || 0) + 1;
        else if (body.type === 'service_click') current.serviceClicks = (current.serviceClicks || 0) + 1;
        current.events = Array.isArray(current.events) ? current.events : [];
        current.events.unshift({
          type: body.type,
          meta: body.meta || {},
          url: body.url || '/',
          timestamp: new Date().toISOString()
        });
        if (current.events.length > 200) current.events = current.events.slice(0, 200);
      }
      current.updatedAt = new Date().toISOString();
      writeJsonFile('analytics.json', current);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/publish-blog') {
      const slug = String(body.slug || '').trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-_]{1,100}$/.test(slug)) {
        return sendJson(res, 400, { ok: false, error: 'Invalid blog slug' });
      }
      if (typeof body.htmlContent !== 'string' || !body.htmlContent.trim()) {
        return sendJson(res, 400, { ok: false, error: 'Missing blog HTML content' });
      }
      const htmlPath = path.join(ROOT, `${slug}.html`);
      fs.writeFileSync(htmlPath, body.htmlContent, 'utf8');

      const blogsPayload = body.blogsCatalog || { version: 1, updatedAt: new Date().toISOString(), posts: [] };
      blogsPayload.updatedAt = new Date().toISOString();
      writeJsonFile('blogs.json', blogsPayload);
      return sendJson(res, 200, { ok: true, file: `${slug}.html` });
    }

    if (pathname === '/api/delete-blog') {
      const blogsPayload = body.blogsCatalog || { version: 1, updatedAt: new Date().toISOString(), posts: [] };
      blogsPayload.updatedAt = new Date().toISOString();
      writeJsonFile('blogs.json', blogsPayload);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { ok: false, error: 'Unknown API endpoint' });
  } catch (err) {
    return sendJson(res, 400, { ok: false, error: err.message });
  }
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname.startsWith('/api/')) {
    return handleApi(req, res, pathname);
  }

  let relPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  if (!relPath) relPath = 'index.html';

  const segments = relPath.split('/').filter(Boolean);
  if (segments.some(seg => seg.startsWith('.') || seg === '..') || BLOCKED_FILES.has(relPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  const resolved = path.resolve(ROOT, relPath);
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found');
    }
    const ext = path.extname(resolved).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': mime };
    if (ext === '.json') headers['Cache-Control'] = 'no-store';
    res.writeHead(200, headers);
    fs.createReadStream(resolved).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`TDM Direct Server running at http://localhost:${PORT}`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin.html`);
});
