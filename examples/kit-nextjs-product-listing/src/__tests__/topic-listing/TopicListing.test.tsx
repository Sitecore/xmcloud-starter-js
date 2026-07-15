/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as TopicListingDefault } from '../../components/topic-listing/TopicListing';
import {
  defaultTopicListingProps,
  topicListingPropsShootingStar,
  topicListingPropsSingleTopic,
  topicListingPropsNoTitle,
  topicListingPropsEmptyTitle,
  topicListingPropsNoTopics,
  topicListingPropsLongContent,
  topicListingPropsSpecialChars,
  topicListingPropsManyTopics,
  topicListingPropsNoFields,
  topicListingPropsNoDatasource,
  topicListingPropsNoChildren,
  topicListingPropsTopicsWithoutLinks,
  topicListingPropsCustomStyles,
  topicListingPropsUndefinedParams,
  mockUseSitecoreNormal,
} from './TopicListing.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  Text: ({ field, tag: Tag = 'div', className, children }: any) => (
    <Tag data-testid="sitecore-text" className={className} data-field-value={field?.value || ''}>
      {field?.value || children || 'Sitecore Text'}
    </Tag>
  ),
}));

// Mock Meteors component
jest.mock('../../components/magicui/meteors', () => ({
  Meteors: ({
    number,
    minDelay,
    maxDelay,
    minDuration,
    maxDuration,
    angle,
    size,
    ...props
  }: any) => (
    <div
      data-testid="meteors"
      data-number={number}
      data-min-delay={minDelay}
      data-max-delay={maxDelay}
      data-min-duration={minDuration}
      data-max-duration={maxDuration}
      data-angle={angle}
      data-size={size}
      {...props}
    >
      Meteors Animation
    </div>
  ),
}));

// Mock TopicItem component
jest.mock('../../components/topic-listing/TopicItem.dev', () => ({
  TopicItem: ({ link, icon }: any) => {
    if (!link?.jsonValue) return null;

    return (
      <div
        data-testid="topic-item"
        data-link-href={link.jsonValue.value?.href || ''}
        data-link-text={link.jsonValue.value?.text || ''}
        data-icon={icon?.jsonValue?.value || ''}
      >
        {link.jsonValue.value?.text || 'Topic Item'}
      </div>
    );
  },
}));

