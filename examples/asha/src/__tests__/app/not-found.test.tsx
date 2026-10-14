import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Page } from '@sitecore-content-sdk/nextjs';
import NotFound from '@/app/[site]/[locale]/[[...path]]/not-found';
import client from 'lib/sitecore-client';
import {
  ErrorPageType,
  FALLBACK_404_MESSAGE,
  FALLBACK_404_TITLE,
  FALLBACK_HOME_LINK,
  MOCK_LOCALE,
  MOCK_NOT_FOUND_PAGE,
  MOCK_SITE,
} from '../test-utils/error-page-test-utils';

const mockGetCachedPageParams = jest.fn();

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
  getCachedPageParams: (...args: unknown[]) => mockGetCachedPageParams(...args),
}));

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-intl-provider">{children}</div>
  ),
}));

jest.mock('next-intl/server', () => ({
  setRequestLocale: jest.fn(),
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

describe('not-found page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCachedPageParams.mockReturnValue({ site: MOCK_SITE, locale: MOCK_LOCALE });
  });

  describe('when Sitecore error fetch succeeds', () => {
    it('renders Sitecore error content', async () => {
      mockGetErrorPage.mockResolvedValue(MOCK_NOT_FOUND_PAGE);

      const component = await NotFound();
      render(component);

      expect(screen.getByTestId('next-intl-provider')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-providers')).toBeInTheDocument();
      expect(screen.getByTestId('sitecore-error-layout')).toHaveTextContent(
        'Sitecore 404 Error Page'
      );
      expect(mockGetErrorPage).toHaveBeenCalledWith(ErrorPageType.NotFound, {
        site: MOCK_SITE,
        locale: MOCK_LOCALE,
      });
    });

    it('falls back to default site and locale when cached params are empty', async () => {
      mockGetCachedPageParams.mockReturnValue({});
      mockGetErrorPage.mockResolvedValue(MOCK_NOT_FOUND_PAGE);

      const component = await NotFound();
      render(component);

      expect(mockGetErrorPage).toHaveBeenCalledWith(ErrorPageType.NotFound, {
        site: MOCK_SITE,
        locale: MOCK_LOCALE,
      });
      expect(screen.getByTestId('sitecore-error-layout')).toBeInTheDocument();
    });
  });

  describe('when Sitecore error fetch fails', () => {
    it('renders fallback UI when fetch returns null', async () => {
      mockGetErrorPage.mockResolvedValue(null);

      const component = await NotFound();
      render(component);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(FALLBACK_404_TITLE);
      expect(screen.getByText(FALLBACK_404_MESSAGE)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: FALLBACK_HOME_LINK })).toHaveAttribute('href', '/');
      expect(screen.queryByTestId('sitecore-error-layout')).not.toBeInTheDocument();
    });

    it('renders fallback UI when fetch throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      mockGetErrorPage.mockRejectedValue(new Error('fetch failed'));

      const component = await NotFound();
      render(component);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(FALLBACK_404_TITLE);
      expect(screen.getByText(FALLBACK_404_MESSAGE)).toBeInTheDocument();
      expect(screen.queryByTestId('sitecore-error-layout')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});
