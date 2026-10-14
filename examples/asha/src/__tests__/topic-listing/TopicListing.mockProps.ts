import {
  TopicListingProps,
  TopicItemProps,
} from '../../components/topic-listing/topic-listing.props';
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';
import { mockPage } from '../test-utils/mockPage';

const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const createMockTopicItem = (
  linkHref: string,
  linkText: string,
  iconName: (typeof IconName)[keyof typeof IconName]
): TopicItemProps => ({
  link: {
    jsonValue: createMockLinkField(linkHref, linkText),
  },
  icon: {
    jsonValue: {
      value: iconName,
    },
  },
});

export const defaultTopicListingProps: TopicListingProps = {
  rendering: { componentName: 'TopicListing' },
  params: {
    backgroundTheme: 'default',
    styles: 'topic-listing-custom-styles',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Explore Our Audio Categories'),
        },
        children: {
          results: [
            createMockTopicItem('/headphones', 'Professional Headphones', IconName.MEDIA),
            createMockTopicItem('/speakers', 'Studio Monitors', IconName.MEDIA),
            createMockTopicItem('/microphones', 'Recording Equipment', IconName.MEDIA),
            createMockTopicItem('/accessories', 'Audio Accessories', IconName.DEFAULT),
          ],
        },
      },
    },
  },
};

export const topicListingPropsShootingStar: TopicListingProps = {
  ...defaultTopicListingProps,
  params: {
    backgroundTheme: 'shooting-star',
    styles: 'shooting-star-theme premium-styling',
  },
};

export const topicListingPropsSingleTopic: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Featured Category'),
        },
        children: {
          results: [createMockTopicItem('/featured', 'Premium Audio', IconName.ARROW_RIGHT)],
        },
      },
    },
  },
};

export const topicListingPropsNoTitle: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: undefined as any,
        children: {
          results: [
            createMockTopicItem('/audio', 'Audio Equipment', IconName.MEDIA),
            createMockTopicItem('/video', 'Video Equipment', IconName.MEDIA),
          ],
        },
      },
    },
  },
};

export const topicListingPropsEmptyTitle: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField(''),
        },
        children: {
          results: [createMockTopicItem('/empty-title', 'Test Topic', IconName.DEFAULT)],
        },
      },
    },
  },
};

export const topicListingPropsNoTopics: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('No Topics Available'),
        },
        children: {
          results: [],
        },
      },
    },
  },
};

export const topicListingPropsLongContent: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField(
            'Discover Our Comprehensive Collection of Professional Audio Equipment, Studio Gear, and High-Fidelity Sound Solutions for Every Audio Need'
          ),
        },
        children: {
          results: [
            createMockTopicItem(
              '/professional-headphones-studio-monitors',
              'Professional Headphones and Studio Monitors for Critical Listening and Audio Production',
              IconName.MEDIA
            ),
            createMockTopicItem(
              '/recording-microphones-audio-interfaces',
              'Recording Microphones, Audio Interfaces, and Professional Studio Equipment',
              IconName.MEDIA
            ),
          ],
        },
      },
    },
  },
};

export const topicListingPropsSpecialChars: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Explorez Nos Catégories Audio™ & Équipements Spécialisés'),
        },
        children: {
          results: [
            createMockTopicItem(
              '/casques-audio',
              'Casques Audio Professionnels & Hi-Fi',
              IconName.MEDIA
            ),
            createMockTopicItem(
              '/enceintes-moniteurs',
              'Enceintes & Moniteurs de Studio',
              IconName.MEDIA
            ),
          ],
        },
      },
    },
  },
};

export const topicListingPropsManyTopics: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Complete Audio Equipment Catalog'),
        },
        children: {
          results: Array.from({ length: 8 }).map((_, i) =>
            createMockTopicItem(
              `/category-${i + 1}`,
              `Audio Category ${i + 1}`,
              Object.values(IconName)[
                i % Object.values(IconName).length
              ] as (typeof IconName)[keyof typeof IconName]
            )
          ),
        },
      },
    },
  },
};

export const topicListingPropsNoFields: TopicListingProps = {
  rendering: { componentName: 'TopicListing' },
  params: {
    backgroundTheme: 'default',
  },
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
};

export const topicListingPropsNoDatasource: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datasource: null as any,
    },
  },
};

export const topicListingPropsNoChildren: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Topics Without Children'),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: null as any,
      },
    },
  },
};

export const topicListingPropsTopicsWithoutLinks: TopicListingProps = {
  ...defaultTopicListingProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Topics Without Links'),
        },
        children: {
          results: [
            {
              link: undefined,
              icon: {
                jsonValue: {
                  value: IconName.MEDIA,
                },
              },
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              link: { jsonValue: null as any },
              icon: {
                jsonValue: {
                  value: IconName.MEDIA,
                },
              },
            },
          ],
        },
      },
    },
  },
};

export const topicListingPropsCustomStyles: TopicListingProps = {
  ...defaultTopicListingProps,
  params: {
    backgroundTheme: 'custom',
    styles: 'bg-dark text-light custom-topic-listing premium-layout responsive-design',
  },
};

export const topicListingPropsUndefinedParams: TopicListingProps = {
  ...defaultTopicListingProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: {} as any, // Empty object instead of undefined to prevent destructuring error
};

// Mock useSitecore contexts for testing
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
