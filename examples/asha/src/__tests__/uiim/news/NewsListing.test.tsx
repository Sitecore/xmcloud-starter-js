import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default } from '@/components/uiim/news/NewsListing';
import type { NewsListingProps } from '@/components/uiim/news/news-listing.props';
import { mockPage } from '../../test-utils/mockPage';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: { value?: string } }) => {
    if (!field?.value) return null;
    return <span>{field.value}</span>;
  },
}));

const article = (
  id: string,
  title: string,
  href: string,
  accent = false
) => ({
  id,
  name: id,
  url: { path: `/Publications/ASHA-Headlines/${id}` },
  pageTitle: { jsonValue: { value: title } },
  pageThumbnail: {
    jsonValue: { value: { src: `https://www.asha.org/siteassets/homepage/news/${id}.png`, alt: title } },
  },
  sourceLink: { jsonValue: { value: { href, text: title } } },
  titleAccent: { jsonValue: { value: accent ? '1' : '' } },
});

const props: NewsListingProps = {
  rendering: { componentName: 'NewsListing' },
  page: mockPage,
  params: { styles: 'news-band', RenderingIdentifier: 'asha-news' },
  fields: {
    data: {
      datasource: {
        title: { jsonValue: { value: 'NEWS' } },
        articles: {
          targetItems: [
            article('cpt', 'Audiology related CPT codes enter routine RUC review process', 'https://www.asha.org/news/2026/audiology-related-cpt-codes-enter-routine-ruc-review-process/'),
            article('voices', 'ASHA Voices: Discussions of New Research on Gene Therapy and Mild Hearing Loss', 'https://leader.pubs.asha.org/do/10.1044/2026-0924-podcast-aud-research-symposium-hearing-2026/full/'),
            article('dysphagia', 'ASHA Leader: Bold Solutions to Shortages of Dysphagia Services', 'https://leader.pubs.asha.org/do/10.1044/leader.FTR3.31072026.slp-dysphagia-outreach-mobile-fees.58/full/', true),
          ],
        },
      },
    },
  },
};

describe('NewsListing', () => {
  it('renders the homepage news grid from selected Publications items', () => {
    render(<Default {...props} />);

    const listing = screen.getByTestId('news-listing');
    expect(listing).toHaveAttribute('id', 'asha-news');
    expect(listing).toHaveClass('news-band');
    expect(screen.getByRole('heading', { name: 'NEWS' })).toHaveClass('border-[#991E66]');
    expect(listing.querySelector('.grid')).toHaveClass('grid-cols-1', '@md:grid-cols-3', 'gap-5');

    const cpt = screen.getByRole('link', { name: /Audiology related CPT codes/i });
    expect(cpt).toHaveAttribute('href', 'https://www.asha.org/news/2026/audiology-related-cpt-codes-enter-routine-ruc-review-process/');
    expect(cpt.querySelector('img')).toHaveAttribute('src', 'https://www.asha.org/siteassets/homepage/news/cpt.png');

    const accent = screen.getByRole('link', { name: /Bold Solutions to Shortages of Dysphagia Services/i });
    expect(accent.querySelector('h3')).toHaveStyle({ color: '#991E66' });
    expect(cpt.querySelector('h3')).toHaveStyle({ color: '#00778B' });
  });

  it('lists child articles when a Publications page is the datasource', () => {
    const childProps: NewsListingProps = {
      rendering: { componentName: 'NewsListing' },
      page: mockPage,
      params: {},
      fields: {
        data: {
          datasource: {
            title: { jsonValue: { value: 'Get ASHA Headlines in Your Email Inbox' } },
            children: {
              results: [
                article('mentor', 'Mentors: Enroll now for the Audiology Mentor Program', 'https://www.asha.org/aud/audiology-mentor-program/'),
              ],
            },
          },
        },
      },
    };

    render(<Default {...childProps} />);

    expect(screen.getByRole('heading', { name: 'NEWS' })).toBeInTheDocument();
    expect(screen.queryByText('Get ASHA Headlines in Your Email Inbox')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Audiology Mentor Program/i })).toHaveAttribute(
      'href',
      'https://www.asha.org/aud/audiology-mentor-program/'
    );
  });

  it('reads an external image stored as image XML', () => {
    render(
      <Default
        rendering={{ componentName: 'NewsListing' }}
        page={mockPage}
        params={{}}
        fields={{
          data: {
            datasource: {
              title: { jsonValue: { value: 'NEWS' } },
              articles: {
                targetItems: [
                  {
                    id: 'cpt',
                    name: 'cpt',
                    pageTitle: { jsonValue: { value: 'Audiology related CPT codes' } },
                    pageThumbnail: {
                      value:
                        '<image src="https://www.asha.org/siteassets/homepage/news/news-aud-cpt-code-ruc.png" alt="CPT review" />',
                    },
                    sourceLink: { jsonValue: { value: { href: 'https://www.asha.org/news/cpt/', text: 'Read' } } },
                  },
                ],
              },
            },
          },
        }}
      />
    );

    expect(screen.getByRole('img', { name: 'CPT review' })).toHaveAttribute(
      'src',
      'https://www.asha.org/siteassets/homepage/news/news-aud-cpt-code-ruc.png'
    );
  });

  it('asks for a datasource when fields are missing', () => {
    render(<Default rendering={{ componentName: 'NewsListing' }} page={mockPage} params={{}} />);

    expect(screen.getByText(/News Listing/i)).toBeInTheDocument();
    expect(screen.queryByTestId('news-listing')).not.toBeInTheDocument();
  });
});
