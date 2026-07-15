export const extractVideoId = (url: string | undefined) => {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^/&?]{10,12})/
  );
  return match && match[1].length === 11 ? match[1] : '';
};

/** Hostnames allowed for Next/Image unoptimized (YouTube thumbnail CDN only; parse host, do not substring-match URLs). */
const YOUTUBE_THUMBNAIL_IMAGE_HOSTS = new Set(['img.youtube.com', 'i.ytimg.com']);

export function isYouTubeThumbnailImageUrl(src: string | undefined): boolean {
  if (!src || src.startsWith('/')) return false;
  try {
    const host = new URL(src).hostname.toLowerCase();
    return YOUTUBE_THUMBNAIL_IMAGE_HOSTS.has(host);
  } catch {
    return false;
  }
}
