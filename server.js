/**
 * JetLink — optional Node/Express backend
 * ----------------------------------------
 * Gives you TRUE server-side short links:  GET /<code>  ->  301 redirect
 * plus a small REST API protected by an API key:
 *   POST   /api/v1/links        { url, alias?, domain?, ending? }
 *   GET    /api/v1/links
 *   DELETE /api/v1/links/:code
 * Data is stored in a plain JSON file (db.json) next to this file.
 * Change the demo API key in db.json (apiKeys array) before real use,
 * or set env JETLINK_API_KEYS="key1,key2".
 *
 * Run:  npm install && npm start     (http://localhost:3000)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

/* ---------- tiny JSON database ---------- */
function loadDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(raw);
    if (!db.links) db.links = {};
    if (!db.clicks) db.clicks = [];
    if (!db.apiKeys) db.apiKeys = [];
    return db;
  } catch (e) {
    return { links: {}, clicks: [], apiKeys: ['demo-api-key-change-me'] };
  }
}
function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
let db = loadDb();
if (process.env.JETLINK_API_KEYS) {
  db.apiKeys = process.env.JETLINK_API_KEYS.split(',').map(s => s.trim()).filter(Boolean);
}

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function genCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (db.links[code]);
  return code;
}
function validUrl(u) {
  try { const x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:'; }
  catch (e) { return false; }
}
function deviceFromUA(ua) {
  ua = ua || '';
  if (/iPad|Tablet|PlayBook/i.test(ua)) return 'Tablet';
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'Mobile';
  return 'Desktop';
}
function recordClick(code, req) {
  const link = db.links[code];
  if (!link) return;
  link.clicks = (link.clicks || 0) + 1;
  db.clicks.push({
    code, owner: link.owner || 'api', ts: Date.now(),
    country: '', device: deviceFromUA(req.headers['user-agent']),
    referrer: req.headers.referer || 'Direct'
  });
  saveDb(db);
}
function apiAuth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || db.apiKeys.indexOf(key) === -1) {
    return res.status(401).json({ error: 'Invalid or missing API key (send header x-api-key).' });
  }
  next();
}

/* ---------- middleware / static ---------- */
app.use(express.json({ limit: '256kb' }));
app.use((req, res, next) => {           // never serve the database or backend files
  if (['/db.json', '/server.js', '/package.json'].includes(req.path)) return res.status(404).end();
  next();
});
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.static(__dirname, { index: false }));

/* ---------- REST API ---------- */
app.post('/api/v1/links', apiAuth, (req, res) => {
  let { url, alias, domain, ending } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Field "url" is required.' });
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  if (!validUrl(url)) return res.status(400).json({ error: 'Invalid URL.' });
  let code = genCode();
  if (alias) {
    alias = String(alias).toLowerCase().trim();
    if (!/^[a-z0-9-]{3,30}$/.test(alias)) return res.status(400).json({ error: 'Alias must be 3-30 chars: a-z 0-9 -' });
    if (db.links[alias]) return res.status(409).json({ error: 'Alias already taken.' });
    code = alias;
  }
  const link = {
    code, domain: domain || 'jetlink.to', ending: ending || '',
    destination: url, type: 'link', owner: 'api',
    clicks: 0, createdAt: Date.now()
  };
  db.links[code] = link;
  saveDb(db);
  const base = req.protocol + '://' + req.get('host');
  res.status(201).json({
    code, short_url: base + '/' + code,
    display_url: 'https://' + link.domain + '/' + code + link.ending,
    destination: url
  });
});

app.get('/api/v1/links', apiAuth, (req, res) => {
  res.json({ links: Object.values(db.links) });
});

app.delete('/api/v1/links/:code', apiAuth, (req, res) => {
  const code = req.params.code;
  if (!db.links[code]) return res.status(404).json({ error: 'Link not found.' });
  delete db.links[code];
  db.clicks = db.clicks.filter(c => c.code !== code);
  saveDb(db);
  res.json({ ok: true, deleted: code });
});

/* ---------- image-card landing + go (records the click, then redirects) ---------- */
app.get('/go/:code', (req, res) => {
  const link = db.links[req.params.code];
  if (!link) return res.status(404).send('Link not found.');
  recordClick(link.code, req);
  res.redirect(302, link.destination);
});

/* ---------- the short-link redirect itself ---------- */
app.get('/:code', (req, res, next) => {
  const code = req.params.code;
  if (!/^[a-z0-9-]{3,30}$/i.test(code)) return next();
  const link = db.links[code];
  if (!link) return res.status(404).send('<!doctype html><title>404</title><h1>Short link not found</h1>');
  if (link.type === 'image') {
    // Image-card links land on a card page first; the click-through goes via /go/:code
    const img = esc(link.image || '');
    const title = esc(link.title || '');
    const go = '/go/' + encodeURIComponent(code);
    return res.send('<!doctype html><html><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + title + '</title>' +
      '<meta property="og:title" content="' + title + '">' +
      '<meta property="og:image" content="' + img + '"></head>' +
      '<body style="margin:0;background:#0b1b3a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui">' +
      '<a href="' + go + '" style="position:relative;display:block;max-width:720px;width:92%">' +
      '<img src="' + img + '" alt="" style="width:100%;border-radius:16px;display:block">' +
      (link.showPlay ? '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="width:74px;height:74px;border-radius:50%;background:#f97316;color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center">&#9654;</span></span>' : '') +
      '<span style="position:absolute;left:0;right:0;bottom:0;padding:16px;color:#fff;font-weight:700;font-size:20px;background:linear-gradient(transparent,rgba(0,0,0,.65));border-radius:0 0 16px 16px">' + title + '</span>' +
      '</a></body></html>');
  }
  recordClick(code, req);
  res.redirect(301, link.destination);
});

app.listen(PORT, () => console.log('JetLink server listening on http://localhost:' + PORT));
