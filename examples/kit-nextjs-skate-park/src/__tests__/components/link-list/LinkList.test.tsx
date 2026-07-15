import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as LinkList } from '../../../components/link-list/LinkList';
import {
  mockLinkListProps,
  mockLinkListPropsSingle,
  mockLinkListPropsEven,
  mockLinkListPropsNoData,
} from './LinkList.mockProps';

const getLinkListDiv = () => document.querySelector('.link-list');
const getListItems = () => document.querySelectorAll('li');

describe('LinkList Component should', () => {
  it('render without crashing', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getLinkListDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getLinkListDiv()).toHaveClass('component', 'link-list', 'linklist-styles');
  });

  it('have correct ID attribute', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getLinkListDiv()).toHaveAttribute('id', 'linklist-test-id');
  });

  it('render title as h3 element', () => {
    render(<LinkList {...mockLinkListProps} />);
    const titleElement = screen.getByText('Link List Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H3');
  });

  it('render all links in the list', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(screen.getByText('First Link')).toBeInTheDocument();
    expect(screen.getByText('Second Link')).toBeInTheDocument();
    expect(screen.getByText('Third Link')).toBeInTheDocument();
  });

  it('render links inside ul element', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(document.querySelector('ul')).toBeInTheDocument();
  });

  it('render each link inside li element', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getListItems()).toHaveLength(3);
  });

  it('apply item index class to each list item', () => {
    render(<LinkList {...mockLinkListProps} />);
    const liElements = getListItems();
    expect(liElements[0]).toHaveClass('item0');
    expect(liElements[1]).toHaveClass('item1');
    expect(liElements[2]).toHaveClass('item2');
  });

  it('apply odd class to even-indexed items (0, 2, 4...)', () => {
    render(<LinkList {...mockLinkListProps} />);
    const liElements = getListItems();
    expect(liElements[0]).toHaveClass('odd');
    expect(liElements[2]).toHaveClass('odd');
  });

  it('apply even class to odd-indexed items (1, 3, 5...)', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getListItems()[1]).toHaveClass('even');
  });

  it('apply first class to first item', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getListItems()[0]).toHaveClass('first');
  });

  it('apply last class to last item', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(getListItems()[2]).toHaveClass('last');
  });

  it('apply both first and last class to single item', () => {
    render(<LinkList {...mockLinkListPropsSingle} />);
    const liElement = document.querySelector('li');
    expect(liElement).toHaveClass('first');
    expect(liElement).toHaveClass('last');
  });

  it('render field-link div for each link', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(document.querySelectorAll('.field-link')).toHaveLength(3);
  });

  it('render links with correct href attributes', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(screen.getByText('First Link').closest('a')).toHaveAttribute('href', '/link-1');
    expect(screen.getByText('Second Link').closest('a')).toHaveAttribute('href', '/link-2');
    expect(screen.getByText('Third Link').closest('a')).toHaveAttribute('href', '/link-3');
  });

  it('apply correct classes for even number of links', () => {
    render(<LinkList {...mockLinkListPropsEven} />);
    const liElements = getListItems();
    expect(liElements).toHaveLength(4);
    expect(liElements[0]).toHaveClass('odd', 'first');
    expect(liElements[1]).toHaveClass('even');
    expect(liElements[2]).toHaveClass('odd');
    expect(liElements[3]).toHaveClass('even', 'last');
  });

  it('show empty state heading when no datasource', () => {
    render(<LinkList {...mockLinkListPropsNoData} />);
    const emptyHeading = screen.getByText('Link List');
    expect(emptyHeading).toBeInTheDocument();
    expect(emptyHeading.tagName).toBe('H3');
  });

  it('not render ul when no datasource', () => {
    render(<LinkList {...mockLinkListPropsNoData} />);
    expect(document.querySelector('ul')).toBeNull();
  });

  it('render component-content div', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(document.querySelector('.component-content')).toBeInTheDocument();
  });
});

describe('LinkList Component Accessibility should', () => {
  it('use semantic heading for title', () => {
    render(<LinkList {...mockLinkListProps} />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Link List Title');
  });

  it('have accessible links for all list items', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(screen.getByRole('link', { name: /First Link/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Second Link/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Third Link/i })).toBeInTheDocument();
  });

  it('use semantic list structure', () => {
    render(<LinkList {...mockLinkListProps} />);
    expect(document.querySelector('ul')).toBeInTheDocument();
    expect(getListItems()).toHaveLength(3);
  });

  it('provide meaningful link text', () => {
    render(<LinkList {...mockLinkListProps} />);
    screen.getAllByRole('link').forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });
});

describe('LinkList Component Edge Cases should', () => {
  it('render correct DOM structure', () => {
    render(<LinkList {...mockLinkListProps} />);
    const container = getLinkListDiv();
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('component', 'link-list');
    
    const contentDiv = container?.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
    
    const title = contentDiv?.querySelector('h3');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Link List Title');
    
    const list = contentDiv?.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('handle missing params gracefully', () => {
    const propsWithoutParams = {
      ...mockLinkListProps,
      params: {} as typeof mockLinkListProps.params,
    };
    
    render(<LinkList {...propsWithoutParams} />);
    expect(screen.getByText('Link List Title')).toBeInTheDocument();
  });

  it('handle null fields gracefully', () => {
    const propsWithNullFields = {
      ...mockLinkListProps,
      fields: null as unknown as typeof mockLinkListProps.fields,
    };
    
    render(<LinkList {...propsWithNullFields} />);
    expect(screen.getByText('Link List')).toBeInTheDocument();
  });

  it('handle undefined fields gracefully', () => {
    const propsWithUndefinedFields = {
      ...mockLinkListProps,
      fields: undefined as unknown as typeof mockLinkListProps.fields,
    };
    
    render(<LinkList {...propsWithUndefinedFields} />);
    expect(screen.getByText('Link List')).toBeInTheDocument();
  });

  it('handle empty links array', () => {
    const propsWithEmptyLinks = {
      ...mockLinkListProps,
      fields: {
        data: {
          datasource: {
            field: mockLinkListProps.fields?.data?.datasource?.field,
            children: {
              results: [],
            },
          },
        },
      },
    };
    
    render(<LinkList {...propsWithEmptyLinks} />);
    expect(screen.getByText('Link List Title')).toBeInTheDocument();
    expect(document.querySelector('ul')).toBeInTheDocument();
  });
});
