import { Field } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import { EnumValues } from '@/enumerations/generic.enum';
import { ThemeLimited as Theme } from '@/enumerations/ThemeLimited.enum';

/**
 * Model used for Sitecore Component integration
 */
export type TextBannerProps = OptionalComponentProps & TextBannerFields & TextBannerParams;

export type TextBannerFields = {
  fields: {
    heading: Field<string>; // Sitecore editable text field
    description?: Field<string>; // Sitecore editable text field
  };
  isPageEditing?: boolean;
};

export type TextBannerParams = {
  params?: {
    theme?: EnumValues<typeof Theme>;
  };
};

