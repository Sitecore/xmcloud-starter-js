import { TopicListingProps, TopicItemProps } from '@/components/topic-listing/topic-listing.props';
import { Field } from '@sitecore-content-sdk/nextjs';

export const mockTopicItems: TopicItemProps[] = [
  {
    link: {
      jsonValue: {
        value: {
          href: '/vehicles/ambulances',
          text: 'Emergency Ambulances',
          linktype: 'internal',
          target: '',
        },
      },
    },
    icon: {
      jsonValue: {
        value: 'arrow-right',
      },
    },
  },
  {
    link: {
      jsonValue: {
        value: {
          href: '/vehicles/fire-trucks',
          text: 'Fire & Rescue',
          linktype: 'internal',
          target: '',
        },
      },
    },
    icon: {
      jsonValue: {
        value: 'signal',
      },
    },
  },
  {
    link: {
      jsonValue: {
        value: {
          href: '/vehicles/command-centers',
          text: 'Mobile Command',
          linktype: 'internal',
          target: '',
        },
      },
    },
    icon: {
      jsonValue: {
        value: 'communities',
      },
    },
  },
  {
    link: {
      jsonValue: {
        value: {
          href: '/fleet-solutions',
          text: 'Fleet Management',
          linktype: 'internal',
          target: '',
        },
      },
    },
    icon: {
      jsonValue: {
        value: 'diversity',
      },
    },
  },
];

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

export const mockTopicListingProps: TopicListingProps = {
  rendering: {
    componentName: 'TopicListing',
    dataSource: 'mock-datasource',
  },
  params: {
    backgroundTheme: {
      value: 'primary',
    } as Field<string>,
  },
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Explore Our Emergency Vehicle Solutions',
          },
        },
        children: {
          results: mockTopicItems,
        },
      },
    },
  },
  page: mockPageBase,
};

export const mockTopicListingPropsWithoutChildren: TopicListingProps = {
  rendering: {
    componentName: 'TopicListing',
    dataSource: 'mock-datasource',
  },
  params: {
    backgroundTheme: {
      value: 'primary',
    } as Field<string>,
  },
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Vehicle Categories',
          },
        },
      },
    },
  },
  page: mockPageBase,
};

export const mockSingleTopicItem: TopicItemProps = {
  link: {
    jsonValue: {
      value: {
        href: '/vehicles/type-1-ambulance',
        text: 'Type I Ambulance',
        linktype: 'internal',
        target: '',
      },
    },
  },
  icon: {
    jsonValue: {
      value: 'arrow-up-right',
    },
  },
};

export const mockTopicItemWithoutLink: TopicItemProps = {
  icon: {
    jsonValue: {
      value: 'default',
    },
  },
};
