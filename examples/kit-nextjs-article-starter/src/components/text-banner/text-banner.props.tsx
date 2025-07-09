import { Field, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { EnumValues } from '@/enumerations/generic.enum';
import { Theme } from '@/enumerations/Theme.enum';

/**
 * Model used for Sitecore Component integration
 */
export type TextBannerProps = ComponentProps & TextBannerFields & TextBannerParams;

export type TextBannerFields = {
  fields: {
    heading: Field<string>; // Sitecore editable text field
    description?: Field<string>; // Sitecore editable text field
    link?: LinkField; // Sitecore editable link field
    link2?: LinkField; // Sitecore editable link field
    image?: ImageField; // Sitecore editable image field
  };
  isPageEditing?: boolean;
};

export type TextBannerParams = {
  params?: {
    excludeTopMargin?: string;
    theme?: EnumValues<typeof Theme>;
  };
};
