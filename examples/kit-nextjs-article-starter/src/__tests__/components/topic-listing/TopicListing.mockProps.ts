import { Field, LinkField, ComponentRendering, Page, PageMode } from '@sitecore-content-sdk/nextjs';
import { TopicListingProps, TopicItemProps } from '@/components/topic-listing/topic-listing.props';

// Mock rendering object
const mockRendering: ComponentRendering = {
  componentName: 'TopicListing',
  dataSource: '',
  params: {},
};

// Mock page object
const mockPage: Page = {
  mode: {
    name: 'normal' as PageMode['name'],
    isEditing: false,
    isPreview: false,
    isNormal: true,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
  },
  layout: {
    sitecore: {
      route: null,
    },
  } as Page['layout'],
  locale: 'en',
};

// Mock topic items
export const mockTopicItem1: TopicItemProps = {
  link: {
    jsonValue: {
      value: {
        href: '/topics/technology',
        text: 'Technology',
        linktype: 'internal',
        url: '/topics/technology',
      },
    } as LinkField,
  },
};

export const mockTopicItem2: TopicItemProps = {
  link: {
    jsonValue: {
      value: {
        href: '/topics/design',
        text: 'Design',
        linktype: 'internal',
        url: '/topics/design',
      },
    } as LinkField,
  },
};

export const mockTopicItem3: TopicItemProps = {
  link: {
    jsonValue: {
      value: {
        href: '/topics/business',
        text: 'Business',
        linktype: 'internal',
        url: '/topics/business',
      },
    } as LinkField,
  },
};

export const mockTopicItem4: TopicItemProps = {
  link: {
    jsonValue: {
      value: {
        href: '/topics/marketing',
        text: 'Marketing',
        linktype: 'internal',
        url: '/topics/marketing',
      },
    } as LinkField,
  },
};

export const mockTopicItemWithoutLink: TopicItemProps = {};

// Mock title
export const mockTitle: Field<string> = {
  value: 'Explore Our Topics',
};

// Default props with all fields
export const defaultProps: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [mockTopicItem1, mockTopicItem2, mockTopicItem3, mockTopicItem4],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'shooting-star',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props without shooting star theme
export const propsWithoutShootingStar: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [mockTopicItem1, mockTopicItem2, mockTopicItem3],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with shooting star theme
export const propsWithShootingStar: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [mockTopicItem1, mockTopicItem2],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'shooting-star',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with single topic
export const propsWithSingleTopic: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [mockTopicItem1],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props without title
export const propsWithoutTitle: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: { value: '' },
        },
        children: {
          results: [mockTopicItem1, mockTopicItem2],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with empty topics array
export const propsWithEmptyTopics: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props without children
export const propsWithoutChildren: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props without fields (null scenario)
export const propsWithoutFields: TopicListingProps = {
  fields: null as unknown as typeof defaultProps.fields,
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with undefined fields
export const propsWithUndefinedFields: TopicListingProps = {
  fields: undefined as unknown as typeof defaultProps.fields,
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

// Props with topics including one without link
export const propsWithMixedTopics: TopicListingProps = {
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: mockTitle,
        },
        children: {
          results: [mockTopicItem1, mockTopicItemWithoutLink, mockTopicItem2],
        },
      },
    },
  },
  params: {
    backgroundTheme: 'default',
  },
  rendering: mockRendering,
  page: mockPage,
};

