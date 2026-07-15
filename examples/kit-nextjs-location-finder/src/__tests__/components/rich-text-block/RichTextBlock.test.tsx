import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as RichTextBlock } from '@/components/rich-text-block/RichTextBlock';
import { Page } from '@sitecore-content-sdk/nextjs';

// Sitecore SDK components and NoDataFallback are already mocked globally in jest.setup.js

// Component-specific mock for RichText to handle empty states in tests
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: { field?: { value?: string } }) => <>{field?.value}</>,
  RichText: ({ field }: { field?: { value?: string } }) => {
    if (!field?.value) {
      return <span className="is-empty-hint">Rich text</span>;
    }
    return <div data-testid="richtext">{field.value}</div>;
  },
  Link: ({
    field,
    children,
  }: {
    field?: { value?: { href?: string; text?: string } };
    children?: React.ReactNode;
  }) => <a href={field?.value?.href}>{field?.value?.text || children}</a>,
  Image: ({ field }: { field?: { value?: { src?: string; alt?: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={field?.value?.src} alt={field?.value?.alt} />
  ),
  Placeholder: ({ name }: { name: string }) => <div data-testid="sitecore-placeholder">{name}</div>,
  useSitecore: () => ({
    sitecoreContext: {},
    updateSitecoreContext: jest.fn(),
  }),
  withDatasourceCheck: () => (component: React.ComponentType) => component,
}));

// Mock NoDataFallback component
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: () => <div data-testid="no-data-fallback">No data available</div>,
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Test props will be handled with proper type safety

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

describe('RichTextBlock Component', () => {
  const mockFields = {
    text: { value: 'This is rich text content' },
  };

  const mockParams = {
    styles: 'custom-style',
    RenderingIdentifier: 'rich-text-id',
  };

  const mockRendering = {
    componentName: 'RichTextBlock',
    dataSource: '/mock-datasource',
    uid: 'mock-uid',
  };

  it('renders rich text content when fields are provided', () => {
    render(
      <RichTextBlock
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        page={mockPageBase}
      />
    );

    expect(screen.getByTestId('richtext')).toHaveTextContent('This is rich text content');
    const container = screen.getByTestId('richtext').closest('.component.rich-text');
    expect(container).toHaveAttribute('id', 'rich-text-id');
    expect(container).toHaveClass('component rich-text');
  });

  it('renders empty hint when text field is empty', () => {
    const emptyFields = {
      text: { value: '' },
    };

    render(
      <RichTextBlock
        fields={emptyFields}
        params={{}}
        rendering={mockRendering}
        page={mockPageBase}
      />
    );
    expect(screen.getByText('Rich text')).toBeInTheDocument();
  });

  it('renders fallback when fields are missing', () => {
    // Testing edge case with undefined fields - using type assertion for test scenario
    // @ts-expect-error - Testing invalid props to verify NoDataFallback behavior
    render(<RichTextBlock fields={undefined} params={{}} rendering={mockRendering} />);
    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
  });
});
