# JetLink — Free URL Shortener (functional alternative to urljetz-style sites)

**Developed By Sabbir** (Owner: Dev X Sabbir)

JetLink হলো একটা সম্পূর্ণ working URL shortener ওয়েবসাইট — একটাই `index.html` ফাইলে পুরো অ্যাপ (HTML + CSS + JS)। Layout/UX reference সাইটের মতো, কিন্তু branding, logo, লেখা আর code — সবই original।

Shorten links, choose domains & media endings, build image cards, download QR codes, track clicks (country / device / referrer), bulk shorten, user dashboard, admin panel, blog, help, legal pages — সবই আছে।

---

## 1) Deploy — PRIMARY: GitHub + Vercel (recommended, permanent & free)

Site-টা Vercel-এ host হবে; Firebase শুধু backend (Auth + Database) হিসেবে কাজ করবে।

1. **GitHub repo বানাও** (e.g. `jetlink`) আর এই folder-এর সব ফাইল push করো:
   ```bash
   git init && git add . && git commit -m "JetLink" 
   git remote add origin https://github.com/<your-name>/jetlink.git
   git push -u origin main
   ```
2. **Vercel-এ import করো:** vercel.com → **Add New → Project** → GitHub repo select → Framework Preset: **Other** → **Deploy**.
3. হয়ে গেছে — site live হবে একটা permanent free address-এ: `https://<project>.vercel.app`
   এই address টা permanently কাজ করবে; প্রতিটা `git push`-এ auto re-deploy হবে।
4. **Short-link paths:** `vercel.json`-এ rewrites দেওয়া আছে, যাতে `/abc123` বা `/abc123.mp4` খুললেও `index.html` load হয় এবং app-এর redirect engine code টা খুঁজে আসল destination-এ পাঠিয়ে দেয় (click record সহ)। Hash form `#/r/abc123` ও সবসময় কাজ করে।

### Custom domain (পরে, Vercel-এ)
1. Vercel dashboard → তোমার project → **Settings → Domains → Add** → নিজের domain লেখো।
2. Vercel যে DNS record দেবে (সাধারণত একটা `A` record `@` → `76.76.21.21`, অথবা subdomain-এর জন্য `CNAME` → `cname.vercel-dns.com`) সেটা domain registrar-এর DNS-এ বসাও।
3. DNS propagate হলে Vercel অটোমেটিক free SSL certificate দিয়ে দেবে।
4. নতুন domain টা app-এর **Admin panel → Site settings → Domain pool**-এ যোগ করো, যাতে shortener-এ সেটা select করা যায়।

> Note: Domain pool-এর নামগুলো (`jetlink.to`, `jlnk.me` ইত্যাদি) UI-এর display/branding choice। কোনো domain সত্যিকারে short link serve করবে তখনই, যখন সেই domain টা তুমি কিনে Vercel project-এ connect করবে। নিজের domain না থাকলে links কাজ করবে তোমার `*.vercel.app` address দিয়ে (আর Node mode-এ তোমার server address দিয়ে)।

---

## 2) Firebase setup (Backend: Auth + Firestore) — one time

Firebase না দিলেও site চলবে **Demo mode**-এ (সব data শুধু ঐ browser-এর localStorage-এ)। Real multi-user accounts আর shared database-এর জন্য Firebase লাগবে:

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (যেকোনো নাম, যেমন `jetlink`).
2. **Build → Authentication → Get started** → Sign-in method → **Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (production mode) → তারপর **Rules** tab-এ এই folder-এর `firestore.rules` ফাইলের content paste করে **Publish** করো।
4. Project settings (⚙️) → **Your apps → Web (`</>`)** → app register করো → যে `firebaseConfig` object পাবে সেটা কপি করো।
5. `index.html` খোলো, script-এর একদম শুরুতে `const firebaseConfig = { ... }` আছে — সেখানে নিজের config paste করো, তারপর GitHub-এ push (Vercel auto-deploy করে দেবে)।
6. **প্রথম admin বানানো:** Firebase Console → Firestore → `users` collection → নিজের user document → একটা field যোগ করো: `role` = `"admin"` (string)। এবার ঐ account দিয়ে login করলেই Admin panel দেখা যাবে।

> Firebase-এর free (Spark) plan-ই যথেষ্ট শুরু করার জন্য। Config-এর `apiKey` ওয়েবের জন্য public key — এটা secret না; আসল security আসে Firestore Rules থেকে।

### Alternative host: Firebase Hosting
চাইলে `firebase.json`-ও রাখা আছে (SPA rewrite সহ)। `npm i -g firebase-tools && firebase login && firebase deploy` — কিন্তু **Vercel-ই primary**, দুটো একসাথে দরকার নেই।

---

## 3) Optional: Node/Express backend (`server.js`)

Firebase-এর বদলে (বা পাশাপাশি) একটা ছোট্ট নিজস্ব server ও দেওয়া আছে — এতে পাওয়া যায় **true server-side 301 redirect** (`GET /abc123` সরাসরি server থেকে redirect) আর একটা REST API:

```bash
npm install
npm start            # http://localhost:3000
```

