'use client';
import type React from 'react';
import type { GlobalHeaderProps } from './global-header.props';
import { GlobalHeaderDefault } from './GlobalHeaderDefault.dev';
import { GlobalHeaderCentered } from './GlobalHeaderCentered.dev';
// Data source checks are done in the child components

// Default display of the component
export const Default: React.FC<GlobalHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;

  return <GlobalHeaderDefault {...props} isPageEditing={isEditing} />;
};

// Variants
export const Centered: React.FC<GlobalHeaderProps> = (props) => {
  const { isEditing } = props.page.mode;

  return <GlobalHeaderCentered {...props} isPageEditing={isEditing} />;
};
