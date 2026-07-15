import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import scConfig from './sitecore.config';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
        exclude: [
          // Exclude non-component sidecars from import map generation
          '**/*.props.ts',
          '**/*.props.tsx',
          '**/*.util.ts',
          '**/*.util.tsx',
          '**/*.dictionary.ts',
          '**/*.dictionary.tsx',
          '**/*.context.ts',
          '**/*.context.tsx',
          '**/utils.ts',
          '**/utils.tsx',
        ],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: [
      'src/components/content-sdk/*',
      'src/components/ui/*',
      // Exclude non-component sidecars from component map generation
      '**/*.props.ts',
      '**/*.props.tsx',
      '**/*.util.ts',
      '**/*.util.tsx',
      '**/*.dictionary.ts',
      '**/*.dictionary.tsx',
      '**/*.context.ts',
      '**/*.context.tsx',
      '**/utils.ts',
      '**/utils.tsx',
    ],
  },
});
