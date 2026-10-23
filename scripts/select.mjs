// Bir repo ağacından hangi dosyaların alınacağını seçer (vendor ve ölçüm ortak kullanır)
export const TEXT = /\.(md|mdx|txt|json|ya?ml|toml|js|mjs|cjs|ts|tsx|jsx|py|sh|html|css|glsl)$/i;
const BAD_DIR = /(^|\/)(node_modules|dist|build|out|\.next|\.git|tests?|__tests__|fixtures|vendor|public|coverage|\.turbo|\.cache|renders?|output)(\/|$)/i;
const BAD_FILE = /(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lock|\.min\.(js|css)|\.map)$/i;
const ROOT_DIRS = /^(references?|scripts|templates?|examples?|docs|prompts|rules|guides?|agents|recipes|knowledge)\//i;
export function selectFiles(tree) {
  const blobs = tree.filter(x => x.type === 'blob');
  let roots = blobs.filter(x => /(^|\/)SKILL\.md$/i.test(x.path) && !BAD_DIR.test(x.path)).map(x => x.path.replace(/\/?SKILL\.md$/i, ''));
  // SKILL.md yoksa: kökte ajan rehberi (AGENTS.md, CLAUDE.md, *GUIDE*.md) varsa kökü rehber olarak al
  let kind = roots.length ? 'skill' : null;
  if (!kind && blobs.some(x => /^(AGENTS|CLAUDE|GEMINI)\.md$|^[^/]*GUIDE[^/]*\.md$/i.test(x.path))) { roots = ['']; kind = 'guide'; }
  const nested = roots.filter(r => r !== '');
  const files = blobs.filter(x => {
    if (!TEXT.test(x.path) || BAD_DIR.test(x.path) || BAD_FILE.test(x.path) || x.size > 150000) return false;
    if (nested.some(r => x.path.startsWith(r + '/'))) return true;
    if (roots.includes('')) { // kökte SKILL.md: sadece kök md dosyaları + bilinen yardımcı klasörler
      if (!x.path.includes('/') && /\.(md|mdx|txt)$/i.test(x.path)) return true;
      if (ROOT_DIRS.test(x.path)) return true;
    }
    return false;
  });
  return { roots, files, kind };
}
// Repo başına bütçe: önce SKILL.md, sonra markdown, sonra küçükten büyüğe diğerleri
export const BUDGET = { bytes: 2_000_000, files: 300 };
export function applyBudget(files) {
  const rank = f => /(^|\/)SKILL\.md$/.test(f.path) ? 0 : /\.(md|mdx|txt)$/i.test(f.path) ? 1 : 2;
  const sorted = [...files].sort((a, b) => rank(a) - rank(b) || a.size - b.size);
  const keep = []; let bytes = 0;
  for (const f of sorted) { if (rank(f) > 0 && (bytes + f.size > BUDGET.bytes || keep.length >= BUDGET.files)) continue; keep.push(f); bytes += f.size; }
  return { keep, dropped: files.length - keep.length };
}
