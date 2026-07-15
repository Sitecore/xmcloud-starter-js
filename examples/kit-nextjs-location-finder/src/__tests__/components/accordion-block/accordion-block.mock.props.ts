import { Page } from '@sitecore-content-sdk/nextjs';

// Mock page object with all required Page properties
const mockPageBase = {
  mode: {
    isEditing: false,
    isPreview: false,
    isNormal: true,
    name: 'normal' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

const mockPageEditing = {
  mode: {
    isEditing: true,
    isPreview: false,
    isNormal: false,
    name: 'edit' as const,
    designLibrary: { isVariantGeneration: false },
    isDesignLibrary: false,
  },
  layout: {
    sitecore: {
      context: {},
      route: null,
    },
  },
  locale: 'en',
} as Page;

// Mock props with complete accordion data
export const mockAccordionProps = {
  fields: {
    data: {
      datasource: {
        heading: {
          jsonValue: {
            value: 'Frequently Asked Questions',
            editable: '{"value":"Frequently Asked Questions","editable":true}',
          },
        },
        description: {
          jsonValue: {
            value: 'Find answers to common questions about our products and services.',
            editable:
              '{"value":"Find answers to common questions about our products and services.","editable":true}',
          },
        },
        link: {
          jsonValue: {
            value: {
              href: '/contact-us',
              text: 'Contact Support',
              linktype: 'internal',
              url: '/contact-us',
              anchor: '',
              target: '',
            },
          },
        },
        children: {
          results: [
            {
              heading: {
                jsonValue: {
                  value: 'What is our return policy?',
                  editable: '{"value":"What is our return policy?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value:
                    '<p>We offer a 30-day return policy for all unused items in original packaging.</p>',
                  editable:
                    '{"value":"<p>We offer a 30-day return policy for all unused items in original packaging.</p>","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'How do I track my order?',
                  editable: '{"value":"How do I track my order?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value:
                    '<p>Once your order ships, you will receive a tracking number via email.</p>',
                  editable:
                    '{"value":"Once your order ships, you will receive a tracking number via email.","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'Do you offer international shipping?',
                  editable: '{"value":"Do you offer international shipping?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Yes, we ship internationally to over 50 countries.</p>',
                  editable:
                    '{"value":"Yes, we ship internationally to over 50 countries.","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'What payment methods do you accept?',
                  editable: '{"value":"What payment methods do you accept?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value:
                    '<p>We accept all major credit cards, PayPal, Apple Pay, and Google Pay.</p>',
                  editable:
                    '{"value":"We accept all major credit cards, PayPal, Apple Pay, and Google Pay.","editable":true}',
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {
    styles: 'accordion-custom-styles',
  },
  rendering: {
    componentName: 'AccordionBlock',
    dataSource: 'accordion-datasource-id',
    uid: 'accordion-uid',
  },
  page: mockPageBase,
  isPageEditing: false,
};

// Mock props with minimal data (only heading and one item)
export const mockAccordionPropsMinimal = {
  fields: {
    data: {
      datasource: {
        heading: {
          jsonValue: {
            value: 'Basic FAQ',
            editable: '{"value":"Basic FAQ","editable":true}',
          },
        },
        link: {
          jsonValue: {
            value: {
              href: '',
              text: '',
              linktype: 'internal',
              url: '',
              anchor: '',
              target: '',
            },
          },
        },
        children: {
          results: [
            {
              heading: {
                jsonValue: {
                  value: 'Single Question?',
                  editable: '{"value":"Single Question?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Single answer content.</p>',
                  editable: '{"value":"<p>Single answer content.</p>","editable":true}',
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {},
  rendering: {
    componentName: 'AccordionBlock',
    dataSource: 'accordion-minimal-id',
    uid: 'accordion-minimal-uid',
  },
  page: mockPageBase,
  isPageEditing: false,
};

// Mock props for editing mode
export const mockAccordionPropsEditing = {
  ...mockAccordionProps,
  isPageEditing: true,
  page: mockPageEditing,
};

// Mock props without datasource (for fallback testing)
export const mockAccordionPropsEmpty = {
  fields: {
    data: {},
  },
  params: {
    styles: 'empty-accordion-styles',
  },
  rendering: {
    componentName: 'AccordionBlock',
    dataSource: '',
    uid: 'accordion-empty-uid',
  },
  page: mockPageBase,
  isPageEditing: false,
};

// Mock props without description and link
export const mockAccordionPropsNoExtras = {
  fields: {
    data: {
      datasource: {
        heading: {
          jsonValue: {
            value: 'Simple Accordion',
            editable: '{"value":"Simple Accordion","editable":true}',
          },
        },
        children: {
          results: [
            {
              heading: {
                jsonValue: {
                  value: 'Simple Question?',
                  editable: '{"value":"Simple Question?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Simple answer.</p>',
                  editable: '{"value":"<p>Simple answer.</p>","editable":true}',
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {
    styles: 'simple-accordion-styles',
  },
  rendering: {
    componentName: 'AccordionBlock',
    dataSource: 'accordion-simple-id',
    uid: 'accordion-simple-uid',
  },
  page: mockPageBase,
  isPageEditing: false,
};

// Mock props with many items (for 50/50 column testing)
export const mockAccordionPropsMany = {
  fields: {
    data: {
      datasource: {
        heading: {
          jsonValue: {
            value: 'Extended FAQ',
            editable: '{"value":"Extended FAQ","editable":true}',
          },
        },
        description: {
          jsonValue: {
            value: 'Comprehensive list of questions and answers.',
            editable: '{"value":"Comprehensive list of questions and answers.","editable":true}',
          },
        },
        link: {
          jsonValue: {
            value: {
              href: '/help',
              text: 'Get Help',
              linktype: 'internal',
              url: '/help',
              anchor: '',
              target: '',
            },
          },
        },
        children: {
          results: [
            {
              heading: {
                jsonValue: {
                  value: 'Question 1?',
                  editable: '{"value":"Question 1?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Answer 1 content.</p>',
                  editable: '{"value":"<p>Answer 1 content.</p>","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'Question 2?',
                  editable: '{"value":"Question 2?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Answer 2 content.</p>',
                  editable: '{"value":"<p>Answer 2 content.</p>","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'Question 3?',
                  editable: '{"value":"Question 3?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Answer 3 content.</p>',
                  editable: '{"value":"<p>Answer 3 content.</p>","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'Question 4?',
                  editable: '{"value":"Question 4?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Answer 4 content.</p>',
                  editable: '{"value":"<p>Answer 4 content.</p>","editable":true}',
                },
              },
            },
            {
              heading: {
                jsonValue: {
                  value: 'Question 5?',
                  editable: '{"value":"Question 5?","editable":true}',
                },
              },
              description: {
                jsonValue: {
                  value: '<p>Answer 5 content.</p>',
                  editable: '{"value":"<p>Answer 5 content.</p>","editable":true}',
                },
              },
            },
          ],
        },
      },
    },
  },
  params: {
    styles: 'extended-accordion-styles',
  },
  rendering: {
    componentName: 'AccordionBlock',
    dataSource: 'accordion-extended-id',
    uid: 'accordion-extended-uid',
  },
  page: mockPageBase,
  isPageEditing: false,
};
