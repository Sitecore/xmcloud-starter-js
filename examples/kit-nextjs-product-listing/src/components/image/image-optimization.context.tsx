import { createContext } from 'react';

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

// This provider is useful for allowing storybook to use a unoptimized: true
export const ImageOptimizationProvider = ({ children, unoptimized }: ProviderProps) => {
  return (
    <ImageOptimizationContext.Provider value={{ unoptimized }}>
      {children}
    </ImageOptimizationContext.Provider>
  );
};
