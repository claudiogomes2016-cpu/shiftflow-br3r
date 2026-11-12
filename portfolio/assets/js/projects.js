/* ─────────────────────────────────────────────────────────────
   PROJECT REGISTRY
   Add a project by appending an object to PROJECTS.

   status: 'live'  → shows OPEN PROJECT (url is required)
           'prep'  → shows "In preparation", no link
   url:    path to the original dashboard, relative to portfolio/index.html.
   files:  the dashboard's file names; if url is missing, the file is also
           looked for next to the portfolio and in its parent folder.
           Keep originals untouched (e.g. projects/<name>/index.html).
   tech:   optional. Fill ONLY with facts verified in the source code.
   banner: title / accent (blue word) / sub — copied from the dashboard's own banner.
   Presentation text (purpose / improved / practice) lives in pitch.js, kept out of git.
   Text fields accept a string or { en, pt }.
   ───────────────────────────────────────────────────────────── */

// Path to the official, authorized Ball logo (e.g. 'assets/images/ball-logo.svg').
// Taken from the banner of the team's own dashboards. Leave empty to show the text name only.
window.BRAND_LOGO = 'assets/images/ball-logo.png';

// Path to the Três Rios site badge shown at the left of the banner (e.g. 'assets/images/tres-rios.png').
window.SITE_BADGE = 'assets/images/tres-rios-badge.png';

window.DEVELOPERS = {
  claudio: { name: 'Claudio Gomes', role: { en: 'Logistics Supervisor', pt: 'Supervisor de Logística' } },
  rickson: { name: 'Rickson', role: { en: 'Shipping Analyst', pt: 'Analista de Expedição' } }
};

// Facts shared by the SAP-fed dashboards below (verified in their source).
const SAP_RUNTIME = {
  en: 'Runs entirely in the browser (Chrome/Edge). The ATUALIZAR SAP button calls a VBScript that uses SAP GUI Scripting on the user\'s PC to export the reports; the page then reads the exported files. No server, database or credentials in the code.',
  pt: 'Roda inteiramente no navegador (Chrome/Edge). O botão ATUALIZAR SAP chama um VBScript que usa o SAP GUI Scripting no PC do usuário para exportar os relatórios; a página então lê os arquivos exportados. Sem servidor, banco de dados ou credenciais no código.'
};
const SAP_INTEGRATION = {
  en: 'SAP data comes from report exports (files), not from a direct database or API connection. Not integrated with WMS or TMS.',
  pt: 'Os dados do SAP vêm da exportação de relatórios (arquivos), não de conexão direta com banco ou API. Não integrado a WMS ou TMS.'
};
const SAP_EVOLUTION = {
  en: [
    'Replace the desktop VBScript export with a scheduled extraction approved by IT (SAP OData/CDS views or BW).',
    'Host on an internal web server or SharePoint with corporate sign-in.'
  ],
  pt: [
    'Substituir a exportação por VBScript no desktop por uma extração agendada aprovada pela TI (OData/CDS do SAP ou BW).',
    'Hospedar em servidor web interno ou SharePoint com login corporativo.'
  ]
};

