import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageGalleryProps } from './image-gallery.props';
import { ImageGalleryDefault } from './ImageGallery.dev';
import { ImageGalleryGrid } from './ImageGalleryGrid.dev';
import { ImageGalleryFiftyFifty } from './ImageGalleryFiftyFifty.dev';
import { ImageGalleryFeaturedImage } from './ImageGalleryFeaturedImage.dev';
import { ImageGalleryNoSpacing } from './ImageGalleryNoSpacing.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<ImageGalleryProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <ImageGalleryDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const FiftyFifty: React.FC<ImageGalleryProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <ImageGalleryFiftyFifty {...props} isPageEditing={isEditing} />;
};

export const Grid: React.FC<ImageGalleryProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <ImageGalleryGrid {...props} isPageEditing={isEditing} />;
};

export const FeaturedImage: React.FC<ImageGalleryProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <ImageGalleryFeaturedImage {...props} isPageEditing={isEditing} />;
};

export const NoSpacing: React.FC<ImageGalleryProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return <ImageGalleryNoSpacing {...props} isPageEditing={isEditing} />;
};
