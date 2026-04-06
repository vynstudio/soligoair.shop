# Soligo Air — soligoair.shop

Production website for Soligo Air, a licensed HVAC contractor serving Central Florida.

**Live site:** https://soligoair.shop
**Stack:** Static HTML/CSS/JS · Bootstrap 5 · Netlify · Netlify Functions
**License:** FL CAC1823002

---

## 🗂 Project Structure

```
/
├── index.html              # Homepage (CoolAir template, Soligo branding)
├── 404.html                # Custom error page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Crawler rules
├── manifest.json           # PWA manifest
├── netlify.toml            # Build config, headers, redirects
├── _headers                # Netlify headers (backup)
├── _redirects              # Netlify redirects (backup)
├── .env.example            # Environment variable reference
├── .gitignore
│
├── css/                    # All stylesheets
│   ├── bootstrap.min.css
│   ├── style.css           # CoolAir base template styles
│   ├── coloring.css        # Color utility classes
│   ├── plugins.css         # Third-party plugin CSS
│   ├── swiper.css          # Hero slider
│   └── colors/
│       └── scheme-01.css   # Soligo brand overrides
│
├── js/                     # All JavaScript
│   ├── plugins.js          # WOW.js, jarallax, owl carousel
│   ├── designesia.js       # Template core engine
│   ├── swiper.js           # Swiper slider
│   ├── custom-swiper-1.js  # Swiper config
│   └── custom-marquee.js   # Areas ticker
│
├── images/                 # All images
│   ├── slider/             # Hero slider backgrounds
│   ├── misc/               # Service & about images
│   ├── icons/              # Section icons
│   ├── testimonial/        # Review avatars
│   └── ...
│
├── fonts/                  # Self-hosted fonts
│   ├── fontawesome6/       # FA6 icons
│   ├── icofont/            # IcoFont icons
│   └── elegant_font/       # Elegant Icons
│
└── netlify/
    └── functions/
        └── submit-lead.js  # Lead capture serverless function
```

---

## 🚀 Local Development

```bash
# Option 1: Simple (no functions)
npx serve .

# Option 2: With Netlify functions
npm install -g netlify-cli
netlify dev
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in real values. Set these in Netlify dashboard under **Site Settings → Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `GHL_WEBHOOK_URL` | Yes | GoHighLevel lead webhook |
| `GHL_API_KEY` | Phase 2 | GHL API for direct contact creation |
| `RESEND_API_KEY` | Yes | Email notification API |
| `FROM_EMAIL` | Yes | Sender email for notifications |
| `NOTIFY_EMAIL` | Yes | Where to receive lead emails |
| `META_PIXEL_ID` | Yes | Facebook Pixel ID |
| `META_CAPI_TOKEN` | Yes | Meta Conversions API token |

---

## 📦 Deployment

Push to `main` → Netlify auto-deploys.

```bash
git add -A && git commit -m "your message" && git push origin main
```

---

## 🗺 Phase 2 Roadmap

- [ ] SMS confirmation on lead submission (Twilio)
- [ ] Online booking integration (Calendly / custom)
- [ ] Customer portal (job status, invoices)
- [ ] Review collection automation (post-job SMS)
- [ ] Google Ads conversion tracking (server-side)
- [ ] Air Care+ membership signup flow (Stripe)
- [ ] Blog CMS (Netlify CMS or Decap)
- [ ] Spanish language version

---

## 📞 Contact

**Soligo Air**
6752 Curtis St, Orlando, FL 32807
(321) 384-7868 | info@soligoair.com
FL Lic. CAC1823002
