import {
  NextImage as ContentSdkImage,
  Text,
} from "@sitecore-content-sdk/nextjs";
import React from "react";
import { CompatibleLink } from "components/content-sdk/CompatibleLink";
import { getFieldValue } from 'lib/component-props';
import { ImageProps, ImageWrapperProps } from './image.props';

const ImageWrapper: React.FC<ImageWrapperProps> = ({ className, id, children }) => (
  <figure className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </figure>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { styles, RenderingIdentifier: id } = params;
  const baseImageField = getFieldValue(fields?.Image);
  const imageField = baseImageField && {
    ...baseImageField,
    value: {
      ...baseImageField.value,
      style: { objectFit: "cover", width: "100%", height: "100%" },
    },
  };

  const altText =
    typeof baseImageField?.value?.alt === "string"
      ? baseImageField.value.alt
      : "Hero banner";

  // Use pixel caps per breakpoint so the browser picks the next-lowest srcset width
  // instead of 100vw (which with DPR can still request 1920px on ~1319px viewport).
  // This fixes mobile/tablet overserving (e.g. 1920px image when displayed at 1319px).
  const bannerSizes =
    "(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px";

  return (
    <figure className={`component hero-banner ${styles}`.trim()} id={typeof id === "string" ? id : undefined}>
      <div className="component-content sc-sxa-image-hero-banner">
        <ContentSdkImage
          field={imageField}
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
  const imageField = getFieldValue(fields?.Image);
  const imageCaptionField = getFieldValue(fields?.ImageCaption);
  const targetUrlField = getFieldValue(fields?.TargetUrl);

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const Image = () => (
    <ContentSdkImage
      field={imageField}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
      alt={
        typeof imageField?.value?.alt === "string"
          ? imageField.value.alt
          : ""
      }
    />
  );
  const shouldWrapWithLink =
    !page?.mode?.isEditing && targetUrlField?.value?.href;

  return (
    <ImageWrapper className={`component image ${styles}`} id={typeof id === "string" ? id : undefined}>
      {shouldWrapWithLink ? (
        <CompatibleLink field={targetUrlField}>
          <Image />
        </CompatibleLink>
      ) : (
        <Image />
      )}
      <figcaption className="image-caption field-imagecaption">
        <Text tag="span" field={imageCaptionField} />
      </figcaption>
    </ImageWrapper>
  );
};
