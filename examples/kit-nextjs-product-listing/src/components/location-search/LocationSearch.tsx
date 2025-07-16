import React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

import { LocationSearchProps } from './location-search.props';
import { LocationSearchDefault } from './LocationSearchDefault.dev';
import { LocationSearchMapRight } from './LocationSearchMapRight.dev';
import { LocationSearchMapTopAllCentered } from './LocationSearchMapTopAllCentered.dev';
import { LocationSearchMapRightTitleZipCentered } from './LocationSearchMapRightTitleZipCentered.dev';
import { LocationSearchTitleZipCentered } from './LocationSearchTitleZipCentered.dev';

// Default display of the component

export const Default: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchDefault {...props} isPageEditing={isPageEditing} />;
};
export const MapRight: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapRight {...props} isPageEditing={isPageEditing} />;
};
export const MapTopAllCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapTopAllCentered {...props} isPageEditing={isPageEditing} />;
};
export const MapRightTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchMapRightTitleZipCentered {...props} isPageEditing={isPageEditing} />;
};
export const MapLeftTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <LocationSearchTitleZipCentered {...props} isPageEditing={isPageEditing} />;
};
