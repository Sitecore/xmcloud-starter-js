/* eslint-disable */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as SiteMetadataDefault } from '../../components/site-metadata/SiteMetadata';
import {
  defaultSiteMetadataProps,
  siteMetadataPropsTitleOnly,
  siteMetadataPropsMetadataOnly,
  siteMetadataPropsEmpty,
  siteMetadataPropsMinimal,
  siteMetadataPropsNoFields,
  siteMetadataPropsSpecialChars,
  siteMetadataPropsLongContent,
  siteMetadataPropsUndefinedFields,
} from './SiteMetadata.mockProps';

// Mock Next.js Head component
let mockHeadCalled = false;
let mockHeadProps: any = null;

jest.mock('next/head', () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    mockHeadCalled = true;
    mockHeadProps = { children };
    return <div data-testid="head-wrapper">Head content rendered</div>;
  };
});

// Mock NoDataFallback
jest.mock('../../utils/NoDataFallback', () => ({
  NoDataFallback: ({ componentName }: { componentName: string }) => (
    <div data-testid="no-data-fallback">{componentName}</div>
  ),
}));

describe('SiteMetadata Component', () => {
  beforeEach(() => {
    mockHeadCalled = false;
    mockHeadProps = null;
  });

  describe('Default Rendering', () => {
    it('renders Head component when fields are provided', () => {
      render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
      expect(mockHeadProps.children).toBeDefined();
    });

    it('renders with title-only fields', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsTitleOnly} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });

    it('renders with metadata-only fields', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsMetadataOnly} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });
  });

  describe('Content Scenarios', () => {
    it('handles empty metadata fields gracefully', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsEmpty} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });

    it('renders minimal metadata with only title', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsMinimal} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });

    it('handles special characters correctly', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsSpecialChars} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });

    it('handles very long content without breaking', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsLongContent} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });

    it('handles undefined field values', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsUndefinedFields} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(mockHeadCalled).toBe(true);
    });
  });

  describe('Fallback Scenarios', () => {
    it('renders NoDataFallback when no fields provided', () => {
      render(<SiteMetadataDefault {...siteMetadataPropsNoFields} />);

      expect(screen.getByTestId('no-data-fallback')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-fallback')).toHaveTextContent('Site Metadata');
    });
  });

  describe('Component Behavior', () => {
    it('renders Head component wrapper for valid fields', () => {
      render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
      expect(screen.getByText('Head content rendered')).toBeInTheDocument();
    });

    it('passes correct data structure to Head', () => {
      render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      expect(mockHeadCalled).toBe(true);
      expect(mockHeadProps).not.toBeNull();
      expect(mockHeadProps.children).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('handles re-renders efficiently', () => {
      const { rerender } = render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();

      rerender(<SiteMetadataDefault {...siteMetadataPropsTitleOnly} />);

      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
    });

    it('renders without performance issues with large content', () => {
      const startTime = performance.now();

      render(<SiteMetadataDefault {...siteMetadataPropsLongContent} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Integration', () => {
    it('integrates with Next.js Head component', () => {
      render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      expect(mockHeadCalled).toBe(true);
      expect(screen.getByTestId('head-wrapper')).toBeInTheDocument();
    });

    it('provides proper component structure', () => {
      render(<SiteMetadataDefault {...defaultSiteMetadataProps} />);

      const headWrapper = screen.getByTestId('head-wrapper');
      expect(headWrapper).toBeInTheDocument();
      expect(headWrapper).toHaveTextContent('Head content rendered');
    });
  });

  describe('Error Handling', () => {
    it('handles malformed field data gracefully', () => {
      const malformedProps = {
        ...defaultSiteMetadataProps,
        fields: {
          title: null as any,
          metadataTitle: undefined as any,
          metadataKeywords: { value: null } as any,
          metadataDescription: {} as any,
        },
      };

      expect(() => {
        render(<SiteMetadataDefault {...malformedProps} />);
      }).not.toThrow();
    });

    it('handles missing field properties', () => {
      const incompleteProps = {
        ...defaultSiteMetadataProps,
        fields: {
          title: { value: 'Test Title' } as any,
          // Missing other fields
        },
      };

      expect(() => {
        render(<SiteMetadataDefault {...incompleteProps} />);
      }).not.toThrow();
    });
  });
});
