# Nexora — Software House Website

A full website for a software house/agency, built from your business plan:
static **frontend** (plain HTML/CSS/JS, no build step) + a small **backend**
(Node.js/Express) that receives contact-form leads.

```
nexora-software-house/
├── frontend/              ← the website (open this in the browser / Live Server)
│   ├── index.html         Home
│   ├── services.html      Services, process (agile cycle), tech stack
│   ├── work.html          Portfolio / case studies
│   ├── pricing.html       Fixed-price / T&M / retainer + FAQ
│   ├── about.html         About + team + values
│   ├── blog.html          Blog / insights (placeholder posts)
│   ├── contact.html       Contact form (calls the backend API)
│   ├── privacy.html       Privacy Policy (placeholder — have a lawyer review)
│   ├── terms.html         Terms of Service (placeholder — have a lawyer review)
│   ├── css/style.css
│   └── js/main.js
├── backend/               ← small API that stores contact-form leads
│   ├── server.js
│   ├── routes/contact.js
│   ├── data/submissions.json   (created automatically, gitignored)
│   ├── package.json
│   └── .env.example
└── README.md
```

## Running it in VS Code

### 1. Backend (handles the contact form)

Open a terminal in VS Code:

```bash
cd backend
npm install
cp .env.example .env
npm start
```

You should see:
```
Nexora backend running at http://localhost:4000
```

Leave this running in its own terminal tab.

### 2. Frontend (the actual website)

The frontend is plain HTML/CSS/JS — no build step needed. Easiest options in VS Code:

**Option A — Live Server extension (recommended)**
1. Install the "Live Server" extension (by Ritwick Dey) from the VS Code Extensions tab.
2. Right-click `frontend/index.html` → "Open with Live Server".
3. It opens at something like `http://127.0.0.1:5500/frontend/index.html`.

**Option B — no extension needed**
```bash
cd frontend
python3 -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

> If your frontend runs on a different port than `5500`, add that origin to
> `backend/.env` under `CORS_ORIGIN`, and update `API_BASE` at the top of
> `frontend/js/main.js` if you change the backend's port.

## Testing the contact form

1. Make sure the backend is running (`npm start` in `backend/`).
2. Open the site's `contact.html` page and submit the form.
3. Check `backend/data/submissions.json` — your submission will be saved there.
4. You can also view all submissions at `http://localhost:4000/api/contact` (no auth — add
   authentication before using this in production).

## What to customize before launch

- **Branding:** swap "Nexora" for your real company name in every HTML file (search & replace),
  plus the logo mark and colors in `frontend/css/style.css` (`:root` variables at the top).
- **Content:** replace placeholder case studies (`work.html`), team names (`about.html`),
  and blog posts (`blog.html`) with real ones.
- **Contact details:** update the email/phone/hours in `contact.html` and `index.html`.
- **Email notifications:** `backend/routes/contact.js` currently only saves leads to a JSON
  file. Hook it up to a real email service (Nodemailer + SMTP, SendGrid, Postmark, etc.) so your
  team actually gets notified — there's a `TODO` marking exactly where to add this.
- **Legal pages:** `privacy.html` and `terms.html` are placeholders. Have them reviewed by a
  lawyer, or generate proper ones via a service like Termly/iubenda, before going live —
  see section 2 of your original business plan for the full list of documents you'll also want
  (NDA, MSA, SOW, contractor agreements, etc.) that live outside the website itself.
- **Deployment:** for production, deploy the backend (e.g. Render, Railway, a small VPS) and
  point `API_BASE` in `frontend/js/main.js` to its real URL; deploy the frontend as a static site
  (Netlify, Vercel, GitHub Pages, or the same server as the backend).

## Tech stack used here

- Frontend: HTML5, CSS3 (custom properties, no framework), vanilla JS
- Backend: Node.js + Express, JSON file storage (swap for a real database like PostgreSQL
  or MongoDB when you're ready — see the tech stack table in `services.html` for other options
  from your original plan)
