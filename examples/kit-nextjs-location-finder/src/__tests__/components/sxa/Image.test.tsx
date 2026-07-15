import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Image, Banner } from '@/components/sxa/Image';
import { Page, ComponentRendering, NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  NextImage: jest.fn(({ field }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="sxa-image" src={field?.value?.src} alt={field?.value?.alt} />
  )),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="image-link">
      {children}
    </a>
  )),
  Text: jest.fn(({ field, tag: Tag = 'span' }) =>
    field?.value ? <Tag data-testid="image-caption">{field.value}</Tag> : null
  ),
}));

describe('SXA Image', () => {
  const mockPage = {
    mode: {
      isEditing: false,
      isPreview: false,
      isNormal: true,
      name: 'normal' as const,
      designLibrary: { isVariantGeneration: false },
      isDesignLibrary: false,
    },
    layout: { sitecore: { context: {}, route: null } },
    locale: 'en',
  } as Page;

  const mockPageEditing = {
    ...mockPage,
    mode: { ...mockPage.mode, isEditing: true, isNormal: false, name: 'edit' as const },
  } as Page;

  const mockRendering = {} as ComponentRendering;
  const mockComponentMap = new Map<string, NextjsContentSdkComponent>();

  const mockFields = {
    Image: {
      value: {
        src: '/images/alaris-type-3-ambulance.jpg',
        alt: 'Alaris Type III Ambulance Front View',
      },
    },
    ImageCaption: {
      value: 'Type III Ambulance - Extended Storage Configuration',
    },
    TargetUrl: {
      value: {
        href: '/vehicles/ambulances/type-3/details',
      },
    },
  };

  it('renders Default with image, caption and link when not editing', () => {
    render(
      <Image
        rendering={mockRendering}
        componentMap={mockComponentMap}
        params={{ styles: '', RenderingIdentifier: 'img-1' }}
        fields={mockFields}
        page={mockPage}
      />
    );

    expect(screen.getByTestId('sxa-image')).toHaveAttribute(
      'src',
      '/images/alaris-type-3-ambulance.jpg'
    );
    expect(screen.getByTestId('image-caption')).toHaveTextContent(
      'Type III Ambulance - Extended Storage Configuration'
    );
    expect(screen.getByTestId('image-link')).toHaveAttribute(
      'href',
      '/vehicles/ambulances/type-3/details'
    );
  });

  it('renders Default without link when not provided', () => {
    const fieldsWithoutLink = {
      ...mockFields,
      TargetUrl: { value: { href: '' } },
    };

    render(
      <Image
        rendering={mockRendering}
        componentMap={mockComponentMap}
        params={{ styles: '', RenderingIdentifier: 'img-2' }}
        fields={fieldsWithoutLink}
        page={mockPage}
      />
    );

    expect(screen.getByTestId('sxa-image')).toBeInTheDocument();
    expect(screen.queryByTestId('image-link')).not.toBeInTheDocument();
  });

  it('renders Default without link when in editing mode', () => {
    render(
      <Image
        rendering={mockRendering}
        componentMap={mockComponentMap}
        params={{ styles: '', RenderingIdentifier: 'img-3' }}
        fields={mockFields}
        page={mockPageEditing}
      />
    );

    expect(screen.getByTestId('sxa-image')).toBeInTheDocument();
    expect(screen.queryByTestId('image-link')).not.toBeInTheDocument();
  });

  it('renders Banner variant in figure.hero-banner and always shows image', () => {
    const { container } = render(
      <Banner
        rendering={mockRendering}
        componentMap={mockComponentMap}
        params={{ styles: 'hero-section', RenderingIdentifier: 'banner-1' }}
        fields={mockFields}
        page={mockPage}
      />
    );

    const bannerFigure = container.querySelector('figure.hero-banner');
    expect(bannerFigure).toBeInTheDocument();
    expect(bannerFigure).toHaveClass('hero-section');
    expect(screen.getByTestId('sxa-image')).toBeInTheDocument();
  });

  it('renders Banner image in editing mode too', () => {
    render(
      <Banner
        rendering={mockRendering}
        componentMap={mockComponentMap}
        params={{ styles: '', RenderingIdentifier: 'banner-2' }}
        fields={mockFields}
        page={mockPageEditing}
      />
    );

    expect(screen.getByTestId('sxa-image')).toBeInTheDocument();
  });
});
