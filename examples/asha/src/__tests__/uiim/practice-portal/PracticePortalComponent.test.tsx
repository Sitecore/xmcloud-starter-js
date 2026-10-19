import React from 'react';
import { render, screen } from '@testing-library/react';
import type { ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { Default, WithTaxonomy } from '@/components/uiim/practice-portal/PracticePortalComponent';
import { readTaxonomyTerms } from '@/components/uiim/practice-portal/practice-portal.props';
import type { PracticePortalComponentProps } from '@/components/uiim/practice-portal/practice-portal.props';
import { mockPage, mockPageEditing } from '../../test-utils/mockPage';

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: { field?: { value?: string } }) => {
    if (!field?.value) return null;
    return <div dangerouslySetInnerHTML={{ __html: field.value }} />;
  },
  Text: ({ field, tag: Tag = 'span' }: { field?: { value?: string }; tag?: string }) => {
    if (!field?.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  Link: ({ field, children }: { field?: { value?: { href?: string; text?: string } }; children?: React.ReactNode }) => (
    <a href={field?.value?.href}>{children}</a>
  ),
}));

const rendering = { componentName: 'PracticePortalComponent', uid: 'practice-portal-1' } as ComponentRendering;

const audience = [
  {
    id: '8bb81ae4-7726-4f85-a159-7fa349c44d6d',
    url: '/Data/Taxonomy/Audience/Audiologist',
    name: 'Audiologist',
    displayName: 'Audiologist',
    fields: { titleRequired: { value: 'Audiologist' } },
  },
  {
    id: '8762eae2-f3d2-4b31-a9dd-ab1da8b215ec',
    name: 'Audiology assistant',
    displayName: 'Audiology assistant',
    fields: { titleRequired: { value: 'Audiology assistant' } },
  },
];

const routeFields = {
  pageTitle: { value: 'Accent Modification' },
  TopicsLink: { value: { href: '/practice-portal', text: 'View All Portal Topics' } },
  Overview: { value: '<p>Accents are a difference, not a disorder.</p>' },
  Audience: audience,
  'Career stage': [{ id: '55801e82-930c-4041-b416-9487640a74b4', name: 'Advanced career', displayName: 'Advanced career' }],
  'Content type': [{ id: '2ed2648e-9fef-444c-9745-b21d382ad3fb', name: 'Evidence map', displayName: 'Evidence map', fields: {} }],
  'Content Types': [],
  'Event Types': [],
  Topics: [],
  'Review cadence': [{ name: 'As needed', displayName: 'As needed' }],
  Specialty: [{ name: 'Aphasia', displayName: 'Aphasia' }],
  Topic: [
    { name: 'Certification', displayName: 'Certification' },
    { name: 'Clinical practice', displayName: 'Clinical practice' },
  ],
  Access: '{11111111-1111-1111-1111-111111111111}',
};

const pageWithFields = {
  ...mockPage,
  layout: {
    sitecore: {
      context: {},
      route: { name: 'Accent Modification', fields: routeFields },
    },
  },
} as unknown as Page;

const props: PracticePortalComponentProps = {
  rendering,
  params: { RenderingIdentifier: 'practice-portal-1' },
  page: pageWithFields,
};

describe('PracticePortalComponent taxonomy', () => {
  it('reads term names from the layout checklist shape and drops raw ids', () => {
    expect(readTaxonomyTerms(audience)).toEqual(['Audiologist', 'Audiology assistant']);
    expect(readTaxonomyTerms('{8BB81AE4-7726-4F85-A159-7FA349C44D6D}|{8762EAE2-F3D2-4B31-A9DD-AB1DA8B215EC}')).toEqual(
      []
    );
    expect(readTaxonomyTerms({ value: '{0DFC3922-6FF7-43F6-A8CF-4D1FE6BA10F4}' })).toEqual([]);
  });

  it('keeps Default free of taxonomy pills', () => {
    render(<Default {...props} />);

    expect(screen.getByTestId('practice-portal')).toBeInTheDocument();
    expect(screen.queryByTestId('practice-portal-with-taxonomy')).not.toBeInTheDocument();
    expect(screen.queryByText('Audiologist')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Accent Modification' })).toBeInTheDocument();
  });

  it('shows selected term names and hides empty groups', () => {
    render(<WithTaxonomy {...props} />);

    const root = screen.getByTestId('practice-portal-with-taxonomy');
    expect(root).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Accent Modification' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'In this topic' })).toBeInTheDocument();
    expect(screen.getAllByText('Audiologist').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Evidence map').length).toBeGreaterThan(0);
    expect(screen.queryByText('Content Types')).not.toBeInTheDocument();
    expect(screen.queryByText('Event Types')).not.toBeInTheDocument();
    expect(screen.queryByText('Topics')).not.toBeInTheDocument();
    expect(screen.queryByText(/8bb81ae4/i)).not.toBeInTheDocument();
    expect(root.querySelector('button')).not.toHaveTextContent('Audiologist');
  });

  it('shows an editing hint when nothing is selected', () => {
    render(
      <WithTaxonomy
        {...props}
        page={
          {
            ...mockPageEditing,
            layout: {
              sitecore: {
                context: {},
                route: {
                  fields: {
                    pageTitle: { value: 'Accent Modification' },
                    Overview: { value: '<p>Overview</p>' },
                    Audience: [],
                  },
                },
              },
            },
          } as unknown as Page
        }
      />
    );

    expect(screen.getByText('No taxonomy selected.')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
  });
});