window.PROJECTS = [
  {
    id: 'grade-carregamento',
    status: 'live',
    url: 'projects/grade-carregamento/Grade_de_Embarque_Latas_e_Tampas_BR3R.html',
    files: ['Grade_de_Embarque_Latas_e_Tampas_BR3R.html'],
    icon: 'truck',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'GRADE DE CARREGAMENTO' },
    name: { en: 'Loading Schedule · Cans & Ends', pt: 'Grade de Carregamento · Latas e Tampas' },
    category: { en: 'Transportation', pt: 'Transporte' },
    description: {
      en: 'Crosses the SAP loading schedule with stock to show, order by order, the pallet balance at the plant and at the AG warehouse, stock shortages, customer restrictions and status — plus a logistics analysis by customer and period.',
      pt: 'Cruza a grade de carregamento do SAP com o estoque para mostrar, pedido a pedido, o saldo em paletes na planta e no AG, falta de estoque, restrições de cliente e status — além de uma análise logística por cliente e período.'
    },
    problem: {
      en: 'Knowing before loading which orders are covered by plant or AG stock and which are short.',
      pt: 'Saber antes do carregamento quais pedidos têm estoque na planta ou no AG e quais estão em falta.'
    },
    tech: {
      objective: {
        en: 'Give shipping a single view of the cans and ends loading schedule against available stock.',
        pt: 'Dar à expedição uma visão única da grade de carregamento de latas e tampas contra o estoque disponível.'
      },
      dataSources: {
        en: ['SAP ZTSD0012 (loading schedule) and MB52 (stock) — required.', 'SAP ZTSD0123 (billing) for the logistics analysis.', 'Restriction, region and palletization spreadsheets (default copies embedded in the file).', 'Customer master embedded in the file (code, name, city).'],
        pt: ['SAP ZTSD0012 (grade) e MB52 (estoque) — obrigatórios.', 'SAP ZTSD0123 (faturamento) para a análise logística.', 'Planilhas de restrição, região e paletização (cópias padrão embutidas no arquivo).', 'Cadastro de clientes embutido no arquivo (código, nome, cidade).']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Built-in Excel (.xlsx) reader using the browser DecompressionStream · html2canvas (copy as image)', 'File System Access API + IndexedDB to re-read the SAP folder', 'VBScript + SAP GUI Scripting for the export', 'Light/dark theme'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Leitor próprio de Excel (.xlsx) com DecompressionStream do navegador · html2canvas (copiar como imagem)', 'File System Access API + IndexedDB para reler a pasta do SAP', 'VBScript + SAP GUI Scripting para a exportação', 'Tema claro/escuro']
      },
      businessRules: {
        en: ['Order balances converted from thousand cans to pallets with the palletization matrix.', 'Balance split between plant and AG, flagging stock shortage per order.', 'Customer restrictions matched by customer + exact format (never approximate).', 'Filters by customer group, location (plant / AG) and period (7, 14, 30 days or all).'],
        pt: ['Saldos dos pedidos convertidos de milheiro para paletes pela matriz de paletização.', 'Saldo dividido entre planta e AG, sinalizando falta de estoque por pedido.', 'Restrições de cliente aplicadas por cliente + formato exato (nunca aproximado).', 'Filtros por grupo de cliente, local (planta / AG) e período (7, 14, 30 dias ou todo).']
      },
      operation: SAP_RUNTIME,
      integration: SAP_INTEGRATION,
      evolution: SAP_EVOLUTION
    }
  },
  {
    id: 'projecao-transferencia',
    status: 'live',
    url: 'projects/projecao-transferencia/Projecao_Transferencia_BR3R.html',
    files: ['Projecao_Transferencia_BR3R.html', 'Projeção_Transferência_BR3R.html'],
    icon: 'transfer',
    developer: 'claudio',
    banner: { title: 'PROJEÇÃO', accent: 'TRANSFERÊNCIA', sub: 'RELATÓRIO DE PROJEÇÃO DE CARGAS · MB52 + VL10D' },
    name: { en: 'Transfer Projection', pt: 'Projeção de Transferência' },
    category: { en: 'Transportation', pt: 'Transporte' },
    description: {
      en: 'Projects how many full trucks can be built from free stock against pending orders, for the Ball plant and NSA, combining 1, 2 or 3 SKUs per truck and showing trucks available with immediate stock.',
      pt: 'Projeta quantas carretas completas podem ser montadas com o estoque livre contra os pedidos pendentes, na planta Ball e no NSA, combinando 1, 2 ou 3 SKUs por carreta e mostrando as carretas com estoque imediato.'
    },
    problem: {
      en: 'Planning transfer loads from stock and open orders without manual calculation.',
      pt: 'Planejar as cargas de transferência a partir do estoque e dos pedidos em aberto sem cálculo manual.'
    },
    tech: {
      objective: {
        en: 'Turn free stock and pending orders into a ready list of possible truck loads.',
        pt: 'Transformar estoque livre e pedidos pendentes em uma lista pronta de cargas possíveis.'
      },
      dataSources: {
        en: ['SAP MB52 (free stock) and VL10D (pending orders).', 'Palletization matrix.', 'A local monitor script writes dados.js next to the page; the page reloads it every 15 seconds.'],
        pt: ['SAP MB52 (estoque livre) e VL10D (pedidos pendentes).', 'Matriz de paletização.', 'Um monitor local grava dados.js ao lado da página; a página recarrega a cada 15 segundos.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'VBScript monitor + SAP GUI Scripting', 'Speech synthesis for voice notices', 'CSV export'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Monitor em VBScript + SAP GUI Scripting', 'Síntese de voz para avisos', 'Exportação CSV']
      },
      businessRules: {
        en: ['A truck load is 25 pallets.', 'Loads built with 1 SKU (closed truck), 2 or 3 SKUs combined.', 'Ball plant (deposits 0700/0707) and NSA calculated separately.', 'Orders can be excluded from the projection; the exclusion list is kept in the browser.'],
        pt: ['Uma carga de carreta é de 25 paletes.', 'Cargas montadas com 1 SKU (carreta fechada), 2 ou 3 SKUs combinados.', 'Planta Ball (depósitos 0700/0707) e NSA calculadas separadamente.', 'Pedidos podem ser excluídos da projeção; a lista de exclusões fica no navegador.']
      },
      operation: SAP_RUNTIME,
      integration: SAP_INTEGRATION,
      evolution: SAP_EVOLUTION
    }
  },
  {
    id: 'projecao-ocupacao',
    status: 'live',
    url: 'projects/projecao-ocupacao/Projecao_de_Ocupacao_BR3R.html',
    files: ['Projecao_de_Ocupacao_BR3R.html', 'Projeção_de_Ocupação_BR3R.html'],
    icon: 'warehouse',
    developer: 'claudio',
    banner: { title: 'PROJEÇÃO DE', accent: 'OCUPAÇÃO', sub: 'SIMULADOR LOGÍSTICO · D+7' },
    name: { en: 'Occupancy Projection · D+7', pt: 'Projeção de Ocupação · D+7' },
    category: { en: 'Warehouse Management', pt: 'Gestão de Armazém' },
    description: {
      en: 'In 2 clicks, projects occupancy of the BR3R plant and the NSA warehouse from D+0 to D+7, from stock and the loading schedule, with editable production and transfers to BRJC and NSA.',
      pt: 'Em 2 cliques, projeta a ocupação da planta BR3R e do armazém NSA de D+0 a D+7, a partir do estoque e da grade de embarque, com produção e transferências para BRJC e NSA editáveis.'
    },
    problem: {
      en: 'Deciding transfers in time to keep stock at a healthy level and the warehouse safe for people.',
      pt: 'Decidir as transferências a tempo para manter o estoque saudável e o armazém seguro para as pessoas.'
    },
    tech: {
      objective: {
        en: 'Project occupancy against physical capacity for the next seven days.',
        pt: 'Projetar a ocupação contra a capacidade física para os próximos sete dias.'
      },
      dataSources: {
        en: ['SAP MB52 (stock) and ZTSD0012 (sales schedule).', 'Reference capacities for cans (plant and NSA), finished ends and basic ends, set in the code.'],
        pt: ['SAP MB52 (estoque) e ZTSD0012 (grade de vendas).', 'Capacidades de referência de latas (planta e NSA), tampa acabada e tampa básica, definidas no código.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Chart.js · SheetJS · html2canvas', 'IndexedDB + File System Access API for the SAP folder', 'Speech synthesis · VBScript + SAP GUI Scripting'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Chart.js · SheetJS · html2canvas', 'IndexedDB + File System Access API para a pasta do SAP', 'Síntese de voz · VBScript + SAP GUI Scripting']
      },
      businessRules: {
        en: ['Production can be set to zero on line-stop days.', 'Both transfers leave plant stock; only the NSA transfer enters NSA stock.', 'Occupancy shown in pallets per day against each area\'s capacity.'],
        pt: ['A produção pode ser zerada nos dias de parada de linha.', 'As duas transferências saem do estoque da planta; só a do NSA entra no estoque do NSA.', 'Ocupação mostrada em paletes por dia contra a capacidade de cada área.']
      },
      operation: SAP_RUNTIME,
      integration: SAP_INTEGRATION,
      evolution: SAP_EVOLUTION
    }
  },
  {
    id: 'relatorio-vendas',
    status: 'live',
    url: 'projects/relatorio-vendas/Relatorio_de_Vendas_BR3R.html',
    files: ['Relatorio_de_Vendas_BR3R.html', 'Relatório_de_Vendas_BR3R.html'],
    icon: 'chart',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'RELATÓRIO DIÁRIO DE VENDAS' },
    name: { en: 'Daily Sales Report', pt: 'Relatório Diário de Vendas' },
    category: { en: 'Operational Intelligence', pt: 'Inteligência Operacional' },
    description: {
      en: 'Daily can sales (direct, transfer to NSA and AG), production × plant output, warehouse occupancy against a 90% limit, sales by region on a map, pending schedule items and blocked SKUs.',
      pt: 'Venda diária de latas (direta, transferência para NSA e AG), produção × saída da planta, ocupação do armazém contra limite de 90%, vendas por região em mapa, pendências da grade e SKUs bloqueados.'
    },
    problem: {
      en: 'Putting sales, production, stock and pending loads in one daily report ready to share.',
      pt: 'Reunir vendas, produção, estoque e pendências em um relatório diário pronto para compartilhar.'
    },
    tech: {
      objective: {
        en: 'Produce the daily logistics report of the plant from SAP data, ready to copy or e-mail.',
        pt: 'Gerar o relatório diário de logística da planta a partir de dados do SAP, pronto para copiar ou enviar por e-mail.'
      },
      dataSources: {
        en: ['SAP ZTSD0123 (sales), ZTSD0012 (schedule, overnight snapshot), ZTPP0011 (production), MB52 (stock).', 'Stock movements entered by the checkers.', 'Sales history and schedule justifications embedded in the file.'],
        pt: ['SAP ZTSD0123 (venda), ZTSD0012 (grade, foto da madrugada), ZTPP0011 (produção), MB52 (estoque).', 'Movimentações lançadas pelos conferentes.', 'Histórico de vendas e justificativas da grade embutidos no arquivo.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'SVG map of Brazil for the regional heat map', 'html2canvas (copy image) · mailto (send e-mail)', 'File System Access API + IndexedDB · speech synthesis', 'VBScript + SAP GUI Scripting'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Mapa do Brasil em SVG para o mapa de calor regional', 'html2canvas (copiar imagem) · mailto (enviar e-mail)', 'File System Access API + IndexedDB · síntese de voz', 'VBScript + SAP GUI Scripting']
      },
      businessRules: {
        en: ['Sales split into direct (plant), transfer to NSA and AG (NSA → customer); today shown as partial.', 'Warehouse occupancy as % of pallet capacity with a 90% limit.', 'Pending schedule shows only what was not loaded, largest balance first.', 'Schedule by shift with reasons.'],
        pt: ['Venda dividida em direta (planta), transferência para NSA e AG (NSA → cliente); o dia atual aparece como parcial.', 'Ocupação do armazém em % da capacidade em paletes com limite de 90%.', 'Pendências da grade mostram só o que não foi carregado, maior saldo primeiro.', 'Grade por turno e motivos.']
      },
      operation: SAP_RUNTIME,
      integration: SAP_INTEGRATION,
      evolution: SAP_EVOLUTION
    }
  },
  {
    id: 'metal',
    status: 'live',
    url: 'projects/metal/Recebimento_e_Estoque_de_Metal_BR3R.html',
    files: ['Recebimento_e_Estoque_de_Metal_BR3R.html'],
    icon: 'coil',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'RECEBIMENTO E ESTOQUE DE METAL' },
    name: { en: 'Metal Receiving & Stock', pt: 'Recebimento e Estoque de Metal' },
    category: { en: 'Inventory Control', pt: 'Controle de Estoque' },
    description: {
      en: 'Coil receiving and stock: occupancy, stock by format and classification, monthly receipts, free stock and quality hold (HFI), plus an ends-metal view with days of coverage and a press scenario simulator.',
      pt: 'Recebimento e estoque de bobinas: ocupação, estoque por formato e classificação, entradas no mês, estoque livre e bloqueio de qualidade (HFI), além de visão de metal de tampas com dias de cobertura e simulador de prensas.'
    },
    problem: {
      en: 'Separating total physical stock from stock that can really be used, and seeing coverage in days.',
      pt: 'Separar o estoque físico total do estoque que realmente pode ser usado, e enxergar a cobertura em dias.'
    },
    tech: {
      objective: {
        en: 'Control metal (coils, TAB, Shell, finished ends) receiving, availability and coverage.',
        pt: 'Controlar recebimento, disponibilidade e cobertura de metal (bobinas, TAB, Shell, tampa acabada).'
      },
      dataSources: {
        en: ['SAP MB52 (stock) and MB51 (receipts), supplier file.', 'Separate MB52 files for ends metal and finished ends.', 'Default item register and capacity per street embedded (replaceable by file).', 'Warehouse layout image embedded.'],
        pt: ['SAP MB52 (estoque) e MB51 (entradas), arquivo do fornecedor.', 'Arquivos MB52 separados para metal de tampas e tampa acabada.', 'Cadastro e capacidade por rua padrão embutidos (substituíveis por arquivo).', 'Imagem do layout do estoque embutida.']
      },
      technologies: {
        en: ['Single-file HTML with SheetJS, Chart.js and html2canvas embedded (works offline)', 'File System Access API · speech synthesis', 'VBScript + SAP GUI Scripting'],
        pt: ['HTML em arquivo único com SheetJS, Chart.js e html2canvas embutidos (funciona offline)', 'File System Access API · síntese de voz', 'VBScript + SAP GUI Scripting']
      },
      businessRules: {
        en: ['Only free stock counts toward coverage; quality (CQ) and blocked (HFI) stock are shown apart.', 'Shell occupancy measured on one shared physical street for both colors combined.', 'Coverage in days per material, with a two-press scenario simulator.', 'Filters by format (12 OZ, 16 OZ…) and classification (L, M, H).'],
        pt: ['Só o estoque livre entra na suficiência; qualidade (CQ) e bloqueado (HFI) aparecem à parte.', 'Ocupação de Shell medida em uma rua física única, compartilhada pelas duas cores somadas.', 'Cobertura em dias por material, com simulador de cenário de duas prensas.', 'Filtros por formato (12 OZ, 16 OZ…) e classificação (L, M, H).']
      },
      operation: SAP_RUNTIME,
      integration: SAP_INTEGRATION,
      evolution: SAP_EVOLUTION
    }
  },
  {
    id: 'mapa-calor-ehs',
    status: 'live',
    url: 'projects/mapa-calor-ehs/Mapa_de_Calor_Armazem_BR3R.html',
    files: ['Mapa_de_Calor_Armazem_BR3R.html', 'Mapa_de_Calor_Armazém_BR3R.html'],
    icon: 'shield',
    developer: 'claudio',
    banner: { title: 'MAPA DE CALOR', accent: 'EHS', after: '– ARMAZÉM DE PRODUTO ACABADO', sub: 'TRÊS RIOS' },
    name: { en: 'EHS Heat Map · Finished Goods Warehouse', pt: 'Mapa de Calor EHS · Armazém de Produto Acabado' },
    category: { en: 'EHS · Warehouse Safety', pt: 'EHS · Segurança no Armazém' },
    description: {
      en: 'Interactive 2D/3D floor plan of the finished goods warehouse with layers for people × forklift flow, EHS risk (probability × severity) and combined exposure, plus an editable action plan.',
      pt: 'Planta interativa 2D/3D do armazém de produto acabado com camadas de fluxo pessoa × empilhadeira, risco EHS (probabilidade × severidade) e exposição combinada, além de plano de ação editável.'
    },
    problem: {
      en: 'Seeing where people and forklifts interact and prioritizing safety actions by risk.',
      pt: 'Enxergar onde pessoas e empilhadeiras interagem e priorizar as ações de segurança pelo risco.'
    },
    tech: {
      objective: {
        en: 'Map EHS risk in the warehouse and drive the action plan from it.',
        pt: 'Mapear o risco EHS no armazém e conduzir o plano de ação a partir dele.'
      },
      dataSources: {
        en: ['Warehouse layout and initial risk points embedded in the file.', 'Edits (points, flows, risks, action plan) saved in the browser; JSON backup and import.', 'No SAP or external data source.'],
        pt: ['Layout do armazém e pontos de risco iniciais embutidos no arquivo.', 'Edições (pontos, fluxos, riscos, plano de ação) salvas no navegador; backup e importação em JSON.', 'Sem SAP ou fonte de dados externa.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'SVG 2D plan · three.js 3D view (embedded)', 'Print to PDF (A3), CSV and JSON export'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Planta 2D em SVG · visão 3D em three.js (embutido)', 'Impressão em PDF (A3), exportação CSV e JSON']
      },
      businessRules: {
        en: ['Risk score = probability × severity; action plan sorted by risk.', 'Layers: machine and people flow, EHS risk, combined exposure.', 'Shows aisles, NR-12 guards, CCTV, fire extinguishers, pedestrian lanes, forklifts and recorded events.', 'Edit mode: drag pins, adjust flow and risk per aisle; mitigation, owner and deadline editable.'],
        pt: ['Pontuação de risco = probabilidade × severidade; plano de ação ordenado pelo risco.', 'Camadas: fluxo de máquinas e pessoas, risco EHS, exposição combinada.', 'Exibe ruas, grades NR-12, câmeras CFTV, extintores, faixas de pedestre, empilhadeiras e eventos registrados.', 'Modo edição: arrastar pinos, ajustar fluxo e risco por corredor; mitigação, responsável e prazo editáveis.']
      },
      operation: {
        en: 'Runs entirely in the browser; no installation. Data stays in the browser of each user unless exported.',
        pt: 'Roda inteiramente no navegador, sem instalação. Os dados ficam no navegador de cada usuário, a não ser que sejam exportados.'
      },
      integration: {
        en: 'Standalone. Not integrated with SAP, WMS, TMS or EHS systems.',
        pt: 'Independente. Não integrado a SAP, WMS, TMS ou sistemas de EHS.'
      },
      evolution: {
        en: ['Store points and action plan in a shared database so all users see the same data.', 'Feed recorded events from the corporate EHS system.', 'Host internally with corporate sign-in.'],
        pt: ['Guardar pontos e plano de ação em banco compartilhado, para todos verem os mesmos dados.', 'Alimentar os eventos registrados a partir do sistema corporativo de EHS.', 'Hospedar internamente com login corporativo.']
      }
    }
  },
  {
    id: 'tmrd',
    status: 'live',
    url: 'https://tmrd-app.github.io/',
    icon: 'alert',
    developer: 'claudio',
    banner: { title: 'TAREFA DE', accent: 'MAIOR RISCO', after: 'DO DIA', sub: 'TMRD · LANÇAMENTO PELO CELULAR E PAINEL AO VIVO' },
    name: { en: 'TMRD · Highest-Risk Task of the Day', pt: 'TMRD · Tarefa de Maior Risco do Dia' },
    category: { en: 'EHS · Safety', pt: 'EHS · Segurança' },
    description: {
      en: 'Supervisors log the highest-risk task of the day from their phones; entries appear live on the TV, in the operations room and for management, with the controls applied and adherence indicators.',
      pt: 'Os supervisores lançam pelo celular a tarefa de maior risco do dia; os lançamentos aparecem na hora na TV, na sala de operações e para a gerência, com os controles aplicados e indicadores de adesão.'
    },
    problem: {
      en: 'Making the day\'s highest risks visible to everyone, as they are planned.',
      pt: 'Deixar visível para todos, no momento do planejamento, onde estão os maiores riscos do dia.'
    },
    tech: {
      objective: {
        en: 'Record the highest-risk task of the day for each area and show it live to the TV, the operations room and management.',
        pt: 'Registrar a tarefa de maior risco do dia de cada área e mostrar ao vivo na TV, na sala de operações e para a gerência.'
      },
      dataSources: {
        en: ['Entries made by supervisors on their phones (QR code or installed app).', 'Cloud database (Supabase / PostgreSQL), updated in real time.', 'A ready-made view (tmrd_planilha) for Excel and Power BI.'],
        pt: ['Lançamentos feitos pelos supervisores no celular (QR Code ou app instalado).', 'Banco de dados na nuvem (Supabase / PostgreSQL), atualizado em tempo real.', 'Visão pronta (tmrd_planilha) para Excel e Power BI.']
      },
      technologies: {
        en: ['Installable web app (PWA) for phone, computer and TV', 'HTML, CSS and vanilla JavaScript · supabase-js (real time)', 'Works without signal: entries wait on the phone and are sent when the signal returns', 'QR code for quick access · automatic update to new versions'],
        pt: ['App web instalável (PWA) para celular, computador e TV', 'HTML, CSS e JavaScript puro · supabase-js (tempo real)', 'Funciona sem sinal: o lançamento fica no celular e é enviado quando o sinal volta', 'QR Code para acesso rápido · atualização automática de versão']
      },
      businessRules: {
        en: ['11 risk topics (chemicals, confined space, hot work, major lifts, hazardous energy, work at height, roof work, equipment intervention, internal logistics, contractors, others).', 'Controls recorded per task: work permit, APR/ART, LOTO, area isolation, watcher, specific PPE, safety talk.', 'Board by topic × day (today and the next 2 days); no entries in past dates.', 'Editing and deleting with an administrator PIN checked on the server; each person edits their own entries.', 'Indicators: adherence by area, tasks per day, most frequent topics, time of entry, risks by area.'],
        pt: ['11 tópicos de risco (produtos químicos, espaço confinado, trabalho a quente, grandes içamentos, energias perigosas, altura, telhado, intervenção em equipamentos, logística interna, terceirizados, outros).', 'Controles registrados por tarefa: PT, APR/ART, bloqueio LOTO, isolamento de área, vigia, EPI específico, DDS.', 'Painel tópico × dias (hoje e os próximos 2 dias); não aceita lançamento em data passada.', 'Edição e exclusão com PIN de administrador conferido no servidor; cada um edita os próprios lançamentos.', 'Indicadores: adesão por área, tarefas por dia, tópicos mais frequentes, horário do lançamento, riscos por área.']
      },
      operation: {
        en: 'Opens in the browser of the phone, computer or TV through the link or the QR code; installing is optional. TV mode stays on full screen without editing buttons.',
        pt: 'Abre no navegador do celular, do computador ou da TV pelo link ou pelo QR Code; instalar é opcional. O modo TV fica em tela cheia, sem botões de edição.'
      },
      integration: {
        en: 'Own cloud database (Supabase), with a view ready for Excel and Power BI. Not integrated with SAP or corporate EHS systems.',
        pt: 'Banco próprio na nuvem (Supabase), com visão pronta para Excel e Power BI. Não integrado a SAP ou a sistemas corporativos de EHS.'
      },
      evolution: {
        en: ['Corporate sign-in for entering and editing tasks.', 'Indicators in the corporate Power BI from the tmrd_planilha view.', 'Use in other Ball operations.'],
        pt: ['Login corporativo para lançar e editar.', 'Indicadores no Power BI corporativo a partir da visão tmrd_planilha.', 'Uso em outras operações da Ball.']
      }
    }
  },
  {
    id: 'reposicao-latas',
    status: 'live',
    url: 'projects/reposicao-latas/Controle-Reposicao-Latas_v2.2.html',
    files: ['Controle-Reposicao-Latas_v2.2.html'],
    icon: 'barcode',
    developer: 'rickson',
    banner: { title: 'CONTROLE DE REPOSIÇÃO DE', accent: 'LATAS', sub: 'PRÉ-EMBARQUE · EXPEDIÇÃO' },
    name: { en: 'Can Replenishment Control', pt: 'Controle de Reposição de Latas' },
    category: { en: 'Shipping · Quality', pt: 'Expedição · Qualidade' },
    description: {
      en: 'Barcode check of the replenishment pallets at pre-loading, in 6 independent docks: each label is compared with the replenishment SKU and marked OK, divergent or repeated lot, with PDF and A4 printout signed by driver and checker.',
      pt: 'Conferência por bipagem dos paletes de reposição no pré-embarque, em 6 docas independentes: cada etiqueta é comparada com o SKU da reposição e marcada como OK, divergente ou lote repetido, com PDF e impressão A4 assinada por motorista e conferente.'
    },
    problem: {
      en: 'Making sure cans are replenished correctly, avoiding a wrong SKU during the process.',
      pt: 'Garantir a reposição correta de latas, evitando SKU incorreto durante o processo.'
    },
    tech: {
      objective: { en: 'Validate, pallet by pallet, that the replenishment matches the right SKU before loading.', pt: 'Validar, palete a palete, que a reposição corresponde ao SKU certo antes do carregamento.' },
      dataSources: {
        en: ['Labels read by barcode scanner (or typed).', 'SKU database embedded in the file (code, description, cans per pallet), editable and with backup.', 'Optional shared SKU service configured in a separate file.'],
        pt: ['Etiquetas lidas por leitor de código de barras (ou digitadas).', 'Banco de SKUs embutido no arquivo (código, descrição, latas por palete), editável e com backup.', 'Serviço de SKUs compartilhado opcional, configurado em arquivo à parte.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Browser storage (localStorage / IndexedDB) per dock', 'PDF and A4 print with signatures'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Armazenamento no navegador (localStorage / IndexedDB) por doca', 'PDF e impressão A4 com assinaturas']
      },
      businessRules: {
        en: ['Each scanned label is checked against the replenishment pallet SKU: OK or divergent.', 'Duplicate check by lot: a lot already scanned is marked "Repeated".', '6 docks with independent records; up to 41 label positions per loading.', 'Driver and checker sign the final report.'],
        pt: ['Cada etiqueta bipada é conferida contra o SKU do palete de reposição: OK ou divergente.', 'Verificação de duplicidade pelo lote: lote já bipado é marcado como "Repetido".', '6 docas com registros independentes; até 41 posições de etiqueta por carregamento.', 'Motorista e conferente assinam o relatório final.']
      },
      operation: { en: 'Runs entirely in the browser, without server.', pt: 'Roda inteiramente no navegador, sem servidor.' },
      integration: { en: 'Standalone. Not integrated with SAP, WMS or TMS.', pt: 'Independente. Não integrado a SAP, WMS ou TMS.' },
      evolution: {
        en: ['Share the SKU database across all shipping computers.', 'Use in other Ball operations.'],
        pt: ['Compartilhar o banco de SKUs entre todos os computadores da expedição.', 'Uso em outras operações da Ball.']
      }
    }
  },
  {
    id: 'rastreabilidade-lotes',
    status: 'live',
    url: 'projects/rastreabilidade-lotes/RASTREABILIDADE_LOTES_BR3R.html',
    files: ['RASTREABILIDADE_LOTES_BR3R.html'],
    icon: 'data',
    developer: 'rickson',
    banner: { title: 'CONTROLE DE CARREGAMENTO E', accent: 'RASTREABILIDADE DE LOTES', sub: 'EXPEDIÇÃO · RASTREABILIDADE SAP (ZTPP0014)' },
    name: { en: 'Loading Control & Lot Traceability', pt: 'Controle de Carregamento e Rastreabilidade de Lotes' },
    category: { en: 'Shipping · Traceability', pt: 'Expedição · Rastreabilidade' },
    description: {
      en: 'Loading check per dock: billed SKUs × scanned pallets, packaging materials expected × billed, alerts, and lot traceability sent to SAP (ZTPP0014) through a local agent — with history, PDF and voice notices.',
      pt: 'Conferência do carregamento por doca: SKUs faturados × paletes bipados, materiais de embalagem esperados × faturados, alertas e rastreabilidade dos lotes enviada ao SAP (ZTPP0014) por agente local — com histórico, PDF e avisos de voz.'
    },
    problem: {
      en: 'Making sure the loaded SKUs are the ones billed — SKUs and packaging material — and automating lot traceability.',
      pt: 'Garantir que os SKUs carregados sejam os mesmos que foram faturados — SKUs e material de embalagem — e automatizar a rastreabilidade dos lotes.'
    },
    tech: {
      objective: { en: 'Check every loading against the invoice and record lot traceability in SAP.', pt: 'Conferir cada carregamento contra o faturamento e registrar a rastreabilidade dos lotes no SAP.' },
      dataSources: {
        en: ['SAP transport number and NF-e of the loading.', 'Pallet labels read by barcode scanner.', 'SKU database and blocked-lot list embedded in the file.', 'SAP ZTPP0014 (lot traceability).'],
        pt: ['Nº do transporte SAP e NF-e do carregamento.', 'Etiquetas dos paletes lidas por leitor de código de barras.', 'Banco de SKUs e lista de lotes bloqueados embutidos no arquivo.', 'SAP ZTPP0014 (rastreabilidade de lotes).']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Local VBScript agent + SAP GUI Scripting', 'Browser storage per dock · PDF and A4 print · voice and sound alerts'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Agente local em VBScript + SAP GUI Scripting', 'Armazenamento no navegador por doca · PDF e impressão A4 · alertas de voz e som']
      },
      businessRules: {
        en: ['Pallets expected = billed cans ÷ cans per pallet (SKU database).', 'Each scanned label is checked against the billed SKUs; blocked lots are flagged.', 'Packaging materials (pallets, separator sheets) expected × billed, with the difference.', 'Lot re-use requires a declared reason; sensitive actions require an authorization code.'],
        pt: ['Paletes esperados = latas faturadas ÷ latas por palete (banco de SKUs).', 'Cada etiqueta bipada é conferida contra os SKUs faturados; lotes bloqueados são sinalizados.', 'Materiais de embalagem (paletes, folhas separadoras) esperados × faturados, com a diferença.', 'Re-uso de lote exige motivo declarado; ações sensíveis exigem código de autorização.']
      },
      operation: {
        en: 'Runs in the browser. Two modes: simulator (training, without SAP) and real SAP, through a local VBScript agent that works on the SAP session already open and logged in (no user or password in the code). The page and the agent exchange command and answer files in a folder authorized in the browser.',
        pt: 'Roda no navegador. Dois modos: simulador (treino, sem SAP) e SAP real, por um agente local em VBScript que trabalha na sessão do SAP já aberta e logada (sem usuário nem senha no código). A página e o agente trocam arquivos de comando e resposta numa pasta autorizada no navegador.'
      },
      integration: {
        en: 'SAP through SAP GUI Scripting (local agent), on the user\'s own session. Not integrated with WMS or TMS.',
        pt: 'SAP pelo SAP GUI Scripting (agente local), na sessão do próprio usuário. Não integrado a WMS ou TMS.'
      },
      evolution: {
        en: ['Extend traceability to other loading flows.', 'Use in other Ball operations.'],
        pt: ['Estender a rastreabilidade a outros fluxos de carregamento.', 'Uso em outras operações da Ball.']
      }
    }
  },
  {
    id: 'faturamento-sucata',
    status: 'live',
    url: 'projects/faturamento-sucata/ROBO_SUCATA.html',
    files: ['ROBO_SUCATA.html'],
    icon: 'robot',
    developer: 'rickson',
    banner: { title: 'FATURAMENTO', accent: 'SUCATA', sub: 'AUTOMAÇÃO DE REMESSAS E FATURAMENTO' },
    name: { en: 'Scrap Billing', pt: 'Faturamento Sucata' },
    category: { en: 'Automation · Billing', pt: 'Automação · Faturamento' },
    description: {
      en: 'A robot that guides the aluminium scrap shipment in 15 steps — from MB52 and lots to the delivery (VL10C), transport, billing, SEFAZ authorization and DANFE — working on the SAP session already open, with a simulator for training.',
      pt: 'Robô que conduz a remessa de sucata de alumínio em 15 etapas — do MB52 e dos lotes à remessa (VL10C), transporte, faturamento, autorização SEFAZ e DANFE — trabalhando na sessão do SAP já aberta, com simulador para treino.'
    },
    problem: {
      en: 'Scrap billing took the checker more than 20 minutes per process.',
      pt: 'O faturamento de sucata levava mais de 20 minutos do conferente por processo.'
    },
    tech: {
      objective: { en: 'Automate the scrap shipment and billing flow in SAP, step by step, with the user confirming.', pt: 'Automatizar o fluxo de remessa e faturamento de sucata no SAP, etapa por etapa, com a confirmação do usuário.' },
      dataSources: {
        en: ['SAP MB52 (scrap stock) and the lots and weights of the shipment.', 'Sales order, transport and driver data entered in the flow.', 'Register of lots already used (duplicate lock).'],
        pt: ['SAP MB52 (estoque de sucata) e os lotes e pesos da remessa.', 'Ordem de venda, transporte e dados do motorista informados no fluxo.', 'Registro de lotes já usados (trava de duplicidade).']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Local VBScript agent + SAP GUI Scripting (VL10C, VL01N, MB52)', 'Execution history and logs · light/dark theme'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Agente local em VBScript + SAP GUI Scripting (VL10C, VL01N, MB52)', 'Histórico de execuções e logs · tema claro/escuro']
      },
      businessRules: {
        en: ['15 steps in 4 stages: billing preparation, transport, billing, documents and conclusion.', 'A lot already used in a previous shipment is blocked.', 'The robot prepares; the user confirms before SAP saves.', 'Waits for vehicle release and SEFAZ authorization before going on.'],
        pt: ['15 etapas em 4 fases: preparação do faturamento, transporte, faturamento, documentos e conclusão.', 'Lote já usado em remessa anterior é bloqueado.', 'O robô prepara; o usuário confirma antes de o SAP gravar.', 'Aguarda a liberação do veículo e a autorização da SEFAZ antes de seguir.']
      },
      operation: {
        en: 'Runs in the browser. Two modes: simulator (training, without SAP) and real SAP, through a local VBScript agent that works on the SAP session already open and logged in (no user or password in the code). The page and the agent exchange command and answer files in a folder authorized in the browser.',
        pt: 'Roda no navegador. Dois modos: simulador (treino, sem SAP) e SAP real, por um agente local em VBScript que trabalha na sessão do SAP já aberta e logada (sem usuário nem senha no código). A página e o agente trocam arquivos de comando e resposta numa pasta autorizada no navegador.'
      },
      integration: {
        en: 'SAP through SAP GUI Scripting (local agent), on the user\'s own session. Not integrated with WMS or TMS.',
        pt: 'SAP pelo SAP GUI Scripting (agente local), na sessão do próprio usuário. Não integrado a WMS ou TMS.'
      },
      evolution: {
        en: ['Apply the same robot to other shipment types.', 'Use in other Ball operations.'],
        pt: ['Aplicar o mesmo robô a outros tipos de remessa.', 'Uso em outras operações da Ball.']
      }
    }
  },
  {
    id: 'apontamento-sucatas',
    status: 'live',
    url: 'projects/apontamento-sucatas/APONTAMENTO_SUCATAS.html',
    files: ['APONTAMENTO_SUCATAS.html'],
    icon: 'scale',
    developer: 'rickson',
    banner: { title: 'APONTAMENTO DE', accent: 'SUCATAS', sub: 'INTEGRAÇÃO SAP · MB1C (MOVIMENTO 531)' },
    name: { en: 'Scrap Booking', pt: 'Apontamento de Sucatas' },
    category: { en: 'Automation · SAP booking', pt: 'Automação · Apontamento SAP' },
    description: {
      en: 'Books scrap in SAP MB1C (movement 531) from the weights read or typed, with the month\'s orders, up to 14 lots per booking, a check before saving and the booking history. It replaces the previous macro spreadsheet.',
      pt: 'Aponta a sucata na MB1C do SAP (movimento 531) a partir dos pesos lidos ou digitados, com as ordens do mês, até 14 lotes por apontamento, conferência antes de gravar e histórico dos apontamentos. Substitui a planilha de macro anterior.'
    },
    problem: {
      en: 'Scrap booking took the checker more than 10 minutes per process.',
      pt: 'O apontamento de sucata levava mais de 10 minutos do conferente por processo.'
    },
    tech: {
      objective: { en: 'Book scrap in SAP quickly and with a check before saving.', pt: 'Apontar a sucata no SAP com rapidez e com conferência antes de gravar.' },
      dataSources: {
        en: ['Weights read or typed per lot (cans or ends, clean or dirty).', 'Orders of the month, registered in the app.', 'SAP MB51 / MB52 for checking.'],
        pt: ['Pesos lidos ou digitados por lote (latas ou tampas, limpa ou suja).', 'Ordens do mês, cadastradas no app.', 'SAP MB51 / MB52 para conferência.']
      },
      technologies: {
        en: ['Single-file HTML, CSS and vanilla JavaScript', 'Local VBScript agent + SAP GUI Scripting (MB1C)', 'Booking history and logs · light/dark theme'],
        pt: ['HTML, CSS e JavaScript puro em arquivo único', 'Agente local em VBScript + SAP GUI Scripting (MB1C)', 'Histórico de apontamentos e logs · tema claro/escuro']
      },
      businessRules: {
        en: ['MB1C, movement 531 (co-product receipt), plant BR3R, storage location 0800, whole kg.', 'Up to 14 lots per booking.', 'Fills MB1C and checks before saving.', 'Closing of the month\'s orders, including previous months.'],
        pt: ['MB1C, movimento 531 (entrada de co-produto), centro BR3R, depósito 0800, KG inteiro.', 'Até 14 lotes por apontamento.', 'Preenche a MB1C e confere antes de gravar.', 'Encerramento das ordens do mês, inclusive de meses anteriores.']
      },
      operation: {
        en: 'Runs in the browser. Two modes: simulator (training, without SAP) and real SAP, through a local VBScript agent that works on the SAP session already open and logged in (no user or password in the code). The page and the agent exchange command and answer files in a folder authorized in the browser.',
        pt: 'Roda no navegador. Dois modos: simulador (treino, sem SAP) e SAP real, por um agente local em VBScript que trabalha na sessão do SAP já aberta e logada (sem usuário nem senha no código). A página e o agente trocam arquivos de comando e resposta numa pasta autorizada no navegador.'
      },
      integration: {
        en: 'SAP through SAP GUI Scripting (local agent), on the user\'s own session. Not integrated with WMS or TMS.',
        pt: 'SAP pelo SAP GUI Scripting (agente local), na sessão do próprio usuário. Não integrado a WMS ou TMS.'
      },
      evolution: {
        en: ['Extend the same booking model to other materials.', 'Use in other Ball operations.'],
        pt: ['Estender o mesmo modelo de apontamento a outros materiais.', 'Uso em outras operações da Ball.']
      }
    }
  }
];
