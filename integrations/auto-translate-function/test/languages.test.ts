import { describe, expect, it } from 'vitest';
import { parseLanguageList } from '../src/config';
import { pickTargetLanguages } from '../src/languages';

const SITE = ['en', 'ja-JP', 'de-DE', 'ar-AE', 'es-ES'];

describe('pickTargetLanguages', () => {
  it('uses every site language except the source by default', () => {
    expect(pickTargetLanguages(SITE, 'en')).toEqual({
      targets: ['ja-JP', 'de-DE', 'ar-AE', 'es-ES'],
      notOnSite: [],
    });
  });

  it('narrows to the allow-list, keeps the site spelling, and reports unknown entries', () => {
    expect(pickTargetLanguages(SITE, 'en', ['DE-de', 'fr-FR', 'en'])).toEqual({
      targets: ['de-DE'],
      notOnSite: ['fr-FR'],
    });
  });

  it('ignores duplicate site languages', () => {
    expect(pickTargetLanguages(['en', 'de-DE', 'de-de'], 'EN').targets).toEqual(['de-DE']);
  });
});

describe('parseLanguageList', () => {
  it('accepts commas, semicolons, pipes and spaces', () => {
    expect(parseLanguageList('de-DE, ja-JP;es-ES|ar-AE fr-FR')).toEqual(['de-DE', 'ja-JP', 'es-ES', 'ar-AE', 'fr-FR']);
  });

  it('returns an empty list for nothing', () => {
    expect(parseLanguageList(undefined)).toEqual([]);
    expect(parseLanguageList('')).toEqual([]);
  });
});
