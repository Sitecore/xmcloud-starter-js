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
        exclude: ['src/components/component-library/*'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: [
      'src/components/content-sdk/*',
      'src/components/ui/*',
      'src/components/lib/*',
      'src/components/component-library/*',
      'src/components/magicui/*',
      'src/components/portal/*',
      'src/components/floating-dock/*',
      'src/components/promo-animated/PromoAnimatedEmptyImageEditing.tsx',
      // Exclude non-component files (props, utils, dictionaries, contexts)
      '**/*.props.ts',
      '**/*.props.tsx',
      '**/*-props.tsx',
      '**/*.mock.props.ts',
      '**/__tests__/**',
      '**/test-utils/**',
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
