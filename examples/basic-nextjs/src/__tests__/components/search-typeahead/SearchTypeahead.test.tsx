import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Default, Header } from '@/components/uiim/search/SearchTypeahead';

// --- Mocks (single CI seam: the SDK search module; see spec #45) ---

const mockUseSuggest = jest.fn();
const mockUseSearch = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs/search', () => ({
  useSuggest: (...args: unknown[]) => mockUseSuggest(...args),
  useSearch: (...args: unknown[]) => mockUseSearch(...args),
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({}));

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

const mockAssign = jest.fn();
jest.mock('@/lib/search-ui/navigate', () => ({
  navigateTo: (href: string) => mockAssign(href),
}));

// --- Fixtures ---

const field = (value: string) => ({ value });

const baseFields = {
  SearchIndex: field('5db6d2f0-4157-45fc-9017-fd928f94f87c'),
  TitleMapping: field('Title'),
  LinkMapping: field(''),
  ResultsPage: { value: { href: '/Articles' } },
  MaxSuggestions: field('5'),
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
  params: { styles: '', RenderingIdentifier: 'search-typeahead' },
  rendering: { uid: 'test-uid', componentName: 'SearchTypeahead' },
  page: livePage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const doc = (title: string, overrides: Record<string, unknown> = {}) => ({
  sc_item_id: title.replace(/\s/g, ''),
  Title: title,
  ...overrides,
});

const term = (text: string) => ({ text, queryPlusText: text });

const suggestState = (overrides: Record<string, unknown> = {}) => ({
  querySuggestions: [],
  previewResults: [],
  isLoading: false,
  isSuccess: true,
  isError: false,
  error: null,
  ...overrides,
});

const typeAndSettle = (value: string) => {
  fireEvent.change(screen.getByRole('textbox'), { target: { value } });
  act(() => jest.advanceTimersByTime(400));
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockUseSuggest.mockReturnValue(suggestState({ isSuccess: false }));
  mockUseSearch.mockReturnValue({ results: [], total: 0, totalPages: 0, isLoading: false, isSuccess: false, isError: false, error: null });
});

afterEach(() => {
  jest.useRealTimers();
});

// --- Tests (external behavior only) ---

describe('suggest request', () => {
  it('passes index and the debounced query to useSuggest', () => {
    render(<Default {...baseProps} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'can' } });
    expect(mockUseSuggest).not.toHaveBeenCalledWith(expect.objectContaining({ query: 'can' }));

    act(() => jest.advanceTimersByTime(400));

    expect(mockUseSuggest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        searchIndexId: '5db6d2f0-4157-45fc-9017-fd928f94f87c',
        query: 'can',
        enabled: true,
      })
    );
  });

  it('sends the page locale for translated pages and omits it for the default language', () => {
    render(<Default {...baseProps} />);
    typeAndSettle('can');
    expect(mockUseSuggest).toHaveBeenLastCalledWith(expect.objectContaining({ locale: undefined }));

    render(<Default {...baseProps} page={{ ...livePage, locale: 'de-DE' }} />);
    expect(mockUseSuggest).toHaveBeenLastCalledWith(expect.objectContaining({ locale: 'de-DE' }));
    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ locale: 'de-DE' }));
  });

  it('does not suggest or open the dropdown with an empty input', () => {
    render(<Default {...baseProps} />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(mockUseSuggest).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
  });
});

describe('dropdown sections', () => {
  it('shows suggested terms, top results, and a see-all option', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({
        querySuggestions: [term('canary'), term('canary releases')],
        previewResults: [doc('Canary Releases Explained')],
      })
    );
    render(<Default {...baseProps} />);
    typeAndSettle('can');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Top results')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'canary' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canary Releases Explained' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See all results' })).toHaveAttribute(
      'href',
      '/Articles?q=can'
    );
  });

  it('hides the suggestions section when the source returns no terms (and drops the echo of the typed text)', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({
        querySuggestions: [term('canary')],
        previewResults: [doc('Canary Releases Explained')],
      })
    );
    render(<Default {...baseProps} />);
    typeAndSettle('canary');

    expect(screen.queryByText('Suggestions')).not.toBeInTheDocument();
    expect(screen.getByText('Top results')).toBeInTheDocument();
  });

  it('caps each section at MaxSuggestions', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({
        querySuggestions: [term('a1'), term('a2'), term('a3')],
        previewResults: [doc('Doc 1'), doc('Doc 2'), doc('Doc 3')],
      })
    );
    render(<Default {...baseProps} fields={{ ...baseFields, MaxSuggestions: field('2') }} />);
    typeAndSettle('a');

    // 2 terms + 2 docs + see-all
    expect(screen.getAllByRole('option')).toHaveLength(5);
  });
});

