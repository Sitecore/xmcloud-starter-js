import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PartialDesignDynamicPlaceholder from '../../../components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import {
  mockPartialDesignProps,
  mockPartialDesignPropsFooter,
  mockPartialDesignPropsComplex,
  mockPartialDesignPropsNoSig,
  mockPartialDesignPropsEmpty,
} from './PartialDesignDynamicPlaceholder.mockProps';

describe('PartialDesignDynamicPlaceholder Component should', () => {
  it('render without crashing', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);
    expect(screen.getByTestId('placeholder-header-partial')).toBeInTheDocument();
  });

  it('render placeholder with signature from rendering params', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);
    const placeholder = screen.getByTestId('placeholder-header-partial');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: header-partial');
  });

  it('render placeholder with different signature', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsFooter} />);
    const placeholder = screen.getByTestId('placeholder-footer-partial');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: footer-partial');
  });

  it('handle complex signature with special characters', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsComplex} />);
    expect(screen.getByTestId('placeholder-main-content-{*}')).toBeInTheDocument();
  });

  it('handle missing signature gracefully', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsNoSig} />);
    expect(screen.getByTestId('placeholder-')).toBeInTheDocument();
  });

  it('handle empty signature', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsEmpty} />);
    expect(screen.getByTestId('placeholder-')).toBeInTheDocument();
  });
});
