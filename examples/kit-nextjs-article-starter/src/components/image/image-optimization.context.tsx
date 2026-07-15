'use client';

import React, { createContext } from 'react';
import { ProviderProps } from './image-optimization.props';
const unoptimized = process.env.NEXT_PUBLIC_NEXT_IMAGE_UNOPTIMIZED === 'true';

export const ImageOptimizationContext = createContext({
  unoptimized: unoptimized ?? false,
});

export const ImageOptimizationProvider = ({ children, unoptimized }: ProviderProps) => {
  return (
    <ImageOptimizationContext.Provider value={{ unoptimized }}>
      {children}
    </ImageOptimizationContext.Provider>
  );
};
