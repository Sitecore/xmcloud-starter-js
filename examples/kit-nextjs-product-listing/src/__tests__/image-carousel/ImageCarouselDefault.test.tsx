/* eslint-disable */
import { render, screen } from '@testing-library/react';
import { ImageCarouselDefault } from '@/components/image-carousel/ImageCarouselDefault.dev';
import { ImageCarouselProps } from '@/components/image-carousel/image-carousel.props';
import { mockPage } from '../test-utils/mockPage';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronLeft: (props: any) => <svg data-testid="chevron-left" {...props} />,
  ChevronRight: (props: any) => <svg data-testid="chevron-right" {...props} />,
}));

// Mock dependencies
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }: any) => <span>{field?.jsonValue?.value || field?.value || ''}</span>,
}));

jest.mock('@/components/image/ImageWrapper.dev', () => ({
  Default: ({ image, className }: any) => (
    <img
      data-testid="carousel-image"
      src={image?.jsonValue?.value?.src || image?.value?.src || ''}
      className={className}
    />
  ),
}));

jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({ fields, children, ...props }: any) => (
    <button data-testid="button-base" {...props}>
      {children || fields?.link?.jsonValue?.value?.text || 'Button'}
    </button>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="ui-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/hooks/use-match-media', () => ({
  useMatchMedia: () => false,
}));

jest.mock('@/components/animated-section/AnimatedSection.dev', () => ({
  Default: ({ children }: any) => <div data-testid="animated-section">{children}</div>,
}));

jest.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, setApi }: any) => {
    // Simulate setting the API
    if (setApi) {
      setTimeout(() => {
        setApi({
          selectedScrollSnap: () => 0,
          on: jest.fn(),
          scrollTo: jest.fn(),
        });
      }, 0);
    }
    return <div data-testid="carousel">{children}</div>;
  },
  CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: any) => (
    <div data-testid="no-data-fallback">{componentName} - No data</div>
  ),
}));

jest.mock('@/components/image-carousel/ImageCarouselEditMode.dev', () => ({
  ImageCarouselEditMode: () => <div data-testid="edit-mode">Edit Mode</div>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('ImageCarouselDefault Component', () => {
  const mockProps: ImageCarouselProps = {
    rendering: {
      uid: 'test-uid',
      componentName: 'ImageCarousel',
      dataSource: '',
    },
    params: {},
    fields: {
      data: {
        datasource: {
          title: { jsonValue: { value: 'Test Carousel Title' } },
          imageItems: {
            results: [
              {
                image: {
                  jsonValue: {
                    value: {
                      src: '/image1.jpg',
                      alt: 'Image 1',
                    },
                  },
                },
                backgroundText: { jsonValue: { value: 'Background 1' } },
                link: {
                  jsonValue: {
                    value: {
                      href: '/link1',
                      text: 'Link 1',
                    },
                  },
                },
              },
              {
                image: {
                  jsonValue: {
                    value: {
                      src: '/image2.jpg',
                      alt: 'Image 2',
                    },
                  },
                },
                backgroundText: { jsonValue: { value: 'Background 2' } },
                link: {
                  jsonValue: {
                    value: {
                      href: '/link2',
                      text: 'Link 2',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
    page: mockPage,
    isPageEditing: false,
  };

  it('renders the carousel with title', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(screen.getByText('Test Carousel Title')).toBeInTheDocument();
  });

  it('renders carousel images', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    const images = screen.getAllByTestId('carousel-image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders navigation buttons', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
  });

  it('renders background text for each slide', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(screen.getByText('Background 1')).toBeInTheDocument();
    expect(screen.getByText('Background 2')).toBeInTheDocument();
  });

  it('renders links/buttons for slides', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    const buttons = screen.getAllByTestId('button-base');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders edit mode when isPageEditing is true', () => {
    const editProps = { ...mockProps, isPageEditing: true };
    render(<ImageCarouselDefault {...editProps} />);
    expect(screen.getByTestId('edit-mode')).toBeInTheDocument();
  });

  it('renders NoDataFallback when fields are missing', () => {
    const emptyProps = {
      ...mockProps,
      fields: undefined as any,
    };
    render(<ImageCarouselDefault {...emptyProps} />);
    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
  });

  it('includes live region for accessibility', () => {
    const { container } = render(<ImageCarouselDefault {...mockProps} />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('renders carousel structure', () => {
    render(<ImageCarouselDefault {...mockProps} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item').length).toBeGreaterThan(0);
  });
});
