import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Container25252525 } from '../../../../components/container/container-25252525/Container25252525';
import { mockContainer25252525Props } from './container25252525.mock.props';

// All mocks are handled globally in jest.setup.js

describe('Container25252525 Component', () => {
  it('renders with basic props and four placeholders', () => {
    render(<Container25252525 {...mockContainer25252525Props} />);

    const placeholders = screen.getAllByTestId('sitecore-placeholder');
    expect(placeholders).toHaveLength(4);

    // Check container structure
    const section = document.querySelector('section');
    expect(section).toHaveClass('container--25252525');
    expect(section?.querySelector('div.w-full.mx-auto')).toBeInTheDocument();
  });

  it('applies custom styles from params', () => {
    const { container } = render(<Container25252525 {...mockContainer25252525Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-25252525-styles');
    expect(section).toHaveClass('container--25252525');
  });

  it('includes top margin by default', () => {
    const { container } = render(<Container25252525 {...mockContainer25252525Props} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('mt-10');
  });
});
