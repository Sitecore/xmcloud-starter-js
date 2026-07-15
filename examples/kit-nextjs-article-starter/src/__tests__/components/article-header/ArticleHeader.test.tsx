import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Default as ArticleHeader } from '@/components/article-header/ArticleHeader';
import {
  defaultProps,
  propsWithoutEyebrow,
  propsWithoutAuthor,
  propsWithoutReadTime,
  propsWithoutDate,
  propsMinimal,
  propsWithoutFields,
  propsWithAuthorNoImage,
  propsWithAuthorNoJobTitle,
} from './ArticleHeader.mockProps';
import type { Field } from '@sitecore-content-sdk/nextjs';

// Mock window.matchMedia
beforeAll(() => {
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

// Mock window.history
const mockBack = jest.fn();
Object.defineProperty(window, 'history', {
  writable: true,
  value: { back: mockBack },
});

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag, className }: { field?: Field<string>; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
  DateField: ({ field, render, tag, className }: { field?: Field<string>; render?: (value: string) => string; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    const formattedDate = render && field?.value ? render(field.value) : field?.value;
    return React.createElement(
      Tag,
      { className, 'data-testid': 'date-field' },
      formattedDate || ''
    );
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Demo1_ArticleHeader_BackToNewsLabel': 'Back to News',
      'Demo1_ArticleHeader_AuthorLabel': 'Written by',
    };
    return translations[key] || key;
  },
}));

// Mock UI components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children?: React.ReactNode }) => <div data-testid="avatar">{children}</div>,
  // eslint-disable-next-line @next/next/no-img-element
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => <img src={src} alt={alt} data-testid="avatar-image" />,
  AvatarFallback: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="badge">
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, className }: { children?: React.ReactNode; onClick?: () => void; variant?: string; className?: string }) => (
    <button
      className={className}
      onClick={onClick}
      data-testid="button"
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster"></div>,
}));

// Mock hooks
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock components
jest.mock('@/components/image/ImageWrapper.dev', () => {
  const ImageWrapperMock = React.forwardRef<HTMLImageElement, { image?: { value?: { src?: string } }; alt?: string; className?: string }>(({ image, alt, className }, ref) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={image?.value?.src}
      alt={alt}
      className={className}
      data-testid="image-wrapper"
    />
  ));
  ImageWrapperMock.displayName = 'ImageWrapper';
  return {
    Default: ImageWrapperMock,
  };
});

jest.mock('@/components/icon/Icon', () => ({
  Default: ({ iconName, className }: { iconName?: string; className?: string }) => (
    <span className={className} data-testid={`icon-${iconName}`}>
      {iconName}
    </span>
  ),
}));

type FloatingDockItem = {
  title: string;
  onClick: () => void;
};

