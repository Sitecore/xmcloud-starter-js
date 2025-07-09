import type React from 'react';
import { useSitecoreContext } from '@sitecore-content-sdk/nextjs';
import type { ImageGalleryProps } from './image-gallery.props';
import { ImageGalleryDefault } from './ImageGallery.dev';
import { ImageGalleryGrid } from './ImageGalleryGrid.dev';
import { ImageGalleryFiftyFifty } from './ImageGalleryFiftyFifty.dev';
import { ImageGalleryFeaturedImage } from './ImageGalleryFeaturedImage.dev';
import { ImageGalleryNoSpacing } from './ImageGalleryNoSpacing.dev';

// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<ImageGalleryProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <ImageGalleryDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const FiftyFifty: React.FC<ImageGalleryProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <ImageGalleryFiftyFifty {...props} isPageEditing={isPageEditing} />;
};

export const Grid: React.FC<ImageGalleryProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <ImageGalleryGrid {...props} isPageEditing={isPageEditing} />;
};

export const FeaturedImage: React.FC<ImageGalleryProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <ImageGalleryFeaturedImage {...props} isPageEditing={isPageEditing} />;
};

export const NoSpacing: React.FC<ImageGalleryProps> = (props) => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext?.pageEditing ?? false;

  return <ImageGalleryNoSpacing {...props} isPageEditing={isPageEditing} />;
};
