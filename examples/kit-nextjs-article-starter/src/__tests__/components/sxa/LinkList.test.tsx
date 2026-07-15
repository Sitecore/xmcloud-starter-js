import React from 'react';
import { render, screen } from '@testing-library/react';
import { Default as LinkList } from '@/components/sxa/LinkList';
import type { LinkField, Field } from '@sitecore-content-sdk/nextjs';
import {
  defaultProps,
  propsWithSingleLink,
  propsWithFourLinks,
  propsWithoutTitle,
  propsWithoutStyles,
  propsWithoutId,
  propsWithInvalidLinks,
  propsWithoutDatasource,
  propsWithEmptyFields,
  propsWithEmptyResults,
} from './LinkList.mockProps';

// Type definitions for mock components
interface MockLinkProps {
  field: LinkField;
}

interface MockTextProps {
  field: Field<string>;
  tag?: string;
}

// Mock Sitecore SDK components
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({ field }: MockLinkProps) => (
    <a href={field.value.href} title={field.value.title} data-testid="link">
      {field.value.text}
    </a>
  ),
  Text: ({ field, tag: Tag = 'span' }: MockTextProps) => {
    const TagElement = (Tag || 'span') as keyof JSX.IntrinsicElements;
    return React.createElement(TagElement, { 'data-testid': 'title' }, field.value);
  },
}));

