import React, { createContext } from 'react';

interface ImageOptions {
  unoptimized: boolean;
}
const unoptimized = process.env.NEXT_PUBLIC_NEXT_IMAGE_UNOPTIMIZED === 'true';

export const ImageOptimizationContext = createContext({
  unoptimized: unoptimized ?? false,
});

interface ProviderProps extends ImageOptions {
  children: React.ReactNode;
}

export const ImageOptimizationProvider = ({ children, unoptimized }: ProviderProps) => {
  return (
    <ImageOptimizationContext.Provider value={{ unoptimized }}>
      {children}
    </ImageOptimizationContext.Provider>
  );
};
