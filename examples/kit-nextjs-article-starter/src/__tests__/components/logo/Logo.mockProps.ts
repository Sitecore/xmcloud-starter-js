import { ImageField } from '@sitecore-content-sdk/nextjs';
import { LogoProps } from '@/components/logo/logo.props';

// Mock logo fields
export const mockLogoField: ImageField = {
  value: {
    src: '/images/logo.svg',
    alt: 'Company Logo',
    width: 164,
    height: 40,
  },
};

export const mockLogoFieldLarge: ImageField = {
  value: {
    src: '/images/logo-large.svg',
    alt: 'Large Company Logo',
    width: 300,
    height: 80,
  },
};

export const mockLogoFieldPng: ImageField = {
  value: {
    src: '/images/logo.png',
    alt: 'Company Logo PNG',
    width: 200,
    height: 50,
  },
};

export const mockLogoFieldWithoutAlt: ImageField = {
  value: {
    src: '/images/logo-no-alt.svg',
    alt: '',
    width: 164,
    height: 40,
  },
};

export const mockLogoFieldWithoutValue: ImageField = {
  value: undefined as unknown as ImageField['value'],
};

export const mockLogoFieldWithoutSrc: ImageField = {
  value: {
    src: '',
    alt: 'Logo',
    width: 164,
    height: 40,
  },
};

// Complete props combinations
export const defaultProps: LogoProps = {
  logo: mockLogoField,
  className: 'custom-logo-class',
};

export const propsWithoutClassName: LogoProps = {
  logo: mockLogoField,
};

export const propsWithLargeLogo: LogoProps = {
  logo: mockLogoFieldLarge,
  className: 'large-logo-class',
};

export const propsWithPngLogo: LogoProps = {
  logo: mockLogoFieldPng,
  className: 'png-logo-class',
};

export const propsWithoutAlt: LogoProps = {
  logo: mockLogoFieldWithoutAlt,
  className: 'logo-no-alt',
};

export const propsWithoutLogoValue: LogoProps = {
  logo: mockLogoFieldWithoutValue,
  className: 'no-value-class',
};

export const propsWithoutSrc: LogoProps = {
  logo: mockLogoFieldWithoutSrc,
  className: 'no-src-class',
};

export const propsWithoutLogo: LogoProps = {
  logo: undefined,
  className: 'no-logo-class',
};

export const propsWithEmptyClassName: LogoProps = {
  logo: mockLogoField,
  className: '',
};

