const res = await fetch('https://amkor.com/', {
  headers: { 'User-Agent': 'Mozilla/5.0' },
});
const html = await res.text();
const needles = ['map', 'footprint', 'world', 'pin', 'legend', 'location'];
for (const n of needles) {
  const re = new RegExp(`.{0,80}${n}.{0,80}`, 'gi');
  const hits = [...html.matchAll(re)].slice(0, 8).map((m) => m[0].replace(/\s+/g, ' '));
  if (hits.length) {
    console.log('\n===', n, '===');
    hits.forEach((h) => console.log(h));
  }
}
