# Logistics Digital Innovation — Ball Três Rios

Portfolio of digital solutions from the Logistics team (Ball Corporation, Três Rios).
Static HTML/CSS/JS: no build step, no server code, no credentials.

```
portfolio/
  index.html              home page (project cards)
  assets/css/portfolio.css
  assets/js/i18n.js       interface text (EN / PT)
  assets/js/projects.js   project registry — the only file to edit when adding a project
  assets/js/app.js        rendering, filters, language, theme, technical-details dialog
  assets/images/          official logo (only when provided/authorized)
  projects/               original dashboards, one folder per project
```

## Adding a dashboard

1. Copy the original dashboard, unchanged, into `projects/<project-name>/`
   (keep its own CSS, JS, images and data files next to it so relative paths keep working).
2. Check its dependencies: CDN libraries, relative paths, data files, external API calls,
   and any key or credential in the code (these must not be published).
3. In `assets/js/projects.js`, change the card's `status` to `'live'`, set
   `url: 'projects/<project-name>/index.html'`, and fill `description`, `problem`
   and (optionally) `tech` with facts verified in the code.

Projects open in a new tab, so the portfolio stays available and the dashboards run
exactly as they were built.

## Official logo

Place the authorized file in `assets/images/` and set `window.BRAND_LOGO` in
`projects.js`. Until then the header shows the company name as text.

## Security notes

- Nothing in this portfolio reads or stores operational data; it only links to the dashboards.
- Any code published as a static site is readable by its visitors — do not rely on it being hidden.
- Final hosting and user access must follow an environment approved by Ball IT.
