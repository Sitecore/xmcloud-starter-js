const res = await fetch('https://amkor.com/', {
  headers: { 'User-Agent': 'Mozilla/5.0' },
});
const html = await res.text();
const urls = [
  ...new Set(
    [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp|svg)(?:\?[^"'\\\s>]*)?/gi)].map(
      (m) => m[0]
    )
  ),
];
console.log('COUNT', urls.length);
urls.forEach((u) => console.log(u));
