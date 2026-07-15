import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as TopicListing } from '@/components/topic-listing/TopicListing';
import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithoutShootingStar,
  propsWithShootingStar,
  propsWithSingleTopic,
  propsWithoutTitle,
  propsWithEmptyTopics,
  propsWithoutChildren,
  propsWithoutFields,
  propsWithUndefinedFields,
  propsWithMixedTopics,
} from './TopicListing.mockProps';

// Type definitions for mock components
interface MockTextProps {
  field?: Field<string>;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}

interface MockMeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  size?: number;
}

interface MockTopicItemProps {
  link?: {
    jsonValue?: LinkField;
  };
}

interface MockNoDataFallbackProps {
  componentName?: string;
}

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag, className }: MockTextProps) => {
    const Tag = (tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { className, 'data-testid': 'text-field' }, field?.value || '');
  },
}));

// Mock Meteors component
jest.mock('@/components/magicui/meteors', () => ({
  Meteors: ({ number, minDelay, maxDelay, minDuration, maxDuration, angle, size }: MockMeteorsProps) => (
    <div
      data-testid="meteors"
      data-number={number?.toString()}
      data-min-delay={minDelay?.toString()}
      data-max-delay={maxDelay?.toString()}
      data-min-duration={minDuration?.toString()}
      data-max-duration={maxDuration?.toString()}
      data-angle={angle?.toString()}
      data-size={size?.toString()}
    >
      Meteors Effect
    </div>
  ),
}));

