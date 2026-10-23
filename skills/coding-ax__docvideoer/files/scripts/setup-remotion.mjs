#!/usr/bin/env node

/**
 * Remotion 视频项目初始化工具
 *
 * 从模板创建 Remotion 视频项目，根据 storyboard.json 自定义场景组件。
 *
 * 用法:
 *   node scripts/setup-remotion.mjs <output-dir>
 *     --storyboard <storyboard.json>
 *     --audio-dir <audio-dir>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '..', 'templates', 'doc-video');

/**
 * 解析 VTT 字幕文件为 SubtitleCue 数组
 * 格式: [{"startMs": 100, "endMs": 5500, "text": "你好"}]
 */
function parseVttFile(vttPath) {
  if (!fs.existsSync(vttPath)) return [];
  const content = fs.readFileSync(vttPath, 'utf-8').trim();
  const cues = [];
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 2) continue;
    // 查找时间戳行: "00:00:00,100 --> 00:00:05,500"
    const timeLine = lines.find((l) => l.includes('-->'));
    const textLine = lines[lines.length - 1];
    if (!timeLine || !textLine || /^\d+$/.test(textLine)) continue;

    const match = timeLine.match(/([\d:,.]+)\s*-->\s*([\d:,.]+)/);
    if (!match) continue;

    cues.push({
      startMs: timeToMs(match[1]),
      endMs: timeToMs(match[2]),
      text: textLine.trim(),
    });
  }

  return cues;
}

function timeToMs(timeStr) {
  // "00:00:00,100" → 100ms
  const parts = timeStr.split(/[:,]/); // [00, 00, 00, 100] or [00, 00, 00.100]
  const h = parseInt(parts[0]) || 0;
  const m = parseInt(parts[1]) || 0;
  const s = parseInt(parts[2]) || 0;
  const ms = parseInt(parts[3]) || parseInt(parts[3]) || 0;
  return (h * 3600 + m * 60 + s) * 1000 + ms;
}

/**
 * 递归复制目录
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 创建 Remotion 视频项目
 * @param {string} outputDir - 输出目录
 * @param {object} storyboard - 分镜数据
 * @param {string} audioDir - 音频文件目录
 */
export function setupRemotionProject(outputDir, storyboard, audioDir) {
  // 1. 复制模板
  console.log(`Setting up Remotion project in: ${outputDir}`);
  copyDir(TEMPLATE_DIR, outputDir);

  // 2. 复制音频文件到 public/audio（Remotion 不支持软链接）
  const publicDir = path.join(outputDir, 'public');
  fs.mkdirSync(publicDir, { recursive: true });
  const audioDestDir = path.join(publicDir, 'audio');
  fs.mkdirSync(audioDestDir, { recursive: true });

  const resolvedAudioDir = path.resolve(audioDir);
  if (fs.existsSync(resolvedAudioDir)) {
    for (const file of fs.readdirSync(resolvedAudioDir)) {
      if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a')) {
        fs.copyFileSync(path.join(resolvedAudioDir, file), path.join(audioDestDir, file));
      }
    }
    console.log(`  Audio files copied to public/audio/`);
  }

  // 3. 解析字幕文件
  const subtitleMap = {};
  const resolvedAudioDir2 = path.resolve(audioDir);
  if (fs.existsSync(resolvedAudioDir2)) {
    for (const file of fs.readdirSync(resolvedAudioDir2)) {
      if (file.endsWith('.vtt')) {
        const sceneId = file.replace('.vtt', '');
        const vttPath = path.join(resolvedAudioDir2, file);
        subtitleMap[sceneId] = parseVttFile(vttPath);
      }
    }
    if (Object.keys(subtitleMap).length > 0) {
      console.log(`  Subtitles parsed for ${Object.keys(subtitleMap).length} scenes`);
    }
  }

  // 4. 写入 storyboard 数据文件
  const dataDir = path.join(outputDir, 'public');
  fs.writeFileSync(
    path.join(dataDir, 'storyboard.json'),
    JSON.stringify(storyboard, null, 2),
    'utf-8',
  );

  // 5. 更新 index.tsx，注入真实的 storyboard + 字幕数据
  const subtitlesJson = JSON.stringify(subtitleMap);
  const indexTsx = `
import { registerRoot, Composition, staticFile } from 'remotion';
import type { Storyboard, AudioTrack, SubtitleCue } from './types';
import Root from './Root';

import storyboardData from '../public/storyboard.json';

const storyboard = storyboardData as Storyboard;
const subtitleData: Record<string, SubtitleCue[]> = ${subtitlesJson};

const audioTracks: AudioTrack[] = storyboard.scenes.map((scene) => ({
  sceneId: scene.id,
  src: staticFile(\`audio/\${scene.id}.mp3\`),
  durationMs: Math.round(scene.duration * 1000),
  subtitles: subtitleData[scene.id] || [],
}));

const totalFrames = Math.round(storyboard.totalDuration * 30);

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DocVideo"
      component={Root as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={totalFrames}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        storyboard,
        audioTracks,
      }}
    />
  );
};

registerRoot(RemotionRoot);
`.trim();

  fs.writeFileSync(path.join(outputDir, 'src', 'index.tsx'), indexTsx, 'utf-8');

  console.log(`Remotion project ready: ${outputDir}`);
  console.log(`  Scenes: ${storyboard.scenes.length}`);
  console.log(`  Total duration: ${storyboard.totalDuration}s (${Math.round(storyboard.totalDuration * 30)} frames)`);

  return outputDir;
}

// --- CLI 入口 ---------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const outputDir = args.find((a) => !a.startsWith('--'));
  const storyboardIdx = args.indexOf('--storyboard');
  const audioIdx = args.indexOf('--audio-dir');

  if (!outputDir || storyboardIdx === -1) {
    console.error('Usage: setup-remotion.mjs <output-dir> --storyboard <storyboard.json> [--audio-dir <dir>]');
    process.exit(1);
  }

  const storyboardPath = args[storyboardIdx + 1];
  const audioDir = audioIdx !== -1 ? args[audioIdx + 1] : path.join(outputDir, 'public', 'audio');

  const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
  setupRemotionProject(path.resolve(outputDir), storyboard, audioDir);
}

main().catch((err) => {
  console.error('Setup Error:', err.message);
  process.exit(1);
});
