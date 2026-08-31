#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "usage: extract-last-frame.sh <input.mp4> <output.jpg>" >&2
  exit 1
fi

input=$1
output=$2

if [[ ! -f "$input" ]]; then
  echo "missing video: $input" >&2
  exit 1
fi

mkdir -p "$(dirname "$output")"

# Seek near the end, then grab one frame.
ffmpeg -hide_banner -loglevel error -y -sseof -0.15 -i "$input" -frames:v 1 -q:v 2 "$output"

if [[ ! -s "$output" ]]; then
  echo "failed to write $output" >&2
  exit 1
fi

echo "$output"
