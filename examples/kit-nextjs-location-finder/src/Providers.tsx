'use client';
import React from 'react';
import { Page, SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { LazyMotion } from 'framer-motion';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { ThemeProvider } from '@/components/theme-provider/theme-provider.dev';
import { VideoProvider } from './contexts/VideoContext';
import { loadFramerFeatures } from '@/lib/framer-features';

export default function Providers({
  children,
  page,
}: {
  children: React.ReactNode;
  page: Page;
}) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
    >
      <LazyMotion features={loadFramerFeatures} strict>
        <VideoProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </VideoProvider>
      </LazyMotion>
    </SitecoreProvider>
  );
}
