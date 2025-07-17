import type React from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { PageHeaderProps } from './page-header.props';
import { PageHeaderDefault } from './PageHeaderDefault.dev';
import { PageHeaderBlueText } from './PageHeaderBlueText.dev';
import { PageHeaderFiftyFifty } from './PageHeaderFiftyFifty.dev';
import { PageHeaderBlueBackground } from './PageHeaderBlueBackground.dev';
import { PageHeaderCentered } from './PageHeaderCentered.dev';

/*
  This component is a page header with multiple variants:
  - Default: Shows the header as per the provided design
  - BlueText: Modified version with blue text styling (to be implemented)
  - 50-50: Equal width layout for the left and right content (to be implemented)
*/

// Default display of the component
export const Default: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PageHeaderDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const BlueText: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PageHeaderBlueText {...props} isPageEditing={isPageEditing} />;
};

export const FiftyFifty: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PageHeaderFiftyFifty {...props} isPageEditing={isPageEditing} />;
};

export const BlueBackground: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PageHeaderBlueBackground {...props} isPageEditing={isPageEditing} />;
};

export const Centered: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  return <PageHeaderCentered {...props} isPageEditing={isPageEditing} />;
};
