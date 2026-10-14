import { normalizeSitecoreImageField, repairMediaSrc } from '@/lib/sitecore-image';

describe('sitecore-image', () => {
  it('repairs the broken https://https media prefix', () => {
    expect(
      repairMediaSrc(
        'https://https/-/jssmedia/Project/evo/evo/Sample-Media/Images/Car.webp?h=1302'
      )
    ).toBe('/-/jssmedia/Project/evo/evo/Sample-Media/Images/Car.webp?h=1302');
  });

  it('keeps DAM public URLs intact', () => {
    const src = 'https://bcaa.sitecoresandbox.cloud/api/public/content/83648-HomepagePromoCTAs-1100x740?v=6ee85c94';
    expect(normalizeSitecoreImageField({ value: { src, alt: 'Auto' } })?.value?.src).toBe(src);
  });

  it('builds a media URL from Sitecore image XML', () => {
    expect(
      normalizeSitecoreImageField({
        value: '<image mediaid="{8432420A-CA72-4BD8-94E9-4E509982205F}" alt="Car" />',
      })?.value
    ).toEqual({
      src: '/-/media/8432420ACA724BD894E94E509982205F.ashx',
      alt: 'Car',
    });
  });
});
