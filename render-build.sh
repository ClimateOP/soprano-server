#!/usr/bin/env bash

mkdir -p /opt/render/project/bin

curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /opt/render/project/bin/yt-dlp

chmod +x /opt/render/project/bin/yt-dlp