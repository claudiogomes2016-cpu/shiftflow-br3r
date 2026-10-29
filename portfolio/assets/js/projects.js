/* ─────────────────────────────────────────────────────────────
   PROJECT REGISTRY
   Add a project by appending an object to PROJECTS.

   status: 'live'  → shows OPEN PROJECT (url is required)
           'prep'  → shows "In preparation", no link
   url:    path to the original dashboard, relative to portfolio/index.html.
           Keep originals untouched (e.g. projects/<name>/index.html).
   tech:   optional. Fill ONLY with facts verified in the source code.
   Text fields accept a string or { en, pt }.
   ───────────────────────────────────────────────────────────── */

// Path to the official, authorized Ball logo (e.g. 'assets/images/ball-logo.svg').
// Leave empty until the file is provided — the header then shows the text name only.
window.BRAND_LOGO = '';

window.DEVELOPERS = {
  claudio: { name: 'Claudio Gomes', role: { en: 'Logistics Supervisor', pt: 'Supervisor de Logística' } },
  rickson: { name: 'Rickson', role: { en: 'Shipping Analyst', pt: 'Analista de Expedição' } }
};

window.PROJECTS = [
  {
    id: 'plant-occupancy',
    status: 'prep',
    icon: 'warehouse',
    developer: 'claudio',
    name: { en: 'Plant Occupancy Dashboard', pt: 'Dashboard de Ocupação da Planta' },
    category: { en: 'Warehouse Management', pt: 'Gestão de Armazém' }
  },
  {
    id: 'warehouse-heatmap',
    status: 'prep',
    icon: 'heatmap',
    developer: 'claudio',
    name: { en: 'Warehouse Heat Map', pt: 'Mapa de Calor do Armazém' },
    category: { en: 'Inventory Control', pt: 'Controle de Estoque' }
  },
  {
    id: 'rickson-01',
    status: 'prep',
    icon: 'truck',
    developer: 'rickson',
    name: { en: 'Shipping project', pt: 'Projeto de Expedição' },
    category: { en: 'Transportation', pt: 'Transporte' }
  }
];
