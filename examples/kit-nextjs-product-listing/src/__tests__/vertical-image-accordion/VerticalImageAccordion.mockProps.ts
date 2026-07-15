import {
  VerticalImageAccordionProps,
  AccordionItem,
} from '../../components/vertical-image-accordion/vertical-image-accordion.props';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt },
  }) as unknown as ImageField;

const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const createMockAccordionItem = (
  title: string,
  description: string,
  imageSrc: string,
  imageAlt: string,
  ctaHref?: string,
  ctaText?: string
): AccordionItem => ({
  title: { jsonValue: createMockField(title) },
  description: { jsonValue: createMockField(description) },
  image: createMockImageField(imageSrc, imageAlt),
  cta: ctaHref && ctaText ? { jsonValue: createMockLinkField(ctaHref, ctaText) } : undefined,
});

export const defaultVerticalImageAccordionProps: VerticalImageAccordionProps = {
  rendering: { componentName: 'VerticalImageAccordion' },
  params: {
    styles: 'vertical-accordion-custom-styles',
  },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Premium Audio Solutions'),
        },
        items: {
          results: [
            createMockAccordionItem(
              'Professional Headphones',
              'Experience studio-quality sound with our professional headphone collection designed for critical listening and music production.',
              '/images/headphones.jpg',
              'Professional headphones on studio desk',
              '/headphones',
              'Shop Headphones'
            ),
            createMockAccordionItem(
              'Studio Monitors',
              'Accurate monitoring solutions for professional audio production with flat frequency response and precise imaging.',
              '/images/monitors.jpg',
              'Studio monitors in professional setup',
              '/monitors',
              'Browse Monitors'
            ),
            createMockAccordionItem(
              'Audio Accessories',
              'Complete your audio setup with premium cables, stands, and acoustic treatment solutions.',
              '/images/accessories.jpg',
              'Audio accessories and cables',
              '/accessories',
              'View Accessories'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsNoTitle: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: undefined,
        items: {
          results: [
            createMockAccordionItem(
              'Audio Equipment',
              'Professional audio solutions.',
              '/images/equipment.jpg',
              'Audio equipment'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsEmptyTitle: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: createMockField('') },
        items: {
          results: defaultVerticalImageAccordionProps.fields.data.datasource.items!.results,
        },
      },
    },
  },
};

export const verticalImageAccordionPropsSingleItem: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Featured Product'),
        },
        items: {
          results: [
            createMockAccordionItem(
              'Premium Headphones',
              'The ultimate listening experience with our flagship headphone model.',
              '/images/premium-headphones.jpg',
              'Premium headphones close-up',
              '/premium-headphones',
              'Learn More'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsNoCTA: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Products Without CTA'),
        },
        items: {
          results: [
            createMockAccordionItem(
              'Display Only Item',
              'This item has no call-to-action button.',
              '/images/display-item.jpg',
              'Display only product'
            ),
            createMockAccordionItem(
              'Another Display Item',
              'Another item without CTA for testing.',
              '/images/display-item-2.jpg',
              'Second display item'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsLongContent: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField(
            'Comprehensive Audio Solutions for Professional Studios, Home Recording, and Live Performance Applications'
          ),
        },
        items: {
          results: [
            createMockAccordionItem(
              'Professional Studio Headphones for Critical Listening and Audio Production Work',
              'Experience unparalleled audio fidelity with our professional studio headphones, meticulously engineered for critical listening applications in recording studios, mastering suites, and broadcast facilities. These headphones feature precision-tuned drivers, comfortable ergonomic design for extended listening sessions, and robust construction that meets the demanding requirements of professional audio environments.',
              '/images/professional-headphones-long.jpg',
              'Professional studio headphones in recording environment',
              '/professional-headphones-collection',
              'Explore Professional Headphones Collection'
            ),
            createMockAccordionItem(
              'Reference Studio Monitors for Accurate Audio Reproduction and Mixing Applications',
              'Achieve perfect mixes with our reference studio monitors that deliver transparent, uncolored sound reproduction across the entire frequency spectrum. These monitors feature advanced driver technology, precision crossover networks, and acoustic design optimized for near-field monitoring in professional studio environments. Ideal for mixing, mastering, and critical evaluation of audio content.',
              '/images/reference-monitors-long.jpg',
              'Reference studio monitors in professional mixing environment',
              '/reference-studio-monitors-series',
              'Browse Reference Monitor Series'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsSpecialChars: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField(
            'Solutions Audio Professionnelles™ & Équipements Spécialisés'
          ),
        },
        items: {
          results: [
            createMockAccordionItem(
              'Casques Audio Professionnels & Hi-Fi',
              "Découvrez notre collection de casques audio professionnels conçus pour l'écoute critique et la production musicale de haute qualité. Précision, confort et durabilité.",
              '/images/casques-professionnels.jpg',
              'Casques audio professionnels en studio',
              '/casques-audio',
              'Voir les Casques'
            ),
            createMockAccordionItem(
              'Moniteurs de Studio & Enceintes de Référence',
              'Moniteurs de studio de référence pour une reproduction audio précise et transparente. Idéaux pour le mixage et le mastering professionnel.',
              '/images/moniteurs-studio.jpg',
              'Moniteurs de studio dans environnement professionnel',
              '/moniteurs-studio',
              'Explorer les Moniteurs'
            ),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsEmptyItems: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('No Items Available'),
        },
        items: {
          results: [],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsEmptyFields: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField(''),
        },
        items: {
          results: [
            createMockAccordionItem('', '', '', ''),
            createMockAccordionItem('', '', '', ''),
          ],
        },
      },
    },
  },
};

export const verticalImageAccordionPropsNoFields: VerticalImageAccordionProps = {
  rendering: { componentName: 'VerticalImageAccordion' },
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
};

export const verticalImageAccordionPropsNoDatasource: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datasource: null as any,
    },
  },
};

export const verticalImageAccordionPropsNoItems: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('No Items in Datasource'),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: null as any,
      },
    },
  },
};

export const verticalImageAccordionPropsManyItems: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Complete Audio Equipment Catalog'),
        },
        items: {
          results: Array.from({ length: 6 }).map((_, i) =>
            createMockAccordionItem(
              `Audio Product ${i + 1}`,
              `Description for audio product ${i + 1} with professional features and quality construction.`,
              `/images/product-${i + 1}.jpg`,
              `Audio product ${i + 1} image`,
              `/product-${i + 1}`,
              `Shop Product ${i + 1}`
            )
          ),
        },
      },
    },
  },
};

export const verticalImageAccordionPropsCustomStyles: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  params: {
    styles: 'bg-dark text-light custom-accordion premium-styling responsive-layout',
  },
};

export const verticalImageAccordionPropsUndefinedParams: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: undefined as any,
};

export const verticalImageAccordionPropsMalformedItems: VerticalImageAccordionProps = {
  ...defaultVerticalImageAccordionProps,
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: createMockField('Malformed Items Test'),
        },
        items: {
          results: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { invalid: 'data' } as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            null as any,
            createMockAccordionItem(
              'Valid Item',
              'This item has valid data.',
              '/images/valid.jpg',
              'Valid item image'
            ),
          ],
        },
      },
    },
  },
};

// Mock useSitecore contexts for testing
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
