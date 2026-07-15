import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as PromoBlock, TextLink } from '@/components/promo-block/PromoBlock';
import { Orientation } from '@/enumerations/Orientation.enum';
import { Variation } from '@/enumerations/Variation.enum';
import { Page } from '@sitecore-content-sdk/nextjs';

// Sitecore components are already mocked globally in jest.setup.js
// No need to mock them again here

// Mock internal components used by PromoBlock
jest.mock('@/components/flex/Flex.dev', () => ({
  Flex: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="flex" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/image/ImageWrapper.dev', () => {
  const ImageWrapper = ({
    image,
    className,
  }: {
    image?: {
      value?: {
        src?: string;
        alt?: string;
      };
    };
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="image"
      src={image?.value?.src || ''}
      alt={image?.value?.alt || ''}
      className={className}
    />
  );
  ImageWrapper.displayName = 'MockImageWrapper';
  return { Default: ImageWrapper };
});

// UI components are already mocked globally in jest.setup.js

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

const baseFields = {
  heading: { value: 'Promo Title' },
  description: { value: 'Promo Description' },
  image: { value: { src: '/test.jpg', alt: 'alt' } },
  link: { value: { href: '/promo', text: 'Learn more' } },
};

interface PromoProps {
  fields?: {
    heading?: { value?: string };
    description?: { value?: string };
    image?: { value?: { src?: string; alt?: string } };
    link?: { value?: { href?: string; text?: string } };
  };
  params: {
    orientation?: string;
    variation?: string;
  };
  rendering: { componentName: string };
}

const renderPromo = (override: Partial<PromoProps> = {}) => {
  const props = {
    fields: baseFields,
    params: { orientation: Orientation.IMAGE_LEFT, variation: Variation.DEFAULT },
    rendering: { componentName: 'PromoBlock' },
    ...override,
  };
  // Type assertion is safe here as we're providing all required props for testing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return render(<PromoBlock {...(props as any)} />);
};

describe('PromoBlock', () => {
  it('renders heading, description, image and link', () => {
    renderPromo();

    expect(screen.getByText('Promo Title')).toBeInTheDocument();
    expect(screen.getByText('Promo Description')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/promo');
    expect(screen.getByTestId('image')).toHaveAttribute('src', '/test.jpg');
  });

  it('renders fallback when fields are missing', () => {
    const emptyProps = {
      fields: undefined,
      params: {},
      rendering: { componentName: 'PromoBlock' },
    };
    // Testing edge case where fields are undefined - type assertion needed for test
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<PromoBlock {...(emptyProps as any)} />);
    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
  });

  it('applies orientation classes for image left', () => {
    const { container } = renderPromo({
      params: { orientation: Orientation.IMAGE_LEFT, variation: Variation.DEFAULT },
    });

    // container wrapper should include grid classes
    const root = container.querySelector('.component.promo-block');
    expect(root).toBeInTheDocument();

    // copy area uses class string depending on orientation
    // We check presence of a known class used in IMAGE_LEFT branch
    const copy = container.querySelector('.px-4.pb-6');
    expect(copy).toBeInTheDocument();
  });

  it('applies orientation classes for image right', () => {
    const { container } = renderPromo({
      params: { orientation: Orientation.IMAGE_RIGHT, variation: Variation.DEFAULT },
    });

    // the image container should exist
    const imageElement = container.querySelector('[data-testid="image"]');
    expect(imageElement).toBeInTheDocument();
    const imageContainer = imageElement?.parentElement;
    expect(imageContainer).toBeInTheDocument();
  });

  it('TextLink forces variation two and outline button', () => {
    const props = {
      fields: baseFields,
      params: { orientation: Orientation.IMAGE_RIGHT },
      rendering: { componentName: 'TextLink' },
      page: mockPageBase,
    };
    // Testing TextLink component variant - type assertion for test compatibility
    render(<TextLink {...props} />);

    // Variation two adds extra class on copy (relative p-6 bg-white)
    const copy = screen.getByText('Promo Description').parentElement as HTMLElement; // RichText in copy section
    expect(copy.className).toMatch(/bg-white/);
  });

  it('does not render link button when link is absent', () => {
    const fieldsWithoutLink = {
      heading: baseFields.heading,
      description: baseFields.description,
      image: baseFields.image,
      // link is intentionally omitted
    };
    renderPromo({ fields: fieldsWithoutLink });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
