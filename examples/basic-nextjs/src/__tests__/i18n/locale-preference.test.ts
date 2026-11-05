import {
  directionFor,
  localeFromPath,
  localizedPath,
  preferredLocaleRedirect,
  stripLocale,
} from '@/i18n/locale-preference';

const routing = { locales: ['en', 'ja-JP', 'de-DE', 'ar-AE', 'es-ES'], defaultLocale: 'en' };

describe('localeFromPath', () => {
  test.each([
    ['/ja-JP/Articles', 'ja-JP'],
    ['/ja-jp/Articles', 'ja-JP'],
    ['/de-DE', 'de-DE'],
    ['/en/Articles', 'en'],
    ['/Articles', undefined],
    ['/', undefined],
    ['/Articles/ja-JP', undefined],
  ])('%s -> %p', (path, expected) => {
    expect(localeFromPath(path, routing.locales)).toBe(expected);
  });
});

describe('stripLocale / localizedPath', () => {
  test.each([
    ['/ja-JP/Articles/X', '/Articles/X'],
    ['/ja-JP', '/'],
    ['/Articles', '/Articles'],
    ['/', '/'],
  ])('strips %s to %s', (path, expected) => {
    expect(stripLocale(path, routing.locales)).toBe(expected);
  });

  test.each([
    ['/Articles', 'ja-JP', '/ja-JP/Articles'],
    ['/', 'de-DE', '/de-DE'],
    ['/ja-JP/Articles', 'en', '/Articles'],
    ['/ja-JP/Articles', 'ar-AE', '/ar-AE/Articles'],
    ['/ja-JP', 'en', '/'],
  ])('%s in %s is %s', (path, locale, expected) => {
    expect(localizedPath(path, locale, routing)).toBe(expected);
  });
});

describe('preferredLocaleRedirect', () => {
  test('keeps a visitor in their remembered language on unprefixed links', () => {
    expect(preferredLocaleRedirect('/Articles/X', 'ja-JP', routing)).toBe('/ja-JP/Articles/X');
    expect(preferredLocaleRedirect('/', 'es-ES', routing)).toBe('/es-ES');
    expect(preferredLocaleRedirect('/Articles', 'ja-jp', routing)).toBe('/ja-JP/Articles');
  });

  test.each([
    ['no cookie', '/Articles', undefined],
    ['default language', '/Articles', 'en'],
    ['unknown language', '/Articles', 'fr-FR'],
    ['already prefixed', '/de-DE/Articles', 'ja-JP'],
    ['explicit default prefix', '/en/Articles', 'ja-JP'],
    ['public file', '/brand/logo.svg', 'ja-JP'],
  ])('serves as is: %s', (_, path, cookie) => {
    expect(preferredLocaleRedirect(path, cookie, routing)).toBeNull();
  });
});

describe('directionFor', () => {
  test.each([
    ['ar-AE', 'rtl'],
    ['he', 'rtl'],
    ['en', 'ltr'],
    ['ja-JP', 'ltr'],
  ])('%s is %s', (locale, dir) => {
    expect(directionFor(locale)).toBe(dir);
  });
});
