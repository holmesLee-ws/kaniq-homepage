#!/usr/bin/env bash
# QA r1: /en 문서가 참조하는 /_next/static/chunks/*.js 의 gzip(기본 레벨 6) 바이트 합. 기준 7379aa5 :3201, 후보 5f5fd82 :3200 (각 scratch에서 npm ci + build + npm start)
set -euo pipefail
for port in "$@"; do
  curl -s localhost:$port/en | grep -oE '/_next/static/chunks/[A-Za-z0-9_./~-]+\.js' | sort -u > /tmp/qa-kaniq/chunks-$port.txt
  n=$(wc -l < /tmp/qa-kaniq/chunks-$port.txt | tr -d ' ')
  sum=$(while read p; do curl -s "localhost:$port$p" | gzip -c | wc -c; done < /tmp/qa-kaniq/chunks-$port.txt | awk '{s+=$1} END{print s}')
  echo "port=$port chunks=$n gzip_sum=$sum"
done
