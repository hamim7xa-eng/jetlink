# JetLink — Deploy Guide (ধাপে ধাপে, বাংলায়)

এই guide follow করলে সাইটটা পুরোপুরি live হয়ে যাবে: প্রথমে **Firebase** (login + database), তারপর **GitHub**-এ code, শেষে **Vercel**-এ hosting। সবগুলোই free।

মোট ৩টা অংশ:
- **Part A — Firebase setup** (একবারই করতে হয়)
- **Part B — GitHub-এ code upload**
- **Part C — Vercel-এ live করা**

---

## Part A — Firebase setup

### ধাপ 1: Firebase project তৈরি

1. Browser-এ যাও: **console.firebase.google.com**
2. **"Add project"** (বা "Create a project") button-এ click করো।
3. Project name দাও, যেমন: `jetlink`
4. Terms accept করে **Continue** চাপো।
5. Google Analytics চাইলে off রাখতে পারো (দরকার নেই) → **Create project** → একটু wait করো → **Continue**।

### ধাপ 2: Authentication চালু করা (signup/login-এর জন্য)

1. বাম পাশের menu থেকে **Build → Authentication**-এ click করো।
2. **"Get started"** button চাপো।
3. **Sign-in method** tab-এ যাও।
4. **Email/Password**-তে click করো → **Enable** toggle on করো → **Save**।

### ধাপ 3: Firestore Database তৈরি (links/users/clicks রাখার জন্য)

1. বাম menu থেকে **Build → Firestore Database**-এ click করো।
2. **"Create database"** button চাপো।
3. **"Start in production mode"** select করো → **Next**।
4. Location যেটা আসে সেটাই রেখে **Enable** চাপো।

### ধাপ 4: firebaseConfig কপি করা

1. বাম উপরে Project Overview-এর পাশের **⚙️ (gear) icon → Project settings**-এ click করো।
2. **General** tab-এ নিচের দিকে **"Your apps"** অংশে **Web icon (`</>`)**-তে click করো।
3. App nickname দাও (যেমন `jetlink-web`) → **Register app** চাপো।
4. স্ক্রিনে `firebaseConfig` নামে একটা code দেখাবে — দেখতে এমন:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

5. এই পুরো অংশটা **copy** করে রাখো।

> ⚠️ এই config secret না — এটা website-এর code-এ থাকাই নিয়ম। আসল security আসে Firestore Rules থেকে (ধাপ 6)।

### ধাপ 5: config-টা index.html-তে বসানো

1. `index.html` ফাইলটা খোলো (Notepad/VS Code যেকোনোটায়)।
2. **Ctrl+F** দিয়ে খোঁজো: `PASTE YOUR FIREBASE CONFIG HERE`
3. ঠিক তার নিচেই `const firebaseConfig = { ... }` আছে, যেখানে সব value খালি (`""`)।
4. খালি value গুলোর জায়গায় ধাপ 4-এ copy করা নিজের value গুলো বসাও।
5. File **Save** করো।

### ধাপ 6: Firestore Rules publish করা

1. Firebase Console-এ **Build → Firestore Database → Rules** tab-এ যাও।
2. তোমার ফোল্ডারে থাকা **`firestore.rules`** ফাইলটা খুলে পুরো লেখা copy করো।
3. Rules editor-এর পুরনো লেখা মুছে copy করা লেখা paste করো।
4. **Publish** button চাপো।

### ধাপ 7: Vercel-এর domain-টা Firebase-এ allow করা

এটা না করলে Vercel-এর live site থেকে login কাজ করবে না!

1. **Build → Authentication → Settings** tab-এ যাও।
2. **Authorized domains** অংশে **"Add domain"** চাপো।
3. তোমার Vercel domain যোগ করো (যেমন `jetlink.vercel.app` — Part C-তে পাওয়া যাবে; পরে এসে যোগ করলেও হবে)।
4. পরে custom domain কিনলে সেটাও এখানে যোগ করতে হবে।

### ধাপ 8: প্রথম Admin বানানো

1. আগে live site-এ গিয়ে নিজের email দিয়ে একটা **account register** করো (Part C শেষ হলে)।
2. তারপর Firebase Console-এ **Build → Firestore Database → Data** tab-এ যাও।
3. **users** collection খোলো → নিজের email-এর document-টা খোলো।
4. `role` field-এ দেখবে লেখা আছে `user` — ওটায় click করে value বদলে **`admin`** লেখো → **Update/Save**।
5. Site-এ **Logout করে আবার Login** করো — এখন উপরে **Admin** menu দেখা যাবে।

---

## Part B — GitHub-এ code upload

1. **github.com**-এ login করো (account না থাকলে free sign up করো)।
2. ডান উপরে **"+" → New repository**-তে click করো।
3. Repository name দাও: `jetlink` → **Public** select রাখো → **Create repository**।
4. নতুন repo-র পেজে **"uploading an existing file"** লিংকে click করো।
5. তোমার `urljetz-clone` ফোল্ডারের **সব ফাইল** drag করে দাও:
   `index.html`, `vercel.json`, `firebase.json`, `firestore.rules`, `server.js`, `package.json`, `README.md`, `DEPLOY-GUIDE-BN.md`
6. নিচে **Commit changes** button চাপো।

> 💡 এরপর থেকে code বদলাতে চাইলে: GitHub repo-তে ফাইলটা খুলে ✏️ (pencil) icon দিয়ে edit করে Commit করলেই Vercel নিজে নিজে নতুন version live করে দেবে।

