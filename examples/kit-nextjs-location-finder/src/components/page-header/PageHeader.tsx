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
  const { isEditing } = page.mode;
  return <PageHeaderDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const BlueText: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PageHeaderBlueText {...props} isPageEditing={isEditing} />;
};

export const FiftyFifty: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PageHeaderFiftyFifty {...props} isPageEditing={isEditing} />;
};

export const BlueBackground: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PageHeaderBlueBackground {...props} isPageEditing={isEditing} />;
};

export const Centered: React.FC<PageHeaderProps> = (props) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  return <PageHeaderCentered {...props} isPageEditing={isEditing} />;
};
