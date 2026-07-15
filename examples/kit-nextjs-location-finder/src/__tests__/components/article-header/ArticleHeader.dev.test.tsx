// src/__tests__/components/article-header/ArticleHeader.dev.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as ArticleHeader } from '@/components/article-header/ArticleHeader';
import { Page } from '@sitecore-content-sdk/nextjs';

//  Component-Specific Mocks
jest.mock('@/components/image/ImageWrapper.dev', () => {
  const MockImageWrapper = React.forwardRef<
    HTMLImageElement,
    { image?: { value?: { src?: string } }; alt?: string }
  >(({ image, alt }, ref) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} data-testid="image-wrapper" src={image?.value?.src} alt={alt} />
  ));

  MockImageWrapper.displayName = 'MockImageWrapper';

  return { Default: MockImageWrapper };
});

jest.mock('@/components/floating-dock/floating-dock.dev', () => {
  const FloatingDock = ({ items }: {  items?: Array<{ title: string; onClick?: () => void }> }) => (
    <div data-testid="floating-dock">
      {items?.map((item, index) => (
        <button key={index} data-testid={`share-${item.title}`} onClick={item.onClick}>
          {item.title}
        </button>
      ))}
    </div>
  );
  FloatingDock.displayName = 'MockFloatingDock';
  return { FloatingDock };
});

jest.mock('@/components/button-component/ButtonComponent', () => {
  const ButtonBase = ({
    buttonLink,
    variant,
    className,
    icon,
    iconPosition,
  }: {
    buttonLink?: { value?: { href?: string; text?: string } };
    variant?: string;
    className?: string;
    icon?: { value?: string };
    iconPosition?: string;
  }) => (
    <button
      data-testid="button-base"
      className={className}
      data-variant={variant}
      data-icon={icon?.value}
      data-icon-position={iconPosition}
    >
      {buttonLink?.value?.text}
    </button>
  );
  ButtonBase.displayName = 'MockButtonBase';
  return { ButtonBase };
});

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

//  Define mock props safely
const mockProps = {
  fields: {
    imageRequired: { value: { src: '/test-image.jpg' } },
    eyebrowOptional: { value: 'Tech News' },
  },
  params: {},
  rendering: { componentName: 'ArticleHeader' },
  externalFields: {
    pageHeaderTitle: { value: 'Sample Article' },
    pageReadTime: { value: '5 min read' },
    pageDisplayDate: { value: 'Oct 13, 2025' },
    pageAuthor: {
      value: {
        personFirstName: { value: 'John' },
        personLastName: { value: 'Doe' },
        personJobTitle: { value: 'Senior Developer' },
        personProfileImage: { value: { src: '/author.jpg' } },
        rendering: { componentName: 'Person' },
        params: {},
      },
    },
  },
  page: mockPageBase,
};

describe('ArticleHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.open for share functionality
    Object.defineProperty(window, 'open', {
      writable: true,
      value: jest.fn(),
    });
  });

  it('renders the header with image and details', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    expect(screen.getByText('Sample Article')).toBeInTheDocument();
    expect(screen.getByText('Tech News')).toBeInTheDocument();
    expect(screen.getAllByTestId('image-wrapper')[0]).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument(); // Multiple instances exist
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getByText('Oct 13, 2025')).toBeInTheDocument();
  });

  it('renders back button correctly', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    const backButton = screen.getByTestId('button-base');
    expect(backButton).toHaveAttribute('data-variant', 'link');
    expect(backButton).toHaveAttribute('data-icon', 'arrow-left');
    expect(screen.getByText('Back to news')).toBeInTheDocument();
  });

  it('renders author section correctly', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-img')).toHaveAttribute('src', '/author.jpg');
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' &&
          content.includes('John') &&
          content.includes('Doe')
        );
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
  });

  it('handles share button clicks correctly', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    const fbButtons = screen.getAllByTestId('share-Share on Facebook');
    fireEvent.click(fbButtons[0]); // Click the first one (mobile version)

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('facebook.com'),
      '_blank',
      'width=600,height=400'
    );
  });

  it('renders floating dock with share buttons', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    // Note: FloatingDock is not mocked, so we test the actual share button interaction
    expect(screen.getAllByTestId('floating-dock')).toBeTruthy();
    expect(screen.getAllByTestId('share-Share on Facebook')).toHaveLength(2); // Mobile and desktop versions
    expect(screen.getAllByTestId('share-Share on LinkedIn')).toHaveLength(2);
    expect(screen.getAllByTestId('share-Copy Link')).toHaveLength(2);
  });

  it('renders category badge when eyebrow is provided', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);

    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('Tech News')).toBeInTheDocument();
  });

  it('renders toaster component', () => {
    render(<ArticleHeader {...(mockProps as React.ComponentProps<typeof ArticleHeader>)} />);
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
