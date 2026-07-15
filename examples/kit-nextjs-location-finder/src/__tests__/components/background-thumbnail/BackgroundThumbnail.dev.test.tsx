import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as BackgroundThumbnail } from '../../../components/background-thumbnail/BackgroundThumbnail.dev';
import { Page } from '@sitecore-content-sdk/nextjs';

//  Mock useSitecore hook
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(),
}));

// Mock page objects with all required Page properties
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

const mockPageNormal = {
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

describe('BackgroundThumbnail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders badge and children when in editing mode', () => {
    render(
      <BackgroundThumbnail page={mockPageEditing}>
        <div data-testid="child">Child Content</div>
      </BackgroundThumbnail>
    );

    //  Badge should appear
    expect(screen.getByText('Update Background')).toBeInTheDocument();
    //  Child should appear
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders nothing when not in editing mode', () => {
    render(
      <BackgroundThumbnail page={mockPageNormal}>
        <div data-testid="child">Child Content</div>
      </BackgroundThumbnail>
    );

    //  Badge should not appear
    expect(screen.queryByText('Update Background')).not.toBeInTheDocument();
    //  Child should not appear either (since returns null)
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });
});
