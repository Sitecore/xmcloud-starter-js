import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import type { Page } from '@sitecore-content-sdk/nextjs';
import GlobalError from '@/app/global-error';
import client from 'lib/sitecore-client';
import {
  ErrorPageType,
  FALLBACK_500_MESSAGE,
  FALLBACK_500_TITLE,
  FALLBACK_HOME_LINK,
  MOCK_LOCALE,
  MOCK_SERVER_ERROR_PAGE,
  MOCK_SITE,
} from '../test-utils/error-page-test-utils';

jest.mock('lib/sitecore-client', () => ({
  __esModule: true,
  default: {
    getErrorPage: jest.fn(),
  },
}));

jest.mock('sitecore.config', () => ({
  __esModule: true,
  default: {
    defaultSite: 'test-site',
    defaultLanguage: 'en',
  },
}));

jest.mock('@sitecore-content-sdk/nextjs', () => ({
  ErrorPage: {
    NotFound: '404',
    InternalServerError: '500',
  },
}));

jest.mock('src/Layout', () => ({
  __esModule: true,
  default: ({ page }: { page: Page }) => (
    <div data-testid="sitecore-error-layout">{page.layout.sitecore.route?.displayName}</div>
  ),
}));

jest.mock('src/Providers', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sitecore-providers">{children}</div>
  ),
}));

const mockGetErrorPage = jest.mocked(client.getErrorPage);

describe('global-error page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when Sitecore error fetch succeeds', () => {
    it('renders Sitecore error content', async () => {
      mockGetErrorPage.mockResolvedValue(MOCK_SERVER_ERROR_PAGE);

      render(<GlobalError />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('sitecore-error-layout')).toHaveTextContent(
          'Sitecore 500 Error Page'
        );
      });

      expect(screen.getByTestId('sitecore-providers')).toBeInTheDocument();
      expect(mockGetErrorPage).toHaveBeenCalledWith(ErrorPageType.InternalServerError, {
        site: MOCK_SITE,
        locale: MOCK_LOCALE,
      });
    });
  });

  describe('when Sitecore error fetch fails', () => {
    it('renders fallback UI when fetch throws', async () => {
      mockGetErrorPage.mockRejectedValue(new Error('fetch failed'));

      render(<GlobalError />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(FALLBACK_500_TITLE);
      });

      expect(screen.getByText(FALLBACK_500_MESSAGE)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: FALLBACK_HOME_LINK })).toHaveAttribute('href', '/');
      expect(screen.queryByTestId('sitecore-error-layout')).not.toBeInTheDocument();
    });

    it('renders fallback UI when fetch returns null', async () => {
      mockGetErrorPage.mockResolvedValue(null);

      render(<GlobalError />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(FALLBACK_500_TITLE);
      });

      expect(screen.getByText(FALLBACK_500_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-error-layout')).not.toBeInTheDocument();
    });
  });
});
