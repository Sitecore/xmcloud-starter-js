import { fireEvent, render, screen } from '@testing-library/react';
import { LanguageSwitcher, nativeLanguageName } from '@/components/i18n/LanguageSwitcher';

const mockNavigateTo = jest.fn();
jest.mock('@/lib/search-ui/navigate', () => ({
  navigateTo: (href: string) => mockNavigateTo(href),
}));

const livePage = (locale: string) =>
  ({ locale, mode: { isEditing: false, isPreview: false } }) as never;

beforeEach(() => {
  jest.clearAllMocks();
  document.cookie = 'NEXT_LOCALE=; path=/; max-age=0';
});

describe('LanguageSwitcher', () => {
  it('lists every site language by its own name and selects the page language', () => {
    render(<LanguageSwitcher page={livePage('de-DE')} />);
    const select = screen.getByLabelText('Language') as HTMLSelectElement;

    expect(select.value).toBe('de-DE');
    expect(Array.from(select.options).map((o) => o.value)).toEqual([
      'en',
      'ja-JP',
      'de-DE',
      'ar-AE',
      'es-ES',
    ]);
    expect(Array.from(select.options).map((o) => o.text)).toEqual([
      nativeLanguageName('en'),
      nativeLanguageName('ja-JP'),
      nativeLanguageName('de-DE'),
      nativeLanguageName('ar-AE'),
      nativeLanguageName('es-ES'),
    ]);
  });

  it('opens the same page in the chosen language and remembers the choice', () => {
    window.history.replaceState(null, '', '/ja-JP/Articles?q=data');
    render(<LanguageSwitcher page={livePage('ja-JP')} />);

    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'es-ES' } });
    expect(mockNavigateTo).toHaveBeenLastCalledWith('/es-ES/Articles?q=data');
    expect(document.cookie).toContain('NEXT_LOCALE=es-ES');

    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'en' } });
    expect(mockNavigateTo).toHaveBeenLastCalledWith('/Articles?q=data');
    expect(document.cookie).toContain('NEXT_LOCALE=en');
  });

  it('is hidden while editing in Pages', () => {
    const { container } = render(
      <LanguageSwitcher page={{ locale: 'en', mode: { isEditing: true } } as never} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('nativeLanguageName', () => {
  test.each([
    ['de-DE', 'Deutsch'],
    ['ja-JP', '日本語'],
    ['es-ES', 'Español'],
  ])('%s is %s', (locale, name) => {
    expect(nativeLanguageName(locale)).toBe(name);
  });
});