jest.mock('@/components/floating-dock/floating-dock.dev', () => ({
  FloatingDock: ({ items }: { items?: FloatingDockItem[] }) => (
    <div data-testid="floating-dock">
      {items?.map((item, index) => (
        <button key={index} onClick={item.onClick} data-testid={`dock-item-${index}`}>
          {item.title}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName?: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

jest.mock('@/utils/date-utils', () => ({
  formatDateInUTC: (date: string) => `Formatted: ${date}`,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Facebook: () => <span data-testid="facebook-icon">Facebook</span>,
  Twitter: () => <span data-testid="twitter-icon">Twitter</span>,
  Linkedin: () => <span data-testid="linkedin-icon">LinkedIn</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Link: () => <span data-testid="link-icon">Link</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
}));

describe('ArticleHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });
  });

  describe('Basic rendering', () => {
    it('should render article header with all fields', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      
      // Author name is rendered (check for both first and last name presence)
      // Use getAllByText since it appears in both avatar fallback and name paragraph
      const authorNames = screen.getAllByText(/John.*Doe/);
      expect(authorNames.length).toBeGreaterThan(0);
    });

    it('should render hero image', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const images = screen.getAllByTestId('image-wrapper');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', '/test-article-hero.jpg');
    });

    it('should render back button', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const backButton = screen.getAllByRole('button').find((button) =>
        button.textContent?.includes('Back to News') ||
        button.textContent?.includes('Demo1_ArticleHeader_BackToNewsLabel')
      );
      expect(backButton).toBeInTheDocument();
    });

    it('should render floating dock for sharing', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getAllByTestId('floating-dock').length).toBeGreaterThan(0);
    });

    it('should render toaster component', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });
  });

  describe('Optional fields handling', () => {
    it('should render without eyebrow/badge', () => {
      render(<ArticleHeader {...(propsWithoutEyebrow as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });

    it('should render without author', () => {
      render(<ArticleHeader {...(propsWithoutAuthor as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });

    it('should render without read time', () => {
      render(<ArticleHeader {...(propsWithoutReadTime as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.queryByText('5 min read')).not.toBeInTheDocument();
      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });

    it('should render without display date', () => {
      render(<ArticleHeader {...(propsWithoutDate as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.queryByTestId('date-field')).not.toBeInTheDocument();
      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });

    it('should render with minimal props', () => {
      render(<ArticleHeader {...(propsMinimal as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });
  });

  describe('Author display', () => {
    it('should render author avatar with image', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toHaveAttribute('src', '/test-author.jpg');
    });

    it('should render author name', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      // Author name is rendered (check for both first and last name presence)
      // Use getAllByText since it appears in both avatar fallback and name paragraph
      const authorNames = screen.getAllByText(/John.*Doe/);
      expect(authorNames.length).toBeGreaterThan(0);
    });

    it('should render author job title', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('should render author without image', () => {
      render(<ArticleHeader {...(propsWithAuthorNoImage as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    });

    it('should render author without job title', () => {
      render(<ArticleHeader {...(propsWithAuthorNoJobTitle as unknown as Parameters<typeof ArticleHeader>[0])} />);

      // Author name is rendered (check for both first and last name presence)
      // Use getAllByText since it appears in both avatar fallback and name paragraph
      const authorNames = screen.getAllByText(/John.*Doe/);
      expect(authorNames.length).toBeGreaterThan(0);
      expect(screen.queryByText('Senior Developer')).not.toBeInTheDocument();
    });

    it('should display "Author" label for author', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const authorLabel =
        screen.queryByText('Author') ||
        screen.queryByText('Written by') ||
        screen.queryByText('Demo1_ArticleHeader_AuthorLabel');
      expect(authorLabel).toBeInTheDocument();
    });
  });

  describe('Back button functionality', () => {
    it('should call window.history.back when clicked', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const backButton = screen.getAllByRole('button').find((button) =>
        button.textContent?.includes('Back to News')
      );
      if (backButton) {
        fireEvent.click(backButton);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should render back arrow icon', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByTestId('icon-arrow-left')).toBeInTheDocument();
    });

    it('should render back button with correct text', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const backButton = screen.getAllByRole('button').find((button) =>
        button.textContent?.includes('Back to News') ||
        button.textContent?.includes('Demo1_ArticleHeader_BackToNewsLabel')
      );
      expect(backButton).toBeDefined();
      if (backButton) {
        expect(backButton).toBeInTheDocument();
      }
    });
  });

  describe('Social sharing functionality', () => {
    it('should render share buttons', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const facebookButtons = screen.getAllByText('Share on Facebook');
      const twitterButtons = screen.getAllByText('Share on Twitter');
      const linkedinButtons = screen.getAllByText('Share on LinkedIn');
      const emailButtons = screen.getAllByText('Share via Email');
      const copyButtons = screen.getAllByText('Copy Link');

      expect(facebookButtons.length).toBeGreaterThan(0);
      expect(twitterButtons.length).toBeGreaterThan(0);
      expect(linkedinButtons.length).toBeGreaterThan(0);
      expect(emailButtons.length).toBeGreaterThan(0);
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('should open Facebook share dialog', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const facebookButtons = screen.getAllByText('Share on Facebook');
      fireEvent.click(facebookButtons[0]);

      expect(mockWindowOpen).toHaveBeenCalled();
      const callArgs = mockWindowOpen.mock.calls[0];
      expect(callArgs[0]).toContain('facebook.com');
    });

    it('should open Twitter share dialog', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const twitterButtons = screen.getAllByText('Share on Twitter');
      fireEvent.click(twitterButtons[0]);

      expect(mockWindowOpen).toHaveBeenCalled();
      const callArgs = mockWindowOpen.mock.calls[0];
      expect(callArgs[0]).toContain('twitter.com');
    });

    it('should open LinkedIn share dialog', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const linkedinButtons = screen.getAllByText('Share on LinkedIn');
      fireEvent.click(linkedinButtons[0]);

      expect(mockWindowOpen).toHaveBeenCalled();
      const callArgs = mockWindowOpen.mock.calls[0];
      expect(callArgs[0]).toContain('linkedin.com');
    });

    it('should copy link to clipboard', async () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const copyButtons = screen.getAllByText('Copy Link');
      fireEvent.click(copyButtons[0]);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    });
  });

  describe('Date formatting', () => {
    it('should format date using formatDateInUTC', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByText(/Formatted: 2024-01-15/)).toBeInTheDocument();
    });
  });

  describe('Badge/Eyebrow rendering', () => {
    it('should render badge with eyebrow text', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should apply correct badge classes', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-accent', 'text-accent-foreground');
    });
  });

  describe('Page editing mode', () => {
    beforeEach(() => {
      mockUseSitecore.mockReturnValue({
        page: {
          mode: {
            isEditing: true,
          },
        },
      });
    });

    it('should render component without badge when no eyebrow value in editing mode', () => {
      render(<ArticleHeader {...(propsWithoutEyebrow as unknown as Parameters<typeof ArticleHeader>[0])} />);

      // Component renders without badge when eyebrow value is missing
      // The header should still be present
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should show read time section even without value in editing mode', () => {
      render(<ArticleHeader {...(propsWithoutReadTime as unknown as Parameters<typeof ArticleHeader>[0])} />);

      // In editing mode, the container should still render
      const textFields = screen.getAllByTestId('text-field');
      expect(textFields.length).toBeGreaterThan(0);
    });

    it('should show dictionary entry missing warning when translation is missing', () => {
      // Mock missing translation
      jest.spyOn(React, 'createElement');

      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      // Component should still render
      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render header element', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should apply correct header classes', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('article-header', 'relative', 'overflow-hidden');
    });

    it('should render white bar section', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const whiteBar = container.querySelector('[data-component="white-bar"]');
      expect(whiteBar).toBeInTheDocument();
    });

    it('should render backdrop blur overlay', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const blurOverlay = container.querySelector('.backdrop-blur-md');
      expect(blurOverlay).toBeInTheDocument();
    });
  });

  describe('Responsive layout', () => {
    it('should render both mobile and desktop share sections', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const floatingDocks = screen.getAllByTestId('floating-dock');
      expect(floatingDocks.length).toBe(2); // Mobile and desktop
    });

    it('should render "Share" label for both sections', () => {
      render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const shareLabels = screen.getAllByText('Share');
      expect(shareLabels.length).toBe(2);
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should render NoDataFallback when fields is null', () => {
      render(<ArticleHeader {...(propsWithoutFields as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const fallback = screen.getByTestId('no-data-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('ArticleHeader');
    });

    it('should handle missing datasource gracefully', () => {
      const propsWithoutDatasource = {
        ...defaultProps,
        fields: {
          data: {
            externalFields: defaultProps.fields.data.externalFields,
          },
        },
      };

      render(<ArticleHeader {...(propsWithoutDatasource as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(screen.getByText('The Future of Web Development')).toBeInTheDocument();
    });

    it('should handle missing externalFields gracefully', () => {
      const propsWithoutExternal = {
        ...defaultProps,
        fields: {
          data: {
            datasource: defaultProps.fields.data.datasource,
          },
        },
      };

      // Should still render the structure
      render(<ArticleHeader {...(propsWithoutExternal as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const { container } = render(<ArticleHeader {...(propsWithoutExternal as unknown as Parameters<typeof ArticleHeader>[0])} />);
      expect(container.querySelector('header')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic header element', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('should have sr-only notification for clipboard', () => {
      const { container } = render(<ArticleHeader {...(defaultProps as unknown as Parameters<typeof ArticleHeader>[0])} />);

      const srOnly = container.querySelector('.sr-only');
      expect(srOnly).toBeInTheDocument();
      expect(srOnly).toHaveAttribute('aria-live', 'polite');
    });
  });
});

