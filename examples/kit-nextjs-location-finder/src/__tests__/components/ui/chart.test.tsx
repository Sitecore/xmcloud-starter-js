import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: React.PropsWithChildren) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="chart-tooltip" />,
  Legend: () => <div data-testid="chart-legend" />,
}));

describe('Chart', () => {
  const mockConfig = {
    value: {
      label: 'Value',
      color: '#000',
    },
  };

  it('renders chart container', () => {
    render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders chart tooltip', () => {
    render(<ChartTooltip />);

    expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
  });

  it('renders chart legend', () => {
    render(<ChartLegend />);

    expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
  });
});
