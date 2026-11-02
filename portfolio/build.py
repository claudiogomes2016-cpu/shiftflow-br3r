"""Build the shareable files, flat (no folders, no ZIP):

    Portfolio_Logistica_BR3R.html     portfolio (cards, technical details)
    Apresentacao_Logistica_BR3R.html  presentation (one slide per project)

Each is a single self-contained file (CSS, JS and images inlined). Put them
in the same folder as the dashboards; ABRIR PROJETO opens the dashboard
found next to them. For e-mail, use the PDF made by tools/pdf.js.

    python build.py <output-folder>
"""
import base64
import pathlib
import re
import sys

SRC = pathlib.Path(__file__).resolve().parent
PAGES = {'index.html': 'Portfolio_Logistica_BR3R.html', 'apresentacao.html': 'Apresentacao_Logistica_BR3R.html'}


def data_uri(path):
    mime = 'image/png' if path.suffix == '.png' else 'image/svg+xml'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()


def inline(html):
    def css(m):
        return '<style>\n' + (SRC / m.group(1)).read_text(encoding='utf-8') + '\n</style>'

    def js(m):
        path = SRC / m.group(1)
        if not path.exists():
            sys.exit(f'missing {path.relative_to(SRC)}')
        code = path.read_text(encoding='utf-8')
        # Images referenced by projects.js become data URIs.
        code = re.sub(r"= '(assets/images/[^']+)';", lambda i: "= '" + data_uri(SRC / i.group(1)) + "';", code)
        return '<script>\n' + code.replace('</script', '<\\/script') + '\n</script>'

    html = re.sub(r'<link rel="stylesheet" href="(assets/css/[^"]+)">', css, html)
    html = re.sub(r'<script src="(assets/js/[^"]+)"></script>', js, html)
    for src, dst in PAGES.items():
        html = html.replace(f'href="{src}"', f'href="{dst}"')
    assert 'href="assets/' not in html and 'src="assets/' not in html
    return html


def main(out):
    out = pathlib.Path(out)
    out.mkdir(parents=True, exist_ok=True)
    for src, dst in PAGES.items():
        (out / dst).write_text(inline((SRC / src).read_text(encoding='utf-8')), encoding='utf-8')
        print('built', out / dst)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
