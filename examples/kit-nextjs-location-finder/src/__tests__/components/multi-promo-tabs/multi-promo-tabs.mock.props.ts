import type {
  MultiPromoTabsProps,
  MultiPromoTabsFields,
} from '@/components/multi-promo-tabs/multi-promo-tabs.props';
import { Page } from '@sitecore-content-sdk/nextjs';

export const mockMultiPromoTabItems: MultiPromoTabsFields[] = [
  {
    title: {
      jsonValue: {
        value: 'Ambulances',
      },
    },
    image1: {
      jsonValue: {
        value: {
          src: '/images/alaris-ambulance-emergency.jpg',
          alt: 'Alaris Emergency Ambulance',
          width: '800',
          height: '600',
        },
      },
    },
    link1: {
      jsonValue: {
        value: {
          href: '/vehicles/ambulances/type-1',
          text: 'View Type I Ambulances',
          linktype: 'internal',
          target: '',
        },
      },
    },
    image2: {
      jsonValue: {
        value: {
          src: '/images/alaris-ambulance-critical-care.jpg',
          alt: 'Alaris Critical Care Ambulance',
          width: '800',
          height: '600',
        },
      },
    },
    link2: {
      jsonValue: {
        value: {
          href: '/vehicles/ambulances/type-3',
          text: 'View Type III Ambulances',
          linktype: 'internal',
          target: '',
        },
      },
    },
  },
  {
    title: {
      jsonValue: {
        value: 'Fire & Rescue',
      },
    },
    image1: {
      jsonValue: {
        value: {
          src: '/images/alaris-fire-truck.jpg',
          alt: 'Alaris Fire Truck',
          width: '800',
          height: '600',
        },
      },
    },
    link1: {
      jsonValue: {
        value: {
          href: '/vehicles/fire-trucks',
          text: 'Explore Fire Trucks',
          linktype: 'internal',
          target: '',
        },
      },
    },
    image2: {
      jsonValue: {
        value: {
          src: '/images/alaris-rescue-vehicle.jpg',
          alt: 'Alaris Rescue Vehicle',
          width: '800',
          height: '600',
        },
      },
    },
    link2: {
      jsonValue: {
        value: {
          href: 'https://alaris-specs.com/rescue-vehicles',
          text: 'Technical Specifications',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
  {
    title: {
      jsonValue: {
        value: 'Mobile Command',
      },
    },
    image1: {
      jsonValue: {
        value: {
          src: '/images/alaris-command-center.jpg',
          alt: 'Alaris Mobile Command Center',
          width: '800',
          height: '600',
        },
      },
    },
    link1: {
      jsonValue: {
        value: {
          href: '/vehicles/command-units/standard',
          text: 'Standard Command Units',
          linktype: 'internal',
          target: '',
        },
      },
    },
    image2: {
      jsonValue: {
        value: {
          src: '/images/alaris-command-tactical.jpg',
          alt: 'Alaris Tactical Command Unit',
          width: '800',
          height: '600',
        },
      },
    },
    link2: {
      jsonValue: {
        value: {
          href: '/vehicles/command-units/tactical',
          text: 'Tactical Command Units',
          linktype: 'internal',
          target: '',
        },
      },
    },
  },
];

export const mockMultiPromoTabsProps: MultiPromoTabsProps = {
  rendering: {
    componentName: 'MultiPromoTabs',
    dataSource: 'mock-datasource',
  },
  params: {},
  fields: {
    data: {
      datasource: {
        title: {
          jsonValue: {
            value: 'Explore our emergency vehicles',
          },
        },
        droplistLabel: {
          jsonValue: {
            value: 'Select a vehicle type',
          },
        },
        children: {
          results: mockMultiPromoTabItems,
        },
      },
    },
  },
  page: {
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
  } as Page,
};
