import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/components/theme-provider/theme-provider.dev';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({
    children,
    attribute,
    defaultTheme,
    enableSystem,
    storageKey,
  }: {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    storageKey?: string;
  }) => (
    <div
      data-testid="next-themes-provider"
      data-attribute={attribute}
      data-default-theme={defaultTheme}
      data-enable-system={enableSystem}
      data-storage-key={storageKey}
    >
      {children}
    </div>
  ),
}));

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-content">Alaris Emergency Vehicles Dashboard</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toHaveTextContent(
      'Alaris Emergency Vehicles Dashboard'
    );
  });

  it('passes props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="theme">
        <div>Test Content</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('next-themes-provider');
    expect(provider).toHaveAttribute('data-attribute', 'class');
    expect(provider).toHaveAttribute('data-default-theme', 'dark');
    expect(provider).toHaveAttribute('data-enable-system', 'true');
    expect(provider).toHaveAttribute('data-storage-key', 'theme');
  });

  it('renders with default theme configuration', () => {
    render(
      <ThemeProvider defaultTheme="system">
        <div data-testid="app-content">Vehicle Fleet Management</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('app-content')).toBeInTheDocument();
    expect(screen.getByTestId('next-themes-provider')).toHaveAttribute(
      'data-default-theme',
      'system'
    );
  });
});
