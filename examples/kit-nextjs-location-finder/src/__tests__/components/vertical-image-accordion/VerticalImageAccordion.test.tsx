import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as VerticalImageAccordion } from '@/components/vertical-image-accordion/VerticalImageAccordion';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock framer-motion components
jest.mock('framer-motion', () => {
  const motion = {
    div: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition,
      ...props
    }: React.PropsWithChildren<{
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }>) => <div {...props}>{children}</div>,
  };
  return { motion, m: motion, AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</> };
});

// Mock ImageWrapper component
jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({
    image,
    className,
    wrapperClass,
  }: {
    image?: { value?: { src?: string; alt?: string } };
    className?: string;
    wrapperClass?: string;
  }) => (
    <div className={wrapperClass}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-testid="image-wrapper"
        src={image?.value?.src}
        alt={image?.value?.alt}
        className={className}
      />
    </div>
  ),
}));

// Mock ButtonBase component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({
    buttonLink,
    variant,
    className,
    children,
    ...props
  }: {
    buttonLink?: { value?: { text?: string; href?: string } };
    variant?: string;
    className?: string;
    children?: React.ReactNode;
  }) => (
    <button data-testid="cta-button" data-variant={variant} className={className} {...props}>
      {buttonLink?.value?.text || children}
    </button>
  ),
}));

describe('VerticalImageAccordion Component', () => {
  const mockRendering = { componentName: 'VerticalImageAccordion' };

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

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const mockData = {
    fields: {
      data: {
        datasource: {
          title: { jsonValue: { value: 'Our Services' } },
          items: {
            results: [
              {
                title: { jsonValue: { value: 'Service 1' } },
                description: { jsonValue: { value: 'Description for service 1' } },
                image: { value: { src: '/service1.jpg', alt: 'Service 1 Image' } },
                cta: { jsonValue: { value: { text: 'Learn More', href: '/service1' } } },
              },
              {
                title: { jsonValue: { value: 'Service 2' } },
                description: { jsonValue: { value: 'Description for service 2' } },
                image: { value: { src: '/service2.jpg', alt: 'Service 2 Image' } },
              },
            ],
          },
        },
      },
    },
    params: {},
    rendering: mockRendering,
    page: mockPageBase,
  };

  it('renders accordion with title and items', () => {
    render(<VerticalImageAccordion {...mockData} />);

    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    expect(screen.getAllByTestId('image-wrapper')).toHaveLength(2);
  });

  it('shows content when accordion item is clicked', () => {
    render(<VerticalImageAccordion {...mockData} />);

    // Initially, the second item (index 1) should be active, so Service 2 description should be visible
    expect(screen.getByText('Description for service 2')).toBeInTheDocument();

    // Click on the first item to make it active
    const firstItem = screen.getByText('Service 1').closest('div[role="tab"]');
    fireEvent.click(firstItem!);

    // Fast-forward time to complete the animation (isExpanding becomes false after 500ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now Service 1 description should be visible
    expect(screen.getByText('Description for service 1')).toBeInTheDocument();
  });

  it('handles keyboard navigation with Enter and Space keys', () => {
    render(<VerticalImageAccordion {...mockData} />);

    const firstItem = screen.getByText('Service 1').closest('div[role="tab"]');

    // Test Enter key
    fireEvent.keyDown(firstItem!, { key: 'Enter' });
    act(() => {
      jest.advanceTimersByTime(500); // Wait for animation to complete
    });
    expect(screen.getByText('Description for service 1')).toBeInTheDocument();

    // Test Space key on second item
    const secondItem = screen.getByText('Service 2').closest('div[role="tab"]');
    fireEvent.keyDown(secondItem!, { key: ' ' });
    act(() => {
      jest.advanceTimersByTime(500); // Wait for animation to complete
    });
    expect(screen.getByText('Description for service 2')).toBeInTheDocument();
  });

  it('renders CTA button when provided', () => {
    render(<VerticalImageAccordion {...mockData} />);

    // Click on the first item to show its content (which has CTA)
    const firstItem = screen.getByText('Service 1').closest('div[role="tab"]');
    fireEvent.click(firstItem!);

    // Wait for animation to complete
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Check if CTA button appears
    const ctaButton = screen.getByTestId('cta-button');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('renders fallback when no fields provided', () => {
    const emptyProps = {
      fields: undefined,
      params: {},
      rendering: mockRendering,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<VerticalImageAccordion {...(emptyProps as any)} />);
    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for VerticalImageAccordion')).toBeInTheDocument();
  });
});
