import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { Default as ArticleContent } from '@/components/uiim/article/ArticleContent';
import { mockPage, mockPageEditing } from '../../test-utils/mockPage';
import type { ArticleContentProps } from '@/components/uiim/article/article-content.props';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: { field?: { value?: string } }) => {
    if (!field?.value) return null;
    return <div data-testid="article-body" dangerouslySetInnerHTML={{ __html: field.value }} />;
  },
  Text: ({ field, tag: Tag = 'span' }: { field?: { value?: string }; tag?: string }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
}));

const rendering = { componentName: 'ArticleContent', uid: 'article-content-1' } as ComponentRendering;

const sampleFields = {
  pageShortTitle: { value: 'Stay cool summer checklist' },
  pageHeaderTitle: { value: 'Beat the heat with our stay cool summer checklist' },
  pageTitle: { value: 'Beat the heat with our stay cool summer checklist' },
  pageSubtitle: { value: 'Keep your home, garden, pets and vehicle cool this summer' },
  pageSummary: {
    value:
      'When things start to heat up, we all love to get outside and enjoy those summer vibes.',
  },
  pageDisplayDate: { value: '20260715T000000Z' },
  pageReadTime: { value: '10 min' },
  Content: {
    value: '<p>When things start to heat up, staying chilled can be a lifesaver.</p><h3>How to keep your home cool</h3>',
  },
};

const pageWithFields = {
  ...mockPage,
  layout: {
    sitecore: {
      context: {},
      route: {
        name: 'Beat the heat summer checklist',
        fields: sampleFields,
      },
    },
  },
} as unknown as Page;

const defaultProps: ArticleContentProps = {
  rendering,
  params: {
    styles: 'article-content-styles',
    RenderingIdentifier: 'article-content-1',
  },
  page: pageWithFields,
};

describe('ArticleContent', () => {
  it('renders header title, summary, and body from route fields', () => {
    render(<ArticleContent {...defaultProps} />);

    expect(screen.getByTestId('article-content')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Beat the heat with our stay cool summer checklist' })
    ).toBeInTheDocument();
    expect(screen.getByText('Stay cool summer checklist')).toBeInTheDocument();
    expect(
      screen.getByText('Keep your home, garden, pets and vehicle cool this summer')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'When things start to heat up, we all love to get outside and enjoy those summer vibes.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('article-body').innerHTML).toContain('How to keep your home cool');
    expect(screen.getByText('July 15, 2026')).toBeInTheDocument();
  });

  it('applies styles and rendering identifier', () => {
    const { container } = render(<ArticleContent {...defaultProps} />);
    const article = container.querySelector('[data-testid="article-content"]');
    expect(article).toHaveClass('article-content-styles');
    expect(article).toHaveAttribute('id', 'article-content-1');
  });

  it('falls back to pageTitle when header title is empty', () => {
    const page = {
      ...pageWithFields,
      layout: {
        sitecore: {
          context: {},
          route: {
            fields: {
              ...sampleFields,
              pageHeaderTitle: { value: '' },
              pageTitle: { value: 'Fallback title' },
            },
          },
        },
      },
    } as unknown as Page;

    render(<ArticleContent {...defaultProps} page={page} />);
    expect(screen.getByRole('heading', { name: 'Fallback title' })).toBeInTheDocument();
  });

  it('shows empty hint when route fields are missing', () => {
    render(<ArticleContent {...defaultProps} page={mockPage} />);
    expect(screen.getByText(/no page fields to display/i)).toBeInTheDocument();
  });

  it('hides the page content field until Show content is on', () => {
    const page = {
      ...pageWithFields,
      layout: {
        sitecore: {
          context: {},
          route: {
            fields: {
              pageHeaderTitle: { value: 'Ready, Set, Reset!' },
              content: { value: '<p>Start the year right with the Reset Challenge in January.</p>' },
            },
          },
        },
      },
    } as unknown as Page;

    const { rerender } = render(<ArticleContent {...defaultProps} page={page} />);
    expect(screen.queryByTestId('article-body')).not.toBeInTheDocument();

    rerender(
      <ArticleContent {...defaultProps} page={page} params={{ ...defaultProps.params, ShowContent: '1' }} />
    );
    expect(screen.getByTestId('article-body').innerHTML).toContain('Reset Challenge');
  });

  it('does not render a meta bullet when date and read time are empty', () => {
    const page = {
      ...mockPageEditing,
      layout: {
        sitecore: {
          context: {},
          route: {
            fields: {
              pageHeaderTitle: { value: 'Ready, Set, Reset!' },
              pageSubtitle: { value: 'Three Challenges to Look Forward to Each Year' },
              pageSummary: { value: 'Each challenge lasts six weeks.' },
            },
          },
        },
      },
    } as unknown as Page;

    render(<ArticleContent {...defaultProps} page={page} />);
    expect(screen.queryByText('•')).not.toBeInTheDocument();
    expect(screen.getByText('Three Challenges to Look Forward to Each Year')).toBeInTheDocument();
  });

  it('keeps empty fields visible while editing', () => {
    const page = {
      ...mockPageEditing,
      layout: {
        sitecore: {
          context: {},
          route: {
            fields: {
              pageHeaderTitle: { value: '' },
              Content: { value: '' },
            },
          },
        },
      },
    } as unknown as Page;

    const { container } = render(<ArticleContent {...defaultProps} page={page} />);
    expect(container.querySelector('[data-testid="article-content"]')).toBeInTheDocument();
  });
});
