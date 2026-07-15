import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Meteors } from '@/components/magicui/meteors';

describe('Meteors Component', () => {
  it('renders the correct number of meteors', () => {
    const numberOfMeteors = 10;
    const { container } = render(<Meteors number={numberOfMeteors} />);
    const meteors = container.querySelectorAll('span');
    expect(meteors.length).toBe(numberOfMeteors);
  });

  it('renders the container div', () => {
    const { container } = render(<Meteors />);
    const containerDiv = container.querySelector('div');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('absolute inset-0 overflow-hidden');
  });

  it('applies correct rotation angle to meteors', () => {
    const angle = 123;
    const { container } = render(<Meteors number={5} angle={angle} />);
    const meteorSpans = container.querySelectorAll('span');

    meteorSpans.forEach((meteor) => {
      const transform = meteor.style.transform;
      expect(transform).toContain(`rotate(${angle}deg)`);
    });
  });

  it('applies custom size to meteors', () => {
    const { container } = render(<Meteors number={3} size="5" />);
    const meteors = container.querySelectorAll('span');
    meteors.forEach((meteor) => {
      expect(meteor).toHaveStyle('width: 5px');
      expect(meteor).toHaveStyle('height: 5px');
    });
  });
});