---

## Part C — Vercel-এ live করা

1. **vercel.com**-এ যাও → **Sign Up / Log In → Continue with GitHub** দিয়ে login করো।
2. **Add New → Project**-তে click করো।
3. তালিকা থেকে তোমার `jetlink` repo-র পাশে **Import** চাপো।
4. Framework Preset: **Other** (static site) রাখো — কোনো setting বদলাতে হবে না, `vercel.json` ফাইলেই সব দেওয়া আছে।
5. **Deploy** button চাপো → ১-২ মিনিট wait করো।
6. Deploy শেষ হলে একটা live link পাবে, যেমন: **https://jetlink.vercel.app** 🎉
7. এই link-টা Part A-এর **ধাপ 7**-এ Firebase Authorized domains-এ যোগ করে এসো (যদি আগে না করে থাকো)।

এই `*.vercel.app` link-টাই permanent — free plan-এ সাইট এখানেই চলবে।

---

## পরে Custom Domain যোগ করা (যখন domain কিনবে)

1. Vercel-এ তোমার project খোলো → **Settings → Domains**।
2. নিজের domain লিখে **Add** চাপো।
3. Vercel স্ক্রিনে DNS record দেখাবে (সাধারণত একটা **A record** আর একটা **CNAME record**)।
4. যেখান থেকে domain কিনেছো (Namecheap/Cloudflare ইত্যাদি) সেখানকার **DNS settings**-এ গিয়ে ঠিক ওই record গুলো যোগ করো।
5. কিছুক্ষণ wait করো — Vercel নিজে থেকেই **Verified** দেখাবে আর free **SSL (https)** চালু করে দেবে।
6. শেষে Firebase Console → Authentication → Settings → **Authorized domains**-এ এই custom domain-টাও যোগ করো (না হলে ওই domain থেকে login হবে না)।

---

## Contact Email বদলানো

Site-এর Contact/About page-এ এখন `[Your Support Email]` লেখা আছে। নিজের আসল email বসাতে:

1. `index.html` খোলো → **Ctrl+F** দিয়ে খোঁজো: `[Your Support Email]`
2. সব জায়গায় (২ জায়গায় আছে) ওটা মুছে নিজের আসল support email লেখো।
3. Save করে GitHub-এ ফাইলটা আবার upload/commit করো → Vercel auto-deploy করে দেবে।

---

## Domain Pool বদলানো (short link-এর domain তালিকা)

1. `index.html`-তে **Ctrl+F** দিয়ে খোঁজো: `DOMAIN_POOL`
2. একটা list দেখবে — এমন: `'jetlink.to', 'jlnk.me', ...` — এগুলোই dropdown-এ দেখায়।
3. নিজের পছন্দের domain যোগ/বাদ দাও (comma আর quote ঠিক রেখে)।
4. ⚠️ শুধু সেই domain-ই যোগ করো যেটা তুমি **সত্যিই কিনেছো আর Vercel-এ connect করেছো** — অন্যের domain লিখলে ওই link কাজ করবে না, শুধু দেখতে সুন্দর লাগবে।
5. Save → GitHub-এ commit → Vercel auto-deploy।

---

## সমস্যা হলে কী check করবে (Troubleshooting)

1. **Site-এ "Demo mode" banner দেখাচ্ছে / login করলে data হারিয়ে যাচ্ছে**
   → Firebase config ঠিকমতো বসেনি। `index.html`-তে `firebaseConfig`-এর `apiKey` খালি (`""`) আছে কিনা দেখো। ঠিক করে আবার GitHub-এ upload করো, তারপর browser-এ **Ctrl+Shift+R** (hard refresh) দাও।

2. **Signup/Login কাজ করছে না (error আসে)**
   → দুটো জিনিস check করো: (ক) Firebase Console → Authentication-এ **Email/Password enable** আছে কিনা; (খ) Authentication → Settings → **Authorized domains**-এ তোমার Vercel/custom domain যোগ করা আছে কিনা।

3. **Link save হচ্ছে না / "permission denied" error**
   → Firestore-এর **Rules** publish হয়নি, অথবা পুরনো rules রয়ে গেছে। Part A ধাপ 6 আবার করো — `firestore.rules` ফাইলের লেখা হুবহু paste করে **Publish** চাপো।

4. **Short link খুললে redirect হচ্ছে না / 404 আসে**
   → GitHub repo-তে **`vercel.json`** ফাইলটা আছে কিনা দেখো। না থাকলে upload করো। থাকলে Vercel dashboard → **Deployments**-এ গিয়ে সর্বশেষ deploy-টা সফল (Ready) হয়েছে কিনা দেখো; দরকার হলে **Redeploy** করো।

5. **GitHub-এ code বদলালাম কিন্তু site-এ পুরনো version দেখাচ্ছে**
   → Vercel dashboard → Deployments-এ নতুন deploy চলছে/শেষ হয়েছে কিনা দেখো। শেষ হয়ে থাকলে browser cache-এর সমস্যা — **Ctrl+Shift+R** দিয়ে hard refresh করো।

6. **Admin menu দেখা যাচ্ছে না**
   → Firestore-এ নিজের user document-এ `role` field-টা হুবহু **`admin`** লিখেছো কিনা দেখো, তারপর site-এ **logout → login** করো।

---

*Developed By Sabbir · Owner: Dev X Sabbir · Brand: JetLink*
