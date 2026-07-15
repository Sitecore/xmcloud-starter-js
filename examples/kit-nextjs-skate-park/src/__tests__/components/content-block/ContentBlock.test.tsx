import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ContentBlock from '../../../components/content-block/ContentBlock';
import {
  mockContentBlockProps,
  mockContentBlockPropsSimple,
  mockContentBlockPropsLong,
  mockContentBlockPropsEmpty,
} from './ContentBlock.mockProps';

const getContentBlockDiv = () => document.querySelector('.contentBlock');

describe('ContentBlock Component should', () => {
  it('render without crashing', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    expect(getContentBlockDiv()).toBeInTheDocument();
  });

  it('render heading as h2 element', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    const headingElement = screen.getByText('Content Block Heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
  });

  it('apply contentTitle class to heading', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    expect(screen.getByText('Content Block Heading')).toHaveClass('contentTitle');
  });

  it('render content with HTML formatting', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    const boldText = screen.getByText('content');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

    const italicText = screen.getByText('formatting');
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe('EM');
  });

  it('apply contentDescription class to content', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    expect(document.querySelector('.contentDescription')).toBeInTheDocument();
  });

  it('render simple content correctly', () => {
    render(<ContentBlock {...mockContentBlockPropsSimple} />);
    const headingElement = screen.getByText('Simple Heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
    expect(screen.getByText('Simple content text.')).toBeInTheDocument();
  });

  it('render long content with multiple paragraphs', () => {
    render(<ContentBlock {...mockContentBlockPropsLong} />);
    expect(screen.getByText('Long Content Block')).toBeInTheDocument();
    expect(screen.getByText(/This is a longer content block/)).toBeInTheDocument();
    expect(screen.getByText('It can even have multiple paragraphs.')).toBeInTheDocument();
  });

  it('handle empty content gracefully', () => {
    render(<ContentBlock {...mockContentBlockPropsEmpty} />);
    expect(getContentBlockDiv()).toBeInTheDocument();
  });

  it('render both heading and content together', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    expect(screen.getByText('Content Block Heading')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

describe('ContentBlock Component Accessibility should', () => {
  it('have proper heading structure with h2', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Content Block Heading');
  });

  it('maintain semantic heading hierarchy', () => {
    render(<ContentBlock {...mockContentBlockPropsSimple} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('have accessible heading text', () => {
    render(<ContentBlock {...mockContentBlockProps} />);
    expect(screen.getByRole('heading', { name: /Content Block Heading/i })).toBeInTheDocument();
  });

  it('render rich content with proper heading hierarchy', () => {
    render(<ContentBlock {...mockContentBlockPropsLong} />);
    expect(screen.getByRole('heading', { level: 2, name: /Long Content Block/i })).toBeInTheDocument();
  });
});
