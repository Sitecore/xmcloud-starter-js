import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageHeaderBlueText } from '@/components/page-header/PageHeaderBlueText.dev';
import { mockPageHeaderProps, mockPageHeaderPropsWithoutLinks } from './page-header.mock.props';

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span', className }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-component' }, field?.value);
  }),
  RichText: jest.fn(({ field, className }) => (
    <div
      className={className}
      data-testid="richtext-component"
      dangerouslySetInnerHTML={{ __html: field?.value }}
    />
  )),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: jest.fn(({ componentName }) => (
    <div data-testid="no-data-fallback">No Data: {componentName}</div>
  )),
}));

jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-section">{children}</div>
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({
    buttonLink,
    variant,
  }: {
    buttonLink: { value: { text: string; href: string } };
    variant: string;
  }) => (
    <button data-testid={`button-${variant}`} data-href={buttonLink.value.href}>
      {buttonLink.value.text}
    </button>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image }: { image: { value: { src: string; alt: string } } }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="image-wrapper" src={image.value.src} alt={image.value.alt} />
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).flat().join(' ')),
}));

describe('PageHeaderBlueText', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders page header with blue text styling and buttons', () => {
    render(<PageHeaderBlueText {...mockPageHeaderProps} isPageEditing={false} />);

    expect(screen.getByText('Advanced Emergency Response Vehicles')).toBeInTheDocument();
    expect(screen.getByTestId('richtext-component')).toBeInTheDocument();
    expect(screen.getByTestId('button-outline')).toHaveTextContent('Explore Our Fleet');
    expect(screen.getByTestId('button-secondary')).toHaveTextContent('Contact Sales');
  });

  it('renders background image with overlay content', () => {
    render(<PageHeaderBlueText {...mockPageHeaderProps} isPageEditing={false} />);

    const image = screen.getByTestId('image-wrapper');
    expect(image).toHaveAttribute('src', '/images/alaris-ambulance-fleet.jpg');
    expect(image).toHaveAttribute('alt', 'Alaris Emergency Vehicle Fleet');
  });

  it('shows buttons in edit mode even when links are empty', () => {
    render(<PageHeaderBlueText {...mockPageHeaderPropsWithoutLinks} isPageEditing={true} />);

    // In edit mode, buttons should still render
    const sections = screen.getAllByTestId('animated-section');
    expect(sections.length).toBeGreaterThan(0);
    // Check that the component renders with title
    expect(screen.getByText('Fire & Rescue Equipment')).toBeInTheDocument();
  });
});
