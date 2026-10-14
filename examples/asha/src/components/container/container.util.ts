import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ContainerPlaceHolderProps } from './container.props';

import type { JSX } from 'react';

export const getContainerPlaceholderProps = (
  fragment: string,
  params: ComponentParams
): ContainerPlaceHolderProps => {
  const model: ContainerPlaceHolderProps = {
    dynamicKey: `${fragment}-${params.DynamicPlaceholderId}`,
    genericKey: `${fragment}-{*}`,
    fragment: fragment,
  };
  return model;
};

export const isContainerPlaceholderEmpty = (
  rendering: ComponentRendering,
  placeholderProps: ContainerPlaceHolderProps,
  children: JSX.Element | undefined
): boolean => {
  return (
    !(
      rendering?.placeholders?.[placeholderProps.dynamicKey] ||
      rendering?.placeholders?.[placeholderProps.genericKey]
    ) && !children
  );
};
