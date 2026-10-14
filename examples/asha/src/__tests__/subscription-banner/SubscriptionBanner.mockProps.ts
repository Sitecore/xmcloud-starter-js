import { SubscriptionBannerProps } from '../../components/subscription-banner/subscription-banner.props';
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { mockPage } from '../test-utils/mockPage';

const createMockField = <T>(value: T): Field<T> => ({ value }) as unknown as Field<T>;

const createMockLinkField = (href: string, text: string): LinkField =>
  ({
    value: { href, text },
  }) as unknown as LinkField;

export const defaultSubscriptionBannerProps: SubscriptionBannerProps = {
  rendering: { componentName: 'SubscriptionBanner' },
  params: {
    styles: 'custom-subscription-banner-styles',
  },
  page: mockPage,
  fields: {
    titleRequired: createMockField('Stay Updated with SYNC Audio'),
    descriptionOptional: createMockField(
      'Get the latest updates on new products, exclusive offers, and audio insights delivered straight to your inbox.'
    ),
    buttonLink: createMockLinkField('/subscribe', 'Subscribe Now'),
    emailPlaceholder: createMockField('Enter your email address'),
    emailErrorMessage: createMockField('Please enter a valid email address'),
    thankYouMessage: createMockField('Thank you for subscribing!'),
  },
};

export const subscriptionBannerPropsMinimal: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    titleRequired: createMockField('Subscribe to Our Newsletter'),
    buttonLink: createMockLinkField('/subscribe', 'Subscribe'),
  },
};

export const subscriptionBannerPropsNoDescription: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    ...defaultSubscriptionBannerProps.fields,
    descriptionOptional: undefined,
  },
};

export const subscriptionBannerPropsCustomMessages: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    ...defaultSubscriptionBannerProps.fields,
    emailPlaceholder: createMockField('Your email here...'),
    emailErrorMessage: createMockField('Oops! Invalid email format'),
    thankYouMessage: createMockField("You're all set! Welcome to SYNC Audio!"),
  },
};

export const subscriptionBannerPropsLongContent: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    titleRequired: createMockField(
      'Stay Connected with SYNC Audio - Your Ultimate Source for Premium Audio Equipment, Industry News, Product Reviews, and Exclusive Member Benefits'
    ),
    descriptionOptional: createMockField(
      'Join our comprehensive newsletter to receive detailed product announcements, in-depth audio equipment reviews, exclusive member discounts, early access to new releases, expert audio tips and tutorials, industry news and trends, and personalized recommendations based on your audio preferences and purchase history. Our newsletter is carefully crafted to provide valuable content for audiophiles, music producers, and audio enthusiasts alike.'
    ),
    buttonLink: createMockLinkField('/newsletter-subscription', 'Join Our Audio Community Today'),
    emailPlaceholder: createMockField('Please enter your email address to receive updates'),
    emailErrorMessage: createMockField(
      'The email address format is invalid. Please check and try again.'
    ),
    thankYouMessage: createMockField(
      'Thank you for joining the SYNC Audio community! You will receive a confirmation email shortly.'
    ),
  },
};

export const subscriptionBannerPropsSpecialChars: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    titleRequired: createMockField('Sübscrïbe tö SYNC™ Àudio Üpdates & Spëciàl Öffers'),
    descriptionOptional: createMockField(
      'Reçevez des mises à jour sur nos équipements audio premium et des offres exclusives. Découvrez les dernières innovations en matière de son de haute qualité.'
    ),
    buttonLink: createMockLinkField('/subscribe-special', "S'abonner Maintenant"),
    emailPlaceholder: createMockField('Entrez votre adresse e-mail ici...'),
    emailErrorMessage: createMockField("Format d'e-mail invalide. Veuillez réessayer."),
    thankYouMessage: createMockField('Merci de votre inscription! Bienvenue chez SYNC Audio™!'),
  },
};

export const subscriptionBannerPropsEmptyFields: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    titleRequired: createMockField(''),
    descriptionOptional: createMockField(''),
    buttonLink: createMockLinkField('', ''),
    emailPlaceholder: createMockField(''),
    emailErrorMessage: createMockField(''),
    thankYouMessage: createMockField(''),
  },
};

export const subscriptionBannerPropsNoFields: SubscriptionBannerProps = {
  rendering: { componentName: 'SubscriptionBanner' },
  params: {},
  page: mockPage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: null as any,
};

export const subscriptionBannerPropsUndefinedTitle: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    ...defaultSubscriptionBannerProps.fields,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    titleRequired: undefined as any,
  },
};

export const subscriptionBannerPropsNoParams: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  params: {},
};

export const subscriptionBannerPropsMalformedLink: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    ...defaultSubscriptionBannerProps.fields,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonLink: { value: null } as any,
  },
};

export const subscriptionBannerPropsTestValidation: SubscriptionBannerProps = {
  ...defaultSubscriptionBannerProps,
  fields: {
    titleRequired: createMockField('Test Email Validation'),
    descriptionOptional: createMockField('Test various email formats and validation scenarios.'),
    buttonLink: createMockLinkField('/test-subscribe', 'Test Subscribe'),
    emailPlaceholder: createMockField('test@example.com'),
    emailErrorMessage: createMockField('Test validation error message'),
    thankYouMessage: createMockField('Test thank you message'),
  },
};

// Mock useSitecore contexts for editing scenarios
export const mockUseSitecoreNormal = {
  page: { mode: { isEditing: false } },
} as unknown;

export const mockUseSitecoreEditing = {
  page: { mode: { isEditing: true } },
} as unknown;
