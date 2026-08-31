#!/usr/bin/env bash
# Upload a local file to fal CDN. Prints only the file_url.
# Hosted MCP cannot read file_path, and last-frame JPEGs are too large
# to pass as base64 through upload_file. Use this after every extract.
set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "usage: upload-to-fal.sh <file> [content_type]" >&2
  exit 1
fi

file=$1
if [[ ! -f "$file" ]]; then
  echo "missing file: $file" >&2
  exit 1
fi

name=$(basename "$file")
ext=$(printf '%s' "${name##*.}" | tr '[:upper:]' '[:lower:]')

if [[ $# -eq 2 ]]; then
  content_type=$2
else
  case "$ext" in
    jpg|jpeg) content_type=image/jpeg ;;
    png) content_type=image/png ;;
    webp) content_type=image/webp ;;
    mp4) content_type=video/mp4 ;;
    *) content_type=application/octet-stream ;;
  esac
fi

key=$(python3 - <<'PY'
import json
import os
import sys
from pathlib import Path

key = os.environ.get("FAL_KEY", "").strip()
if key:
    print(key)
    raise SystemExit(0)

mcp = Path.home() / ".cursor" / "mcp.json"
if not mcp.is_file():
    raise SystemExit(1)

auth = (
    json.loads(mcp.read_text())
    .get("mcpServers", {})
    .get("fal-ai", {})
    .get("headers", {})
    .get("Authorization", "")
)
if auth.lower().startswith("bearer "):
    print(auth.split(" ", 1)[1].strip())
    raise SystemExit(0)
raise SystemExit(1)
PY
) || {
  echo "FAL_KEY is unset and ~/.cursor/mcp.json has no fal-ai Bearer" >&2
  exit 1
}

init_file=$(mktemp)
trap 'rm -f "$init_file"' EXIT

python3 - "$key" "$name" "$content_type" "$init_file" <<'PY'
import json
import sys
import urllib.request

key, name, content_type, dest = sys.argv[1:]
req = urllib.request.Request(
    "https://rest.alpha.fal.ai/storage/upload/initiate",
    data=json.dumps({"file_name": name, "content_type": content_type}).encode(),
    headers={
        "Authorization": f"Key {key}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req) as resp:
    Path = dest
    open(Path, "w").write(resp.read().decode())
PY

upload_url=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['upload_url'])" "$init_file")
file_url=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['file_url'])" "$init_file")

curl -sS -X PUT "$upload_url" \
  -H "Content-Type: $content_type" \
  --data-binary @"$file" >/dev/null

echo "$file_url"
