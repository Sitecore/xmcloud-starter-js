/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CdpPageView from '@/components/content-sdk/CdpPageView';
import { testComponentMap } from '@/__tests__/test-utils/component-props';

// Mock the Sitecore SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  CdpHelper: {
    getPageVariantId: jest.fn(
      (itemId, language, variantId, scope) => `${itemId}-${language}-${variantId}-${scope}`
    ),
  },
  useSitecore: jest.fn(),
}));

// Mock the Sitecore Cloud SDK
jest.mock('@sitecore-content-sdk/events', () => ({
  pageView: jest.fn(),
}));

// Mock sitecore.config (moduleNameMapper in jest.config resolves this; api.edge.clientContextId set so pageView is called)
jest.mock('sitecore.config', () => ({
  __esModule: true,
  default: {
    api: { edge: { clientContextId: 'test-context-id' } },
    defaultLanguage: 'en',
    personalize: { scope: 'test-scope' },
  },
}));

import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { pageView } from '@sitecore-content-sdk/events';

const mockedUseSitecore = useSitecore as jest.MockedFunction<typeof useSitecore>;
const mockPageView = pageView as jest.MockedFunction<typeof pageView>;

type MockSitecoreContext = ReturnType<typeof useSitecore>;

describe('CdpPageView Component', () => {
  const mockSitecoreContext: MockSitecoreContext = {
    loadImportMap: jest.fn(),
    componentMap: testComponentMap,
    page: {
      layout: {
        sitecore: {
          route: {
            itemId: 'test-item-id',
            itemLanguage: 'en',
            name: 'Test Page',
            placeholders: {},
          },
          context: {
            variantId: 'test-variant-id',
          },
        },
      },
      siteName: 'test-site',
      locale: 'en',
      mode: {
        isNormal: true,
        isEditing: false,
        isPreview: false,
        name: 'normal' as any,
        designLibrary: {
          isVariantGeneration: false,
        },
        isDesignLibrary: false,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPageView.mockResolvedValue({
      ref: 'test-ref',
      status: 'success',
      version: '1.0',
      client_key: 'test-client-key',
      customer_ref: 'test-customer-ref',
    });
    mockedUseSitecore.mockReturnValue(mockSitecoreContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<CdpPageView />);
      expect(container).toBeInTheDocument();
    });

    it('renders an empty fragment', () => {
      const { container } = render(<CdpPageView />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Page View Events', () => {
    it('triggers pageView with proper data when all conditions are met', () => {
      render(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'USD',
        page: 'Test Page',
        pageVariantId: 'test-item-id-en-test-variant-id-test-scope',
        language: 'en',
      });
    });

    it('does not trigger pageView in editing mode', () => {
      const editingContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          mode: {
            isNormal: false,
            isEditing: true,
            isPreview: false,
            name: 'edit' as any,
            designLibrary: {
              isVariantGeneration: false,
            },
            isDesignLibrary: false,
          },
        },
      };
      mockedUseSitecore.mockReturnValue(editingContext);

      render(<CdpPageView />);

      expect(mockPageView).not.toHaveBeenCalled();
    });

    it('does not trigger pageView when route itemId is missing', () => {
      const noItemIdContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          layout: {
            sitecore: {
              route: {
                itemLanguage: 'en',
                name: 'Test Page',
                placeholders: {},
              } as MockSitecoreContext['page']['layout']['sitecore']['route'],
              context: {
                variantId: 'test-variant-id',
              },
            },
          },
        },
      };
      mockedUseSitecore.mockReturnValue(noItemIdContext);

      render(<CdpPageView />);

      expect(mockPageView).not.toHaveBeenCalled();
    });

    it('uses default language when itemLanguage is not provided', () => {
      const noLanguageContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          layout: {
            sitecore: {
              route: {
                itemId: 'test-item-id',
                name: 'Test Page',
                placeholders: {},
              } as MockSitecoreContext['page']['layout']['sitecore']['route'],
              context: {
                variantId: 'test-variant-id',
              },
            },
          },
        },
      };
      mockedUseSitecore.mockReturnValue(noLanguageContext);

      render(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledWith({
        channel: 'WEB',
        currency: 'USD',
        page: 'Test Page',
        pageVariantId: 'test-item-id-en-test-variant-id-test-scope',
        language: 'en',
      });
    });

    it('handles pageView rejection gracefully', async () => {
      mockPageView.mockRejectedValue(new Error('Test error'));

      const { container } = render(<CdpPageView />);

      // Component swallows rejection via .catch(() => {}); should not throw
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(container).toBeInTheDocument();
    });
  });

  describe('Re-rendering behavior', () => {
    it('triggers pageView again when route changes', () => {
      const { rerender } = render(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(1);

      const newContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          layout: {
            sitecore: {
              route: {
                itemId: 'new-item-id',
                itemLanguage: 'en',
                name: 'New Page',
                placeholders: {},
              } as MockSitecoreContext['page']['layout']['sitecore']['route'],
              context: {
                variantId: 'test-variant-id',
              },
            },
          },
        },
      };
      mockedUseSitecore.mockReturnValue(newContext);

      rerender(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(2);
    });

    it('triggers pageView again when variant changes', () => {
      const { rerender } = render(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(1);

      const newVariantContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          layout: {
            sitecore: {
              route: mockSitecoreContext.page.layout.sitecore.route,
              context: {
                variantId: 'new-variant-id',
              },
            },
          },
        },
      };
      mockedUseSitecore.mockReturnValue(newVariantContext);

      rerender(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(2);
    });

    it('triggers pageView again when siteName changes', () => {
      const { rerender } = render(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(1);

      const newSiteNameContext: MockSitecoreContext = {
        ...mockSitecoreContext,
        page: {
          ...mockSitecoreContext.page,
          siteName: 'new-site',
        },
      };
      mockedUseSitecore.mockReturnValue(newSiteNameContext);

      rerender(<CdpPageView />);

      expect(mockPageView).toHaveBeenCalledTimes(2);
    });
  });
});
