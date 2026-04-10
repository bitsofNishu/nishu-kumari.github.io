# BioNex Portfolio — Ms. Kiro

A sci-fi themed personal portfolio with constellation background, DNA helix loader, and fully JSON-driven content.

## 📁 Project Structure

```
portfolio/
├── index.html          # Loading screen (entry point)
├── main.html           # Main portfolio site
├── style.css           # All styles (shared by both pages)
├── loader.js           # Loader animations + warp transition
├── script.js           # Main site rendering + animations
├── data/               # ✏️ Edit these JSON files to update content
│   ├── loader.json     # Loading screen text & console logs
│   ├── hero.json       # Name, taglines, CTA buttons
│   ├── about.json      # Profile image, fields, bio
│   ├── education.json  # Schools, boards, logos, years, status
│   ├── projects.json   # Project cards (title, tags, status)
│   ├── skills.json     # Skill icons, names, levels
│   ├── certs.json      # Certificates + PDF paths
│   └── contact.json    # Terminal prompt, social links
└── assets/             # Images, logos, PDFs
    ├── education_logo.png   # Profile image (placeholder)
    ├── bseb_logo.png        # BSEB board logo
    └── lpu_logo.png         # LPU university logo
```

## 🚀 Getting Started

Serve the folder with any static server:

```bash
# Python
python3 -m http.server 5050

# Node (npx)
npx serve -p 5050

# VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open `http://localhost:5050/`

## ✏️ How to Update Content

All content lives in `data/*.json`. No HTML or JS changes needed.

### Change name / taglines
Edit `data/hero.json`:
```json
{
  "name": "Ms. Kiro",
  "taglines": [
    "Biotechnology Explorer // Genetic Architect",
    "AI Curious // Code Meets Biology"
  ]
}
```

### Update About Me
Edit `data/about.json` — change fields, bio text, or profile image path.

### Add/remove education
Edit `data/education.json` — each entry needs:
- `level` — degree name (e.g. "Class X", "B.Tech Biotechnology")
- `board` — board/university name
- `school` — school/college name
- `logo` — path to logo image in `assets/`
- `year` — passing year or range
- `status` — `"complete"` or `"progress"`

### Add/remove projects
Edit `data/projects.json` — each entry needs:
- `id` — unique ID (e.g. "PRJ-005")
- `title`, `desc` — project name and description
- `tags` — array of tech tags
- `status` — `"live"`, `"complete"`, or `"progress"`
- `link` — URL to project

### Add/remove skills
Edit `data/skills.json`:
```json
{ "icon": "🤖", "name": "Artificial Intelligence", "level": 65 }
```
`level` is 0–100, controls the animated bar width.

### Add/remove certifications
Edit `data/certs.json`:
```json
{
  "title": "Genomic Data Science",
  "provider": "Coursera",
  "date": "2023",
  "pdf": "assets/my-certificate.pdf"
}
```
Place PDF files in `assets/`. Clicking a cert card opens the PDF in a modal viewer.

### Update contact links
Edit `data/contact.json`:
```json
{
  "prompt": "kiro@comm:~$",
  "links": [
    { "icon": "✉", "label": "Email", "href": "mailto:you@email.com" },
    { "icon": "⟐", "label": "GitHub", "href": "https://github.com/you" },
    { "icon": "◈", "label": "LinkedIn", "href": "https://linkedin.com/in/you" }
  ]
}
```

### Update loading screen
Edit `data/loader.json` — change title, ready message, name, button text, or console log entries.

## 🎨 Customizing Colors

All colors are CSS variables at the top of `style.css`:

```css
:root {
  --bg: #09080e;             /* Main screen background color */
  --neon-blue: #a78bfa;      /* Headings & links */
  --neon-green: #34d399;     /* Status badges, verified, marks */
  --neon-purple: #f9a8d4;    /* Accents: names, providers, badges */
  --neon-pink: #fb7185;      /* Errors, warnings, CTA highlights */
  --text: #ffffff;           /* Main body text */
  --text-dim: #b8b2cc;      /* Secondary/muted text */
}
```

The loading screen background gradient is also in `style.css` — search for `Loading screen background`.

## 🔄 Page Flow

1. User visits `index.html` (loader)
2. DNA helix + console boot sequence plays
3. Click **▶ INITIALIZE** → warp animation → navigates to `main.html`
4. Refreshing `main.html` redirects back to loader (via sessionStorage flag)

## 📱 Responsive

- Desktop: full constellation, cursor glow, hover effects
- Mobile (≤768px): cursor effects hidden, simplified layout, stacked grids

## 🧩 Features

- **Constellation background** — 120 twinkling stars with realistic colors, connected by lines
- **Bio-fact tooltips** — hover near stars to see random biology facts
- **DNA helix loader** — animated double helix with console boot sequence
- **Warp transition** — speed lines + zoom blur when entering main site
- **Typing effect** — rotating taglines with blinking cursor
- **Glass morphism cards** — frosted glass UI throughout
- **Hexagonal profile** — hex-clipped photo with animated rings
- **Interactive terminal** — type commands (help, about, email, github, etc.)
- **PDF certificate viewer** — click cert cards to view PDFs in modal
- **Scroll reveal** — sections animate in on scroll
- **Sound toggle** — optional sci-fi beep effects
- **Nav rail** — vertical dot navigation with scroll-based active state
