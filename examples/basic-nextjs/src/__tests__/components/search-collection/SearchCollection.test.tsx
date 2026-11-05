import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default } from '@/components/uiim/search/SearchCollection';

// --- Mocks (single CI seam: the SDK search module; see spec #45) ---

const mockUseSearch = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs/search', () => ({
  useSearch: (...args: unknown[]) => mockUseSearch(...args),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag }: { field?: { value?: string }; tag?: string }) =>
    React.createElement(tag ?? 'span', {}, field?.value ?? ''),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => `dict:${key}`;
    t.has = () => false;
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
  SortOrder: field('desc'),
  MaxItems: field('3'),
  Heading: field('Latest Articles'),
};

const livePage = {
  mode: { isEditing: false, isPreview: false },
  siteName: 'main-website',
  layout: { sitecore: { route: { name: 'Home', itemLanguage: 'en' } } },
};

const editingPage = {
  ...livePage,
  mode: { isEditing: true, isPreview: false },
};

const baseProps = {
  fields: baseFields,
  params: { styles: '', RenderingIdentifier: 'search-collection' },
  rendering: { uid: 'test-uid', componentName: 'SearchCollection' },
  page: livePage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const doc = (title: string, isoDate: string, overrides: Record<string, unknown> = {}) => ({
  sc_item_id: title.replace(/\s/g, ''),
  Title: title,
  ArticleContent: '<p>Some <strong>rich</strong> body &amp; more.</p>',
  ArticlePublicationDate: isoDate,
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
  mockUseSearch.mockReturnValue(searchState());
});

// --- Tests (external behavior only) ---

describe('SearchCollection browse query', () => {
  it('passes index, empty keyphrase, max items, and sort to useSearch', () => {
    render(<Default {...baseProps} />);

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        searchIndexId: '5db6d2f0-4157-45fc-9017-fd928f94f87c',
        query: '',
        page: 1,
        pageSize: 3,
        sort: { name: 'ArticlePublicationDate', order: 'desc' },
        enabled: true,
      })
    );
  });

  it('sends the page locale for translated pages and omits it for the default language', () => {
    render(<Default {...baseProps} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ locale: undefined }));

    render(<Default {...baseProps} page={{ ...livePage, locale: 'ja-JP' }} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ locale: 'ja-JP' }));
  });

  it('sorts ascending when SortOrder is asc and omits sort without SortBy', () => {
    render(
      <Default {...baseProps} fields={{ ...baseFields, SortOrder: field('asc') }} />
    );
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: { name: 'ArticlePublicationDate', order: 'asc' } })
    );

    render(<Default {...baseProps} fields={{ ...baseFields, SortBy: field('') }} />);
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ sort: undefined })
    );
  });
});

describe('cards', () => {
  it('renders the heading and mapped card fields in result order', () => {
    mockUseSearch.mockReturnValue(
      searchState({
        total: 3,
        results: [
          doc('Observability Beyond Dashboards', '2026-07-28T09:00:00Z'),
          doc('Zero Downtime Database Migrations', '2026-07-15T09:00:00Z'),
          doc('Canary Releases Explained', '2026-07-02T09:00:00Z'),
        ],
      })
    );
    render(<Default {...baseProps} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Latest Articles');

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Observability Beyond Dashboards',
      'Zero Downtime Database Migrations',
      'Canary Releases Explained',
    ]);

    expect(screen.getByText('Jul 28, 2026')).toBeInTheDocument();
    expect(screen.getAllByText('Some rich body & more.')).toHaveLength(3);
    expect(screen.queryByRole('link')).not.toBeInTheDocument(); // LinkMapping empty
  });

  it('renders a Read more link when LinkMapping resolves', () => {
    mockUseSearch.mockReturnValue(
      searchState({
        total: 1,
        results: [doc('Canary Releases Explained', '2026-07-02T09:00:00Z', { url: '/a/canary' })],
      })
    );
    render(
      <Default {...baseProps} fields={{ ...baseFields, LinkMapping: field('url') }} />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/a/canary');
  });
});

describe('states', () => {
  it('renders nothing live when the index returns no results', () => {
    mockUseSearch.mockReturnValue(searchState({ total: 0, results: [] }));
    const { container } = render(<Default {...baseProps} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders skeletons and disables the search in editing mode', () => {
    render(<Default {...baseProps} page={editingPage} />);

    expect(screen.getAllByTestId('search-skeleton')).toHaveLength(3); // MaxItems
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('renders nothing live (and a hint while editing) without a datasource', () => {
    const noFields = { ...baseProps, fields: undefined };
    const { container } = render(<Default {...noFields} />);
    expect(container).toBeEmptyDOMElement();

    render(<Default {...noFields} page={editingPage} />);
    expect(screen.getByText('SearchCollection')).toBeInTheDocument();
  });
});

describe('related to current page (More Like This)', () => {
  const seed = '9A0D5430-275E-4663-BD5C-852659AE802B';
  const relatedProps = {
    ...baseProps,
    fields: { ...baseFields, RelatedToCurrentPage: { value: true }, Heading: field('Related articles') },
    page: {
      ...livePage,
      layout: { sitecore: { route: { name: 'One To One', itemLanguage: 'en', itemId: `{${seed}}` } } },
    },
  };

  it('seeds the search with the normalized route item ID, ignores sort, and asks for one extra item', () => {
    render(<Default {...relatedProps} />);

    const options = mockUseSearch.mock.lastCall[0];
    expect(options).toEqual(
      expect.objectContaining({
        seedItemId: '9a0d5430-275e-4663-bd5c-852659ae802b',
        pageSize: 4,
        sort: undefined,
        enabled: true,
      })
    );
    expect(options).not.toHaveProperty('query');
  });

  it('excludes the current page and caps at MaxItems', () => {
    mockUseSearch.mockReturnValue(
      searchState({
        total: 4,
        results: [
          doc('Current Page', '2026-01-01T00:00:00Z', { sc_item_id: seed.toLowerCase() }),
          doc('Related A', '2026-02-01T00:00:00Z'),
          doc('Related B', '2026-03-01T00:00:00Z'),
          doc('Related C', '2026-04-01T00:00:00Z'),
        ],
      })
    );
    render(<Default {...relatedProps} />);

    expect(screen.queryByText('Current Page')).not.toBeInTheDocument();
    expect(screen.getByText('Related A')).toBeInTheDocument();
    expect(screen.getByText('Related C')).toBeInTheDocument();
    expect(screen.getByText('Related articles')).toBeInTheDocument();
  });

  it('renders nothing live without a resolvable route item ID', () => {
    const { container } = render(
      <Default {...relatedProps} page={{ ...livePage, layout: { sitecore: { route: { name: 'x' } } } }} />
    );
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
    expect(container).toBeEmptyDOMElement();
  });

  it('accepts the checkbox as "1" (raw field value)', () => {
    render(
      <Default {...relatedProps} fields={{ ...relatedProps.fields, RelatedToCurrentPage: field('1') }} />
    );
    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ seedItemId: '9a0d5430-275e-4663-bd5c-852659ae802b' })
    );
  });
});
