import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container6321 } from '../../../../components/container/container-6321/Container6321';
import { mockContainer6321Props, mockContainer6321PropsNoMargin } from './container6321.mock.props';

// All mocks are handled globally in jest.setup.js

describe('Container6321 Component', () => {
  it('renders with basic props and six placeholders', () => {
    render(<Container6321 {...mockContainer6321Props} />);

    const placeholders = screen.getAllByTestId('sitecore-placeholder');
    expect(placeholders).toHaveLength(6);

    // Check container structure
    const section = document.querySelector('section');
    expect(section).toHaveClass('container--6321');
    expect(section?.querySelector('div.w-full.mx-auto')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container6321 {...mockContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-6321-styles');
    expect(section).toHaveClass('container--6321');
    expect(section).toHaveClass('bg-[#f5f5f5]');
  });

  it('excludes top margin when specified', () => {
    const { container } = render(<Container6321 {...mockContainer6321PropsNoMargin} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-0');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container6321 {...mockContainer6321Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-10');
  });
});
