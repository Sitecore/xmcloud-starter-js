import { type NextRequest, NextResponse } from 'next/server';
import {
  defineProxy,
  PreviewProxy,
  AppRouterMultisiteProxy,
  PersonalizeProxy,
  RedirectsProxy,
  LocaleProxy,
} from '@sitecore-content-sdk/nextjs/proxy';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { routing } from './i18n/routing';
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeFromPath,
  preferredLocaleRedirect,
} from './i18n/locale-preference';
import client from './lib/sitecore-client';

const preview = new PreviewProxy({
    client,
    ...scConfig.api.edge,
});

const locale = new LocaleProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  /**
   * List of all supported locales configured in routing.ts
   */
  locales: routing.locales.slice(),
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  // in multilanguage scenarios, we need locale middleware to always run first to ensure locale is set and used correctly by the rest of the middlewares
  skip: () => false,
});

const multisite = new AppRouterMultisiteProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to disable more.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const redirects = new RedirectsProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.api.local,
  ...scConfig.redirects,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

const personalize = new PersonalizeProxy({
  /**
   * List of sites for site resolver to work with
   */
  sites,
  ...scConfig.api.edge,
  ...scConfig.personalize,
  // This function determines if the middleware should be turned off on per-request basis.
  // Certain paths are ignored by default (e.g. Next.js API routes), but you may wish to disable more.
  // By default it is disabled while in development mode.
  // This is an important performance consideration since Next.js Edge middleware runs on every request.
  skip: () => false,
});

/**
 * Visitor page requests only: Pages editing and preview run in draft mode and pick their
 * language from Sitecore, so they never follow the remembered visitor language.
 */
const isVisitorPageRequest = (req: NextRequest) =>
  (req.method === 'GET' || req.method === 'HEAD') &&
  !req.cookies.has('__prerender_bypass') &&
  !req.nextUrl.searchParams.has('sc_itemid');

export default async function proxy(req: NextRequest) {
  const visitor = isVisitorPageRequest(req);
  const remembered = req.cookies.get(LOCALE_COOKIE)?.value;

  // Sitecore links carry no language prefix: keep the visitor in the language they chose
  // (src/i18n/locale-preference.ts).
  const target = visitor ? preferredLocaleRedirect(req.nextUrl.pathname, remembered, routing) : null;
  if (target) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 307);
  }

  const res = await defineProxy(preview, locale, multisite, redirects, personalize).exec(req);

  const fromPath = visitor ? localeFromPath(req.nextUrl.pathname, routing.locales) : undefined;
  if (fromPath && fromPath !== remembered) {
    res.cookies.set(LOCALE_COOKIE, fromPath, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  }
  return res;
}

export const config = {
  /*
   * Match all paths except for:
   * 1. API route handlers
   * 2. /_next (Next.js internals)
   * 3. /sitecore/api (Sitecore API routes)
   * 4. /- (Sitecore media)
   * 5. /healthz (Health check)
   * 7. all root files inside /public
   */
  matcher: [
    '/',
    '/((?!api/|\\.well-known/|sitemap|robots|llms|_next/|healthz|sitecore/api/|-/|favicon.ico|sc_logo.svg|ai/).*)',
  ],
};