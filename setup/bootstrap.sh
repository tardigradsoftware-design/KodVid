#!/usr/bin/env bash
# KodVid ortam kurulumu. Her oturum basinda calistirin; tekrar calistirmak guvenlidir.
# Kurar: Node 22+ (/home/user altina, yeniden baslatmada korunur), FFmpeg, Chrome kutuphaneleri,
# HyperFrames icin Chrome Headless Shell. Sonunda bir durum ozeti yazar.
# Kullanim: bash setup/bootstrap.sh
set -uo pipefail

KV_HOME="${KV_HOME:-$HOME/.kodvid}"
NODE_DIR="$KV_HOME/node"
export PATH="$NODE_DIR/bin:$PATH"
export TMPDIR="$HOME/.tmp"
mkdir -p "$KV_HOME" "$TMPDIR"

ok()   { printf '  [OK]    %s\n' "$*"; }
warn() { printf '  [UYARI] %s\n' "$*"; }
fail() { printf '  [HATA]  %s\n' "$*"; FAILED=1; }
FAILED=0
SUDO=""; if [ "$(id -u)" -ne 0 ]; then sudo -n true 2>/dev/null && SUDO="sudo -n" || warn "sudo yok: apt paketleri kurulamaz"; fi

echo "== 1. Node 22+"
node_major() { command -v node >/dev/null 2>&1 && node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }
if [ "$(node_major)" -lt 22 ]; then
  case "$(uname -m)" in x86_64) ARCH=x64;; aarch64|arm64) ARCH=arm64;; *) ARCH=x64;; esac
  BASE="https://nodejs.org/dist/latest-v22.x"
  FILE=$(curl -fsSL "$BASE/SHASUMS256.txt" | grep -oE "node-v22\.[0-9]+\.[0-9]+-linux-$ARCH\.tar\.xz" | head -1)
  if [ -n "$FILE" ] && curl -fsSL "$BASE/$FILE" -o "$KV_HOME/node.tar.xz"; then
    rm -rf "$NODE_DIR" && mkdir -p "$NODE_DIR" && tar -xJf "$KV_HOME/node.tar.xz" -C "$NODE_DIR" --strip-components=1 && rm -f "$KV_HOME/node.tar.xz"
  fi
fi
[ "$(node_major)" -ge 22 ] && ok "Node $(node -v) ($(command -v node))" || fail "Node 22 kurulamadi"

echo "== 2. Sistem paketleri (FFmpeg, Chrome icin NSS)"
PKGS=""
command -v ffmpeg >/dev/null 2>&1 || PKGS="$PKGS ffmpeg"
for p in libnss3 libnspr4 libnss3-tools; do dpkg -s "$p" >/dev/null 2>&1 || PKGS="$PKGS $p"; done
if [ -n "$PKGS" ]; then
  if [ -n "$SUDO" ] || [ "$(id -u)" -eq 0 ]; then
    $SUDO apt-get update -qq >/dev/null 2>&1; DEBIAN_FRONTEND=noninteractive $SUDO apt-get install -y -qq $PKGS >/dev/null 2>&1 || fail "apt kurulumu basarisiz:$PKGS"
  else fail "Eksik paketler kurulamadi:$PKGS"; fi
fi
command -v ffmpeg >/dev/null 2>&1 && ok "$(ffmpeg -version | head -1 | cut -d' ' -f1-3)" || fail "FFmpeg yok"

echo "== 3. Chrome Headless Shell"
npx -y hyperframes browser ensure >/dev/null 2>&1 || warn "browser ensure hata verdi"
CHROME=$(find "$HOME/.cache" -type f -name chrome-headless-shell 2>/dev/null | head -1)
if [ -n "$CHROME" ]; then
  MISSING=$(ldd "$CHROME" 2>/dev/null | awk '/not found/ {print $1}' | tr '\n' ' ')
  [ -n "$MISSING" ] && fail "Chrome icin eksik kutuphaneler: $MISSING" || ok "$("$CHROME" --version 2>/dev/null)"
else fail "Chrome Headless Shell bulunamadi"; fi

echo "== 4. HyperFrames"
HF=$(npx -y hyperframes --version 2>/dev/null | tail -1)
[ -n "$HF" ] && ok "HyperFrames $HF" || warn "HyperFrames surumu okunamadi; 'npx hyperframes doctor --json' ile kontrol edin"

echo "== 5. Kaynaklar"
ok "CPU: $(nproc) cekirdek, RAM: $(free -h | awk '/Mem:/ {print $2" toplam, "$7" bos"}')"
ok "Disk bos (home): $(df -h "$HOME" | awk 'NR==2 {print $4}'), TMPDIR: $TMPDIR"
[ "$(nproc)" -le 2 ] && warn "GPU yok ve cekirdek az: render yaklasik gercek zamanin 2 kati surer"

echo
if [ "$FAILED" -eq 0 ]; then echo "HAZIR. Render icin: bash setup/render.sh --quality draft --output out.mp4"
else echo "EKSIK VAR. Yukaridaki [HATA] satirlarini duzeltmeden render etmeyin."; fi
exit "$FAILED"
