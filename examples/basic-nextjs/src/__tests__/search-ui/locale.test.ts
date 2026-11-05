jest.mock('sitecore.config', () => ({ __esModule: true, default: { defaultLanguage: 'en' } }), {
  virtual: true,
});

import { searchLocale } from '@/lib/search-ui/locale';

describe('searchLocale', () => {
  test.each(['ja-JP', 'de-DE', 'ar-AE', 'es-ES'])('passes the %s route locale through', (locale) => {
    expect(searchLocale({ locale })).toBe(locale);
  });

  test.each(['en', 'EN', '', undefined])('omits the default or missing locale %p', (locale) => {
    expect(searchLocale(locale === undefined ? undefined : { locale })).toBeUndefined();
  });

  test('uses the given default language', () => {
    expect(searchLocale({ locale: 'en' }, 'de-DE')).toBe('en');
    expect(searchLocale({ locale: 'de-DE' }, 'de-DE')).toBeUndefined();
  });
});
