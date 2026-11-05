import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { Default } from '@/components/uiim/search/SearchResults';

// --- Mocks (single CI seam: the SDK search module; see spec #45) ---

const mockUseSearch = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs/search', () => ({
  useSearch: (...args: unknown[]) => mockUseSearch(...args),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => `dict:${key}`;
    t.has = (key: string) => key === 'SearchExperience_ResultsFound';
    return t;
  },
}));

jest.mock('@sitecore-content-sdk/events', () => ({
  event: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));

// --- Fixtures ---

const field = (value: string) => ({ value });

const baseFields = {
  SearchIndex: field('5db6d2f0-4157-45fc-9017-fd928f94f87c'),
  TitleMapping: field('Title'),
  DescriptionMapping: field('ArticleContent'),
  ImageMapping: field('ArticleImage'),
  LinkMapping: field(''),
  DateMapping: field('ArticlePublicationDate'),
  SortBy: field('ArticlePublicationDate'),
};

const livePage = {
  mode: { isEditing: false, isPreview: false },
  siteName: 'main-website',
  layout: { sitecore: { route: { name: 'Articles', itemLanguage: 'en' } } },
};

const editingPage = {
  ...livePage,
  mode: { isEditing: true, isPreview: false },
};

const baseProps = {
  fields: baseFields,
  params: { pageSize: '2', columns: '3', styles: '', RenderingIdentifier: 'search-results' },
  rendering: { uid: 'test-uid', componentName: 'SearchResults' },
  page: livePage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const doc = (title: string, overrides: Record<string, unknown> = {}) => ({
  sc_item_id: title.replace(/\s/g, ''),
  Title: title,
  ArticleContent: '<p>Some <strong>rich</strong> body &amp; more.</p>',
  ArticlePublicationDate: '2026-07-02T09:00:00Z',
  ...overrides,
});

const searchState = (overrides: Record<string, unknown> = {}) => ({
  total: 0,
  totalPages: 0,
  results: [],
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: null,
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  window.history.replaceState(null, '', '/Articles');
  mockUseSearch.mockReturnValue(searchState());
});

// --- Tests (external behavior only) ---

describe('SearchResults cards', () => {
  it('renders mapped title, stripped description, and formatted date', () => {
    mockUseSearch.mockReturnValue(
      searchState({ total: 1, totalPages: 1, results: [doc('Canary Releases')] })
    );
    render(<Default {...baseProps} />);

    expect(screen.getByText('Canary Releases')).toBeInTheDocument();
    expect(screen.getByText('Some rich body & more.')).toBeInTheDocument();
    expect(screen.getByText('Jul 2, 2026')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument(); // LinkMapping empty
  });

  it('renders a Read more link when LinkMapping resolves', () => {
    mockUseSearch.mockReturnValue(
      searchState({
        total: 1,
        totalPages: 1,
        results: [doc('Canary Releases', { url: '/articles/canary' })],
      })
    );
    render(
      <Default {...baseProps} fields={{ ...baseFields, LinkMapping: field('url') }} />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/articles/canary');
  });
});

describe('search flow', () => {
  it('sends the page locale for translated pages and omits it for the default language', () => {
    render(<Default {...baseProps} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ locale: undefined }));

    render(<Default {...baseProps} page={{ ...livePage, locale: 'ar-AE' }} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ locale: 'ar-AE' }));
  });

  it('passes index, page size, and debounced query to useSearch', () => {
    jest.useFakeTimers();
    render(<Default {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'canary' } });
    expect(mockUseSearch).not.toHaveBeenCalledWith(expect.objectContaining({ query: 'canary' }));

    act(() => jest.advanceTimersByTime(400));

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        searchIndexId: '5db6d2f0-4157-45fc-9017-fd928f94f87c',
        query: 'canary',
        page: 1,
        pageSize: 2,
        enabled: true,
      })
    );
    jest.useRealTimers();
  });

  it('mirrors the debounced query to the URL without navigation', () => {
    jest.useFakeTimers();
    render(<Default {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'canary' } });
    act(() => jest.advanceTimersByTime(400));

    expect(window.location.search).toBe('?q=canary');
    jest.useRealTimers();
  });

  it('hydrates the query and page from the URL after mount without clobbering ?page=', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/Articles?q=canary&page=2');
    render(<Default {...baseProps} />);

    // Post-mount hydration (SSR-safe: first render matches the server).
    expect(screen.getByRole('textbox')).toHaveValue('canary');

    act(() => jest.advanceTimersByTime(400));
    // The hydration-induced query change must not reset the page to 1.
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'canary', page: 2 })
    );
    jest.useRealTimers();
  });
});

