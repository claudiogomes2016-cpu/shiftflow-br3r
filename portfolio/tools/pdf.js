// Saves the presentation as a PDF (one slide per page) for e-mail.
//   node tools/pdf.js <Apresentacao_Logistica_BR3R.html> <output.pdf> [pt|en]
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [src, out, lang = 'pt'] = process.argv.slice(2);
  if (!src || !out) { console.error('usage: node tools/pdf.js <presentation.html> <output.pdf> [pt|en]'); process.exit(1); }
  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: lang === 'pt' ? 'pt-BR' : 'en-US' });
  await page.goto('file://' + encodeURI(path.resolve(src)));
  await page.click(`[data-lang="${lang}"]`);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, width: '1600px', height: '900px', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('saved', out);
})();
