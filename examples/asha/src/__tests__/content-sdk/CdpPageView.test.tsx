import React from 'react';
import { render } from '@testing-library/react';
import CdpPageView from '../../components/content-sdk/CdpPageView';
import {
  mockCdpPageViewProps,
  mockEditingModeProps,
  mockNoRouteProps,
} from './CdpPageView.mockProps';

// Mock Sitecore Content SDK
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => mockUseSitecore(),
  CdpHelper: {
    getPageVariantId: jest.fn(() => 'test-variant-id'),
  },
}));

// Mock pageView from Content SDK events
const mockPageView = jest.fn().mockReturnValue(Promise.resolve());
jest.mock('@sitecore-content-sdk/events', () => ({
  pageView: (config: unknown) => mockPageView(config),
}));

// Mock sitecore.config
jest.mock('sitecore.config', () => ({
  __esModule: true,
  default: {
    defaultLanguage: 'en',
    personalize: {
      scope: 'test-scope',
    },
  },
}));

describe('CdpPageView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: mockCdpPageViewProps,
        },
        siteName: mockCdpPageViewProps.siteName,
        mode: mockCdpPageViewProps.mode,
      },
    });

    const { container } = render(<CdpPageView />);
    expect(container).toBeInTheDocument();
  });

  it('calls pageView when in normal mode with route', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: mockCdpPageViewProps,
        },
        siteName: mockCdpPageViewProps.siteName,
        mode: mockCdpPageViewProps.mode,
      },
    });

    render(<CdpPageView />);

    expect(mockPageView).toHaveBeenCalled();
    expect(mockPageView).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'WEB',
        currency: 'USD',
      })
    );
  });

  it('does not call pageView in editing mode', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: mockEditingModeProps,
        },
        siteName: mockEditingModeProps.siteName,
        mode: mockEditingModeProps.mode,
      },
    });

    render(<CdpPageView />);

    expect(mockPageView).not.toHaveBeenCalled();
  });

  it('does not call pageView when route is missing', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: mockNoRouteProps,
        },
        siteName: mockNoRouteProps.siteName,
        mode: mockNoRouteProps.mode,
      },
    });

    render(<CdpPageView />);

    expect(mockPageView).not.toHaveBeenCalled();
  });
});
