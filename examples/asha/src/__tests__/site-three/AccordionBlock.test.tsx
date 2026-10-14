/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Default as AccordionBlockDefault,
  TwoColumn as AccordionBlockTwoColumn,
  Vertical as AccordionBlockVertical,
  BoxedAccordion as AccordionBlockBoxedAccordion,
  BoxedContent as AccordionBlockBoxedContent,
} from '@/components/site-three/AccordionBlock';

// Mock Accordion UI components
jest.mock('shadcd/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: any) => (
    <div data-testid="accordion" {...props}>
      {children}
    </div>
  ),
  AccordionContent: ({ children, ...props }: any) => (
    <div data-testid="accordion-content" {...props}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value, ...props }: any) => (
    <div data-testid="accordion-item" data-value={value} {...props}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, ...props }: any) => (
    <button data-testid="accordion-trigger" {...props}>
      {children}
    </button>
  ),
}));

// Mock Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  RichText: ({ field, ...props }: any) => <div {...props}>{field?.value || ''}</div>,
  Link: ({ field, children, className }: any) => (
    <a href={field?.value?.href || '#'} className={className}>
      {children || field?.value?.text || ''}
    </a>
  ),
}));

describe('AccordionBlock', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      data: {
        datasource: {
          heading: {
            jsonValue: {
              value: 'FAQ Section',
            },
          },
          description: {
            jsonValue: {
              value: 'Frequently asked questions',
            },
          },
          link: {
            jsonValue: {
              value: {
                href: '/faq',
                text: 'View All FAQ',
              },
            },
          },
          children: {
            results: [
              {
                id: 'item-1',
                heading: {
                  jsonValue: {
                    value: 'Question 1?',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Answer to question 1',
                  },
                },
              },
              {
                id: 'item-2',
                heading: {
                  jsonValue: {
                    value: 'Question 2?',
                  },
                },
                description: {
                  jsonValue: {
                    value: 'Answer to question 2',
                  },
                },
              },
            ],
          },
        },
      },
    },
  };

  describe('Default variant', () => {
    it('renders accordion with heading', () => {
      render(<AccordionBlockDefault {...mockProps} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<AccordionBlockDefault {...mockProps} />);
      expect(screen.getByText('Frequently asked questions')).toBeInTheDocument();
    });

    it('renders all accordion items', () => {
      render(<AccordionBlockDefault {...mockProps} />);
      expect(screen.getByText('Question 1?')).toBeInTheDocument();
      expect(screen.getByText('Question 2?')).toBeInTheDocument();
      expect(screen.getByText('Answer to question 1')).toBeInTheDocument();
      expect(screen.getByText('Answer to question 2')).toBeInTheDocument();
    });

    it('renders link', () => {
      render(<AccordionBlockDefault {...mockProps} />);
      expect(screen.getByText('View All FAQ')).toBeInTheDocument();
    });

    it('renders accordion UI component', () => {
      render(<AccordionBlockDefault {...mockProps} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('handles missing link field', () => {
      const propsWithoutLink: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              link: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                  },
                },
              },
            },
          },
        },
      };
      render(<AccordionBlockDefault {...propsWithoutLink} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.queryByText('View All FAQ')).not.toBeInTheDocument();
    });

    it('handles empty children results', () => {
      const propsWithEmptyChildren = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<AccordionBlockDefault {...propsWithEmptyChildren} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('handles missing fields gracefully', () => {
      const minimalProps: any = {
        params: {},
        fields: {
          data: {
            datasource: {
              link: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                  },
                },
              },
              children: {
                results: [],
              },
            },
          },
        },
      };
      render(<AccordionBlockDefault {...minimalProps} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });
  });

  describe('TwoColumn variant', () => {
    it('renders TwoColumn layout correctly', () => {
      render(<AccordionBlockTwoColumn {...mockProps} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('renders items in TwoColumn format', () => {
      render(<AccordionBlockTwoColumn {...mockProps} />);
      expect(screen.getByText('Question 1?')).toBeInTheDocument();
      expect(screen.getByText('Question 2?')).toBeInTheDocument();
    });
  });

  describe('Vertical variant', () => {
    it('renders Vertical layout correctly', () => {
      render(<AccordionBlockVertical {...mockProps} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('handles missing link in Vertical variant', () => {
      const propsWithoutLink: any = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              link: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                  },
                },
              },
            },
          },
        },
      };
      render(<AccordionBlockVertical {...propsWithoutLink} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.queryByText('View All FAQ')).not.toBeInTheDocument();
    });
  });

  describe('BoxedAccordion variant', () => {
    it('renders BoxedAccordion layout correctly', () => {
      render(<AccordionBlockBoxedAccordion {...mockProps} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('handles missing description in BoxedAccordion', () => {
      const propsWithoutDescription = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              description: undefined,
            },
          },
        },
      };
      render(<AccordionBlockBoxedAccordion {...propsWithoutDescription} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
    });
  });

  describe('BoxedContent variant', () => {
    it('renders BoxedContent layout correctly', () => {
      render(<AccordionBlockBoxedContent {...mockProps} />);
      expect(screen.getByText('FAQ Section')).toBeInTheDocument();
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('handles missing heading in BoxedContent', () => {
      const propsWithoutHeading = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              heading: undefined,
            },
          },
        },
      };
      render(<AccordionBlockBoxedContent {...propsWithoutHeading} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });
  });

  describe('AccordionBlockItem', () => {
    it('handles missing item heading', () => {
      const propsWithMissingItemHeading = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'item-1',
                    heading: undefined,
                    description: {
                      jsonValue: {
                        value: 'Answer without question',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      };
      render(<AccordionBlockDefault {...propsWithMissingItemHeading} />);
      expect(screen.getByText('Answer without question')).toBeInTheDocument();
    });

    it('handles missing item description', () => {
      const propsWithMissingItemDescription = {
        ...mockProps,
        fields: {
          data: {
            datasource: {
              ...mockProps.fields.data.datasource,
              children: {
                results: [
                  {
                    id: 'item-1',
                    heading: {
                      jsonValue: {
                        value: 'Question without answer?',
                      },
                    },
                    description: undefined,
                  },
                ],
              },
            },
          },
        },
      };
      render(<AccordionBlockDefault {...propsWithMissingItemDescription} />);
      expect(screen.getByText('Question without answer?')).toBeInTheDocument();
    });
  });
});
