import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import React from 'react';
import type { JSX } from 'react';

describe('Container Utility Functions', () => {
  describe('getContainerPlaceholderProps', () => {
    it('should generate placeholder props with dynamic key', () => {
      const params = {
        DynamicPlaceholderId: 'main-container',
      };

      const result = getContainerPlaceholderProps('container-left', params);

      expect(result).toEqual({
        dynamicKey: 'container-left-main-container',
        genericKey: 'container-left-{*}',
        fragment: 'container-left',
      });
    });

    it('should handle empty DynamicPlaceholderId', () => {
      const params = {
        DynamicPlaceholderId: '',
      };

      const result = getContainerPlaceholderProps('container-right', params);

      expect(result).toEqual({
        dynamicKey: 'container-right-',
        genericKey: 'container-right-{*}',
        fragment: 'container-right',
      });
    });

    it('should handle different fragment names', () => {
      const params = {
        DynamicPlaceholderId: 'test-123',
      };

      const result = getContainerPlaceholderProps('custom-fragment', params);

      expect(result.dynamicKey).toBe('custom-fragment-test-123');
      expect(result.genericKey).toBe('custom-fragment-{*}');
      expect(result.fragment).toBe('custom-fragment');
    });

    it('should handle undefined DynamicPlaceholderId', () => {
      const params = {
        DynamicPlaceholderId: undefined,
      } as { DynamicPlaceholderId?: string };

      const result = getContainerPlaceholderProps('container', params);

      expect(result.dynamicKey).toBe('container-undefined');
      expect(result.genericKey).toBe('container-{*}');
    });
  });

  describe('isContainerPlaceholderEmpty', () => {
    const placeholderProps = {
      dynamicKey: 'container-left-main',
      genericKey: 'container-left-{*}',
      fragment: 'container-left',
    };

    it('should return true when rendering has no placeholders and no children', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {},
      } as ComponentRendering;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, undefined);

      expect(result).toBe(true);
    });

    it('should return false when rendering has dynamic placeholder', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {
          'container-left-main': [
            {
              componentName: 'SomeComponent',
            },
          ],
        },
      } as ComponentRendering;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, undefined);

      expect(result).toBe(false);
    });

    it('should return false when rendering has generic placeholder', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {
          'container-left-{*}': [
            {
              componentName: 'SomeComponent',
            },
          ],
        },
      } as ComponentRendering;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, undefined);

      expect(result).toBe(false);
    });

    it('should return false when children are provided', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {},
      } as ComponentRendering;

      const children = React.createElement('div', null, 'Test child') as JSX.Element;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, children);

      expect(result).toBe(false);
    });

    it('should return false when both placeholders and children exist', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {
          'container-left-main': [
            {
              componentName: 'SomeComponent',
            },
          ],
        },
      } as ComponentRendering;

      const children = React.createElement('div', null, 'Test child') as JSX.Element;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, children);

      expect(result).toBe(false);
    });

    it('should handle undefined rendering', () => {
      const result = isContainerPlaceholderEmpty(
        undefined as unknown as ComponentRendering,
        placeholderProps,
        undefined
      );

      expect(result).toBe(true);
    });

    it('should handle rendering without placeholders property', () => {
      const rendering = {
        componentName: 'Container',
      } as ComponentRendering;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, undefined);

      expect(result).toBe(true);
    });

    it('should return false when placeholders exist but are empty arrays', () => {
      const rendering = {
        componentName: 'Container',
        placeholders: {
          'container-left-main': [],
        },
      } as ComponentRendering;

      const result = isContainerPlaceholderEmpty(rendering, placeholderProps, undefined);

      // Empty arrays are truthy in JavaScript, so placeholder is considered to exist
      expect(result).toBe(false);
    });
  });
});