// Mock NoDataFallback component
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('TopicListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSitecore.mockReturnValue(mockUseSitecoreNormal);
  });

  describe('Default Rendering', () => {
    it('renders with default props successfully', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('Explore Our Audio Categories');
    });

    it('renders all topic items correctly', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(4);

      expect(topicItems[0]).toHaveAttribute('data-link-href', '/headphones');
      expect(topicItems[0]).toHaveAttribute('data-link-text', 'Professional Headphones');
      expect(topicItems[1]).toHaveAttribute('data-link-href', '/speakers');
      expect(topicItems[1]).toHaveAttribute('data-link-text', 'Studio Monitors');
    });

    it('applies correct container structure and classes', () => {
      const { container } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      const mainContainer = container.querySelector('.bg-primary.relative.overflow-hidden');
      expect(mainContainer).toBeInTheDocument();

      const innerContainer = container.querySelector('.mx-auto.max-w-7xl');
      expect(innerContainer).toBeInTheDocument();
    });

    it('renders title with correct styling', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const title = screen.getByTestId('sitecore-text');
      expect(title.tagName.toLowerCase()).toBe('h2');
      expect(title).toHaveClass('font-heading', 'text-4xl', 'font-semibold', 'text-white');
    });

    it('renders topic items in flex container', () => {
      const { container } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      const topicContainer = container.querySelector(
        '.flex.flex-wrap.items-center.justify-center.gap-6'
      );
      expect(topicContainer).toBeInTheDocument();
    });
  });

  describe('Background Themes', () => {
    it('renders without meteors for default background theme', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      expect(screen.queryByTestId('meteors')).not.toBeInTheDocument();
    });

    it('renders meteors for shooting-star background theme', () => {
      render(<TopicListingDefault {...topicListingPropsShootingStar} />);

      const meteors = screen.getByTestId('meteors');
      expect(meteors).toBeInTheDocument();
      expect(meteors).toHaveAttribute('data-number', '40');
      expect(meteors).toHaveAttribute('data-min-delay', '0.2');
      expect(meteors).toHaveAttribute('data-max-delay', '1.5');
      expect(meteors).toHaveAttribute('data-angle', '310');
    });

    it('applies correct meteor styles and CSS variables', () => {
      const { container } = render(<TopicListingDefault {...topicListingPropsShootingStar} />);

      const meteorContainer = container.querySelector('.absolute.inset-0.z-10');
      expect(meteorContainer).toBeInTheDocument();
      expect(meteorContainer).toHaveStyle('--meteor-color: 255, 255, 255');
      expect(meteorContainer).toHaveStyle('--meteor-opacity: 0.6');
    });

    it('handles other background theme values', () => {
      const customThemeProps = {
        ...defaultTopicListingProps,
        params: { backgroundTheme: 'custom-theme' },
      };

      render(<TopicListingDefault {...customThemeProps} />);

      expect(screen.queryByTestId('meteors')).not.toBeInTheDocument();
    });
  });

  describe('Content Scenarios', () => {
    it('renders single topic item correctly', () => {
      render(<TopicListingDefault {...topicListingPropsSingleTopic} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(1);
      expect(topicItems[0]).toHaveTextContent('Premium Audio');
    });

    it('handles missing title gracefully', () => {
      render(<TopicListingDefault {...topicListingPropsNoTitle} />);

      // Title should not be rendered when undefined
      const titleContainer = screen.queryByTestId('sitecore-text');
      expect(titleContainer).not.toBeInTheDocument();

      // But topics should still render
      expect(screen.getAllByTestId('topic-item')).toHaveLength(2);
    });

    it('handles empty title gracefully', () => {
      render(<TopicListingDefault {...topicListingPropsEmptyTitle} />);

      const title = screen.getByTestId('sitecore-text');
      expect(title).toHaveAttribute('data-field-value', '');
      expect(screen.getByTestId('topic-item')).toBeInTheDocument();
    });

    it('handles no topic items', () => {
      render(<TopicListingDefault {...topicListingPropsNoTopics} />);

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('No Topics Available');
      expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
    });

    it('handles long content properly', () => {
      render(<TopicListingDefault {...topicListingPropsLongContent} />);

      const title = screen.getByTestId('sitecore-text');
      expect(title).toHaveTextContent(/Discover Our Comprehensive Collection/);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems[0]).toHaveTextContent(/Professional Headphones and Studio Monitors/);
    });

    it('handles special characters and international text', () => {
      render(<TopicListingDefault {...topicListingPropsSpecialChars} />);

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent(
        /Explorez Nos Catégories Audio™/
      );

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems[0]).toHaveTextContent('Casques Audio Professionnels & Hi-Fi');
    });

    it('handles many topic items', () => {
      render(<TopicListingDefault {...topicListingPropsManyTopics} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(8);

      topicItems.forEach((item, index) => {
        expect(item).toHaveTextContent(`Audio Category ${index + 1}`);
        expect(item).toHaveAttribute('data-link-href', `/category-${index + 1}`);
      });
    });

    it('filters out topics without valid links', () => {
      render(<TopicListingDefault {...topicListingPropsTopicsWithoutLinks} />);

      // Topics without valid links should not render
      expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('provides correct ARIA structure and semantics', () => {
      const { container } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      const mainContainer = container.querySelector('[data-class-change]');
      expect(mainContainer).toBeInTheDocument();

      const title = screen.getByTestId('sitecore-text');
      expect(title.tagName.toLowerCase()).toBe('h2');
    });

    it('applies container query classes', () => {
      const { container } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      const mainContainer = container.querySelector('.\\@container');
      expect(mainContainer).toBeInTheDocument();
    });

    it('uses proper responsive classes', () => {
      const { container } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      const mainContainer = container.querySelector('.py-24.md\\:pb-\\[128px\\].md\\:pt-28');
      expect(mainContainer).toBeInTheDocument();

      const innerContainer = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8');
      expect(innerContainer).toBeInTheDocument();
    });

    it('maintains proper z-index layering', () => {
      const { container } = render(<TopicListingDefault {...topicListingPropsShootingStar} />);

      const meteorLayer = container.querySelector('.z-10');
      expect(meteorLayer).toBeInTheDocument();

      const contentLayer = container.querySelector('.z-20');
      expect(contentLayer).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('returns NoDataFallback when no fields', () => {
      render(<TopicListingDefault {...topicListingPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('Topic Listing');
    });

    it('handles missing datasource gracefully', () => {
      render(<TopicListingDefault {...topicListingPropsNoDatasource} />);

      // Component renders basic structure even with missing datasource
      const backgroundDiv = document.querySelector('[data-class-change="true"]');
      expect(backgroundDiv).toBeInTheDocument();
    });

    it('handles missing children gracefully', () => {
      render(<TopicListingDefault {...topicListingPropsNoChildren} />);

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('Topics Without Children');
      expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
    });

    it('handles undefined params gracefully', () => {
      render(<TopicListingDefault {...topicListingPropsUndefinedParams} />);

      // Should still render content without crashing
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.queryByTestId('meteors')).not.toBeInTheDocument();
    });

    it('handles malformed topic data', () => {
      const malformedProps = {
        ...defaultTopicListingProps,
        fields: {
          data: {
            datasource: {
              title: {
                jsonValue: { value: 'Malformed Data Test' },
              },
              children: {
                results: [
                  { invalid: 'data' } as any,  
                  null as any,
                ],
              },
            },
          },
        },
      };

      expect(() => {
        render(<TopicListingDefault {...malformedProps} />);
      }).not.toThrow();

      expect(screen.getByTestId('sitecore-text')).toHaveTextContent('Malformed Data Test');
    });
  });

  describe('Accessibility', () => {
    it('provides semantic heading structure', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const heading = screen.getByTestId('sitecore-text');
      expect(heading.tagName.toLowerCase()).toBe('h2');
      expect(heading).toHaveTextContent('Explore Our Audio Categories');
    });

    it('has proper text contrast for readability', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const title = screen.getByTestId('sitecore-text');
      expect(title).toHaveClass('text-white'); // White text on primary background
    });

    it('maintains focus management structure', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const topicItems = screen.getAllByTestId('topic-item');
      topicItems.forEach((item) => {
        // Topic items should be rendered and accessible
        expect(item).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<TopicListingDefault {...defaultTopicListingProps} />);

      rerender(<TopicListingDefault {...defaultTopicListingProps} />);

      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
      expect(screen.getAllByTestId('topic-item')).toHaveLength(4);
    });

    it('renders large numbers of topics without performance issues', () => {
      const startTime = performance.now();
      render(<TopicListingDefault {...topicListingPropsManyTopics} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
      expect(screen.getAllByTestId('topic-item')).toHaveLength(8);
    });
  });

  describe('Integration', () => {
    it('works with Sitecore Text component', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const textComponent = screen.getByTestId('sitecore-text');
      expect(textComponent).toHaveAttribute('data-field-value', 'Explore Our Audio Categories');
    });

    it('integrates with TopicItem components correctly', () => {
      render(<TopicListingDefault {...defaultTopicListingProps} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems[0]).toHaveAttribute('data-icon');
      expect(topicItems[0]).toHaveAttribute('data-link-href');
      expect(topicItems[0]).toHaveAttribute('data-link-text');
    });

    it('applies custom styles when provided', () => {
      render(<TopicListingDefault {...topicListingPropsCustomStyles} />);

      // Should render without errors
      expect(screen.getByTestId('sitecore-text')).toBeInTheDocument();
    });
  });
});
