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
    id: 'shiftflow',
    status: 'live',
    url: '../index.html',
    icon: 'handover',
    developer: 'claudio',
    name: 'ShiftFlow BR3R',
    category: { en: 'Operational Intelligence', pt: 'Inteligência Operacional' },
    description: {
      en: 'Digital shift handover for shipping: loaded and unloaded volumes, incidents, blocks, trucks waiting over 4 hours and required photos — with a manager area for real-time history and productivity.',
      pt: 'Troca de turno digital da expedição: volumes carregados e descarregados, incidentes, bloqueios, veículos com mais de 4 horas de espera e fotos obrigatórias — com área do gestor para histórico em tempo real e produtividade.'
    },
    problem: {
      en: 'Shift handovers need a standardized, traceable record that managers can follow up on.',
      pt: 'A troca de turno precisa de um registro padronizado e rastreável, acompanhável pela gestão.'
    },
    tech: {
      objective: {
        en: 'Standardize the shift handover record of the shipping team and give managers a consolidated, real-time view of each shift.',
        pt: 'Padronizar o registro da troca de turno da expedição e dar aos gestores uma visão consolidada e em tempo real de cada turno.'
      },
      dataSources: {
        en: [
          'Supabase (PostgreSQL) tables: turnos, profiles, disciplina, disciplina_planos.',
          'Supabase Storage bucket for shift photos (fotos-turnos).',
          'Data is entered by the operators in the app; there is no automatic feed from corporate systems.',
          'Browser localStorage only for preferences (theme, last state).'
        ],
        pt: [
          'Tabelas no Supabase (PostgreSQL): turnos, profiles, disciplina, disciplina_planos.',
          'Bucket do Supabase Storage para fotos do turno (fotos-turnos).',
          'Os dados são lançados pelos operadores no app; não há alimentação automática por sistemas corporativos.',
          'localStorage do navegador apenas para preferências (tema, último estado).'
        ]
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Chart.js + chartjs-plugin-datalabels', 'supabase-js v2 (database, storage, realtime)', 'Web Share API (sharing to the logistics group)', 'Installable web app (manifest), light/dark theme'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Chart.js + chartjs-plugin-datalabels', 'supabase-js v2 (banco, storage, realtime)', 'Web Share API (compartilhamento no grupo da logística)', 'Web app instalável (manifest), tema claro/escuro']
      },
      businessRules: {
        en: [
          'Login per checker (conferente) with a 4-digit PIN; the shift team is pre-selected from the profile.',
          'The question about vehicles waiting over 4 hours must be answered — and justified — before finalizing.',
          'Required photos are uploaded and the formatted summary is shared when the handover is finalized.',
          'Manager role unlocks the manager area: real-time history, productivity by team, monthly evolution.',
          'Disciplinary occurrences per checker with action plans, cross-filtered charts and CSV export.'
        ],
        pt: [
          'Login por conferente com PIN de 4 dígitos; a turma é pré-selecionada pelo cadastro.',
          'A pergunta sobre veículos com mais de 4 horas de espera deve ser respondida — e justificada — antes de finalizar.',
          'Fotos obrigatórias são enviadas e o resumo formatado é compartilhado ao finalizar a troca de turno.',
          'Perfil de gestor libera a área do gestor: histórico em tempo real, produtividade por turma, evolução mensal.',
          'Ocorrências disciplinares por conferente com plano de ação, gráficos com filtro cruzado e exportação CSV.'
        ]
      },
      integration: {
        en: 'Standalone cloud database (Supabase). Not integrated with WMS, TMS or other corporate systems.',
        pt: 'Banco de dados em nuvem independente (Supabase). Não integrado a WMS, TMS ou outros sistemas corporativos.'
      },
      evolution: {
        en: [
          'Move authentication to the server side (corporate SSO or Supabase Auth with row-level security) instead of PIN validation in the browser.',
          'Host the database and storage in an environment approved by Ball IT.',
          'Feed volumes and vehicle times from WMS/TMS to reduce manual entry.',
          'Expose the shift data to the corporate BI / data warehouse.'
        ],
        pt: [
          'Levar a autenticação para o servidor (SSO corporativo ou Supabase Auth com row-level security) em vez de validar o PIN no navegador.',
          'Hospedar banco e storage em ambiente aprovado pela TI da Ball.',
          'Alimentar volumes e tempos de veículos a partir do WMS/TMS para reduzir lançamentos manuais.',
          'Disponibilizar os dados de turno ao BI / data warehouse corporativo.'
        ]
      }
    }
  },
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
