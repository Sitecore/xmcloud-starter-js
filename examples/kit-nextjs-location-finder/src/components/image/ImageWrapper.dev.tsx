import type React from 'react';
import { cn } from '@/lib/utils';
import { ImageField } from '@sitecore-content-sdk/nextjs';
import ClientImage from './ImageWrapper.client';

import type { ImageWrapperProps } from './image-wrapper.props';

/**
 * Server component wrapper for ImageWrapper. Delegates to ClientImage for
 * client-only behavior (editing mode, in-view detection, optimization context).
 */
export const Default: React.FC<ImageWrapperProps> = (props) => {
  const { image, wrapperClass } = props;

  if (image == null) {
    return null;
  }

  return (
    <div className={cn('image-container', wrapperClass)}>
      <ClientImage {...props} />
    </div>
  );
};
