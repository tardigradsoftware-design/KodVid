#!/usr/bin/env node

/**
 * 免费 TTS 语音合成工具
 *
 * 支持两种后端（自动检测，优先 Edge TTS）：
 *   - Edge TTS（推荐）：微软 Edge 在线 TTS，音质好，支持字幕时间戳
 *   - Mac say：macOS 系统自带，离线可用
 *
 * 用法:
 *   node scripts/tts.mjs --text "你好世界" --out ./output.mp3
 *   node scripts/tts.mjs --file ./scenes.json
 *
 * 批量输入 JSON 格式:
 *   [
 *     { "id": "scene-1", "text": "讲解文案1", "output": "./audio/scene-1.mp3" },
 *     { "id": "scene-2", "text": "讲解文案2", "output": "./audio/scene-2.mp3" }
 *   ]
 *
 * 可选环境变量:
 *   TTS_BACKEND     - 强制指定后端: "edge" | "mac"
 *   TTS_VOICE       - 音色（默认 zh-CN-XiaoxiaoNeural）
 *   TTS_RATE        - 语速调整（默认 +0%，如 "+10%" 或 "-10%"）
 *   EDGE_TTS_PATH   - edge-tts 可执行文件路径
 */

import { execFile, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execFileP = promisify(execFile);

// --- 后端检测 ------------------------------------------------------------

let _backend = null;

function detectBackend() {
  if (_backend) return _backend;

  // 强制指定
  const forced = process.env.TTS_BACKEND;
  if (forced === 'edge' || forced === 'mac') {
    _backend = forced;
    return _backend;
  }

  // 检查 edge-tts
  const edgePath = process.env.EDGE_TTS_PATH
    || findEdgeTts()
    || 'edge-tts';

  try {
    execSync(`"${edgePath}" --version`, { stdio: 'pipe' });
    _backend = 'edge';
    _edgeTtsPath = edgePath;
    return _backend;
  } catch {}

  // 回退到 macOS say
  try {
    execSync('say -v "?"', { stdio: 'pipe' });
    _backend = 'mac';
    return _backend;
  } catch {}

  throw new Error('No TTS backend found. Install edge-tts (pip3 install edge-tts) or use macOS.');
}

let _edgeTtsPath = null;
function getEdgeTtsPath() {
  if (_edgeTtsPath) return _edgeTtsPath;
  _edgeTtsPath = process.env.EDGE_TTS_PATH || findEdgeTts() || 'edge-tts';
  return _edgeTtsPath;
}

function findEdgeTts() {
  // 尝试常见路径
  const candidates = [
    path.join(process.env.HOME || '/tmp', 'Library/Python/3.9/bin/edge-tts'),
    path.join(process.env.HOME || '/tmp', 'Library/Python/3.11/bin/edge-tts'),
    path.join(process.env.HOME || '/tmp', 'Library/Python/3.12/bin/edge-tts'),
    '/usr/local/bin/edge-tts',
    '/opt/homebrew/bin/edge-tts',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// --- 后端: Edge TTS ------------------------------------------------------

const EDGE_VOICES = {
  female: 'zh-CN-XiaoxiaoNeural',  // 温暖女声
  male: 'zh-CN-YunyangNeural',      // 专业男声
  lively: 'zh-CN-YunxiNeural',      // 活泼男声
  girl: 'zh-CN-XiaoyiNeural',       // 活泼女声
};

/**
 * 使用 Edge TTS 合成语音
 */
async function synthesizeEdge({ text, voice, rate, output }) {
  const edgePath = getEdgeTtsPath();
  const v = voice || process.env.TTS_VOICE || EDGE_VOICES.female;
  const r = rate || process.env.TTS_RATE || '+0%';

  const args = ['--voice', v, '--rate', r, '--text', text, '--write-media', output];
  await execFileP(edgePath, args, { timeout: 30000 });

  // 同时生成字幕文件
  const vttPath = output.replace(/\.\w+$/, '.vtt');
  try {
    await execFileP(edgePath, [...args.slice(0, -2), '--write-subtitles', vttPath], { timeout: 30000 });
  } catch {
    // 字幕生成失败不阻塞主流程
  }
}

// --- 后端: macOS say -----------------------------------------------------

/**
 * 使用 macOS say 命令合成语音
 */
async function synthesizeMac({ text, voice, rate, output }) {
  const v = voice || process.env.TTS_VOICE || 'Tingting';
  // say 的 rate 单位是 wpm，默认约 180
  const rateNum = rate ? parseFloat(rate) : 180;

  const aiffOutput = output.replace(/\.\w+$/, '.aiff');
  await execFileP('say', ['-v', v, '-r', String(rateNum), '-o', aiffOutput, '--', text], { timeout: 30000 });

  // 转换为 mp3
  await execFileP('afconvert', ['-f', 'mp4f', '-d', 'aac', '-b', '128000', aiffOutput, output], { timeout: 30000 });

  // 清理临时 aiff
  try { fs.unlinkSync(aiffOutput); } catch {}
}

// --- 公开 API ------------------------------------------------------------

const DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural';

/**
 * 合成单段文本为语音
 * @param {object} opts
 * @param {string} opts.text - 要合成的文本
 * @param {string} [opts.voice] - 音色，默认 zh-CN-XiaoxiaoNeural
 * @param {string} [opts.rate] - 语速，默认 "+0%"
 * @param {string} [opts.output] - 输出文件路径
 * @returns {Promise<{output: string, audio: Buffer}>}
 */
export async function synthesize(opts = {}) {
  const { text, voice = DEFAULT_VOICE, rate = '+0%' } = opts;
  if (!text) throw new Error('text is required');

  const backend = detectBackend();
  const output = opts.output || path.resolve(process.cwd(), `tts-output-${Date.now()}.mp3`);
  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (backend === 'edge') {
    await synthesizeEdge({ text, voice, rate, output });
  } else if (backend === 'mac') {
    await synthesizeMac({ text, voice, rate, output });
  } else {
    throw new Error(`Unknown TTS backend: ${backend}`);
  }

  const audio = fs.readFileSync(output);
  return { output, audio };
}

/**
 * 批量合成
 * @param {Array<{id: string, text: string, output?: string}>} items
 * @param {object} [opts]
 * @param {string} [opts.voice] - 音色
 * @param {string} [opts.rate] - 语速
 * @param {number} [opts.concurrency=3] - 并行数
 * @returns {Promise<Array<{id: string, output: string, durationMs: number}>>}
 */
export async function synthesizeBatch(items, opts = {}) {
  const { voice, rate, concurrency = 3 } = opts;
  const results = [];
  const backend = detectBackend();

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(async (item) => {
        const output = item.output || path.resolve(process.cwd(), `${item.id}.mp3`);
        await synthesize({ text: item.text, voice, rate, output });
        const durationMs = getAudioDuration(output);
        return { id: item.id, output, durationMs, backend };
      }),
    );

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value);
      } else {
        console.error(`TTS batch error [${items[i + batchResults.indexOf(r)]?.id}]:`, r.reason?.message || r.reason);
      }
    }
  }

  return results;
}

