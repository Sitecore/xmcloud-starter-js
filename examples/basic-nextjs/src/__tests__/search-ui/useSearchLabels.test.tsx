import { renderHook } from '@testing-library/react';
import { useSearchLabels } from '@/lib/search-ui/useSearchLabels';

// Shape produced by src/i18n/request.ts: the Sitecore Dictionary under the site name.
const messages: Record<string, unknown> = {
  'main-website': {
    SearchExperience_SortBy: 'Ordenar por',
    SearchExperience_SeeAllResults: 'Ver todos los resultados',
  },
  SearchExperience_ReadMore: 'Leer más',
};

const lookup = (path: string): unknown =>
  path.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], messages);

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => lookup(key) as string;
    t.has = (key: string) => typeof lookup(key) === 'string';
    return t;
  },
}));

describe('useSearchLabels', () => {
  it('reads the label from the site dictionary', () => {
    const { result } = renderHook(() => useSearchLabels('main-website'));
    expect(result.current('SORT_BY')).toBe('Ordenar por');
    expect(result.current('SEE_ALL_RESULTS')).toBe('Ver todos los resultados');
  });

  it('falls back to a root entry, then to the English default', () => {
    const { result } = renderHook(() => useSearchLabels('main-website'));
    expect(result.current('READ_MORE')).toBe('Leer más');
    expect(result.current('FILTER_BY')).toBe('Filter by');
  });

  it('uses root entries and defaults without a site name', () => {
    const { result } = renderHook(() => useSearchLabels());
    expect(result.current('SORT_BY')).toBe('Sort by');
    expect(result.current('READ_MORE')).toBe('Leer más');
  });
});
