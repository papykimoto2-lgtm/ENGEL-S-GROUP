#!/usr/bin/env python3
"""Assemble index.html (fichier unique) : injecte les textures d'étiquettes en base64."""
import base64, pathlib
d = pathlib.Path(__file__).parent
src = (d / 'src.html').read_text(encoding='utf8')
def b64(n): return 'data:image/jpeg;base64,' + base64.b64encode((d / 'assets' / n).read_bytes()).decode()
out = src.replace('__BODY_TEX__', b64('label_body.jpg')).replace('__NECK_TEX__', b64('label_neck.jpg'))
(d / 'index.html').write_text(out, encoding='utf8'); print('index.html', len(out) // 1024, 'Ko')
