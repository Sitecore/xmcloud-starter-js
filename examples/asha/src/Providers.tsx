'use client';
import React from 'react';
import {
  ComponentPropsCollection,
  ComponentPropsContext,
  Page,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map.client';
import { ThemeProvider } from '@/components/theme-provider/theme-provider.dev';
import { VideoProvider } from './contexts/VideoContext';

export default function Providers({
  children,
  page,
  componentProps = {},
}: {
  children: React.ReactNode;
  page: Page;
  componentProps?: ComponentPropsCollection;
}) {
  return (
    <SitecoreProvider
      api={scConfig.api}
      componentMap={components}
      page={page}
      loadImportMap={() => import('.sitecore/import-map.client')}
    >
      <ComponentPropsContext value={componentProps}>
          <VideoProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              forcedTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </VideoProvider>
        </ComponentPropsContext>
      </SitecoreProvider>
  );
}
