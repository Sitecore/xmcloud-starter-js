export type BlogFacet = {
  label: string;
  keywords: string[];
};

const FACET_LINE = /^\s*([^|]+)\s*(?:\|\s*(.*))?$/;

export const parseFacetConfig = (value?: string): BlogFacet[] => {
  if (!value?.trim()) {
    return [];
  }

  const seen = new Set<string>();
  const facets: BlogFacet[] = [];

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = FACET_LINE.exec(line);
    if (!match) continue;

    const label = match[1].trim();
    const keywordSource = match[2]?.trim() || label;
    const keywords = keywordSource
      .split(',')
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean);

    const key = label.toLowerCase();
    if (!label || seen.has(key) || keywords.length === 0) continue;

    seen.add(key);
    facets.push({ label, keywords });
  }

  return facets;
};

export const hasFacetConfig = (value?: string): boolean => parseFacetConfig(value).length > 0;

export const matchFacets = (haystack: string, facets: BlogFacet[]): string[] => {
  const text = haystack.toLowerCase();
  return facets.filter((facet) => facet.keywords.some((keyword) => text.includes(keyword))).map((facet) => facet.label);
};
