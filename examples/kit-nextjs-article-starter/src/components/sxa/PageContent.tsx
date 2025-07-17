import React, { JSX } from 'react';
import {
  RichText as ContentSdkRichText,
  useSitecore,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PageContentProps): JSX.Element => {
  const { page } = useSitecore();
  const sxaStyles = props.params?.Styles ?? '';
  const id = props.params?.RenderingIdentifier ?? null;

  if (!(props.fields && props.fields.Content) && !page?.layout.sitecore.route?.fields?.Content) {
    return (
      <div className={`component page-content ${sxaStyles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Page Content]</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`component page-content ${sxaStyles}`} id={id ? id : undefined}>
      <div className="component-content">
        <ContentSdkRichText
          field={
            (props.fields && props.fields.Content
              ? props.fields.Content
              : page?.layout.sitecore.route?.fields?.Content) as RichTextField
          }
          className="field-content"
        />
      </div>
    </div>
  );
};
