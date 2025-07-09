import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export type AlertBannerProps = ComponentProps &
  AlertBannerParams &
  AlertBannerFields &
  AlertBannerData;

export type AlertBannerParams = {
  params: {
    mock_param?: string;
  };
};

// Non-component data source fields
// TODO_SCAFFOLD_BE: Populate if needed, remove if not
export type AlertBannerData = {
  externalFields: {
    mock_external_data: Field<string>;
  };
};

export type AlertBannerFields = {
  fields: {
    title: Field<string>; // Sitecore editable text field
    description: Field<string>; // Sitecore editable text field
    image?: ImageField; // Sitecore editable image field
    link?: LinkField; // Sitecore editable link field
  };
};