describe('states', () => {
  it('shows the empty state with dictionary fallbacks when nothing matches', () => {
    mockUseSearch.mockReturnValue(searchState({ total: 0 }));
    render(<Default {...baseProps} />);

    // NoResultsFound key is NOT in the mocked dictionary -> English fallback
    expect(screen.getByText('No results found')).toBeInTheDocument();
    // ResultsFound key IS in the mocked dictionary -> translated value
    expect(screen.getByText(/dict:SearchExperience_ResultsFound/)).toBeInTheDocument();
  });

  it('shows the error state with a retry action', () => {
    mockUseSearch.mockReturnValue(
      searchState({ isError: true, isSuccess: false, error: new Error('boom') })
    );
    render(<Default {...baseProps} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('renders skeletons and disables the search in editing mode', () => {
    render(<Default {...baseProps} page={editingPage} />);

    expect(screen.getAllByTestId('search-skeleton')).toHaveLength(2); // pageSize
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('renders nothing live (and a hint while editing) without a datasource', () => {
    const noFields = { ...baseProps, fields: undefined };
    const { container } = render(<Default {...noFields} />);
    expect(container).toBeEmptyDOMElement();

    render(<Default {...noFields} page={editingPage} />);
    expect(screen.getByText('SearchResults')).toBeInTheDocument();
  });
});

describe('sort', () => {
  it('defaults to relevance (no sort argument) and hides the control without SortBy', () => {
    render(<Default {...baseProps} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: undefined })
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    render(<Default {...baseProps} fields={{ ...baseFields, SortBy: field('') }} />);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('combobox')).toHaveLength(1); // only the first render's
  });

  it('passes the chosen sort to useSearch, resets the page, and mirrors ?sort=', () => {
    mockUseSearch.mockReturnValue(
      searchState({ total: 3, totalPages: 2, results: [doc('A'), doc('B')] })
    );
    render(<Default {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' })); // move to page 2

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'oldest' } });

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sort: { name: 'ArticlePublicationDate', order: 'asc' },
        page: 1, // sort change resets pagination
      })
    );
    expect(window.location.search).toContain('sort=oldest');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'newest' } });
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: { name: 'ArticlePublicationDate', order: 'desc' } })
    );
  });
});

describe('pagination', () => {
  it('pages forward and requests the next page', () => {
    mockUseSearch.mockReturnValue(
      searchState({ total: 3, totalPages: 2, results: [doc('A'), doc('B')] })
    );
    render(<Default {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    expect(window.location.search).toBe('?page=2');
  });
});

describe('facets', () => {
  const facetProps = {
    ...baseProps,
    fields: { ...baseFields, Facets: field('ArticleTopic:Topic') },
  };
  const topicFacets = [
    {
      name: 'ArticleTopic',
      value: [
        { text: 'Engineering', count: 4 },
        { text: 'AI', count: 2 },
      ],
    },
  ];

  it('requests counts for the configured facets and renders them with a label', () => {
    mockUseSearch.mockReturnValue(
      searchState({ total: 1, totalPages: 1, results: [doc('Canary Releases')], facets: topicFacets })
    );
    render(<Default {...facetProps} />);

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ facet: { fields: [{ name: 'ArticleTopic' }] } })
    );
    const sidebar = screen.getByTestId('facet-sidebar');
    expect(within(sidebar).getByText('Topic')).toBeInTheDocument();
    expect(within(sidebar).getByRole('checkbox', { name: /Engineering/ })).not.toBeChecked();
    expect(within(sidebar).getByText('4')).toBeInTheDocument();
  });

  it('ticking values adds an OR filter, resets to page 1, and mirrors the selection to the URL', () => {
    mockUseSearch.mockReturnValue(
      searchState({ total: 6, totalPages: 3, results: [doc('Canary Releases')], facets: topicFacets })
    );
    render(<Default {...facetProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    const sidebar = screen.getByTestId('facet-sidebar');
    fireEvent.click(within(sidebar).getByRole('checkbox', { name: /Engineering/ }));
    fireEvent.click(within(sidebar).getByRole('checkbox', { name: /AI/ }));

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        facet: {
          fields: [
            { name: 'ArticleTopic', filters: [{ operator: 'eq', value: ['Engineering', 'AI'] }] },
          ],
        },
      })
    );
    expect(new URLSearchParams(window.location.search).get('ArticleTopic')).toBe('Engineering|AI');
  });

  it('hydrates the selection from the URL and offers Clear all', () => {
    window.history.replaceState(null, '', '/Articles?ArticleTopic=AI');
    mockUseSearch.mockReturnValue(
      searchState({ total: 2, totalPages: 1, results: [doc('Canary Releases')], facets: topicFacets })
    );
    render(<Default {...facetProps} />);

    const sidebar = screen.getByTestId('facet-sidebar');
    expect(within(sidebar).getByRole('checkbox', { name: /AI/ })).toBeChecked();

    fireEvent.click(within(sidebar).getByRole('button', { name: 'Clear all' }));
    expect(within(sidebar).getByRole('checkbox', { name: /AI/ })).not.toBeChecked();
    expect(window.location.search).not.toContain('ArticleTopic');
  });

  it('keeps a selected value visible (count 0) when the API no longer returns it', () => {
    window.history.replaceState(null, '', '/Articles?ArticleTopic=Engineering');
    mockUseSearch.mockReturnValue(
      searchState({
        total: 0,
        results: [],
        facets: [{ name: 'ArticleTopic', value: [{ text: 'AI', count: 1 }] }],
      })
    );
    render(<Default {...facetProps} />);

    const sidebar = screen.getByTestId('facet-sidebar');
    expect(within(sidebar).getByRole('checkbox', { name: /Engineering/ })).toBeChecked();
  });

  it('degrades to a facet-less search when the faceted request fails', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockUseSearch.mockImplementation((options: { facet?: unknown }) =>
      options.facet
        ? searchState({ isSuccess: false, isError: true, error: new Error('HTTP 400') })
        : searchState({ total: 1, totalPages: 1, results: [doc('Canary Releases')] })
    );
    render(<Default {...facetProps} />);

    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ facet: undefined }));
    expect(screen.getByText('Canary Releases')).toBeInTheDocument();
    expect(screen.queryByTestId('facet-sidebar')).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('sends no facet request when Facets is empty', () => {
    render(<Default {...baseProps} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ facet: undefined }));
    expect(screen.queryByTestId('facet-sidebar')).not.toBeInTheDocument();
  });
});
