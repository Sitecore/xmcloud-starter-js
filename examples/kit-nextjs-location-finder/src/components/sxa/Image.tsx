import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';
import { ComponentProps } from '@/lib/component-props';
import type { SxaImageProps } from './sxa-image.props';

type ImageProps = ComponentProps & SxaImageProps;

const ImageWrapper: React.FC<{
  className: string;
  id?: string;
  children: React.ReactNode;
}> = ({ className, id, children }) => (
  <figure className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </figure>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles ?? ''}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { styles, RenderingIdentifier: id } = params;
  const imageField = fields?.Image && {
    ...fields.Image,
    value: {
      ...fields.Image.value,
      style: { objectFit: 'cover', width: '100%', height: '100%' },
    },
  };

  const altText =
    typeof fields?.Image?.value?.alt === 'string' ? fields.Image.value.alt : 'Hero banner';

  const bannerSizes =
    '(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px';

  return (
    <figure
      className={`component hero-banner ${styles ?? ''}`.trim()}
      id={typeof id === 'string' ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner">
        <ContentSdkImage
          field={imageField || fields?.Image}
          loading="eager"
          fetchPriority="high"
          sizes={bannerSizes}
          alt={altText}
        />
      </div>
    </figure>
  );
};

export const Default: React.FC<ImageProps> = (props) => {
  const { fields, params, page } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const Image = () => (
    <ContentSdkImage
      field={fields.Image}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
      alt={typeof fields?.Image?.value?.alt === 'string' ? fields.Image.value.alt : ''}
    />
  );

  const shouldWrapWithLink = !page?.mode?.isEditing && fields.TargetUrl?.value?.href;

  return (
    <ImageWrapper
      className={`component image ${styles ?? ''}`}
      id={typeof id === 'string' ? id : undefined}
    >
      {shouldWrapWithLink && fields.TargetUrl ? (
        <ContentSdkLink field={fields.TargetUrl}>
          <Image />
        </ContentSdkLink>
      ) : (
        <Image />
      )}
      <figcaption className="image-caption field-imagecaption">
        <Text tag="span" field={fields.ImageCaption} />
      </figcaption>
    </ImageWrapper>
  );
};
