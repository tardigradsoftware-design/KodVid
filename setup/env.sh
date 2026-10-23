# KodVid ortam degiskenleri. Her komut oncesi: source /home/user/KodVid/setup/env.sh
# Agir dosyalar (Node, npm onbellegi, render gecici dosyalari) mumkunse /opt/kodvid altina gider,
# boylece /home/user calisma alani kotasini doldurmaz. /opt yazilamazsa $HOME/.kodvid kullanilir.
if [ -z "${KV_HOME:-}" ]; then
  if [ -d /opt/kodvid ] && [ -w /opt/kodvid ]; then KV_HOME=/opt/kodvid; else KV_HOME="$HOME/.kodvid"; fi
fi
export KV_HOME
export PATH="$KV_HOME/node/bin:$PATH"
export TMPDIR="$KV_HOME/tmp"
export npm_config_cache="$KV_HOME/npm-cache"
mkdir -p "$TMPDIR" "$npm_config_cache" 2>/dev/null || true
