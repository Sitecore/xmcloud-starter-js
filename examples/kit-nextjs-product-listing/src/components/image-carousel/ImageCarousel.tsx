import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageCarouselProps } from './image-carousel.props';
import { ImageCarouselDefault } from './ImageCarouselDefault.dev';
import { ImageCarouselLeftRightPreview } from './ImageCarouselLeftRightPreview.dev';
import { ImageCarouselFullBleed } from './ImageCarouselFullBleed.dev';
import { ImageCarouselPreviewBelow } from './ImageCarouselPreviewBelow.dev';
import { ImageCarouselFeaturedImageLeft } from './ImageCarouselFeaturedImageLeft.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<ImageCarouselProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <ImageCarouselDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const LeftRightPreview: React.FC<ImageCarouselProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <ImageCarouselLeftRightPreview {...props} isPageEditing={isPageEditing} />;
};

export const FullBleed: React.FC<ImageCarouselProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <ImageCarouselFullBleed {...props} isPageEditing={isPageEditing} />;
};

export const PreviewBelow: React.FC<ImageCarouselProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <ImageCarouselPreviewBelow {...props} isPageEditing={isPageEditing} />;
};

export const FeaturedImageLeft: React.FC<ImageCarouselProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <ImageCarouselFeaturedImageLeft {...props} isPageEditing={isPageEditing} />;
};