/**
 * 获取音频文件实际时长（毫秒）
 * 使用 afinfo（macOS）或 ffprobe
 */
export function getAudioDuration(filePath) {
  if (!fs.existsSync(filePath)) return 0;

  try {
    // macOS afinfo
    const out = execSync(`afinfo "${filePath}" 2>/dev/null | grep "estimated duration"`, { encoding: 'utf-8' });
    const match = out.match(/([\d.]+)\s*sec/);
    if (match) return Math.round(parseFloat(match[1]) * 1000);
  } catch {}

  try {
    // ffprobe fallback
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, { encoding: 'utf-8' });
    const d = parseFloat(out.trim());
    if (!isNaN(d)) return Math.round(d * 1000);
  } catch {}

  // 文件大小估算 mp3 ~16KB/s
  const stat = fs.statSync(filePath);
  return Math.round((stat.size / 16000) * 1000);
}

// --- CLI 入口 ------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  // 检测后端
  const backendIdx = args.indexOf('--backend');
  if (backendIdx !== -1) process.env.TTS_BACKEND = args[backendIdx + 1];

  const backend = detectBackend();
  console.error(`TTS backend: ${backend}`);

  // 批量模式
  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1) {
    const jsonPath = args[fileIdx + 1];
    const items = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const voiceIdx = args.indexOf('--voice');
    const rateIdx = args.indexOf('--rate');
    const voice = voiceIdx !== -1 ? args[voiceIdx + 1] : undefined;
    const rate = rateIdx !== -1 ? args[rateIdx + 1] : undefined;

    console.error(`Synthesizing ${items.length} items...`);
    const results = await synthesizeBatch(items, { voice, rate });

    const summary = results.map((r) => ({ id: r.id, output: r.output, durationMs: r.durationMs, backend: r.backend }));
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  // 单段模式
  const textIdx = args.indexOf('--text');
  const text = textIdx !== -1 ? args[textIdx + 1] : args[0];
  if (!text) {
    console.error('Usage: tts.mjs --text <text> [--out <path>] [--voice <voice>] [--rate <rate>]');
    console.error('       tts.mjs --file <scenes.json>');
    console.error('');
    console.error('Voices (Edge TTS):');
    console.error('  zh-CN-XiaoxiaoNeural  温暖女声 (默认)');
    console.error('  zh-CN-YunyangNeural   专业男声');
    console.error('  zh-CN-YunxiNeural     活泼男声');
    console.error('  zh-CN-XiaoyiNeural    活泼女声');
    console.error('');
    console.error('Voices (macOS say):');
    console.error('  Tingting              普通话女声 (默认)');
    console.error('  Meijia                台语女声');
    process.exit(1);
  }

  const outIdx = args.indexOf('--out');
  const outPath = outIdx !== -1 ? args[outIdx + 1] : null;
  const voiceIdx = args.indexOf('--voice');
  const voice = voiceIdx !== -1 ? args[voiceIdx + 1] : undefined;
  const rateIdx = args.indexOf('--rate');
  const rate = rateIdx !== -1 ? args[rateIdx + 1] : undefined;

  const label = text.length > 50 ? text.slice(0, 50) + '...' : text;
  console.error(`Synthesizing: "${label}"`);
  const result = await synthesize({ text, voice, rate, output: outPath });

  const durationMs = getAudioDuration(result.output);
  console.log(`Output: ${result.output}`);
  console.log(`Size: ${(result.audio.length / 1024).toFixed(1)} KB`);
  console.log(`Duration: ${(durationMs / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error('TTS Error:', err.message);
  process.exit(1);
});
