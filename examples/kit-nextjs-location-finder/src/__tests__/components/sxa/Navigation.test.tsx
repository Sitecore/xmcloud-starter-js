/* eslint-disable no-console -- test file mocks console to suppress output */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Default as Navigation, ButtonNavigation } from '@/components/sxa/Navigation';
import { baseSitecoreProps } from '@/__tests__/test-utils/component-props';

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: jest.fn(() => ({
    page: {
      mode: {
        isEditing: false,
      },
    },
  })),
  Text: jest.fn(({ field }) => <span data-testid="nav-text">{field?.value}</span>),
  Link: jest.fn(({ field, children }) => (
    <a href={field?.value?.href} data-testid="nav-link">
      {children}
    </a>
  )),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-icon">→</span>,
}));

describe('SXA Navigation', () => {
  let originalConsoleLog: typeof console.log;

  beforeEach(() => {
    // Suppress console.log for tests
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    // Restore original console.log
    console.log = originalConsoleLog;
  });

  const mockChildFields = [
    {
      Id: '2',
      DisplayName: 'Ambulances',
      Title: { value: 'Ambulances' },
      NavigationTitle: { value: '' },
      Href: '/vehicles/ambulances',
      Querystring: '',
      Children: [],
      Styles: ['nav-item'],
    },
    {
      Id: '3',
      DisplayName: 'Fire Trucks',
      Title: { value: 'Fire Trucks' },
      NavigationTitle: { value: '' },
      Href: '/vehicles/fire-trucks',
      Querystring: '',
      Children: [],
      Styles: ['nav-item'],
    },
  ];

  // Mock fields - component type expects Fields but uses it as a record with numeric keys
  const mockFields = {
    '0': {
      Id: '1',
      DisplayName: 'Vehicles',
      Title: { value: 'Emergency Vehicles' },
      NavigationTitle: { value: 'All Vehicles' },
      Href: '/vehicles',
      Querystring: '',
      Children: mockChildFields,
      Styles: ['nav-main'],
    },
  };

  it('renders navigation component structure', () => {
    const { container } = render(
      <Navigation
        {...baseSitecoreProps}
        fields={mockFields}
        params={{ Styles: 'main-nav', RenderingIdentifier: 'nav-1' }}
        handleClick={jest.fn()}
        relativeLevel={0}
      />
    );

    const navComponent = container.querySelector('.component.navigation');
    expect(navComponent).toBeInTheDocument();
    expect(navComponent).toHaveClass('main-nav');
    expect(navComponent).toHaveAttribute('id', 'nav-1');
  });

  it('renders mobile menu toggle checkbox', () => {
    const { container } = render(
      <Navigation
        {...baseSitecoreProps}
        fields={mockFields}
        params={{ Styles: '', RenderingIdentifier: 'nav-mobile' }}
        handleClick={jest.fn()}
        relativeLevel={0}
      />
    );

    const checkbox = container.querySelector('.menu-mobile-navigate') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.type).toBe('checkbox');
  });

  it('renders ButtonNavigation variant with grid layout', () => {
    const { container } = render(
      <ButtonNavigation
        {...baseSitecoreProps}
        fields={mockFields}
        params={{ Styles: '' }}
        handleClick={jest.fn()}
        relativeLevel={0}
      />
    );

    expect(screen.getByText('Component Categories')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });
});