- Data থাকে `db.json` ফাইলে (auto-create হয়; প্রথম API key: `demo-api-key-change-me` — real use-এর আগে বদলে নাও, অথবা env দাও: `JETLINK_API_KEYS="key1,key2" npm start`)।
- Render / Railway / নিজের VPS-এ চালানো যাবে। Vercel static site-এর সাথে এটা optional — দরকার হলে শুধু API + server-redirect-এর জন্য আলাদা subdomain-এ রাখো।

### API usage
```bash
# Create
curl -X POST https://your-server/api/v1/links \
  -H "x-api-key: YOUR_KEY" -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/a/long/page","alias":"my-page","ending":".mp4"}'

# List
curl https://your-server/api/v1/links -H "x-api-key: YOUR_KEY"

# Delete
curl -X DELETE https://your-server/api/v1/links/my-page -H "x-api-key: YOUR_KEY"
```
Response (201): `{ "code": "my-page", "short_url": "...", "display_url": "...", "destination": "..." }`
Errors: `400` invalid URL/alias, `401` bad API key, `409` alias taken, `404` unknown code.

Dashboard → **API** tab-এ প্রতিটা user-এর নিজের API key থাকে (generate/regenerate), আর একটা in-page tester আছে যেটা সব mode-এই কাজ করে।

---

## 4) Database structure

**Firestore collections** (Firebase mode) / **localStorage keys `jl_*`** (Demo mode) / **`db.json`** (Node mode):

| Collection | Fields |
|---|---|
| `links` (doc id = code) | `code, domain, ending, destination, type` (`link`/`image`/`media`), `title, description, image, showPlay, videoTime, position` (image cards), `owner` (uid বা `'guest'`), `clicks`, `createdAt` |
| `clicks` | `code, owner, ts, country, device` (Mobile/Tablet/Desktop), `referrer` |
| `users` (doc id = uid) | `name, email, role` (`user`/`admin`), `apiKey, createdAt` |
| `settings/site` | `cpmRate`, `domains[]` |
| `messages` | contact form: `name, email, subject, message, ts` |
| `reports` | abuse reports: `linkRef, email, reason, details, ts` |

Click-এর country আসে free `ipapi.co` lookup থেকে (key লাগে না; fail হলে silently blank থাকে)। QR code আসে free `api.qrserver.com` থেকে।

---

## 5) Honest feature list — কোনটা কোথায় কতটা working

### (a) Local Demo mode (কোনো config ছাড়া, শুধু ফাইলটা খুললেই)
✅ Fully working: 3-tab shortener (Short Link / Image Card with live preview / Media Link), custom endings, domain pool, result modal + QR (PNG/SVG download), bot-preview toggle, image-card landing page, click recording + redirect via `#/r/<code>`, demo register/login (localStorage), dashboard (overview chart, my links CRUD, bulk + CSV, per-link analytics + CSV export, API key + in-page tester), admin panel (demo admin = Firestore-এর বদলে local user doc-এ `role` বদলাতে হবে — সহজ পথ: Firebase mode), blog (12 original articles, search/filter/pagination), help/FAQ, contact + abuse forms (local-এ save হয়), legal pages, site stats from real local data.
⚠️ সীমাবদ্ধতা: data শুধু ঐ একটা browser-এ থাকে; demo password "hash" আসল security না; অন্য device থেকে short link খুললে ঐ device-এ link টা পাওয়া যাবে না।

### (b) Firebase mode (config paste করলে)
✅ উপরের সবই, কিন্তু data Firestore-এ shared — যেকোনো device থেকে link resolve হয়, real Email/Password accounts (Firebase Auth), password reset email, role-based admin, Firestore security rules। Vercel-এ host করা static site থেকেই সব চলবে।
⚠️ Click country lookup তখনও ipapi free tier; খুব বেশি traffic হলে ওদের rate limit লাগতে পারে।

### (c) Node server mode (`server.js`)
✅ True server-side **301 redirect** (`/abc123`), image-card landing page server থেকে, REST API with API-key auth, JSON file DB। Frontend ছাড়াও API দিয়ে link বানানো/মোছা যায়।
⚠️ JSON file DB ছোট site-এর জন্য ঠিক আছে; বড় scale-এ Firestore/SQL-এ migrate করতে হবে। Node DB আর Firestore একে অপরের সাথে sync হয় না — একটাকে main ধরো।

### এখনো যা backend/paid piece ছাড়া হবে না (সৎ তালিকা)
- **Real earnings/payouts:** Dashboard-এর earnings শুধু একটা **estimate** (clicks ÷ 1000 × CPM rate) — কোনো ad network বা payment system connect করা নেই, এটা real টাকা না।
- **নিজের custom domain-এ short links:** domain কিনে Vercel-এ connect না করা পর্যন্ত pool-এর domain গুলো শুধু display form; working link সবসময় তোমার আসল deployment address দিয়ে খোলে (modal-এ দুটোই পরিষ্কার দেখানো হয়, Copy সবসময় working URL টাই copy করে)।
- **Link-in-bio pages, team accounts, paid plans:** reference ecosystem-এ থাকলেও এই build-এ নেই — pricing page-এ শুধু Free plan আছে, যেটাই সত্যি।
- **Abuse auto-moderation:** reports admin panel-এ জমা হয়; auto phishing-scan-এর মতো paid/API service যোগ করা হয়নি।

