import {
  Field,
  ImageField,
  NextImage as JssImage,
  Link as JssLink,
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
            <JssImage field={Image} />
          ) : (
            <JssLink field={TargetUrl}>
              <JssImage field={Image} />
            </JssLink>
          )}
        </div>
      </div>
    );
  }

  return <div className={classNameList}></div>;
};

export const Default = (props: ImageProps): JSX.Element => {
  const { page } = useSitecore();
  const { Image } = props.fields;
  const sxaStyles = props.params?.Styles ?? '';
  const classNameList = `component image ${sxaStyles}`.trimEnd();

  const modifyImageProps = {
    ...Image,
    value: {
      ...Image?.value,
      alt: Image?.value?.alt || 'image',
    },
  };

  if (props.fields) {
    return (
      <div className={classNameList}>
        <div className="component-content">
          {page.mode.isEditing ? <JssImage field={modifyImageProps} /> : ''}
        </div>
      </div>
    );
  }

  return <div className={classNameList}></div>;
};
