/**
 * One-off visual check: renders the Version2 world map (land + sample pins) to a PNG.
 * Mirrors the math in src/components/location-search/world-map.utils.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const source = readFileSync('src/components/location-search/world-land.data.ts', 'utf8');
const arrayStart = source.indexOf('[', source.indexOf('WORLD_LAND_RINGS: LandRing[] =') + 30);
const rings = JSON.parse(
  source.slice(arrayStart, source.lastIndexOf('];') + 1).replace(/,(\s*\])/g, '$1')
);

const CENTER_LONGITUDE = 150;
const WIDTH = 1000;
const LAT_TOP = 72;
const LAT_BOTTOM = -55;

const mercatorY = (lat) => {
  const clamped = Math.max(-84, Math.min(84, lat));
  const rad = (clamped * Math.PI) / 180;
  return (WIDTH / (2 * Math.PI)) * (Math.PI - Math.log(Math.tan(Math.PI / 4 + rad / 2)));
};

const TOP = mercatorY(LAT_TOP);
const HEIGHT = mercatorY(LAT_BOTTOM) - TOP;

const project = (lat, lng) => {
  const shifted = ((((lng - CENTER_LONGITUDE + 180) % 360) + 360) % 360) - 180;
  return { x: ((shifted + 180) / 360) * WIDTH, y: mercatorY(lat) - TOP };
};

let path = '';
for (const ring of rings) {
  let current = [];
  let previous = null;
  for (const [lng, lat] of ring) {
    const { x, y } = project(lat, lng);
    const exitsLeft = previous && x - previous.x > WIDTH / 2;
    const exitsRight = previous && previous.x - x > WIDTH / 2;
    if (previous && (exitsLeft || exitsRight)) {
      const unwrappedX = exitsLeft ? x - WIDTH : x + WIDTH;
      const exitX = exitsLeft ? 0 : WIDTH;
      const ratio = (exitX - previous.x) / (unwrappedX - previous.x);
      const edgeY = previous.y + ratio * (y - previous.y);
      current.push(`${exitX.toFixed(1)},${edgeY.toFixed(1)}`);
      if (current.length > 2) path += `M${current.join('L')}Z`;
      current = [`${(WIDTH - exitX).toFixed(1)},${edgeY.toFixed(1)}`];
    }
    current.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    previous = { x, y };
  }
  if (current.length > 2) path += `M${current.join('L')}Z`;
}

const samplePins = [
  ['hq', 'Tempe AZ', 33.42, -111.94],
  ['factory', 'Seoul', 37.57, 126.98],
  ['factory', 'Tokyo', 35.68, 139.69],
  ['factory', 'Shanghai', 31.23, 121.47],
  ['factory', 'Singapore', 1.35, 103.82],
  ['support', 'Porto Portugal', 41.15, -8.61],
  ['support', 'Munich', 48.14, 11.58],
  ['support', 'Austin TX', 30.27, -97.74],
  ['support', 'Taipei', 25.03, 121.57],
];
const colors = { hq: '#D4A017', factory: '#2D8B8B', support: '#7B3F6B' };

const pins = samplePins
  .map(([type, , lat, lng]) => {
    const { x, y } = project(lat, lng);
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.4)"><path d="M0 0c-3.9-5.7-9-11.6-9-17.2C-9-22.6-5-26.6 0-26.6s9 4 9 9.4C9-11.6 3.9-5.7 0 0z" fill="${colors[type]}"/><circle cx="0" cy="-17.2" r="3.1" fill="#fff"/></g>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT.toFixed(1)}" width="${WIDTH}" height="${Math.round(HEIGHT)}">
<rect width="${WIDTH}" height="${HEIGHT.toFixed(1)}" fill="#c9dceb"/>
<path d="${path}" fill="#e9e9e9"/>
${pins}
</svg>`;

writeFileSync('docs/ai/demos/amkor/_tmp-world-map-preview.svg', svg);
await sharp(Buffer.from(svg)).png().toFile('docs/ai/demos/amkor/_tmp-world-map-preview.png');
console.log('viewBox height', HEIGHT.toFixed(1));
