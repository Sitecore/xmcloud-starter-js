export const extractVideoId = (url: string | undefined) => {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^/&?]{10,12})/
  );
  return match && match[1].length === 11 ? match[1] : '';
};
