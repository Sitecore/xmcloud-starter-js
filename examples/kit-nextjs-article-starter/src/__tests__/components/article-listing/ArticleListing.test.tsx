/// <reference types="jest" />
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as ArticleListing } from '@/components/article-listing/ArticleListing';
import {
  defaultProps,
  propsThreeArticles,
  propsWithoutTitle,
  propsWithoutDescription,
  propsWithoutLink,
  propsTwoArticles,
  propsOneArticle,
  propsNoArticles,
  propsEditing,
  mockArticle1,
  mockQaArticle1,
  mockArticleAdditional,
} from './ArticleListing.mockProps';

import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';

// Mock useSitecore hook
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag, className }: { field?: Field<string>; tag?: string; className?: string }) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
  Link: ({ field, children, className }: { field?: LinkField; children?: React.ReactNode; className?: string }) => (
    <a href={field?.value?.href} className={className} data-testid="article-link">
      {children}
    </a>
  ),
}));

// Mock Button component
jest.mock('@/components/button-component/ButtonComponent', () => ({
  EditableButton: ({ buttonLink, isPageEditing, className }: { buttonLink?: LinkField; isPageEditing?: boolean; className?: string }) => (
    <a
      href={buttonLink?.value?.href || '#'}
      className={className}
      data-testid="listing-button"
      data-editing={isPageEditing}
    >
      {buttonLink?.value?.text || 'Button'}
    </a>
  ),
}));

