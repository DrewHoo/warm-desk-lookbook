#!/usr/bin/env python3
"""Inline data.js + copy.json into template.html -> index.html (one self-contained page)."""
import html, json, pathlib

root = pathlib.Path(__file__).parent
tpl = (root / "template.html").read_text()
data = (root / "data.js").read_text()
copy = json.loads((root / "copy.json").read_text())

out = tpl.replace("/*DATA*/", data).replace("/*COPY*/", json.dumps(copy, ensure_ascii=False))
for key in ("title", "meta_description"):
    out = out.replace("{{" + key + "}}", html.escape(copy[key], quote=True))
(root / "index.html").write_text(out)
print("wrote index.html", len(out), "bytes")
