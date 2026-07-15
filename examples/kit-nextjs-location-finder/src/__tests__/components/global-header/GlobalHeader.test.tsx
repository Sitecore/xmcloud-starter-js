import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Default as GlobalHeader,
  Centered as GlobalHeaderCentered,
} from '@/components/global-header/GlobalHeader';
import { mockGlobalHeaderProps } from './global-header.mock.props';
import { Page } from '@sitecore-content-sdk/nextjs';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
    },
  })),
}));

// Mock child components
jest.mock('@/components/global-header/GlobalHeaderDefault.dev', () => ({
  GlobalHeaderDefault: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <header data-testid="global-header-default">
      GlobalHeaderDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </header>
  ),
}));

jest.mock('@/components/global-header/GlobalHeaderCentered.dev', () => ({
  GlobalHeaderCentered: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <header data-testid="global-header-centered">
      GlobalHeaderCentered - {isPageEditing ? 'Editing' : 'Normal'}
    </header>
  ),
}));

describe('GlobalHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the default variant without crashing', () => {
    render(<GlobalHeader {...mockGlobalHeaderProps} />);
    expect(screen.getByTestId('global-header-default')).toBeInTheDocument();
    expect(screen.getByText(/Normal/)).toBeInTheDocument();
  });

  it('passes isPageEditing prop correctly in editing mode', () => {
    const mockPageEditing = {
      mode: {
        isEditing: true,
        isPreview: false,
        isNormal: false,
        name: 'edit' as const,
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

    render(
      <GlobalHeader
        {...mockGlobalHeaderProps}
        page={mockPageEditing}
      />
    );
    expect(screen.getByText(/Editing/)).toBeInTheDocument();
  });

  it('renders the centered variant correctly', () => {
    render(<GlobalHeaderCentered {...mockGlobalHeaderProps} />);
    expect(screen.getByTestId('global-header-centered')).toBeInTheDocument();
  });
});
