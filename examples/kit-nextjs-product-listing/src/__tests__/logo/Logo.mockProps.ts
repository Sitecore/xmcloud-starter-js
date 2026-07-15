import type { LogoProps } from '../../components/logo/logo.props';
import type { ImageField } from '@sitecore-content-sdk/nextjs';

// Inline utility functions
const createMockImageField = (src: string, alt: string): ImageField =>
  ({
    value: { src, alt, width: '200', height: '100' },
  }) as unknown as ImageField;

const mockLogoImageField = createMockImageField('/logo/company-logo.svg', 'Company Logo');
const mockEmptyImageField = createMockImageField('', '');

export const defaultLogoProps: LogoProps = {
  logo: mockLogoImageField,
  className: 'custom-logo-class',
};

export const logoPropsNoImage: LogoProps = {
  logo: mockEmptyImageField,
  className: 'custom-logo-class',
};

export const logoPropsMinimal: LogoProps = {
  logo: mockLogoImageField,
};

export const logoPropsCustomClass: LogoProps = {
  logo: mockLogoImageField,
  className: 'header-logo w-32 h-16',
};
