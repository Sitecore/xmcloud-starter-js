import type React from 'react';
import { ImageWrapperClient } from './ImageWrapper.client';
import type { ImageWrapperProps } from './ImageWrapper.client';

/**
 * Server component wrapper for ImageWrapper. Delegates to ImageWrapperClient for
 * client-only behavior (editing mode, in-view, optimization context).
 */
export const Default: React.FC<ImageWrapperProps> = (props) => {
  return <ImageWrapperClient {...props} />;
};
