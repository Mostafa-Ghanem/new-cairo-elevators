#!/usr/bin/env bash
# Regenerates scripts/lqip.json: a tiny blurred WebP (data URI) for every photo in
# public/assets/images, used by scripts/postbuild.mjs as the <img> placeholder
# while the real image downloads. Needs ImageMagick. Run after adding/replacing photos.
set -euo pipefail
cd "$(dirname "$0")/.."
echo '{' > scripts/lqip.json
first=1
while IFS= read -r f; do
  data=$(convert "$f" -resize 20x -strip -quality 40 webp:- | base64 -w0)
  key=${f#public/}
  [ $first -eq 1 ] && first=0 || echo ',' >> scripts/lqip.json
  printf '  "%s": "data:image/webp;base64,%s"' "$key" "$data" >> scripts/lqip.json
done < <(find public/assets/images -name '*.webp' ! -name '*-720.webp' ! -name '*-860.webp' ! -path '*/brand/*' | sort)
printf '\n}\n' >> scripts/lqip.json
