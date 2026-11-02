/* ─────────────────────────────────────────────────────────────
   PROJECT REGISTRY
   Add a project by appending an object to PROJECTS.

   status: 'live'  → shows OPEN PROJECT (url is required)
           'prep'  → shows "In preparation", no link
   url:    path to the original dashboard, relative to portfolio/index.html.
           Keep originals untouched (e.g. projects/<name>/index.html).
   tech:   optional. Fill ONLY with facts verified in the source code.
   banner: title / accent (blue word) / sub — copied from the dashboard's own banner.
   pitch:  presentation slide — purpose, what it improved (3 points), a line "in practice".
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
    'Host on an internal web server or SharePoint with corporate sign-in.',
    'Move embedded reference data out of the HTML into a governed data source.'
  ],
  pt: [
    'Substituir a exportação por VBScript no desktop por uma extração agendada aprovada pela TI (OData/CDS do SAP ou BW).',
    'Hospedar em servidor web interno ou SharePoint com login corporativo.',
    'Tirar os dados de referência embutidos no HTML e levá-los para uma fonte de dados governada.'
  ]
};

window.PROJECTS = [
  {
    id: 'grade-carregamento',
    status: 'live',
    url: 'projects/grade-carregamento/Grade_de_Embarque_Latas_e_Tampas_BR3R.html',
    icon: 'truck',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'GRADE DE CARREGAMENTO' },
    pitch: {
      purpose: {
        en: 'Shows, order by order, whether the loading schedule has stock at the plant or at the AG warehouse.',
        pt: 'Mostra, pedido a pedido, se a grade de carregamento tem estoque na planta ou no AG.'
      },
      improved: {
        en: ['Stock shortages show up before loading, not at the dock.', 'Customer restrictions checked automatically by exact format.', 'One screen instead of crossing SAP reports by hand.'],
        pt: ['A falta de estoque aparece antes do carregamento, e não na doca.', 'Restrições de cliente conferidas automaticamente pelo formato exato.', 'Uma tela só, no lugar de cruzar relatórios do SAP na mão.']
      },
      practice: {
        en: 'Before loading, I know which orders have stock and where it is — plant or AG.',
        pt: 'Antes de carregar, eu sei quais pedidos têm estoque e onde ele está: planta ou AG.'
      }
    },
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
    icon: 'transfer',
    developer: 'claudio',
    banner: { title: 'PROJEÇÃO', accent: 'TRANSFERÊNCIA', sub: 'RELATÓRIO DE PROJEÇÃO DE CARGAS · MB52 + VL10D' },
    pitch: {
      purpose: {
        en: 'Builds the transfer loads from free stock and pending orders.',
        pt: 'Monta as cargas de transferência a partir do estoque livre e dos pedidos pendentes.'
      },
      improved: {
        en: ['Trucks of 25 pallets calculated automatically, with 1, 2 or 3 SKUs.', 'Updates by itself from SAP every 15 seconds.', 'Shows which trucks can leave now with immediate stock.'],
        pt: ['Carretas de 25 paletes calculadas automaticamente, com 1, 2 ou 3 SKUs.', 'Atualiza sozinho a partir do SAP a cada 15 segundos.', 'Mostra quais carretas podem sair agora com estoque imediato.']
      },
      practice: {
        en: 'I open the panel and already see how many trucks I can build now, and with which SKUs.',
        pt: 'Abro o painel e já vejo quantas carretas consigo montar agora, e com quais SKUs.'
      }
    },
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
    icon: 'warehouse',
    developer: 'claudio',
    banner: { title: 'PROJEÇÃO DE', accent: 'OCUPAÇÃO', sub: 'SIMULADOR LOGÍSTICO · D+7' },
    pitch: {
      purpose: {
        en: 'Shows warehouse occupancy from today to 7 days ahead — plant, NSA and BRJC.',
        pt: 'Mostra a ocupação do depósito de hoje até 7 dias à frente — planta, NSA e BRJC.'
      },
      improved: {
        en: ['Decisions are made in advance: transfers, production on line-stop days.', 'Occupancy is kept at a healthy level, never a dangerous one.', 'A safer warehouse for the people who work in it.'],
        pt: ['As decisões são tomadas com antecedência: transferências, produção nos dias de parada.', 'A ocupação é mantida em nível saudável, nunca perigoso.', 'Um armazém mais seguro para as pessoas que trabalham nele.']
      },
      practice: {
        en: 'I see the next 7 days today and decide what to do to keep occupancy at a level that guarantees people\'s safety.',
        pt: 'Enxergo hoje os próximos 7 dias e decido o que fazer para manter a ocupação em um nível que garanta a segurança das pessoas.'
      }
    },
    name: { en: 'Occupancy Projection · D+7', pt: 'Projeção de Ocupação · D+7' },
    category: { en: 'Warehouse Management', pt: 'Gestão de Armazém' },
    description: {
      en: 'Simulates warehouse occupancy in pallets from D+0 to D+7 for the plant, NSA and BRJC, from current stock and the sales schedule, with editable daily production and transfers.',
      pt: 'Simula a ocupação do armazém em paletes de D+0 a D+7 para planta, NSA e BRJC, a partir do estoque atual e da grade de vendas, com produção e transferências diárias editáveis.'
    },
    problem: {
      en: 'Anticipating warehouse saturation days ahead instead of reacting to it.',
      pt: 'Antecipar a saturação do armazém com dias de antecedência, em vez de reagir a ela.'
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
    icon: 'chart',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'RELATÓRIO DIÁRIO DE VENDAS' },
    pitch: {
      purpose: {
        en: 'The plant\'s daily logistics report on one screen.',
        pt: 'O relatório diário de logística da planta em uma tela.'
      },
      improved: {
        en: ['Sales, production, occupancy, pending loads and blocked SKUs together.', 'Occupancy alert against the 90% limit.', 'Ready to copy or e-mail — the same report for everyone, every day.'],
        pt: ['Vendas, produção, ocupação, pendências e SKUs bloqueados juntos.', 'Alerta de ocupação contra o limite de 90%.', 'Pronto para copiar ou enviar por e-mail — o mesmo relatório para todos, todo dia.']
      },
      practice: {
        en: 'One report a day, the same for everyone, with sales, production and occupancy.',
        pt: 'Um relatório por dia, igual para todos, com vendas, produção e ocupação.'
      }
    },
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
    icon: 'coil',
    developer: 'claudio',
    banner: { title: 'LOGÍSTICA', accent: 'INFORMA', sub: 'RECEBIMENTO E ESTOQUE DE METAL' },
    pitch: {
      purpose: {
        en: 'Controls receiving and stock of coils and ends metal.',
        pt: 'Controla o recebimento e o estoque de bobinas e de metal de tampas.'
      },
      improved: {
        en: ['Separates what we have from what we can use: free × quality × blocked (HFI).', 'Coverage in days for each material.', 'Press scenario simulator to plan consumption.'],
        pt: ['Separa o que eu tenho do que eu posso usar: livre × qualidade × bloqueado (HFI).', 'Cobertura em dias para cada material.', 'Simulador de prensas para planejar o consumo.']
      },
      practice: {
        en: 'I know how many days of free metal I have per material, and the impact of changing the presses.',
        pt: 'Sei quantos dias de metal livre eu tenho por material, e o impacto de mudar as prensas.'
      }
    },
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
    icon: 'shield',
    developer: 'claudio',
    banner: { title: 'MAPA DE CALOR', accent: 'EHS', after: '– ARMAZÉM DE PRODUTO ACABADO', sub: 'TRÊS RIOS' },
    pitch: {
      purpose: {
        en: 'Maps where people and forklifts cross paths in the finished goods warehouse.',
        pt: 'Mapeia onde pessoas e empilhadeiras se cruzam no armazém de produto acabado.'
      },
      improved: {
        en: ['Risks ranked by probability × severity.', 'Action plan with owner and deadline in the same place.', '2D/3D view and A3 report for safety meetings.'],
        pt: ['Riscos priorizados por probabilidade × severidade.', 'Plano de ação com responsável e prazo no mesmo lugar.', 'Visão 2D/3D e relatório A3 para as reuniões de segurança.']
      },
      practice: {
        en: 'The highest-risk points come first, each with action, owner and deadline.',
        pt: 'Os pontos de maior risco aparecem primeiro, cada um com ação, responsável e prazo.'
      }
    },
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
    id: 'rickson-01',
    status: 'prep',
    icon: 'inventory',
    developer: 'rickson',
    name: { en: 'Shipping project', pt: 'Projeto de Expedição' },
    category: { en: 'Transportation', pt: 'Transporte' }
  }
];
