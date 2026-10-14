/* eslint-disable */
import { render, screen } from '@testing-library/react';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageOptimizationContext } from '@/components/image/image-optimization.context';

// Mock dependencies
const mockUseSitecore = jest.fn(() => ({
  page: {
    mode: {
      isEditing: false,
      isPreview: false,
    },
  },
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Image: ({ field, className }: any) => (
    <img
      data-testid="content-sdk-image"
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
    />
  ),
  useSitecore: () => mockUseSitecore(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img data-testid="next-image" {...props} />;
  },
}));

jest.mock('framer-motion', () => ({
  useInView: () => true,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/utils/placeholderImageLoader', () => ({
  __esModule: true,
  default: ({ src }: any) => src,
}));

describe('ImageWrapper Component', () => {
  const mockImage = {
    value: {
      src: 'https://example.com/test-image.jpg',
      alt: 'Test image',
      width: 800,
      height: 600,
    },
  };

  it('renders NextImage when not in editing mode', () => {
    render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper image={mockImage} className="custom-class" />
      </ImageOptimizationContext.Provider>
    );

    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('renders nothing when image is not provided and not editing', () => {
    const { container } = render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper className="custom-class" />
      </ImageOptimizationContext.Provider>
    );

    // Component returns empty fragment when no image and not editing
    const imageContainer = container.querySelector('.image-container');
    expect(imageContainer).toBeNull();
  });

  it('applies wrapperClass to the container', () => {
    const { container } = render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper image={mockImage} wrapperClass="wrapper-custom" />
      </ImageOptimizationContext.Provider>
    );

    const wrapper = container.querySelector('.image-container');
    expect(wrapper).toHaveClass('wrapper-custom');
  });

  it('applies className to the image', () => {
    render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper image={mockImage} className="image-custom" />
      </ImageOptimizationContext.Provider>
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveClass('image-custom');
  });

  it('handles SVG images with unoptimized flag', () => {
    const svgImage = {
      value: {
        src: 'https://example.com/test-image.svg',
        alt: 'Test SVG',
      },
    };

    // Mock isEditing or isPreview to trigger content-sdk Image rendering
    mockUseSitecore.mockReturnValueOnce({
      page: {
        mode: {
          isEditing: false,
          isPreview: true, // SVG will use content-sdk Image in preview
        },
      },
    });

    render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper image={svgImage} />
      </ImageOptimizationContext.Provider>
    );

    const image = screen.getByTestId('content-sdk-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.svg');
  });

  it('uses unoptimized from context', () => {
    render(
      <ImageOptimizationContext.Provider value={{ unoptimized: true }}>
        <ImageWrapper image={mockImage} />
      </ImageOptimizationContext.Provider>
    );

    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
  });

  it('passes additional props to NextImage', () => {
    render(
      <ImageOptimizationContext.Provider value={{ unoptimized: false }}>
        <ImageWrapper image={mockImage} data-custom="test-value" />
      </ImageOptimizationContext.Provider>
    );

    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('data-custom', 'test-value');
  });
});
