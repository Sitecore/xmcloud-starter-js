import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as Navigation } from '../../../components/navigation/Navigation';
import {
  mockNavigationProps,
  mockNavigationPropsFlat,
  mockNavigationPropsDisplayName,
  mockNavigationPropsEmpty,
} from './Navigation.mockProps';

const getNavigationDiv = () => document.querySelector('.navigation');
const getNavElement = () => document.querySelector('nav');
const getMobileCheckbox = () => document.querySelector('input[type="checkbox"].menu-mobile-navigate') as HTMLInputElement;

describe('Navigation Component should', () => {
  it('render without crashing', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(getNavigationDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(getNavigationDiv()).toHaveClass('component', 'navigation', 'navigation-styles');
  });

  it('have correct ID attribute', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(getNavigationDiv()).toHaveAttribute('id', 'navigation-test-id');
  });

  it('render all top-level navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('render child navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('render navigation inside nav element', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(getNavElement()).toBeInTheDocument();
  });

  it('render navigation items inside ul element', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelectorAll('ul').length).toBeGreaterThan(0);
  });

  it('render navigation items as li elements', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('apply rel-level1 class to top-level items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home').closest('li')).toHaveClass('rel-level1');
  });

  it('apply rel-level2 class to child items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Team').closest('li')).toHaveClass('rel-level2');
  });

  it('apply custom styles to navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home').closest('li')).toHaveClass('home-style');
  });

  it('apply child class when item has children', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('About').closest('.navigation-title')).toHaveClass('child');
  });

  it('not apply child class when item has no children', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home').closest('.navigation-title')).not.toHaveClass('child');
  });

  it('render nested ul for items with children', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelectorAll('ul.clearfix').length).toBeGreaterThan(1);
  });

  it('render links with correct href attributes', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
  });

  it('render mobile menu checkbox', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(getMobileCheckbox()).toBeInTheDocument();
  });

  it('toggle menu state when checkbox is clicked', () => {
    render(<Navigation {...mockNavigationProps} />);
    const checkbox = getMobileCheckbox();
    
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('toggle active state when navigation title is clicked', () => {
    render(<Navigation {...mockNavigationProps} />);
    const aboutTitle = screen.getByText('About').closest('.navigation-title') as HTMLElement;
    const aboutLi = aboutTitle.closest('li');

    expect(aboutLi).not.toHaveClass('active');
    fireEvent.click(aboutTitle);
    expect(aboutLi).toHaveClass('active');
    fireEvent.click(aboutTitle);
    expect(aboutLi).not.toHaveClass('active');
  });

  it('use NavigationTitle when available', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('fall back to Title when NavigationTitle is not available', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('fall back to DisplayName when neither Title nor NavigationTitle available', () => {
    render(<Navigation {...mockNavigationPropsDisplayName} />);
    expect(screen.getByText('Simple Link')).toBeInTheDocument();
  });

  it('render flat navigation without children', () => {
    render(<Navigation {...mockNavigationPropsFlat} />);
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  it('show placeholder when no fields provided', () => {
    render(<Navigation {...mockNavigationPropsEmpty} />);
    expect(screen.getByText('[Navigation]')).toBeInTheDocument();
  });

  it('not render nav element when no fields provided', () => {
    render(<Navigation {...mockNavigationPropsEmpty} />);
    expect(getNavElement()).toBeNull();
  });

  it('render hamburger menu element', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelector('.menu-humburger')).toBeInTheDocument();
  });

  it('render component-content wrapper', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelector('.component-content')).toBeInTheDocument();
  });
});

describe('Navigation Component Accessibility should', () => {
  it('use semantic nav element', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('have accessible links for all navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
  });

  it('provide keyboard accessible navigation', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(document.querySelectorAll('li[tabindex="0"]').length).toBeGreaterThan(0);
  });

  it('maintain proper link structure for screen readers', () => {
    render(<Navigation {...mockNavigationProps} />);
    screen.getAllByRole('link').forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('have accessible nested navigation structure', () => {
    render(<Navigation {...mockNavigationProps} />);
    expect(screen.getByRole('link', { name: /Team/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /History/i })).toBeInTheDocument();
  });
});

describe('Navigation Component Error Handling should', () => {
  it('handle missing fields gracefully', () => {
    render(<Navigation {...mockNavigationPropsEmpty} />);
    expect(screen.getByText('[Navigation]')).toBeInTheDocument();
  });

  it('handle undefined children in navigation items', () => {
    render(<Navigation {...mockNavigationPropsFlat} />);
    expect(screen.getByRole('link', { name: /Page 1/i })).toBeInTheDocument();
  });

  it('handle missing NavigationTitle field', () => {
    render(<Navigation {...mockNavigationPropsDisplayName} />);
    expect(screen.getByText('Simple Link')).toBeInTheDocument();
  });

  it('handle multiple click events on mobile toggle', () => {
    render(<Navigation {...mockNavigationProps} />);
    const hamburger = document.querySelector('.menu-humburger');
    
    fireEvent.click(hamburger!);
    fireEvent.click(hamburger!);
    fireEvent.click(hamburger!);

    expect(hamburger).toBeInTheDocument();
  });

  it('render without params', () => {
    render(<Navigation {...{ ...mockNavigationProps, params: {} as typeof mockNavigationProps.params }} />);
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
  });
});

describe('Navigation Component Edge Cases should', () => {
  it('render correct DOM structure', () => {
    render(<Navigation {...mockNavigationProps} />);
    const container = getNavigationDiv();
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('component', 'navigation');
    
    const contentDiv = container?.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
    
    const navElement = contentDiv?.querySelector('nav');
    expect(navElement).toBeInTheDocument();
    
    const menuList = navElement?.querySelector('ul.clearfix');
    expect(menuList).toBeInTheDocument();
  });

  it('handle missing params gracefully', () => {
    const propsWithoutParams = {
      ...mockNavigationProps,
      params: {} as typeof mockNavigationProps.params,
    };
    
    render(<Navigation {...propsWithoutParams} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('handle empty fields object', () => {
    const propsWithEmptyFields = {
      ...mockNavigationProps,
      fields: {} as unknown as typeof mockNavigationProps.fields,
    };
    
    render(<Navigation {...propsWithEmptyFields} />);
    expect(screen.getByText('[Navigation]')).toBeInTheDocument();
  });

  it('handle single navigation item with proper structure', () => {
    const propsWithSingleItem = {
      ...mockNavigationProps,
      fields: {
        Home: {
          Id: 'home-id',
          DisplayName: 'Home',
          NavigationTitle: { value: 'Home' },
          Href: '/',
          Children: [],
          Styles: ['home-style'],
        },
      } as unknown as typeof mockNavigationProps.fields,
    };
    
    render(<Navigation {...propsWithSingleItem} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });
});
