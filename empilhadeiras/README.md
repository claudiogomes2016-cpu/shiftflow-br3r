# Gestão de Empilhadeiras – BR3R

Painel de gestão da frota de empilhadeiras da planta Três Rios (BR3R).
Arquivo único (`index.html`), sem dependências: abre direto no navegador.
Layout pensado para notebook com zoom de 80%.

## Hoje
- Contrato SOMOV 2027 × frota atual 2026 (VAMOS + SOMOV)
- Cards clicáveis com detalhes, tabela da frota com busca e filtro por grupo
- Comparativo 2026 × 2027 por grupo, incluindo o budget atual
- Budget mensal e projeção anual, pontos de atenção, exportar CSV e imprimir

## Próximos módulos
- Setores e alocação de cada máquina
- Dashboard e KPIs (disponibilidade, MTBF, MTTR, chamados)
- Abertura de chamados com fotos, vídeos e textos padrão do chamado e do e-mail (Outlook)
- Manutenções preventivas e corretivas com upload de fichas e PDFs

Os dados ficam no objeto `D` e na constante `BUD` no início do `<script>`.
