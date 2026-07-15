import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as TopicListing } from '@/components/topic-listing/TopicListing';
import {
  mockTopicListingProps,
  mockTopicListingPropsWithoutChildren,
} from './topic-listing.mock.props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: jest.fn(({ field, tag = 'span' }) => {
    const Tag = tag as keyof JSX.IntrinsicElements;
    return React.createElement(Tag, { 'data-testid': 'text-field' }, field?.value);
  }),
}));

// Mock Meteors component
jest.mock('@/components/magicui/meteors', () => ({
  Meteors: ({
    number,
    minDelay,
    maxDelay,
  }: {
    number: number;
    minDelay: number;
    maxDelay: number;
    minDuration?: number;
    maxDuration?: number;
    angle?: number;
    size?: string;
  }) => (
    <div
      data-testid="meteors"
      data-number={number}
      data-min-delay={minDelay}
      data-max-delay={maxDelay}
    />
  ),
}));

// Mock TopicItem
jest.mock('@/components/topic-listing/TopicItem.dev', () => ({
  TopicItem: ({
    link,
    icon,
  }: {
    link?: { jsonValue?: { value: { text: string; href: string } } };
    icon: { jsonValue: { value: string } };
  }) => (
    <div data-testid="topic-item" data-icon={icon?.jsonValue?.value}>
      {link?.jsonValue?.value?.text}
    </div>
  ),
}));

// Mock NoDataFallback
jest.mock('@/utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">No data for {componentName}</div>
  ),
}));

describe('TopicListing', () => {
  it('renders topic listing with title and topic items', () => {
    render(<TopicListing {...mockTopicListingProps} />);

    expect(screen.getByTestId('text-field')).toHaveTextContent(
      'Explore Our Emergency Vehicle Solutions'
    );

    const topicItems = screen.getAllByTestId('topic-item');
    expect(topicItems).toHaveLength(4);
    expect(topicItems[0]).toHaveTextContent('Emergency Ambulances');
    expect(topicItems[1]).toHaveTextContent('Fire & Rescue');
  });

  it('renders meteors background effect', () => {
    render(<TopicListing {...mockTopicListingProps} />);

    const meteors = screen.getByTestId('meteors');
    expect(meteors).toBeInTheDocument();
    expect(meteors).toHaveAttribute('data-number', '40');
  });

  it('renders without children when no topics provided', () => {
    render(<TopicListing {...mockTopicListingPropsWithoutChildren} />);

    expect(screen.getByTestId('text-field')).toHaveTextContent('Vehicle Categories');
    expect(screen.queryByTestId('topic-item')).not.toBeInTheDocument();
  });

  it('renders NoDataFallback when no fields provided', () => {
    const propsWithoutFields = {
      ...mockTopicListingProps,
      fields: null,
    };

    // @ts-expect-error Testing no fields scenario
    render(<TopicListing {...propsWithoutFields} />);

    expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
    expect(screen.getByText('No data for Topic Listing')).toBeInTheDocument();
  });
});
