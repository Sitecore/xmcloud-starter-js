import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  LinkField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';

interface Fields {
  Image: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Banner = (props: ImageProps): JSX.Element => {
  const { page } = useSitecore();
  const { Image } = props.fields;
  const { TargetUrl } = props.fields;
  const sxaStyles = props.params?.Styles ?? '';
  const classNameList = `component image ${sxaStyles}`.trimEnd();

  if (Image?.value && Image?.value.src) {
    return (
      <div className={classNameList}>
        <div className="component-content">
          {page.mode.isEditing || !props.fields.TargetUrl?.value?.href ? (
            <ContentSdkImage field={Image} />
          ) : (
            <ContentSdkLink field={TargetUrl}>
              <ContentSdkImage field={Image} />
            </ContentSdkLink>
          )}
        </div>
      </div>
    );
  }

  return <div className={classNameList}></div>;
};

export const Default = (props: ImageProps): JSX.Element => {
  const { fields, params } = props;
  const sxaStyles = params?.Styles ?? '';
  const classNameList = `component image ${sxaStyles}`.trimEnd();

  if (fields) {
    const { Image } = props.fields;

    const modifyImageProps = {
      ...Image,
      value: {
        ...Image?.value,
        alt: Image?.value?.alt || 'image',
      },
    };

    return (
      <div className={classNameList}>
        <div className="component-content">
          <ContentSdkImage field={modifyImageProps} />
        </div>
      </div>
    );
  }

  return <div className={classNameList}></div>;
};
