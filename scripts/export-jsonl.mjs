#!/usr/bin/env node
// Tum skill'leri tek bir JSONL dosyasina aktarir: her satir bir skill.
// Modeli egitmek (fine-tune) veya vektor veritabanina (RAG) yuklemek icin kullanilir.
// Kullanim: node scripts/export-jsonl.mjs [--local]   (--local: local/ klasorunu de ekler)
// Cikti: dist/kodvid-skills.jsonl
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const withLocal = process.argv.includes('--local');
const MAX_REF_BYTES = 200_000; // skill basina referans metni ust siniri
const skills = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog', 'skills.json'), 'utf8')).filter((s) => !s.duplicateOf);

function walk(d) { return fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : []; }
function references(dir, entry) {
  // Skill klasorundeki diger markdown dosyalari (ic ice skill klasorleri haric)
  const out = []; let bytes = 0;
  for (const f of walk(dir).filter((f) => /\.(md|mdx|txt)$/i.test(f) && path.resolve(f) !== path.resolve(entry)).sort()) {
    const rel = path.relative(dir, f).split(path.sep).join('/');
    if (rel.split('/').slice(0, -1).some((_, i, a) => fs.existsSync(path.join(dir, ...a.slice(0, i + 1), 'SKILL.md')))) continue;
    const content = fs.readFileSync(f, 'utf8'); if (bytes + content.length > MAX_REF_BYTES) break;
    bytes += content.length; out.push({ path: rel, content });
  }
  return out;
}

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const outFile = path.join(ROOT, 'dist', 'kodvid-skills.jsonl');
const w = fs.createWriteStream(outFile);
let n = 0;
for (const s of skills) {
  const entry = path.join(ROOT, s.path);
  const isRepoRoot = s.kind !== 'skill';
  w.write(JSON.stringify({ id: s.id, name: s.name, description: s.description, repo: s.repo, license: s.license, category: s.category,
    engines: s.engines, kind: s.kind, content: fs.readFileSync(entry, 'utf8'), references: isRepoRoot ? [] : references(path.join(ROOT, s.dir), entry) }) + '\n');
  n++;
}
if (withLocal) {
  for (const d of fs.existsSync(path.join(ROOT, 'local')) ? fs.readdirSync(path.join(ROOT, 'local')) : []) {
    const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'local', d, 'SOURCE.json'), 'utf8'));
    for (const f of walk(path.join(ROOT, 'local', d, 'files')).filter((p) => /^skill\.md$/i.test(path.basename(p)))) {
      w.write(JSON.stringify({ id: `local/${d}/${path.basename(path.dirname(f))}`, name: path.basename(path.dirname(f)), repo: src.repo, license: src.license,
        localOnly: true, content: fs.readFileSync(f, 'utf8'), references: references(path.dirname(f), f) }) + '\n');
      n++;
    }
  }
}
w.end(() => console.log(`${n} skill -> ${path.relative(ROOT, outFile)} (${(fs.statSync(outFile).size / 1e6).toFixed(1)} MB)`));
