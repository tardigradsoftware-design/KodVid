#!/usr/bin/env node

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function printHelp() {
  console.log(`
docvideoer - document-to-video helper

Usage:
  docvideoer fetch <url> --out <source.md>
  docvideoer tts --storyboard <storyboard.json> --audio-dir <audio-dir>
  docvideoer setup --storyboard <storyboard.json> --audio-dir <audio-dir> --video-dir <video-dir>
  docvideoer render --video-dir <video-dir> --out <output.mp4> [--install]
  docvideoer build --storyboard <storyboard.json> --project-dir <project-dir> [--install]

Notes:
  - Generate storyboard.json with Codex/Claude, or write it manually from examples/storyboard.example.json.
  - Edge TTS is recommended: pip3 install edge-tts
  - On macOS, the TTS script can fall back to the system say command.
`.trim());
}

function argValue(args, name, fallback = null) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function requireValue(args, name) {
  const value = argValue(args, name);
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function createTtsBatch(storyboardPath, audioDir) {
  const storyboard = readJson(storyboardPath);
  if (!Array.isArray(storyboard.scenes)) {
    throw new Error('storyboard.scenes must be an array');
  }

  const absoluteAudioDir = path.resolve(audioDir);
  fs.mkdirSync(absoluteAudioDir, { recursive: true });

  const items = storyboard.scenes
    .filter((scene) => scene.narration && scene.narration.trim())
    .map((scene) => ({
      id: scene.id,
      text: scene.narration,
      output: path.join(absoluteAudioDir, `${scene.id}.mp3`),
    }));

  if (items.length === 0) {
    throw new Error('No scene narration found in storyboard');
  }

  const batchPath = path.join(path.dirname(absoluteAudioDir), 'tts-batch.json');
  writeJson(batchPath, items);
  return batchPath;
}

async function runNodeScript(scriptName, args, options = {}) {
  const scriptPath = path.join(rootDir, 'scripts', scriptName);
  const child = await execFileP(process.execPath, [scriptPath, ...args], {
    cwd: options.cwd || rootDir,
    env: { ...process.env, ...(options.env || {}) },
    maxBuffer: 1024 * 1024 * 20,
  });
  if (child.stderr) process.stderr.write(child.stderr);
  if (child.stdout) process.stdout.write(child.stdout);
}

async function runCommand(command, args, options = {}) {
  const child = await execFileP(command, args, {
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...(options.env || {}) },
    maxBuffer: 1024 * 1024 * 20,
  });
  if (child.stderr) process.stderr.write(child.stderr);
  if (child.stdout) process.stdout.write(child.stdout);
}

async function fetchCommand(args) {
  const url = args.find((arg) => /^https?:\/\//.test(arg));
  const out = requireValue(args, '--out');
  if (!url) throw new Error('fetch requires a URL');
  await runNodeScript('fetch-doc.mjs', [url, '--out', out]);
}

async function ttsCommand(args) {
  const storyboardPath = requireValue(args, '--storyboard');
  const audioDir = requireValue(args, '--audio-dir');
  const batchPath = createTtsBatch(storyboardPath, audioDir);
  const ttsArgs = ['--file', batchPath];

  for (const opt of ['--voice', '--rate', '--backend']) {
    const value = argValue(args, opt);
    if (value) ttsArgs.push(opt, value);
  }

  await runNodeScript('tts.mjs', ttsArgs);
}

async function setupCommand(args) {
  const storyboardPath = requireValue(args, '--storyboard');
  const audioDir = requireValue(args, '--audio-dir');
  const videoDir = requireValue(args, '--video-dir');
  await runNodeScript('setup-remotion.mjs', [
    videoDir,
    '--storyboard',
    storyboardPath,
    '--audio-dir',
    audioDir,
  ]);
}

async function renderCommand(args) {
  const videoDir = path.resolve(requireValue(args, '--video-dir'));
  const out = path.resolve(requireValue(args, '--out'));

  if (hasFlag(args, '--install')) {
    await runCommand('npm', ['install'], { cwd: videoDir });
  }

  await runCommand('npx', ['remotion', 'render', 'src/index.tsx', 'DocVideo', out], { cwd: videoDir });
}

async function buildCommand(args) {
  const projectDir = path.resolve(requireValue(args, '--project-dir'));
  const storyboardPath = path.resolve(requireValue(args, '--storyboard'));
  const audioDir = path.join(projectDir, 'audio');
  const videoDir = path.join(projectDir, 'video');
  const out = path.join(projectDir, 'output.mp4');

  fs.mkdirSync(projectDir, { recursive: true });
  await ttsCommand(['--storyboard', storyboardPath, '--audio-dir', audioDir, ...args]);
  await setupCommand(['--storyboard', storyboardPath, '--audio-dir', audioDir, '--video-dir', videoDir]);
  await renderCommand(['--video-dir', videoDir, '--out', out, ...(hasFlag(args, '--install') ? ['--install'] : [])]);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  switch (command) {
    case 'fetch':
      await fetchCommand(args);
      break;
    case 'tts':
      await ttsCommand(args);
      break;
    case 'setup':
      await setupCommand(args);
      break;
    case 'render':
      await renderCommand(args);
      break;
    case 'build':
      await buildCommand(args);
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((err) => {
  console.error(`docvideoer: ${err.message}`);
  process.exit(1);
});
