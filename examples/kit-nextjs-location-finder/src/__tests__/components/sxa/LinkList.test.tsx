import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as LinkList } from '@/components/sxa/LinkList';
import { baseSitecoreProps } from '@/__tests__/test-utils/component-props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'list-title' }, field?.value);
  }),
  Link: jest.fn(({ field, className }) => (
    <a href={field?.value?.href} className={className} data-testid="link-item">
      {field?.value?.text}
    </a>
  )),
}));

describe('SXA LinkList', () => {
  const mockFields = {
    data: {
      datasource: {
        field: {
          title: {
            value: 'Vehicle Categories',
          },
        },
        children: {
          results: [
            {
              field: {
                link: {
                  value: {
                    href: '/vehicles/ambulances',
                    text: 'Ambulances',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/vehicles/fire-trucks',
                    text: 'Fire Trucks',
                  },
                },
              },
            },
            {
              field: {
                link: {
                  value: {
                    href: '/vehicles/rescue',
                    text: 'Rescue Vehicles',
                  },
                },
              },
            },
          ],
        },
      },
    },
  };

  it('renders link list with title and vehicle links', () => {
    render(
      <LinkList {...baseSitecoreProps} params={{ styles: '', RenderingIdentifier: 'linklist-1' }} fields={mockFields} />
    );

    expect(screen.getByTestId('list-title')).toHaveTextContent('Vehicle Categories');
    const links = screen.getAllByTestId('link-item');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveTextContent('Ambulances');
    expect(links[1]).toHaveTextContent('Fire Trucks');
    expect(links[2]).toHaveTextContent('Rescue Vehicles');
  });

  it('renders links with correct hrefs', () => {
    render(
      <LinkList {...baseSitecoreProps} params={{ styles: '', RenderingIdentifier: 'linklist-2' }} fields={mockFields} />
    );

    const links = screen.getAllByTestId('link-item');
    expect(links[0]).toHaveAttribute('href', '/vehicles/ambulances');
    expect(links[1]).toHaveAttribute('href', '/vehicles/fire-trucks');
    expect(links[2]).toHaveAttribute('href', '/vehicles/rescue');
  });

  it('renders empty state when no datasource provided', () => {
    const emptyFields = null;

    render(
      <LinkList
        {...baseSitecoreProps}
        params={{ styles: '', RenderingIdentifier: 'linklist-empty' }}
        // @ts-expect-error Testing empty fields case
        fields={emptyFields}
      />
    );

    expect(screen.getByText('Link List')).toBeInTheDocument();
  });
});
