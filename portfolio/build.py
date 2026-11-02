"""Build the shareable package: index.html and apresentacao.html as single
self-contained files (CSS, JS and images inlined), plus the dashboards.

Single files keep working when the folder is opened from a network drive or
when only some files get copied.

    python build.py <output-folder>
"""
import base64
import pathlib
import re
import shutil
import sys

SRC = pathlib.Path(__file__).resolve().parent


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
    assert 'href="assets/' not in html and 'src="assets/' not in html
    return html


def main(out):
    out = pathlib.Path(out) / 'portfolio'
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    for page in ('index.html', 'apresentacao.html'):
        (out / page).write_text(inline((SRC / page).read_text(encoding='utf-8')), encoding='utf-8')
    shutil.copytree(SRC / 'projects', out / 'projects', ignore=shutil.ignore_patterns('.gitkeep'))
    shutil.copy(SRC / 'README.md', out / 'README.md')
    print('built', out)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
