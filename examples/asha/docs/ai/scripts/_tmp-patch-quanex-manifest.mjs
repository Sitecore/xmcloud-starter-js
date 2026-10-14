import { readFileSync, writeFileSync } from 'fs';

const manifestPath = 'docs/ai/manifests/sitecore-manifest.yaml';
const block = readFileSync('docs/ai/ia/_tmp-quanex-ia-manifest-block.yaml', 'utf8').trimEnd() + '\n\n';
let m = readFileSync(manifestPath, 'utf8');
const startMarker = '  - name: "quanex-ia-tree"';
const nextMarker = '  - name: "pillsburylaw-blogs-content-update"';
const start = m.indexOf(startMarker);
const next = m.indexOf(nextMarker);
if (start < 0 || next < 0) {
  throw new Error(`markers not found start=${start} next=${next}`);
}
m = m.slice(0, start) + block + m.slice(next);
writeFileSync(manifestPath, m);
console.log('replaced quanex block');
