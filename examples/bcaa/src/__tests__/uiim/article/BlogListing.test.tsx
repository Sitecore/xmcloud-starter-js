import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { Default as BlogListing } from '@/components/uiim/article/BlogListing';
import { mockPage } from '../../test-utils/mockPage';
import type { BlogListingProps } from '@/components/uiim/article/blog-listing.props';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({ page: mockPage }),
  Text: ({ field, tag: Tag = 'span' }: { field?: { value?: string }; tag?: string }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  RichText: ({ field }: { field?: { value?: string } }) => {
    if (!field?.value) return null;
    return <div dangerouslySetInnerHTML={{ __html: field.value }} />;
  },
  NextImage: () => null,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const rendering = { componentName: 'BlogListing', uid: 'blog-listing-1' } as ComponentRendering;

const article = (id: string, title: string, summary: string, path: string) => ({
  id,
  name: title,
  url: { path },
  pageTitle: { jsonValue: { value: title } },
  pageHeaderTitle: { jsonValue: { value: title } },
  pageSummary: { jsonValue: { value: summary } },
  pageDisplayDate: { jsonValue: { value: '20260701T000000Z' } },
  pageReadTime: { jsonValue: { value: '6 min' } },
});

const defaultProps: BlogListingProps = {
  rendering,
  params: {
    styles: 'blog-listing-styles',
    RenderingIdentifier: 'blog-listing-1',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: { value: 'BCAA Blog' } },
        intro: { jsonValue: { value: '<p>Stories from BCAA.</p>' } },
        showFilters: { jsonValue: { value: true } },
        searchPlaceholder: { jsonValue: { value: 'Search articles' } },
        filterFacetLabel: { jsonValue: { value: 'Topics' } },
        emptyResultsText: { jsonValue: { value: 'No articles match your search.' } },
        filterFacets: {
          jsonValue: {
            value: 'Travel | travel, road\nSafety | scam, phishing',
          },
        },
        blogsRoot: {
          targetItem: {
            children: {
              results: [
                article(
                  '1',
                  'How to maximize your BC summer road trip',
                  'Five great BC road trips',
                  '/BCAA-Blog/road-trip'
                ),
                article(
                  '2',
                  'How to protect yourself from online scams',
                  'Phishing remains widespread',
                  '/BCAA-Blog/scams'
                ),
              ],
            },
          },
        },
      },
    },
  },
};

describe('BlogListing', () => {
  it('renders the title and both articles', () => {
    render(<BlogListing {...defaultProps} />);

    expect(screen.getByTestId('blog-listing')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'BCAA Blog' })).toBeInTheDocument();
    expect(screen.getAllByTestId('blog-listing-card')).toHaveLength(2);
    expect(screen.getByText('How to maximize your BC summer road trip')).toBeInTheDocument();
    expect(screen.getByText('How to protect yourself from online scams')).toBeInTheDocument();
  });

  it('filters articles from the search box', () => {
    render(<BlogListing {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Search articles'), { target: { value: 'phishing' } });

    expect(screen.getAllByTestId('blog-listing-card')).toHaveLength(1);
    expect(screen.getByText('How to protect yourself from online scams')).toBeInTheDocument();
    expect(screen.queryByText('How to maximize your BC summer road trip')).not.toBeInTheDocument();
  });

  it('filters articles from a topic chip', () => {
    render(<BlogListing {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Travel' }));

    expect(screen.getAllByTestId('blog-listing-card')).toHaveLength(1);
    expect(screen.getByText('How to maximize your BC summer road trip')).toBeInTheDocument();
  });

  it('shows the empty state when nothing matches', () => {
    render(<BlogListing {...defaultProps} />);

    fireEvent.change(screen.getByLabelText('Search articles'), { target: { value: 'zzzz' } });

    expect(screen.getByTestId('blog-listing-empty')).toHaveTextContent(
      'No articles match your search.'
    );
  });
});
