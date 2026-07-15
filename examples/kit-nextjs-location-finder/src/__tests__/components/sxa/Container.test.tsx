import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container } from '@/components/sxa/Container';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock AppPlaceholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name }: { name: string }) => (
    <div data-testid={`placeholder-${name}`}>Placeholder: {name}</div>
  ),
}));

describe('SXA Container', () => {
  const mockRendering = {
    componentName: 'Container',
    dataSource: '',
    uid: '123',
    params: {
      DynamicPlaceholderId: 'main-content',
      GridParameters: 'col-12',
      Styles: 'bg-white',
      RenderingIdentifier: 'container-1',
    },
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

  it('renders container with grid parameters and styles', () => {
    const { container } = render(
      <Container rendering={mockRendering} params={mockRendering.params} page={mockPage} componentMap={mockComponentMap} />
    );

    const containerDiv = container.querySelector('.component.container-default');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('col-12');
    expect(containerDiv).toHaveClass('bg-white');
  });

  it('renders placeholder with correct key', () => {
    const { getByTestId } = render(
      <Container rendering={mockRendering} params={mockRendering.params} page={mockPage} componentMap={mockComponentMap} />
    );

    expect(getByTestId('placeholder-container-main-content')).toBeInTheDocument();
  });

  it('applies background image when provided', () => {
    const paramsWithBackground = {
      ...mockRendering.params,
      BackgroundImage: 'mediaurl="/images/alaris-vehicle-fleet.jpg"',
    };

    const { container } = render(
      <Container rendering={mockRendering} params={paramsWithBackground} page={mockPage} componentMap={mockComponentMap} />
    );

    const bgElement = container.querySelector('.bg-cover');
    expect(bgElement).toHaveStyle({
      backgroundImage: "url('/images/alaris-vehicle-fleet.jpg')",
    });
  });
});
