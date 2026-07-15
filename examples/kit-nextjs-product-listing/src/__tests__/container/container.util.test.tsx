import React from 'react';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

describe('container.util', () => {
  describe('getContainerPlaceholderProps', () => {
    it('generates placeholder props with dynamic key', () => {
      const fragment = 'container-main';
      const params: ComponentParams = {
        DynamicPlaceholderId: '123',
      };

      const result = getContainerPlaceholderProps(fragment, params);

      expect(result).toEqual({
        dynamicKey: 'container-main-123',
        genericKey: 'container-main-{*}',
        fragment: 'container-main',
      });
    });

    it('generates placeholder props with different fragment', () => {
      const fragment = 'container-sidebar';
      const params: ComponentParams = {
        DynamicPlaceholderId: '456',
      };

      const result = getContainerPlaceholderProps(fragment, params);

      expect(result).toEqual({
        dynamicKey: 'container-sidebar-456',
        genericKey: 'container-sidebar-{*}',
        fragment: 'container-sidebar',
      });
    });

    it('handles numeric DynamicPlaceholderId as string', () => {
      const fragment = 'test-fragment';
      const params: ComponentParams = {
        DynamicPlaceholderId: '789',
      };

      const result = getContainerPlaceholderProps(fragment, params);

      expect(result).toEqual({
        dynamicKey: 'test-fragment-789',
        genericKey: 'test-fragment-{*}',
        fragment: 'test-fragment',
      });
    });

    it('handles empty string DynamicPlaceholderId', () => {
      const fragment = 'container';
      const params: ComponentParams = {
        DynamicPlaceholderId: '',
      };

      const result = getContainerPlaceholderProps(fragment, params);

      expect(result).toEqual({
        dynamicKey: 'container-',
        genericKey: 'container-{*}',
        fragment: 'container',
      });
    });

    it('handles special characters in fragment name', () => {
      const fragment = 'container-full-width';
      const params: ComponentParams = {
        DynamicPlaceholderId: 'abc-123',
      };

      const result = getContainerPlaceholderProps(fragment, params);

      expect(result).toEqual({
        dynamicKey: 'container-full-width-abc-123',
        genericKey: 'container-full-width-{*}',
        fragment: 'container-full-width',
      });
    });
  });

  describe('isContainerPlaceholderEmpty', () => {
    const mockPlaceholderProps = {
      dynamicKey: 'container-main-123',
      genericKey: 'container-main-{*}',
      fragment: 'container-main',
    };

    it('returns true when placeholder is empty and no children', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {},
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      expect(result).toBe(true);
    });

    it('returns false when dynamicKey placeholder exists', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {
          'container-main-123': [
            {
              uid: 'child-1',
              componentName: 'ChildComponent',
              dataSource: '',
            },
          ],
        },
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      expect(result).toBe(false);
    });

    it('returns false when genericKey placeholder exists', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {
          'container-main-{*}': [
            {
              uid: 'child-1',
              componentName: 'ChildComponent',
              dataSource: '',
            },
          ],
        },
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      expect(result).toBe(false);
    });

    it('returns false when children are provided', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {},
      };

      const mockChildren = <div>Test content</div>;

      const result = isContainerPlaceholderEmpty(
        rendering,
        mockPlaceholderProps,
        mockChildren as React.JSX.Element
      );

      expect(result).toBe(false);
    });

    it('returns false when both placeholder and children exist', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {
          'container-main-123': [
            {
              uid: 'child-1',
              componentName: 'ChildComponent',
              dataSource: '',
            },
          ],
        },
      };

      const mockChildren = <div>Test content</div>;

      const result = isContainerPlaceholderEmpty(
        rendering,
        mockPlaceholderProps,
        mockChildren as React.JSX.Element
      );

      expect(result).toBe(false);
    });

    it('returns true when placeholders object is undefined', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      expect(result).toBe(true);
    });

    it('returns false when placeholder array is empty but exists', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {
          'container-main-123': [],
        },
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      // Empty array is still truthy, so placeholder "exists"
      expect(result).toBe(false);
    });

    it('handles different placeholder keys correctly', () => {
      const rendering: ComponentRendering = {
        uid: 'test-uid',
        componentName: 'Container',
        dataSource: '',
        placeholders: {
          'other-placeholder': [
            {
              uid: 'child-1',
              componentName: 'ChildComponent',
              dataSource: '',
            },
          ],
        },
      };

      const result = isContainerPlaceholderEmpty(rendering, mockPlaceholderProps, undefined);

      expect(result).toBe(true);
    });
  });
});