describe('fallback for sources without suggest', () => {
  it('runs the title search when suggest returns nothing, and lists its documents', () => {
    mockUseSuggest.mockReturnValue(suggestState());
    mockUseSearch.mockReturnValue({
      results: [doc('Canary Releases Explained')],
      total: 1,
      totalPages: 1,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });
    render(<Default {...baseProps} />);
    typeAndSettle('canary');

    expect(mockUseSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'canary', pageSize: 5, enabled: true })
    );
    expect(screen.getByRole('option', { name: 'Canary Releases Explained' })).toBeInTheDocument();
  });

  it('does not run the fallback search when suggest has results', () => {
    mockUseSuggest.mockReturnValue(suggestState({ previewResults: [doc('Canary Releases Explained')] }));
    render(<Default {...baseProps} />);
    typeAndSettle('canary');

    expect(mockUseSearch).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
  });
});

describe('navigation intent', () => {
  it('Enter without a selection navigates to the results page with ?q=', () => {
    mockUseSuggest.mockReturnValue(suggestState({ previewResults: [doc('Canary Releases Explained')] }));
    render(<Default {...baseProps} />);
    typeAndSettle('canary');

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(mockAssign).toHaveBeenCalledWith('/Articles?q=canary');
  });

  it('choosing a suggested term searches it on the results page', () => {
    mockUseSuggest.mockReturnValue(suggestState({ querySuggestions: [term('personalization')] }));
    render(<Default {...baseProps} />);
    typeAndSettle('pers');

    fireEvent.click(screen.getByRole('option', { name: 'personalization' }));
    expect(mockAssign).toHaveBeenCalledWith('/Articles?q=personalization');
  });

  it('arrow keys move across both sections and Enter chooses (doc without link -> results page with the title)', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({
        querySuggestions: [term('canary deploy')],
        previewResults: [doc('Canary Deep Dive')],
      })
    );
    render(<Default {...baseProps} />);
    typeAndSettle('can');

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'canary deploy', selected: true })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Canary Deep Dive', selected: true })).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockAssign).toHaveBeenCalledWith('/Articles?q=Canary%20Deep%20Dive');
  });

  it('clicking a preview result with a link mapping navigates to the document link', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({ previewResults: [doc('Canary Releases Explained', { url: '/articles/canary' })] })
    );
    render(<Default {...baseProps} fields={{ ...baseFields, LinkMapping: field('url') }} />);
    typeAndSettle('can');

    fireEvent.click(screen.getByText('Canary Releases Explained'));
    expect(mockAssign).toHaveBeenCalledWith('/articles/canary');
  });

  it('Escape closes the dropdown', () => {
    mockUseSuggest.mockReturnValue(suggestState({ previewResults: [doc('Canary Releases Explained')] }));
    render(<Default {...baseProps} />);
    typeAndSettle('can');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('states', () => {
  it('is quiet in editing mode: suggest disabled, input inert', () => {
    render(<Default {...baseProps} page={editingPage} />);

    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(mockUseSuggest).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('renders nothing live (and a hint while editing) without a datasource', () => {
    const noFields = { ...baseProps, fields: undefined };
    const { container } = render(<Default {...noFields} />);
    expect(container).toBeEmptyDOMElement();

    render(<Default {...noFields} page={editingPage} />);
    expect(screen.getByText('SearchTypeahead')).toBeInTheDocument();
  });
});

describe('Header variant', () => {
  it('shares the full combobox behavior: suggestions and direct link navigation', () => {
    mockUseSuggest.mockReturnValue(
      suggestState({ previewResults: [doc('Canary Releases Explained', { url: '/articles/canary' })] })
    );
    render(<Header {...baseProps} fields={{ ...baseFields, LinkMapping: field('url') }} />);
    typeAndSettle('can');

    expect(mockUseSuggest).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'can', enabled: true })
    );
    fireEvent.click(screen.getByText('Canary Releases Explained'));
    expect(mockAssign).toHaveBeenCalledWith('/articles/canary');
  });

  it('renders nothing live without a datasource', () => {
    const { container } = render(<Header {...baseProps} fields={undefined as never} />);
    expect(container).toBeEmptyDOMElement();
  });
});
