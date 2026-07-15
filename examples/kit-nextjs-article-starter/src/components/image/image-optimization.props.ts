import type React from 'react';

export interface ImageOptions {
  unoptimized: boolean;
}

export interface ProviderProps extends ImageOptions {
  children: React.ReactNode;
}
