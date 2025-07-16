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
  const { isEditing } = page.mode;
  return <LocationSearchDefault {...props} isPageEditing={isEditing} />;
};
export const MapRight: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <LocationSearchMapRight {...props} isPageEditing={isEditing} />;
};
export const MapTopAllCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <LocationSearchMapTopAllCentered {...props} isPageEditing={isEditing} />;
};
export const MapRightTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <LocationSearchMapRightTitleZipCentered {...props} isPageEditing={isEditing} />;
};
export const MapLeftTitleZipCentered: React.FC<LocationSearchProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <LocationSearchTitleZipCentered {...props} isPageEditing={isEditing} />;
};
