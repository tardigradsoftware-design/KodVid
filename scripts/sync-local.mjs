#!/usr/bin/env node
// Lisansi yeniden dagitima izin vermeyen repolarin (Remotion skills dahil) skill dosyalarini
// sadece bu bilgisayara, local/ klasorune indirir. local/ git'e eklenmez (.gitignore).
// Kullanim: node scripts/sync-local.mjs            -> hepsi
//           node scripts/sync-local.mjs remotion   -> adinda "remotion" gecenler
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { selectFiles, applyBudget } from './select.mjs';

const ex = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'local');
const filter = (process.argv[2] || '').toLowerCase();
const repos = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog', 'repos.json'), 'utf8'))
  .filter((r) => r.status === 'local-sync' && r.repo.toLowerCase().includes(filter));
const safePath = (p) => !/[:*?"<>|]/.test(p) && !p.split('/').some((s) => s === '..' || s === '' || /[. ]$/.test(s));

async function fetchRaw(repo, sha, p) {
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/${p.split('/').map(encodeURIComponent).join('/')}`;
  for (let t = 0; t < 3; t++) { try { const r = await fetch(url); if (r.ok) return Buffer.from(await r.arrayBuffer()); if (r.status === 404) return null; } catch {} }
  return null;
}

let n = 0;
for (const r of repos) {
  const dir = path.join(OUT, r.repo.replace('/', '__'));
  const tree = JSON.parse((await ex('gh', ['api', `repos/${r.repo}/git/trees/${r.sha}?recursive=1`], { maxBuffer: 1 << 28 })).stdout).tree;
  const { keep } = applyBudget(selectFiles(tree).files.filter((f) => safePath(f.path)));
  fs.rmSync(dir, { recursive: true, force: true });
  let ok = 0;
  for (let i = 0; i < keep.length; i += 12) await Promise.all(keep.slice(i, i + 12).map(async (f) => {
    const b = await fetchRaw(r.repo, r.sha, f.path); if (!b) return;
    const o = path.join(dir, 'files', f.path); fs.mkdirSync(path.dirname(o), { recursive: true }); fs.writeFileSync(o, b); ok++;
  }));
  if (ok) fs.writeFileSync(path.join(dir, 'SOURCE.json'), JSON.stringify({ repo: r.repo, sha: r.sha, license: r.license, note: 'Yeniden dagitmayin; sadece yerel kullanim.' }, null, 2));
  console.log(`${++n}/${repos.length} ${r.repo}: ${ok} dosya`);
}
