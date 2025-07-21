import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { CSSProperties, type JSX } from 'react';

interface Fields {
  Image: ImageField & { metadata?: { [key: string]: unknown } };
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const ImageDefault = (props: ImageProps): JSX.Element => (
  <div className={`component image ${props.params.styles}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </div>
);

export const Banner = (props: ImageProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const classHeroBannerEmpty =
    isEditing && props.fields?.Image?.value?.class === 'scEmptyImage' ? 'hero-banner-empty' : '';
  const backgroundStyle = (props?.fields?.Image?.value?.src && {
    backgroundImage: `url('${props.fields.Image.value.src}')`,
  }) as CSSProperties;
  const modifyImageProps = {
    ...props.fields.Image,
    value: {
      ...props.fields.Image.value,
      style: { width: '100%', height: '100%' },
    },
  };

  return (
    <div
      className={`component hero-banner ${props.params.styles} ${classHeroBannerEmpty}`}
      id={id ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {isEditing ? <ContentSdkImage field={modifyImageProps} /> : ''}
      </div>
    </div>
  );
};

export const Default = (props: ImageProps): JSX.Element => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  if (props.fields) {
    const Image = () => <ContentSdkImage field={props.fields.Image} />;
    const id = props.params.RenderingIdentifier;

    return (
      <div className={`component image ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          {isEditing || !props.fields.TargetUrl?.value?.href ? (
            <Image />
          ) : (
            <ContentSdkLink field={props.fields.TargetUrl}>
              <Image />
            </ContentSdkLink>
          )}
          <Text
            tag="span"
            className="image-caption field-imagecaption"
            field={props.fields.ImageCaption}
          />
        </div>
      </div>
    );
  }

  return <ImageDefault {...props} />;
};