---

## 6) Files

| File | কাজ |
|---|---|
| `index.html` | পুরো website (এক ফাইলে সব) |
| `vercel.json` | Vercel rewrites — short paths + SPA fallback → `index.html` |
| `firebase.json` | (Alternative) Firebase Hosting config |
| `firestore.rules` | Firestore security rules |
| `server.js` + `package.json` | Optional Node/Express backend (301 redirect + API) |
| `.vercelignore` | Node backend ফাইলগুলো Vercel static deploy থেকে বাদ রাখে |

Developed By Sabbir · Owner: Dev X Sabbir · Brand: JetLink (original) · সব লেখা ও code original — কোনো reference site-এর logo/brand/text copy করা হয়নি।

---

## 7) Build report — tests run & results (honest)

Build date: 2026-11-17 · Credit line: **Developed By Sabbir** · Owner: **Dev X Sabbir**

| # | Test | Result |
|---|---|---|
| 1 | সব inline `<script>` block extract করে `node --check` (4 blocks) | ✅ PASS — কোনো syntax error নেই |
| 2 | JS-এ referenced সব element id (106 টি) HTML-এ আছে কিনা cross-check | ✅ PASS — missing: NONE |
| 3 | `firebase.json`, `vercel.json`, `package.json` JSON validity | ✅ PASS |
| 4 | `node --check server.js` | ✅ PASS |
| 5 | `python3 -m http.server` দিয়ে `index.html` serve করে curl | ✅ HTTP 200, পুরো ফাইল আসে |
| 6 | **jsdom smoke test** (real app code, demo mode): shortener mount, 3 tabs, domain chips, FAQ, link create + DB lookup, pretty/working URL format, image-card type সংরক্ষণ, duplicate alias block, demo register, login, wrong-password reject, click counter + click record (country সহ) | ✅ 18/18 PASS, page error: none |
| 7 | **Vercel-style path test** (jsdom): `/test99.mp4` খুললে code resolve হয়, click record হয়, redirect attempt হয়; অজানা code `/zzzz99` → 404 view | ✅ PASS |
| 8 | **Node server live test**: `GET /` 200 · API create (key সহ) 201 · key ছাড়া 401 · `GET /test-link` → **301** আসল destination-এ, click count 1 · duplicate alias 409 · DELETE 200 · delete-এর পর 404 | ✅ সব PASS |
| 9 | Firebase mode (live) | ⚠️ NOT TESTED — কোনো real Firebase project/config ছিল না। Code compat SDK ব্যবহার করে, config paste করলেই চলার কথা; নিজের project দিয়ে একবার test করে নিও। |
| 10 | Real browser / mobile device visual test | ⚠️ NOT TESTED — jsdom দিয়ে logic test হয়েছে; আসল browser-এ একবার খুলে দেখে নেওয়া ভালো। |

Test-এর জন্য তৈরি `node_modules` / `db.json` deliverable folder থেকে মুছে দেওয়া হয়েছে — folder পরিষ্কার।

### Offline QA pass (2026-11-17, user offline থাকাকালীন)

আলাদা একটা deep QA pass চালানো হয়েছে (jsdom দিয়ে real app code, demo mode):

| # | Check | Result |
|---|---|---|
| 11 | **সব SPA route render test** — home, pricing, blog, article (1টি), help, faq, about, contact, report-abuse, legal ৭টি (terms, privacy, cookie-policy, acceptable-use, dmca, refund-policy, disclaimer), login, register, forgot-password — প্রতিটা non-empty render হয়েছে | ✅ 19/19 route PASS, page error: 0 |
| 12 | **Dashboard + Admin render** — demo register → login অবস্থায় dashboard, role বদলে admin view | ✅ দুটোই render হয়েছে, error 0 |
| 13 | **Click-through test** — home FAQ accordion খোলে, media ending button active হয়, dashboard-এর ৭টি tab-ই click করে render হয়েছে | ✅ সব PASS |
| 14 | **Link audit** — nav/footer/inline মিলিয়ে 29টি unique `#/...` link, প্রতিটা আসল route-এ resolve হয় | ✅ broken link: NONE |
| 15 | **Button audit** — সব view মিলিয়ে 95টি unique button; প্রতিটার click/submit handler আছে (data-act / data-dtab / data-lact / form submit / accordion wiring মিলিয়ে যাচাই) | ✅ handler ছাড়া button: NONE |
| 16 | **Fix applied** — `drawBarChart()`-এ canvas context পাওয়া না গেলে (খুব পুরনো browser/বিরল case) পুরো dashboard crash করত; এখন null-guard দেওয়া হয়েছে — chart skip হবে, page চলবে। Fix-এর পর সব inline script আবার `node --check` করা হয়েছে | ✅ PASS (সব মিলিয়ে QA: **61/61 PASS**) |
