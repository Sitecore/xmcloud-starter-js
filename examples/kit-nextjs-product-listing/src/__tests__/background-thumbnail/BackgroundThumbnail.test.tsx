import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as BackgroundThumbnailDefault } from '../../components/background-thumbnail/BackgroundThumbnail.dev';
import {
  defaultBackgroundThumbnailProps,
  mockUseSitecoreEditing,
  mockUseSitecoreNormal,
  mockPageEditing,
  mockPageNormal,
} from './BackgroundThumbnail.mockProps';

// Mock the Sitecore Content SDK
import { useSitecore } from '@sitecore-content-sdk/nextjs';
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(),
}));

// Mock the Badge component
jest.mock('../../components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>
      {children}
    </span>
  ),
}));

// Mock cn utility
jest.mock('../../lib/utils', () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' '),
}));

describe('BackgroundThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the badge and children in editing mode', () => {
    // Mock useSitecore to return editing mode
    (useSitecore as jest.Mock).mockReturnValue(mockUseSitecoreEditing);

    render(
      <BackgroundThumbnailDefault
        {...defaultBackgroundThumbnailProps}
        page={mockPageEditing}
      />
    );

    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('Update Background')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });

  it('renders nothing in non-editing mode', () => {
    // Mock useSitecore to return non-editing mode
    (useSitecore as jest.Mock).mockReturnValue(mockUseSitecoreNormal);

    const { container } = render(
      <BackgroundThumbnailDefault
        {...defaultBackgroundThumbnailProps}
        page={mockPageNormal}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
