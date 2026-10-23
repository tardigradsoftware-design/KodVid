#!/usr/bin/env node
// catalog/skills.json dosyasindan motor basina kucuk dizinler uretir: catalog/index/<motor>.md
// Ajan buyuk skills.json yerine once README.md'yi, sonra tek bir motor dosyasini okur.
// build.mjs sonunda otomatik calisir; elle: node scripts/make-index.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'catalog', 'index');
const skills = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog', 'skills.json'), 'utf8')).filter((s) => !s.duplicateOf);

const ENGINES = {
  hyperframes: 'HyperFrames: HTML + CSS + GSAP ile video. Bu ortam icin onerilen ana motor.',
  remotion: 'Remotion: React ile video. Sirketlerde ucretli lisans gerekebilir.',
  manim: 'Manim: Python ile matematik ve bilim animasyonu.',
  gsap: 'GSAP: zamanlama, easing ve animasyon kutuphanesi.',
  lottie: 'Lottie: vektorel animasyon dosyalari.',
  ffmpeg: 'FFmpeg: mevcut videoyu kesme, birlestirme, altyazi, ses.',
  tts: 'Seslendirme, muzik ve transkripsiyon.',
  'ai-video-model': 'Yapay zeka video modelleri (Veo, Kling, LTX vb.). Genelde API anahtari ister.',
  threejs: 'Three.js ile 3B sahneler.',
  'html-canvas': 'Saf HTML/Canvas ile tarayicida kare kare video.',
  p5js: 'p5.js ile uretken sanat animasyonlari.',
  blender: 'Blender ile 3B film.',
  'motion-canvas': 'Motion Canvas: TypeScript animasyon motoru.',
  revideo: 'Revideo: Motion Canvas tabanli, sunucuda render.',
  moviepy: 'MoviePy: Python ile video duzenleme.',
  other: 'Belirli bir motora baglanamayan skill ler (yontem, senaryo, kurgu bilgisi).',
};

const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').replace(/\|/g, '/').trim().slice(0, n);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const groups = {};
for (const s of skills) for (const e of (s.engines.length ? s.engines : ['other'])) (groups[e] ||= []).push(s);

let readme = '# Motor Dizini\n\nGoreve uyan motorun dosyasini ac. Her satir: skill adi, kisa aciklama, klasor yolu.\n'
  + 'Ayni skill birden fazla motorda gorunebilir. Satirlar yildiz sayisina gore siralidir.\n\n| Dosya | Skill | Aciklama |\n|---|---:|---|\n';
for (const [e, desc] of Object.entries(ENGINES)) {
  const list = groups[e]; if (!list?.length) continue;
  let md = `# ${e}\n\n${desc}\n\nToplam ${list.length} skill. Once SKILL.md dosyasini oku, sonra sadece onun gosterdigi dosyalari.\n\n`;
  for (const s of list) md += `- **${clean(s.name, 60)}** (${s.kind}, ${s.license}): ${clean(s.description, 160)}\n  \`${s.dir}\`\n`;
  fs.writeFileSync(path.join(OUT, `${e}.md`), md);
  readme += `| [${e}.md](${e}.md) | ${list.length} | ${desc} |\n`;
}
fs.writeFileSync(path.join(OUT, 'README.md'), readme);
const sizes = fs.readdirSync(OUT).map((f) => `${f} ${(fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0)}KB`);
console.log(`dizin: ${sizes.join(', ')}`);
