#!/usr/bin/env python3
"""Embed current local catalog into the original standalone gallery; no network."""
import json
from pathlib import Path
from _contracts import KINDS, catalog

def main():
    root = Path(__file__).resolve().parents[1]
    payload = {}
    for kind in KINDS:
        payload[kind] = list(catalog(kind, root / 'catalog').values())
    template = root / 'assets/gallery/template.html'
    text = template.read_text(encoding='utf-8')
    if text.count('__CATALOG_JSON__') != 1:
        raise ValueError('Gallery template marker must occur once')
    encoded = json.dumps(payload, ensure_ascii=False).replace('</', '<\\/')
    result = text.replace('__CATALOG_JSON__', encoded)
    output = root / 'assets/gallery/index.html'
    output.write_text(result, encoding='utf-8')
    print(json.dumps({'output': str(output), 'items': sum(map(len, payload.values())), 'catalog_verification_mutated': False}, ensure_ascii=False))

if __name__ == '__main__':
    main()