describe('LinkList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render link list with default structure', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toBeInTheDocument();
      expect(linkList).toHaveClass('custom-link-list-style');
    });

    it('should render title', () => {
      render(<LinkList {...defaultProps} />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
      expect(title).toHaveTextContent('Quick Links');
    });

    it('should have correct rendering identifier', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toHaveAttribute('id', 'link-list-id');
    });

    it('should render correct number of links', () => {
      render(<LinkList {...defaultProps} />);

      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(3);
    });
  });

  describe('Link rendering', () => {
    it('should render links with correct content', () => {
      render(<LinkList {...defaultProps} />);

      const links = screen.getAllByTestId('link');
      expect(links[0]).toHaveTextContent('Page 1');
      expect(links[0]).toHaveAttribute('href', '/page1');
      expect(links[0]).toHaveAttribute('title', 'Go to Page 1');

      expect(links[1]).toHaveTextContent('Page 2');
      expect(links[1]).toHaveAttribute('href', '/page2');

      expect(links[2]).toHaveTextContent('Page 3');
      expect(links[2]).toHaveAttribute('href', '/page3');
    });

    it('should render single link correctly', () => {
      render(<LinkList {...propsWithSingleLink} />);

      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(1);
      expect(links[0]).toHaveTextContent('Page 1');
    });

    it('should render four links correctly', () => {
      render(<LinkList {...propsWithFourLinks} />);

      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(4);
    });

    it('should filter out invalid links', () => {
      render(<LinkList {...(propsWithInvalidLinks as unknown as Parameters<typeof LinkList>[0])} />);

      const links = screen.getAllByTestId('link');
      // Should only render valid links (mockLink1 and mockLink2)
      expect(links.length).toBe(2);
      expect(links[0]).toHaveTextContent('Page 1');
      expect(links[1]).toHaveTextContent('Page 2');
    });
  });

  describe('List item classes', () => {
    it('should apply correct classes to list items', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const listItems = container.querySelectorAll('ul li');
      
      // First item: item0, odd, first
      expect(listItems[0]).toHaveClass('item0', 'odd', 'first');
      
      // Second item: item1, even
      expect(listItems[1]).toHaveClass('item1', 'even');
      
      // Third item: item2, odd, last
      expect(listItems[2]).toHaveClass('item2', 'odd', 'last');
    });

    it('should apply first and last classes correctly for single item', () => {
      const { container } = render(<LinkList {...propsWithSingleLink} />);

      const listItems = container.querySelectorAll('ul li');
      expect(listItems[0]).toHaveClass('item0', 'odd', 'first', 'last');
    });

    it('should apply even/odd classes correctly for four items', () => {
      const { container } = render(<LinkList {...propsWithFourLinks} />);

      const listItems = container.querySelectorAll('ul li');
      expect(listItems[0]).toHaveClass('odd', 'first');
      expect(listItems[1]).toHaveClass('even');
      expect(listItems[2]).toHaveClass('odd');
      expect(listItems[3]).toHaveClass('even', 'last');
    });
  });

  describe('Component structure', () => {
    it('should render correct DOM structure', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toBeInTheDocument();

      const componentContent = linkList?.querySelector('.component-content');
      expect(componentContent).toBeInTheDocument();

      const title = componentContent?.querySelector('h3');
      expect(title).toBeInTheDocument();

      const ul = componentContent?.querySelector('ul');
      expect(ul).toBeInTheDocument();

      const listItems = ul?.querySelectorAll('li');
      expect(listItems?.length).toBe(3);

      listItems?.forEach((li) => {
        const fieldLink = li.querySelector('.field-link');
        expect(fieldLink).toBeInTheDocument();

        const link = fieldLink?.querySelector('a');
        expect(link).toBeInTheDocument();
      });
    });

    it('should wrap links in field-link divs', () => {
      const { container } = render(<LinkList {...defaultProps} />);

      const fieldLinks = container.querySelectorAll('.field-link');
      expect(fieldLinks.length).toBe(3);

      fieldLinks.forEach((fieldLink) => {
        expect(fieldLink.querySelector('a')).toBeInTheDocument();
      });
    });
  });

  describe('Styles and parameters', () => {
    it('should handle empty styles parameter', () => {
      const { container } = render(<LinkList {...propsWithoutStyles} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toHaveClass('component', 'link-list');
      expect(linkList?.className).not.toContain('undefined');
    });

    it('should handle empty RenderingIdentifier', () => {
      const { container } = render(<LinkList {...propsWithoutId} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).not.toHaveAttribute('id');
    });

    it('should handle empty title', () => {
      render(<LinkList {...propsWithoutTitle} />);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });
  });

  describe('Fallback rendering', () => {
    it('should render fallback when datasource is missing', () => {
      const { container } = render(<LinkList {...propsWithoutDatasource} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toBeInTheDocument();

      const componentContent = linkList?.querySelector('.component-content');
      expect(componentContent).toBeInTheDocument();

      const fallbackTitle = componentContent?.querySelector('h3');
      expect(fallbackTitle).toBeInTheDocument();
      expect(fallbackTitle).toHaveTextContent('Link List');

      // Should not render title from Text component
      expect(screen.queryByTestId('title')).not.toBeInTheDocument();
    });

    it('should render fallback when fields is undefined', () => {
      const { container } = render(<LinkList {...propsWithEmptyFields} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toBeInTheDocument();

      const fallbackTitle = container.querySelector('h3');
      expect(fallbackTitle).toHaveTextContent('Link List');
    });

    it('should render with empty list when results is empty', () => {
      const { container } = render(<LinkList {...propsWithEmptyResults} />);

      const ul = container.querySelector('ul');
      expect(ul).toBeInTheDocument();
      expect(ul?.children.length).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing params gracefully', () => {
      const emptyParams = {} as typeof defaultProps.params;
      const propsWithoutParams = {
        params: emptyParams,
        fields: defaultProps.fields,
      };

      const { container } = render(<LinkList {...propsWithoutParams} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).toBeInTheDocument();
    });

    it('should trim trailing whitespace from styles', () => {
      const propsWithTrailingSpace = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          styles: 'custom-style   ',
        },
      };

      const { container } = render(<LinkList {...propsWithTrailingSpace} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList?.className).toBe('component link-list custom-style');
    });

    it('should handle undefined id parameter', () => {
      const propsWithUndefinedId = {
        ...defaultProps,
        params: {
          ...defaultProps.params,
          RenderingIdentifier: undefined,
        } as unknown as typeof defaultProps.params,
      };

      const { container } = render(<LinkList {...propsWithUndefinedId} />);

      const linkList = container.querySelector('.component.link-list');
      expect(linkList).not.toHaveAttribute('id');
    });
  });

  describe('Data filtering', () => {
    it('should only render items with valid link fields', () => {
      render(<LinkList {...(propsWithInvalidLinks as unknown as Parameters<typeof LinkList>[0])} />);

      const links = screen.getAllByTestId('link');
      // Only valid links should be rendered
      expect(links.length).toBe(2);
    });

    it('should handle results with undefined field property', () => {
      const propsWithUndefinedField = {
        ...defaultProps,
        fields: {
          data: {
            datasource: {
              children: {
                results: [
                  { field: { link: defaultProps.fields.data.datasource.children.results[0].field.link } },
                  { field: undefined } as unknown as { field?: { link?: LinkField } },
                  { field: { link: defaultProps.fields.data.datasource.children.results[1].field.link } },
                ],
              },
              field: {
                title: defaultProps.fields.data.datasource.field.title,
              },
            },
          },
        },
      };

      render(<LinkList {...(propsWithUndefinedField as unknown as Parameters<typeof LinkList>[0])} />);

      const links = screen.getAllByTestId('link');
      expect(links.length).toBe(2);
    });
  });
});

