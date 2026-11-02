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

## Dashboards and distribution

The dashboards in `projects/` hold real operational data (sales history,
customer master, warehouse layout). This repository is public, so they are
listed in `.gitignore` and never pushed here. The complete portfolio
(this folder + `projects/`) is distributed as a ZIP, to be placed in a
location approved by Ball IT (SharePoint, OneDrive or internal server).

| Folder | Original file |
|---|---|
| projects/grade-carregamento | Grade_de_Embarque_Latas_e_Tampas_BR3R.html |
| projects/projecao-transferencia | Projeção_Transferência_BR3R.html |
| projects/projecao-ocupacao | Projeção_de_Ocupação_BR3R.html |
| projects/relatorio-vendas | Relatório_de_Vendas_BR3R.html |
| projects/metal | Recebimento_e_Estoque_de_Metal_BR3R.html |
| projects/mapa-calor-ehs | Mapa_de_Calor_Armazem_BR3R.html |

The files are byte-identical copies of the originals.

## Banner and logo

The banner follows the standard of the BR3R Logistics dashboards. The Ball logo
and the Três Rios badge in `assets/images/` were taken from those dashboards.

## Security notes

- Nothing in this portfolio reads or stores operational data; it only links to the dashboards.
- Any code published as a static site is readable by its visitors — do not rely on it being hidden.
- Final hosting and user access must follow an environment approved by Ball IT.
