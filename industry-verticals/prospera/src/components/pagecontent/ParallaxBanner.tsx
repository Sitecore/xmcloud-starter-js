'use client';

import {
  Field,
  Image,
  ImageField,
  RichTextField,
  Text,
  RichText,
  Link,
  LinkField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { BannerLayer, ParallaxBanner } from 'react-scroll-parallax';

interface Fields {
  Title: Field<string>;
  Text: RichTextField;
  BackgroundImage: ImageField;
  ForegroundImage: ImageField;
  Link: LinkField;
}

export type ParallaxBannerProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ParallaxBannerProps) => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const sxaStyles = `${props.params?.styles || ''}`;

  const BannerContentBlock = (
    <div className="parallax-banner-content-inner">
      <h1 className="display-3 fw-bold text-center mb-3">
        <Text field={props.fields.Title} />
      </h1>
      <div className="fs-5 text-center">
        <RichText field={props.fields.Text} />

        {(isPageEditing || props.fields?.Link?.value?.href) && (
          <Link field={props.fields.Link} className="button button-main mt-3" />
        )}
      </div>
    </div>
  );

  const background: BannerLayer = {
    image: `${props.fields.BackgroundImage?.value?.src}`,
    translateY: [0, 50],
    opacity: [1, 0.3],
    scale: [1.05, 1, 'easeOutCubic'],
    shouldAlwaysCompleteAnimation: true,
    className: 'parallax-banner-background',
  };

  const headline: BannerLayer = {
    translateY: [-30, 20],
    scale: [1, 1.1, 'easeOutCubic'],
    shouldAlwaysCompleteAnimation: true,
    expanded: false,
    children: BannerContentBlock,
    className: 'parallax-banner-content',
  };

  const foreground: BannerLayer = {
    image: `${props.fields.ForegroundImage?.value?.src}`,
    translateY: [0, 10],
    scale: [1, 1.1, 'easeOutCubic'],
    shouldAlwaysCompleteAnimation: true,
    className: 'parallax-banner-foreground',
  };

  return (
    <div
      className={`component parallax-banner ${isPageEditing ? 'edit-mode' : ''} ${sxaStyles}`}
      id={id ? id : undefined}
    >
      {isPageEditing ? (
        <div className="parallax-banner-inner">
          <Image field={props.fields.BackgroundImage} className="parallax-banner-background" />
          <div className="parallax-banner-content">{BannerContentBlock}</div>
          <Image field={props.fields.ForegroundImage} className="parallax-banner-foreground" />
        </div>
      ) : (
        <ParallaxBanner
          layers={[background, headline, foreground]}
          className="parallax-banner-inner"
        />
      )}
    </div>
  );
};
