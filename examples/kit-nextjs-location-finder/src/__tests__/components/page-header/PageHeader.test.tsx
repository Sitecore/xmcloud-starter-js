import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as PageHeader, BlueText, FiftyFifty } from '@/components/page-header/PageHeader';
import { mockPageHeaderProps } from './page-header.mock.props';

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
jest.mock('@/components/page-header/PageHeaderDefault.dev', () => ({
  PageHeaderDefault: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="page-header-default">
      PageHeaderDefault - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/page-header/PageHeaderBlueText.dev', () => ({
  PageHeaderBlueText: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="page-header-blue-text">
      PageHeaderBlueText - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/page-header/PageHeaderFiftyFifty.dev', () => ({
  PageHeaderFiftyFifty: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="page-header-fifty-fifty">
      PageHeaderFiftyFifty - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/page-header/PageHeaderBlueBackground.dev', () => ({
  PageHeaderBlueBackground: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="page-header-blue-background">
      PageHeaderBlueBackground - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

jest.mock('@/components/page-header/PageHeaderCentered.dev', () => ({
  PageHeaderCentered: ({ isPageEditing }: { isPageEditing: boolean }) => (
    <section data-testid="page-header-centered">
      PageHeaderCentered - {isPageEditing ? 'Editing' : 'Normal'}
    </section>
  ),
}));

describe('PageHeader', () => {
  it('renders Default variant correctly', () => {
    render(<PageHeader {...mockPageHeaderProps} />);
    expect(screen.getByTestId('page-header-default')).toBeInTheDocument();
    expect(screen.getByText(/PageHeaderDefault - Normal/)).toBeInTheDocument();
  });

  it('renders BlueText variant correctly', () => {
    render(<BlueText {...mockPageHeaderProps} />);
    expect(screen.getByTestId('page-header-blue-text')).toBeInTheDocument();
    expect(screen.getByText(/PageHeaderBlueText - Normal/)).toBeInTheDocument();
  });

  it('renders FiftyFifty variant correctly', () => {
    render(<FiftyFifty {...mockPageHeaderProps} />);
    expect(screen.getByTestId('page-header-fifty-fifty')).toBeInTheDocument();
    expect(screen.getByText(/PageHeaderFiftyFifty - Normal/)).toBeInTheDocument();
  });
});
