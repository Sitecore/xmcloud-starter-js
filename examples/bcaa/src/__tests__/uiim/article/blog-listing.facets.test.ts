import { hasFacetConfig, matchFacets, parseFacetConfig } from '@/components/uiim/article/blog-listing.facets';

describe('blog-listing.facets', () => {
  const config = `Membership | membership, member, rewards
Travel | travel, trip, road
Safety | scam, phishing`;

  it('parses label and keyword lines', () => {
    expect(parseFacetConfig(config)).toEqual([
      { label: 'Membership', keywords: ['membership', 'member', 'rewards'] },
      { label: 'Travel', keywords: ['travel', 'trip', 'road'] },
      { label: 'Safety', keywords: ['scam', 'phishing'] },
    ]);
  });

  it('treats a label-only line as its own keyword', () => {
    expect(parseFacetConfig('Insurance')).toEqual([{ label: 'Insurance', keywords: ['insurance'] }]);
  });

  it('returns empty for missing or blank config', () => {
    expect(parseFacetConfig('')).toEqual([]);
    expect(parseFacetConfig(undefined)).toEqual([]);
    expect(hasFacetConfig('')).toBe(false);
    expect(hasFacetConfig(config)).toBe(true);
  });

  it('matches facets from title and summary text', () => {
    expect(matchFacets('Plan a BC summer road trip', parseFacetConfig(config))).toEqual(['Travel']);
    expect(matchFacets('How to protect yourself from online scams', parseFacetConfig(config))).toEqual([
      'Safety',
    ]);
  });

  it('returns no tags when nothing matches', () => {
    expect(matchFacets('Unrelated article about gardens', parseFacetConfig(config))).toEqual([]);
  });
});
