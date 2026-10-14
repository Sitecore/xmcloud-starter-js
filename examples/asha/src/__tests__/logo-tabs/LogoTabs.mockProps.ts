import type {
  LogoTabsProps,
  LogoItemProps,
  LogoTabContent,
} from '../../components/logo-tabs/logo-tabs.props';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

// Inline utility functions
const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '200', height: '100' },
  }) as unknown as ImageField;
const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

const mockTitleField = createMockField('Our Brand Partners');
const mockBackgroundImageField = createMockImageField(
  '/backgrounds/partners-bg.jpg',
  'Partners Background'
);

const mockLogo1: LogoItemProps = {
  title: { jsonValue: createMockField('Brand Alpha') },
  logo: { jsonValue: createMockImageField('/logos/brand-alpha.svg', 'Brand Alpha Logo') },
};

const mockLogo2: LogoItemProps = {
  title: { jsonValue: createMockField('Brand Beta') },
  logo: { jsonValue: createMockImageField('/logos/brand-beta.svg', 'Brand Beta Logo') },
};

const mockLogo3: LogoItemProps = {
  title: { jsonValue: createMockField('Brand Gamma') },
  logo: { jsonValue: createMockImageField('/logos/brand-gamma.svg', 'Brand Gamma Logo') },
};

const mockTabContent1: LogoTabContent = {
  heading: { jsonValue: createMockField('Brand Alpha Partnership') },
  cta: { jsonValue: createMockLinkField('/partners/alpha', 'Learn More About Alpha') },
};

const mockTabContent2: LogoTabContent = {
  heading: { jsonValue: createMockField('Brand Beta Collaboration') },
  cta: { jsonValue: createMockLinkField('/partners/beta', 'Discover Beta Solutions') },
};

const mockTabContent3: LogoTabContent = {
  heading: { jsonValue: createMockField('Brand Gamma Alliance') },
  cta: { jsonValue: createMockLinkField('/partners/gamma', 'Explore Gamma Products') },
};

export const defaultLogoTabsProps: LogoTabsProps = {
  rendering: { componentName: 'LogoTabs', params: {} },
  params: { colorScheme: 'primary' },
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        backgroundImage: { jsonValue: mockBackgroundImageField },
        logos: {
          results: [mockLogo1, mockLogo2, mockLogo3],
        },
        logoTabContent: {
          results: [mockTabContent1, mockTabContent2, mockTabContent3],
        },
      },
    },
  },
};

export const logoTabsPropsNoLogos: LogoTabsProps = {
  rendering: { componentName: 'LogoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        logos: {
          results: [],
        },
        logoTabContent: {
          results: [],
        },
      },
    },
  },
};

export const logoTabsPropsMinimal: LogoTabsProps = {
  rendering: { componentName: 'LogoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        logos: {
          results: [mockLogo1, mockLogo2],
        },
        logoTabContent: {
          results: [mockTabContent1, mockTabContent2],
        },
      },
    },
  },
};

export const logoTabsPropsNoBackground: LogoTabsProps = {
  rendering: { componentName: 'LogoTabs', params: {} },
  params: {},
  page: mockPage,
  fields: {
    data: {
      datasource: {
        title: { jsonValue: mockTitleField },
        logos: {
          results: [mockLogo1, mockLogo2, mockLogo3],
        },
        logoTabContent: {
          results: [mockTabContent1, mockTabContent2, mockTabContent3],
        },
      },
    },
  },
};
