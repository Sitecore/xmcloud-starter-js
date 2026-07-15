import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ColumnSplitter } from '@/components/sxa/ColumnSplitter';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock AppPlaceholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name }: { name: string }) => (
    <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>
  ),
}));

describe('SXA ColumnSplitter', () => {
  const mockRendering = {
    componentName: 'ColumnSplitter',
    dataSource: '',
    uid: '123',
  };

  const mockPage = {
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

  const mockComponentMap = new Map();

  it('renders columns with specified widths and styles', () => {
    const params = {
      EnabledPlaceholders: '1,2,3',
      ColumnWidth1: 'col-md-4',
      ColumnWidth2: 'col-md-4',
      ColumnWidth3: 'col-md-4',
      Styles1: 'vehicle-specs',
      Styles2: 'vehicle-features',
      Styles3: 'vehicle-pricing',
      RenderingIdentifier: 'splitter-1',
      styles: 'row-equal',
    };

    const { container, getByTestId } = render(
      <ColumnSplitter rendering={mockRendering} params={params} page={mockPage} componentMap={mockComponentMap} />
    );

    const splitterDiv = container.querySelector('.column-splitter');
    expect(splitterDiv).toBeInTheDocument();
    expect(splitterDiv).toHaveClass('row-equal');

    expect(getByTestId('placeholder-column-1-{*}')).toBeInTheDocument();
    expect(getByTestId('placeholder-column-2-{*}')).toBeInTheDocument();
    expect(getByTestId('placeholder-column-3-{*}')).toBeInTheDocument();
  });

  it('renders only enabled columns', () => {
    const params = {
      EnabledPlaceholders: '1,3',
      ColumnWidth1: 'col-md-6',
      ColumnWidth3: 'col-md-6',
      RenderingIdentifier: 'splitter-2',
      styles: '',
    };

    const { getByTestId, queryByTestId } = render(
      <ColumnSplitter rendering={mockRendering} params={params} page={mockPage} componentMap={mockComponentMap} />
    );

    expect(getByTestId('placeholder-column-1-{*}')).toBeInTheDocument();
    expect(queryByTestId('placeholder-column-2-{*}')).not.toBeInTheDocument();
    expect(getByTestId('placeholder-column-3-{*}')).toBeInTheDocument();
  });

  it('applies custom column classes for vehicle layout', () => {
    const params = {
      EnabledPlaceholders: '1,2',
      ColumnWidth1: 'col-md-8',
      ColumnWidth2: 'col-md-4',
      Styles1: 'ambulance-details',
      Styles2: 'ambulance-sidebar',
      RenderingIdentifier: 'vehicle-layout',
      styles: '',
    };

    const { container } = render(<ColumnSplitter rendering={mockRendering} params={params} page={mockPage} componentMap={mockComponentMap} />);

    const columns = container.querySelectorAll('.column-splitter > div');
    expect(columns[0]).toHaveClass('col-md-8', 'ambulance-details');
    expect(columns[1]).toHaveClass('col-md-4', 'ambulance-sidebar');
  });
});
