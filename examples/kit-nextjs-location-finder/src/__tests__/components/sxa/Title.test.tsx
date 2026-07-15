import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Title } from '@/components/sxa/Title';
import { Page } from '@sitecore-content-sdk/nextjs';
import { baseSitecoreProps } from '@/__tests__/test-utils/component-props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isNormal: true,
        isEditing: false,
      },
      layout: {
        sitecore: {
          route: {
            fields: {
              pageTitle: {
                value: 'Alaris Emergency Vehicles',
              },
            },
          },
        },
      },
    },
  })),
  Text: jest.fn(({ field }) => <span data-testid="text-field">{field?.value}</span>),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="link-field">
      {children}
    </a>
  )),
}));

describe('SXA Title', () => {
  const mockPage = {
    mode: {
      isNormal: true,
      isEditing: false,
      isPreview: false,
      name: 'normal' as const,
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
    layout: {
      sitecore: {
        context: {},
        route: {
          fields: {
            pageTitle: {
              value: 'Alaris Emergency Vehicles',
            },
          },
        },
      },
    },
    locale: 'en',
  } as unknown as Page;

  const mockFields = {
    data: {
      datasource: {
        url: {
          path: '/vehicles/ambulances',
          siteName: 'alaris',
        },
        field: {
          jsonValue: {
            value: 'Advanced Ambulance Fleet',
          },
        },
      },
      contextItem: {
        url: {
          path: '',
          siteName: '',
        },
        field: {
          jsonValue: {
            value: '',
          },
        },
      },
    },
  };

  it('renders title with link in normal mode', () => {
    render(
      <Title {...baseSitecoreProps} params={{ styles: '', RenderingIdentifier: 'title-1' }} fields={mockFields} page={mockPage} />
    );

    expect(screen.getByTestId('link-field')).toBeInTheDocument();
    // Component prioritizes datasource field over page title
    expect(screen.getByTestId('text-field')).toHaveTextContent('Advanced Ambulance Fleet');
  });

  it('applies custom styles and rendering identifier', () => {
    const { container } = render(
      <Title
        {...baseSitecoreProps}
        params={{ styles: 'text-center font-bold', RenderingIdentifier: 'vehicle-title' }}
        fields={mockFields}
        page={mockPage}
      />
    );

    const titleDiv = container.querySelector('.component.title');
    expect(titleDiv).toHaveClass('text-center', 'font-bold');
    expect(titleDiv).toHaveAttribute('id', 'vehicle-title');
  });

  it('renders with context item when datasource is not available', () => {
    const fieldsWithContextItem = {
      data: {
        datasource: null,
        contextItem: {
          url: {
            path: '/vehicles/fire-trucks',
            siteName: 'alaris',
          },
          field: {
            jsonValue: {
              value: 'Fire Truck Specifications',
            },
          },
        },
      },
    };

    render(
      <Title
        {...baseSitecoreProps}
        params={{ styles: '', RenderingIdentifier: 'title-2' }}
        // @ts-expect-error Testing fallback behavior with null datasource
        fields={fieldsWithContextItem}
        page={mockPage}
      />
    );

    expect(screen.getByTestId('link-field')).toHaveAttribute('href', '/vehicles/fire-trucks');
  });
});
