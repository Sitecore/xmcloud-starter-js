import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopicItem } from '@/components/topic-listing/TopicItem.dev';
import { mockSingleTopicItem, mockTopicItemWithoutLink } from './topic-listing.mock.props';

// Mock ButtonBase
jest.mock('@/components/button-component/ButtonComponent', () => ({
  ButtonBase: ({
    buttonLink,
    icon,
    variant,
    iconPosition,
  }: {
    buttonLink: { value: { href: string; text: string } };
    icon: { value: string };
    variant: string;
    iconPosition: string;
    iconClassName?: string;
  }) => (
    <button
      data-testid="button-base"
      data-href={buttonLink?.value?.href}
      data-icon={icon?.value}
      data-variant={variant}
      data-icon-position={iconPosition}
    >
      {buttonLink?.value?.text}
    </button>
  ),
}));

describe('TopicItem', () => {
  it('renders topic item with button and icon', () => {
    render(<TopicItem {...mockSingleTopicItem} />);

    const button = screen.getByTestId('button-base');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Type I Ambulance');
    expect(button).toHaveAttribute('data-href', '/vehicles/type-1-ambulance');
    expect(button).toHaveAttribute('data-icon', 'arrow-up-right');
  });

  it('applies correct button variant and icon position', () => {
    render(<TopicItem {...mockSingleTopicItem} />);

    const button = screen.getByTestId('button-base');
    expect(button).toHaveAttribute('data-variant', 'topic');
    expect(button).toHaveAttribute('data-icon-position', 'leading');
  });

  it('returns null when no link is provided', () => {
    const { container } = render(<TopicItem {...mockTopicItemWithoutLink} />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('button-base')).not.toBeInTheDocument();
  });
});