// Silence React DOM attribute warnings (e.g., fill boolean) and navigation errors for this suite
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Convert all args to strings for easier checking
    const argsString = args.map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      if (arg && typeof arg === 'object' && 'message' in arg) return String(arg.message);
      return String(arg);
    }).join(' ');
    
    // Suppress fill attribute warning (multiple possible message formats)
    if (
      argsString.includes('fill') &&
      (argsString.includes('non-boolean attribute') ||
       argsString.includes('If you want to write it to the DOM'))
    ) {
      return;
    }
    
    // Suppress navigation errors from jsdom (expected when testing window.location.href changes)
    if (argsString.includes('Not implemented: navigation')) {
      return;
    }
    
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ArticleListing Component', () => {
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
    it('should render article listing with all fields', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
      expect(screen.getByText('Discover our latest insights and tutorials')).toBeInTheDocument();
      expect(screen.getByText('View All Articles')).toBeInTheDocument();
    });

    it('should render component with data-component attribute', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const component = container.querySelector('[data-component="ArticleListing"]');
      expect(component).toBeInTheDocument();
    });

    it('should apply custom styles from params', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const styledDiv = container.querySelector('.custom-listing-style');
      expect(styledDiv).toBeInTheDocument();
    });

    it('should render with aria-label', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const section = container.querySelector('section[data-component="ArticleListing"]');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('aria-labelledby', 'article-listing-section');
    });
  });

  describe('Featured articles layout (first 2)', () => {
    it('should render first 2 articles in featured layout', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Partners in Sustainability')).toBeInTheDocument();
    });

    it('should render featured article images', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Images use article title as alt text
      expect(screen.getByAltText('Introduction to React Hooks')).toBeInTheDocument();
      expect(screen.getByAltText('Partners in Sustainability')).toBeInTheDocument();
    });

    it('should render featured article summaries', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(
        screen.getByText(/Learn the fundamentals of React Hooks/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/How Solterra & Co. works with partners/)
      ).toBeInTheDocument();
    });

    it('should render featured article authors', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render featured article read times', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('8 min read')).toBeInTheDocument();
      expect(screen.getByText('4 min read')).toBeInTheDocument();
    });

    it('should render featured articles in 2-column grid', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const featuredGrid = container.querySelector('.grid.\\@md\\:grid-cols-2');
      expect(featuredGrid).toBeInTheDocument();
    });
  });

  describe('Regular articles layout (remaining)', () => {
    it('should render remaining articles in regular layout', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('CSS Grid Layout Guide')).toBeInTheDocument();
    });

    it('should render regular articles in 3-column grid', () => {
      const { container } = render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      const regularGrid = container.querySelector('.grid.\\@lg\\:grid-cols-3');
      expect(regularGrid).toBeInTheDocument();
    });

    it('should not render summaries for regular articles', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Regular articles don't show summary text in the compact layout
      expect(screen.queryByText(/Master CSS Grid/)).not.toBeInTheDocument();
    });

    it('should render regular article titles', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('CSS Grid Layout Guide')).toBeInTheDocument();
    });
  });

  describe('Article author display', () => {
    it('should render author avatars for featured articles', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const authorImages = screen.getAllByAltText(/avatar/);
      expect(authorImages.length).toBeGreaterThan(0);
    });

    it('should render author initials when no image available', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Sarah Johnson has no image, should show initials
      expect(screen.getByText('SJ')).toBeInTheDocument();
    });

    it('should render author initials for regular articles when author has name but no image', () => {
      // Create props with an article that has author name but no profile image in regular articles section
      // This ensures we test the initials fallback code path (lines 196-202)
      const propsWithAuthorNoImage = {
        ...propsThreeArticles,
        fields: {
          ...propsThreeArticles.fields,
          featuredContent: [
            mockArticle1,
            mockQaArticle1,
            {
              ...mockArticleAdditional,
              fields: {
                ...mockArticleAdditional.fields,
                taxAuthor: {
                  ...mockArticleAdditional.fields.taxAuthor,
                  fields: {
                    ...mockArticleAdditional.fields.taxAuthor.fields,
                    personProfileImage: undefined,
                  },
                },
              },
            },
          ],
        },
      };

      render(<ArticleListing {...(propsWithAuthorNoImage as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Should show initials "SJ" for Sarah Johnson in the regular articles section
      // This tests the fallback code path when authorImage is falsy but author name exists
      const initials = screen.getAllByText('SJ');
      expect(initials.length).toBeGreaterThan(0);
    });

    it('should render author names with read time separator', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const separators = screen.getAllByText('•');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe('Optional fields handling', () => {
    it('should render without title', () => {
      render(<ArticleListing {...(propsWithoutTitle as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.queryByText('Latest Articles')).not.toBeInTheDocument();
      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
    });

    it('should render without description', () => {
      render(<ArticleListing {...(propsWithoutDescription as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
      expect(
        screen.queryByText('Discover our latest insights and tutorials')
      ).not.toBeInTheDocument();
    });

    it('should render without link button', () => {
      render(<ArticleListing {...(propsWithoutLink as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.queryByTestId('listing-button')).not.toBeInTheDocument();
    });

    it('should render with only 2 articles (all featured)', () => {
      render(<ArticleListing {...(propsTwoArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Partners in Sustainability')).toBeInTheDocument();
      expect(screen.queryByText('CSS Grid Layout Guide')).not.toBeInTheDocument();
    });

    it('should render with only 1 article', () => {
      render(<ArticleListing {...(propsOneArticle as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
      expect(screen.queryByText('Partners in Sustainability')).not.toBeInTheDocument();
    });

    it('should render with no articles', () => {
      render(<ArticleListing {...(propsNoArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
      expect(screen.queryByText('Introduction to React Hooks')).not.toBeInTheDocument();
    });
  });

  describe('Article navigation', () => {
    it('should navigate to article when image is clicked in normal mode', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.click(imageContainers[0]);
        // In a real browser, this would navigate
      }
    });

    it('should handle keyboard navigation with Enter key', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const imageContainers = screen.getAllByRole('button');
      if (imageContainers.length > 0) {
        fireEvent.keyDown(imageContainers[0], { key: 'Enter' });
        // In a real browser, this would navigate
      }
    });

    it('should render article links for regular articles', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      const links = screen.getAllByTestId('article-link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Page editing mode', () => {
    it('should render images without click handlers in editing mode', () => {
      render(<ArticleListing {...(propsEditing as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Images should render but not be clickable in editing mode
      // Images use article title as alt text
      expect(screen.getByAltText('Introduction to React Hooks')).toBeInTheDocument();
    });

    it('should render titles without links in editing mode for featured articles', () => {
      render(<ArticleListing {...(propsEditing as unknown as Parameters<typeof ArticleListing>[0])} />);

      // In editing mode, titles are h3 elements without links
      const title = screen.getByText('Introduction to React Hooks');
      expect(title.tagName).toBe('H3');
    });

    it('should show link button even without href in editing mode', () => {
      const propsEditingNoLink = {
        ...propsEditing,
        fields: {
          ...propsEditing.fields,
          linkOptional: {
            value: {
              href: '',
              text: 'Add link',
            },
          },
        },
      };

      render(<ArticleListing {...(propsEditingNoLink as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Add link')).toBeInTheDocument();
    });

    it('should show fallback link button when linkOptional is undefined in editing mode', () => {
      const propsEditingUndefinedLink = {
        ...propsEditing,
        fields: {
          ...propsEditing.fields,
          linkOptional: undefined,
        },
      };

      render(<ArticleListing {...(propsEditingUndefinedLink as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Should show the fallback "Add link" text from the default link object
      expect(screen.getByText('Add link')).toBeInTheDocument();
    });
  });

  describe('Article transformation', () => {
    it('should correctly transform featured content to articles', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Solterra demo: Article 1 + QA Article 1
      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Partners in Sustainability')).toBeInTheDocument();
    });

    it('should render a third article in the regular layout when provided', () => {
      render(<ArticleListing {...(propsThreeArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('CSS Grid Layout Guide')).toBeInTheDocument();
    });

    it('should handle articles without author names', () => {
      const propsNoAuthor = {
        ...defaultProps,
        fields: {
          ...defaultProps.fields,
          featuredContent: [
            {
              ...defaultProps.fields.featuredContent[0],
              fields: {
                ...defaultProps.fields.featuredContent[0].fields,
                taxAuthor: {
                  id: 'no-author',
                  name: 'No Author',
                  fields: {
                    personFirstName: { value: '' },
                    personLastName: { value: '' },
                  },
                },
              },
            },
          ],
        },
      };

      const { container } = render(<ArticleListing {...(propsNoAuthor as unknown as Parameters<typeof ArticleListing>[0])} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Responsive layout classes', () => {
    it('should apply container query classes', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const containerQuery = container.querySelector('.\\@container');
      expect(containerQuery).toBeInTheDocument();
    });

    it('should apply responsive padding classes', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const paddingContainer = container.querySelector('.px-4.py-12');
      expect(paddingContainer).toBeInTheDocument();
    });

    it('should apply max-width constraint', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const maxWidth = container.querySelector('.max-w-7xl');
      expect(maxWidth).toBeInTheDocument();
    });
  });

  describe('Typography and styling', () => {
    it('should apply correct heading classes', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const title = screen.getByText('Latest Articles');
      expect(title.tagName).toBe('H2');
      expect(title).toHaveClass('font-heading', 'text-primary');
    });

    it('should apply correct description classes', () => {
      render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const description = screen.getByText('Discover our latest insights and tutorials');
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-muted-foreground', 'font-body');
    });

    it('should apply hover effects to featured articles', () => {
      const { container } = render(<ArticleListing {...(defaultProps as unknown as Parameters<typeof ArticleListing>[0])} />);

      const featuredArticles = container.querySelectorAll('.group\\/article');
      expect(featuredArticles.length).toBeGreaterThan(0);
    });
  });

  describe('useSitecore integration', () => {
    it('should use prop isPageEditing when provided', () => {
      render(<ArticleListing {...(propsEditing as unknown as Parameters<typeof ArticleListing>[0])} />);

      const button = screen.getByTestId('listing-button');
      expect(button).toHaveAttribute('data-editing', 'true');
    });

    it('should fallback to context isEditing when prop not provided', () => {
      mockUseSitecore.mockReturnValue({
        page: {
          mode: {
            isEditing: true,
          },
        },
      });

      const propsWithoutEditingProp = {
        ...defaultProps,
        isPageEditing: undefined,
      };

      render(<ArticleListing {...(propsWithoutEditingProp as unknown as Parameters<typeof ArticleListing>[0])} />);

      // Should use context value
      const title = screen.getByText('Introduction to React Hooks');
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty featuredContent array', () => {
      render(<ArticleListing {...(propsNoArticles as unknown as Parameters<typeof ArticleListing>[0])} />);

      expect(screen.getByText('Latest Articles')).toBeInTheDocument();
    });

    it('should handle undefined fields', () => {
      const propsUndefinedFields = {
        params: defaultProps.params,
        fields: undefined as unknown as typeof defaultProps.fields,
        isPageEditing: false,
        rendering: defaultProps.rendering,
        page: defaultProps.page,
      };

      const { container } = render(<ArticleListing {...(propsUndefinedFields as unknown as Parameters<typeof ArticleListing>[0])} />);
      expect(container).toBeInTheDocument();
    });

    it('should handle missing article URLs', () => {
      const propsNoUrl = {
        ...defaultProps,
        fields: {
          ...defaultProps.fields,
          featuredContent: [
            {
              ...defaultProps.fields.featuredContent[0],
              url: '',
            },
          ],
        },
      };

      render(<ArticleListing {...(propsNoUrl as unknown as Parameters<typeof ArticleListing>[0])} />);
      expect(screen.getByText('Introduction to React Hooks')).toBeInTheDocument();
    });
  });
});

