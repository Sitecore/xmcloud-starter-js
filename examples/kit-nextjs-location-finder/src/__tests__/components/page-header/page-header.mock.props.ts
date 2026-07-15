import type { PageHeaderProps } from '@/components/page-header/page-header.props';
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

export const mockPageHeaderProps: PageHeaderProps = {
  rendering: {
    componentName: 'PageHeader',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    data: {
      datasource: {
        imageRequired: {
          jsonValue: {
            value: {
              src: '/images/alaris-ambulance-fleet.jpg',
              alt: 'Alaris Emergency Vehicle Fleet',
              width: '1200',
              height: '800',
            },
          },
        },
        link1: {
          jsonValue: {
            value: {
              href: '/vehicles/explore',
              text: 'Explore Our Fleet',
              linktype: 'internal',
              target: '',
            },
          },
        },
        link2: {
          jsonValue: {
            value: {
              href: '/contact/sales',
              text: 'Contact Sales',
              linktype: 'internal',
              target: '',
            },
          },
        },
      },
      externalFields: {
        pageTitle: {
          jsonValue: {
            value: 'Emergency Vehicle Solutions',
          },
        },
        pageHeaderTitle: {
          jsonValue: {
            value: 'Advanced Emergency Response Vehicles',
          },
        },
        pageSubtitle: {
          jsonValue: {
            value:
              '<p>Alaris delivers cutting-edge ambulances, fire trucks, and rescue vehicles engineered for the most demanding emergency situations. Trust our proven fleet to save lives.</p>',
          },
        },
      },
    },
  },
  page: mockPageBase,
};

export const mockPageHeaderPropsWithoutLinks: PageHeaderProps = {
  rendering: {
    componentName: 'PageHeader',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    data: {
      datasource: {
        imageRequired: {
          jsonValue: {
            value: {
              src: '/images/alaris-rescue-vehicle.jpg',
              alt: 'Alaris Rescue Vehicle',
              width: '1200',
              height: '800',
            },
          },
        },
        link1: {
          jsonValue: {
            value: {
              href: '',
              text: '',
              linktype: 'internal',
              target: '',
            },
          },
        },
        link2: {
          jsonValue: {
            value: {
              href: '',
              text: '',
              linktype: 'internal',
              target: '',
            },
          },
        },
      },
      externalFields: {
        pageTitle: {
          jsonValue: {
            value: 'Fire & Rescue Equipment',
          },
        },
        pageHeaderTitle: {
          jsonValue: {
            value: '',
          },
        },
        pageSubtitle: {
          jsonValue: {
            value: '<p>Professional grade equipment for first responders.</p>',
          },
        },
      },
    },
  },
  page: mockPageBase,
};

export const mockPageHeaderPropsWithStyles: PageHeaderProps = {
  rendering: {
    componentName: 'PageHeader',
    dataSource: 'mock-datasource',
  },
  params: {
    styles: 'position-right custom-style',
  },
  fields: {
    data: {
      datasource: {
        imageRequired: {
          jsonValue: {
            value: {
              src: '/images/alaris-command-unit.jpg',
              alt: 'Alaris Mobile Command Unit',
              width: '1200',
              height: '800',
            },
          },
        },
      },
      externalFields: {
        pageTitle: {
          jsonValue: {
            value: 'Mobile Command Centers',
          },
        },
        pageHeaderTitle: {
          jsonValue: {
            value: 'Command & Control Solutions',
          },
        },
        pageSubtitle: {
          jsonValue: {
            value: '<p>Strategic mobile command centers for coordinated emergency response.</p>',
          },
        },
      },
    },
  },
  page: mockPageBase,
};
