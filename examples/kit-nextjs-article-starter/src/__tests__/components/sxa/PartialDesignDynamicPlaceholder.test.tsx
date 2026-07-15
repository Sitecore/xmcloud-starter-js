import React from 'react';
import { render, screen } from '@testing-library/react';
import PartialDesignDynamicPlaceholder from '@/components/sxa/PartialDesignDynamicPlaceholder';
import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithCustomSig,
  propsWithComplexSig,
  propsWithEmptySig,
  propsWithoutSig,
  propsWithUndefinedParams,
  propsWithNullRendering,
  propsWithNumericSig,
} from './PartialDesignDynamicPlaceholder.mockProps';

// Type definitions for mock components
interface MockAppPlaceholderProps {
  name?: string;
  rendering?: ComponentRendering;
}

// Mock the Placeholder component
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  AppPlaceholder: ({ name, rendering }: MockAppPlaceholderProps) => (
    <div data-testid={`placeholder-${name || 'empty'}`} data-rendering={rendering?.componentName || 'unknown'}>
      Dynamic Placeholder Content: {name || 'empty'}
    </div>
  ),
}));

describe('PartialDesignDynamicPlaceholder Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render dynamic placeholder with sig parameter', () => {
      render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveTextContent('main-content-dynamic');
    });

    it('should pass rendering to Placeholder component', () => {
      render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toHaveAttribute('data-rendering', 'PartialDesignDynamicPlaceholder');
    });

    it('should render with custom sig', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithCustomSig} />);

      const placeholder = screen.getByTestId('placeholder-sidebar-content-{*}');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveTextContent('sidebar-content-{*}');
    });

    it('should render with complex sig pattern', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithComplexSig} />);

      const placeholder = screen.getByTestId('placeholder-dynamic-placeholder-{GUID}-{*}');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveTextContent('dynamic-placeholder-{GUID}-{*}');
    });

    it('should render with numeric sig', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithNumericSig} />);

      const placeholder = screen.getByTestId('placeholder-placeholder-123');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Empty and missing sig', () => {
    it('should render with empty sig', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithEmptySig} />);

      const placeholder = screen.getByTestId('placeholder-empty');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle missing sig parameter', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithoutSig} />);

      const placeholder = screen.getByTestId('placeholder-empty');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle undefined params', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithUndefinedParams} />);

      const placeholder = screen.getByTestId('placeholder-empty');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle null rendering gracefully', () => {
      render(<PartialDesignDynamicPlaceholder {...propsWithNullRendering} />);

      const placeholder = screen.getByTestId('placeholder-empty');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle undefined rendering', () => {
      const propsWithUndefinedRendering = {
        rendering: undefined as unknown as ComponentRendering,
        params: defaultProps.params,
        page: defaultProps.page,
      };

      render(<PartialDesignDynamicPlaceholder {...propsWithUndefinedRendering} />);

      const placeholder = screen.getByTestId('placeholder-empty');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle sig with special characters', () => {
      const propsWithSpecialChars = {
        rendering: {
          componentName: 'PartialDesignDynamicPlaceholder',
          dataSource: '',
          params: {
            sig: 'placeholder-with-dashes_and_underscores',
          },
        } as ComponentRendering,
        params: defaultProps.params,
        page: defaultProps.page,
      };

      render(<PartialDesignDynamicPlaceholder {...propsWithSpecialChars} />);

      const placeholder = screen.getByTestId('placeholder-placeholder-with-dashes_and_underscores');
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('Placeholder component integration', () => {
    it('should pass name prop to Placeholder', () => {
      render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toHaveTextContent('main-content-dynamic');
    });

    it('should pass rendering prop to Placeholder', () => {
      render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toHaveAttribute('data-rendering', 'PartialDesignDynamicPlaceholder');
    });

    it('should render single Placeholder component', () => {
      const { container } = render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholders = container.querySelectorAll('[data-testid^="placeholder-"]');
      expect(placeholders.length).toBe(1);
    });
  });

  describe('Component simplicity', () => {
    it('should not have wrapper elements', () => {
      const { container } = render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      // Should directly render the Placeholder without wrappers
      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toBeInTheDocument();
      
      // Check that placeholder is the direct child of container
      expect(container.firstChild).toBe(placeholder);
    });

    it('should be a simple passthrough component', () => {
      render(<PartialDesignDynamicPlaceholder {...defaultProps} />);

      const placeholder = screen.getByTestId('placeholder-main-content-dynamic');
      expect(placeholder).toBeInTheDocument();
      
      // Verify no additional processing or transformation
      expect(placeholder).toHaveTextContent('main-content-dynamic');
    });
  });

  describe('Different sig patterns', () => {
    it('should handle sig with wildcards', () => {
      const propsWithWildcard = {
        rendering: {
          componentName: 'PartialDesignDynamicPlaceholder',
          dataSource: '',
          params: {
            sig: 'content-{*}',
          },
        } as ComponentRendering,
        params: defaultProps.params,
        page: defaultProps.page,
      };

      render(<PartialDesignDynamicPlaceholder {...propsWithWildcard} />);

      const placeholder = screen.getByTestId('placeholder-content-{*}');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle sig with GUID pattern', () => {
      const propsWithGuid = {
        rendering: {
          componentName: 'PartialDesignDynamicPlaceholder',
          dataSource: '',
          params: {
            sig: 'placeholder-{12345678-1234-1234-1234-123456789abc}',
          },
        } as ComponentRendering,
        params: defaultProps.params,
        page: defaultProps.page,
      };

      render(<PartialDesignDynamicPlaceholder {...propsWithGuid} />);

      const placeholder = screen.getByTestId('placeholder-placeholder-{12345678-1234-1234-1234-123456789abc}');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle sig with path separators', () => {
      const propsWithPath = {
        rendering: {
          componentName: 'PartialDesignDynamicPlaceholder',
          dataSource: '',
          params: {
            sig: 'section/subsection/placeholder',
          },
        } as ComponentRendering,
        params: defaultProps.params,
        page: defaultProps.page,
      };

      render(<PartialDesignDynamicPlaceholder {...propsWithPath} />);

      const placeholder = screen.getByTestId('placeholder-section/subsection/placeholder');
      expect(placeholder).toBeInTheDocument();
    });
  });
});