// Mock TopicItem component
jest.mock('@/components/topic-listing/TopicItem.dev', () => ({
  TopicItem: ({ link }: MockTopicItemProps) => (
    <div data-testid="topic-item">
      {link?.jsonValue?.value?.text as string | undefined || 'No Link'}
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: MockNoDataFallbackProps) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('TopicListing Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render topic listing with all topics', () => {
      render(<TopicListing {...defaultProps} />);

      expect(screen.getByText('Explore Our Topics')).toBeInTheDocument();
      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(4);
    });

    it('should render all topic names', () => {
      render(<TopicListing {...defaultProps} />);

      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Business')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });

    it('should render title in h2 tag', () => {
      render(<TopicListing {...defaultProps} />);

      const title = screen.getByText('Explore Our Topics');
      expect(title.tagName).toBe('H2');
    });

    it('should render with correct container structure', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('@container', 'bg-primary', 'text-primary-foreground');
    });
  });

  describe('Component structure', () => {
    it('should apply correct container classes', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        '@container',
        'bg-primary',
        'text-primary-foreground',
        'relative',
        'overflow-hidden',
        'py-24'
      );
    });

    it('should have data-class-change attribute', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveAttribute('data-class-change');
    });

    it('should apply responsive padding classes', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('py-24', 'md:pb-[128px]', 'md:pt-28');
    });

    it('should render with correct title classes', () => {
      render(<TopicListing {...defaultProps} />);

      const title = screen.getByText('Explore Our Topics');
      expect(title).toHaveClass(
        'font-heading',
        '@sm:text-5xl',
        '@md:text-6xl',
        '@lg:text-7xl',
        'text-4xl',
        'font-semibold'
      );
    });
  });

  describe('Shooting star background', () => {
    it('should render meteors when backgroundTheme is shooting-star', () => {
      render(<TopicListing {...propsWithShootingStar} />);

      expect(screen.getByTestId('meteors')).toBeInTheDocument();
    });

    it('should not render meteors when backgroundTheme is not shooting-star', () => {
      render(<TopicListing {...propsWithoutShootingStar} />);

      expect(screen.queryByTestId('meteors')).not.toBeInTheDocument();
    });

    it('should configure meteors with correct props', () => {
      render(<TopicListing {...propsWithShootingStar} />);

      const meteors = screen.getByTestId('meteors');
      expect(meteors).toHaveAttribute('data-number', '40');
      expect(meteors).toHaveAttribute('data-min-delay', '0.2');
      expect(meteors).toHaveAttribute('data-max-delay', '1.5');
      expect(meteors).toHaveAttribute('data-min-duration', '18');
      expect(meteors).toHaveAttribute('data-max-duration', '38');
      expect(meteors).toHaveAttribute('data-angle', '310');
      expect(meteors).toHaveAttribute('data-size', '3');
    });

    it('should apply CSS variables for meteor color and opacity', () => {
      const { container } = render(<TopicListing {...propsWithShootingStar} />);

      const meteorsContainer = container.querySelector('.absolute.inset-0.z-10');
      expect(meteorsContainer).toHaveStyle({
        '--meteor-color': '255, 255, 255',
        '--meteor-opacity': '0.6',
      });
    });
  });

  describe('Topics rendering', () => {
    it('should render single topic', () => {
      render(<TopicListing {...propsWithSingleTopic} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(1);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should render topics in flex container', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const topicsContainer = container.querySelector('.flex.flex-wrap.items-center.justify-center');
      expect(topicsContainer).toBeInTheDocument();
    });

    it('should apply gap between topics', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const topicsContainer = container.querySelector('.flex.flex-wrap');
      expect(topicsContainer).toHaveClass('gap-6');
    });
  });

  describe('Optional fields handling', () => {
    it('should render without title when empty', () => {
      render(<TopicListing {...propsWithoutTitle} />);

      const textFields = screen.getAllByTestId('text-field');
      const emptyTitle = textFields.find((el) => el.textContent === '');
      expect(emptyTitle).toBeInTheDocument();
    });

    it('should render without topics when array is empty', () => {
      render(<TopicListing {...propsWithEmptyTopics} />);

      expect(screen.getByText('Explore Our Topics')).toBeInTheDocument();
      expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
    });

    it('should handle missing children gracefully', () => {
      render(<TopicListing {...propsWithoutChildren} />);

      expect(screen.getByText('Explore Our Topics')).toBeInTheDocument();
      expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
    });

    it('should handle topics with mixed valid and invalid data', () => {
      render(<TopicListing {...propsWithMixedTopics} />);

      const topicItems = screen.getAllByTestId('topic-item');
      expect(topicItems).toHaveLength(3);
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should show NoDataFallback when fields is null', () => {
      render(<TopicListing {...propsWithoutFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Topic Listing')).toBeInTheDocument();
    });

    it('should show NoDataFallback when fields is undefined', () => {
      render(<TopicListing {...propsWithUndefinedFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByText('Topic Listing')).toBeInTheDocument();
    });
  });

  describe('Layout and positioning', () => {
    it('should apply max width and padding to inner container', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    });

    it('should apply relative z-index to content', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const contentContainer = container.querySelector('.relative.z-20');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should apply absolute z-index to meteors container', () => {
      const { container } = render(<TopicListing {...propsWithShootingStar} />);

      const meteorsContainer = container.querySelector('.absolute.inset-0.z-10');
      expect(meteorsContainer).toBeInTheDocument();
    });
  });

  describe('Content layout', () => {
    it('should center content horizontally', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const flexContainer = container.querySelector('.flex.flex-col.items-center');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should apply correct gaps between sections', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const flexContainer = container.querySelector('.flex.flex-col.items-center');
      expect(flexContainer).toHaveClass('gap-16', 'md:gap-24');
    });

    it('should apply max width to title container', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const titleContainer = container.querySelector('.max-w-4xl');
      expect(titleContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic heading for title', () => {
      render(<TopicListing {...defaultProps} />);

      const title = screen.getByText('Explore Our Topics');
      expect(title.tagName).toBe('H2');
    });

    it('should have proper text color for readability', () => {
      render(<TopicListing {...defaultProps} />);

      const title = screen.getByText('Explore Our Topics');
      expect(title).toHaveClass('text-white');
    });
  });

  describe('Theme and styling', () => {
    it('should apply primary background', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should have overflow hidden for background effects', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('overflow-hidden');
    });

    it('should center text content', () => {
      const { container } = render(<TopicListing {...defaultProps} />);

      const flexContainer = container.querySelector('.text-center');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});

