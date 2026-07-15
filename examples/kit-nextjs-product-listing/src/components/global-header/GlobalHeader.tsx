'use client';

import type React from 'react';
import type { GlobalHeaderProps } from './global-header.props';
import { GlobalHeaderDefault } from './GlobalHeaderDefault.dev';
import { GlobalHeaderCentered } from './GlobalHeaderCentered.dev';
// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<GlobalHeaderProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;

  return <GlobalHeaderDefault {...props} isPageEditing={isPageEditing} />;
};

// Variants
export const Centered: React.FC<GlobalHeaderProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;

  return <GlobalHeaderCentered {...props} isPageEditing={isPageEditing} />;
};
