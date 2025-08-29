# Website Audit Tool (Security + Performance + SEO)

A hackathon-ready, full-stack project. Enter a URL and get a consolidated report:
- Lighthouse scores: **Performance, SEO, Accessibility, Best Practices**
- Security header checks (CSP, HSTS, X-Frame-Options, etc.)
- Basic SEO checks (title, meta description, H1, alt tags, sitemap/robots)

## 🛠️ Requirements
- Node.js 18+
- Chromium/Chrome installed (for Lighthouse headless run)

## 🚀 Quick Start
```bash
cd backend
npm install
npm run dev     # starts the server at http://localhost:4000
```
Open: http://localhost:4000

> If Lighthouse fails to find Chrome, install Chrome or set `CHROME_PATH` env var.

## 📦 Scripts
- `npm run dev` – start server with hot-reload (nodemon)
- `npm start` – start server (node)

## 📁 Structure
```
backend/
  server.js
  package.json
  utils/
    audit.js
    lighthouse.js
    security.js
    seo.js
public/
  index.html
  app.js
  style.css
```

## 🧪 Example
Type: `https://example.com` and press **Run Audit** → you'll see scores and detailed findings with recommendations. You can export JSON via the button.

## 🔐 Notes
This tool performs **read-only** checks. It does not attack or exploit targets. Use only on sites you own or have permission to test.
