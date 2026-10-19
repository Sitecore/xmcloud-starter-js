'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faMusic, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import { ChevronRight, Search, User } from 'lucide-react';
import Link from 'next/link';
import { MiniCart } from './non-sitecore/MiniCart';
import { SearchBox } from './non-sitecore/SearchBox';
import { MobileMenuWrapper } from './MobileMenuWrapper';
import type { HeaderSTProps } from './header-st.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { cn } from '@/lib/utils';

const navLinkClass = 'block p-4 font-[family-name:var(--font-accent)] font-medium';

// Deferred until render so this client module can finish exporting Default
// before component-map reads it (avoids TDZ circular init).
const getComponentMap = () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('.sitecore/component-map').default;

export const Default = (props: HeaderSTProps) => {
  const fields = getDatasource(props.fields);

  return (
    <section className={`${props.params?.styles}`} data-class-change>
      <div className="flex justify-between items-start">
        <Link
          href="/"
          className="relative flex justify-center items-center grow-0 shrink-0 w-24 lg:w-32 h-24 lg:h-32 p-4 lg:p-6 bg-primary z-100"
          prefetch={false}
        >
          <ContentSdkImage field={getFieldValue(fields?.Logo)} className="w-full h-full object-contain" />
        </Link>

        <div
          className="relative flex [.partial-editing-mode_&]:flex-col-reverse justify-between items-start gap-10 grow max-w-7xl lg:px-4 bg-background"
          role="navigation"
        >
          <ul className="hidden lg:flex flex-row lg:[.partial-editing-mode_&]:!flex-col text-left bg-background">
            <AppPlaceholder
              name={`header-navigation-${props.params?.DynamicPlaceholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={getComponentMap()}
            />
          </ul>
          <div className="basis-full lg:basis-auto lg:ml-auto">
            <ul className="flex">
              <li className="hidden lg:block">
                <ContentSdkLink
                    field={getFieldValue(fields?.SupportLink)!}
                  prefetch={false}
                  className={navLinkClass}
                />
              </li>
              <li className="mr-auto lg:mr-0">
                {props.params.showSearchBox ? (
                  <SearchBox searchLink={getFieldValue(fields?.SearchLink)!} />
                ) : (
                  <ContentSdkLink
                    field={getFieldValue(fields?.SearchLink)!}
                    prefetch={false}
                    className={navLinkClass}
                  />
                )}
              </li>
              <MobileMenuWrapper>
                <div className="lg:hidden flex flex-col w-full h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <ul className="flex flex-col text-center bg-background">
                      <AppPlaceholder
                        name={`header-navigation-${props.params?.DynamicPlaceholderId}`}
                        rendering={props.rendering}
                        page={props.page}
                        componentMap={getComponentMap()}
                      />
                    </ul>
                  </div>
                  <div className="w-full">
                    <hr className="w-full border-border" />
                    <ul className="text-center">
                      <li>
                        <ContentSdkLink
                          field={getFieldValue(fields?.SupportLink)!}
                          prefetch={false}
                          className={navLinkClass}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </MobileMenuWrapper>
              <li>
                {props.params.showMiniCart ? (
                  <MiniCart cartLink={getFieldValue(fields?.CartLink)!} />
                ) : (
                  <ContentSdkLink
                    field={getFieldValue(fields?.CartLink)!}
                    prefetch={false}
                    className="block p-4"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />
                  </ContentSdkLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const SOLID_AFTER_PX = 12;
const HIDE_AFTER_PX = 180;

type HeaderChrome = 'top' | 'solid' | 'hidden';

const isChecked = (value?: string) => value === '1' || value?.toLowerCase() === 'true';

const HeaderSTScrollFrame = ({
  children,
  className,
  isEditing = false,
}: {
  children: ReactNode;
  className?: string;
  isEditing?: boolean;
}) => {
  const [chrome, setChrome] = useState<HeaderChrome>('top');
  const lastY = useRef(0);
  const hasMeasured = useRef(false);

  useEffect(() => {
    if (isEditing) return;

    const update = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;
      const goingDown = delta > 2;
      const goingUp = delta < -2;
      lastY.current = y;

      setChrome((current) => {
        if (!hasMeasured.current) {
          hasMeasured.current = true;
          if (y <= SOLID_AFTER_PX) return 'top';
          if (y > HIDE_AFTER_PX) return 'hidden';
          return 'solid';
        }

        if (y <= SOLID_AFTER_PX) return 'top';
        if (goingUp) return 'solid';
        if (goingDown && y > HIDE_AFTER_PX) return 'hidden';
        if (current === 'hidden') return 'hidden';
        return 'solid';
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isEditing]);

  const visibleChrome = isEditing ? 'editing' : chrome;

  return (
    <header
      className={cn(
        className,
        'z-50 w-full text-primary-foreground transition-transform duration-300 ease-out motion-reduce:transition-none',
        isEditing ? 'relative bg-primary' : 'fixed inset-x-0 top-0',
        !isEditing && chrome === 'top' && 'bg-transparent',
        !isEditing && chrome !== 'top' && 'bg-primary',
        !isEditing && chrome === 'hidden' && '-translate-y-full'
      )}
      data-class-change
      data-header-chrome={visibleChrome}
      data-testid="header-st-version4"
    >
      {children}
    </header>
  );
};

const iconControlClass =
  'inline-flex size-11 items-center justify-center text-primary-foreground hover:opacity-80';

const version4NavClass = [
  'hidden min-w-0 flex-1 items-center justify-center lg:flex',
  '[&_span.inline-block]:!px-2.5 [&_span.inline-block]:!py-2 [&_span.inline-block]:xl:!px-3.5',
  '[&_a]:font-(family-name:--font-heading) [&_a]:text-sm [&_a]:font-bold [&_a]:uppercase [&_a]:tracking-wide [&_a]:text-primary-foreground',
  '[&_span]:font-(family-name:--font-heading) [&_span]:text-sm [&_span]:font-bold [&_span]:uppercase [&_span]:tracking-wide [&_span]:text-primary-foreground',
  '[&_.bg-background]:!text-foreground',
  '[&_.bg-background_a]:!font-medium [&_.bg-background_a]:!text-base [&_.bg-background_a]:!normal-case [&_.bg-background_a]:!tracking-normal [&_.bg-background_a]:!text-foreground',
  '[&_.bg-background_span]:!font-medium [&_.bg-background_span]:!normal-case [&_.bg-background_span]:!tracking-normal [&_.bg-background_span]:!text-foreground',
].join(' ');

const HeaderSTVersion4View = (props: HeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const showSearchBox = Boolean(props.params?.showSearchBox);
  const showMiniCart = Boolean(props.params?.showMiniCart) && !isChecked(props.params?.HideCart);
  const searchLink = getFieldValue(fields?.SearchLink);
  const loginLink = getFieldValue(fields?.LoginLink);
  const cartLink = getFieldValue(fields?.CartLink);
  const placeholderName = `header-navigation-${props.params?.DynamicPlaceholderId}`;

  return (
    <div className="mx-auto flex h-[4.5rem] w-full max-w-[90rem] items-center gap-3 px-4 lg:px-6">
      <Link
        href="/"
        className="relative z-10 flex h-12 shrink-0 items-center rounded-md bg-background px-2.5 py-1.5"
        prefetch={false}
        aria-label="Home"
      >
        <ContentSdkImage
          field={getFieldValue(fields?.Logo)}
          className="h-8 w-auto max-w-[7.5rem] object-contain"
        />
      </Link>

      <nav className={version4NavClass} aria-label="Primary">
        <ul className="flex flex-row items-center">
          <AppPlaceholder
            name={placeholderName}
            rendering={props.rendering}
            page={props.page}
            componentMap={getComponentMap()}
          />
        </ul>
      </nav>

      <div className="ml-auto flex items-center text-primary-foreground">
        {loginLink ? (
          <ContentSdkLink
            field={loginLink}
            prefetch={false}
            className={iconControlClass}
            aria-label={loginLink.value?.text || 'Log in'}
          >
            <User className="size-6" strokeWidth={1.75} aria-hidden />
          </ContentSdkLink>
        ) : (
          <span className={iconControlClass} aria-hidden>
            <User className="size-6" strokeWidth={1.75} />
          </span>
        )}

        {showSearchBox && searchLink ? (
          <SearchBox searchLink={searchLink} />
        ) : searchLink ? (
          <ContentSdkLink
            field={searchLink}
            prefetch={false}
            className={iconControlClass}
            aria-label={searchLink.value?.text || 'Search'}
          >
            <Search className="size-6" strokeWidth={1.75} aria-hidden />
          </ContentSdkLink>
        ) : (
          <span className={iconControlClass} aria-hidden>
            <Search className="size-6" strokeWidth={1.75} />
          </span>
        )}

        <MobileMenuWrapper alwaysVisible className="p-2 text-primary-foreground">
          <div className="flex h-full w-full flex-col">
            <div className="flex flex-1 items-center justify-center">
              <ul className="flex flex-col bg-background text-center text-foreground">
                <AppPlaceholder
                  name={placeholderName}
                  rendering={props.rendering}
                  page={props.page}
                  componentMap={getComponentMap()}
                />
              </ul>
            </div>
          </div>
        </MobileMenuWrapper>

        {showMiniCart && cartLink ? <MiniCart cartLink={cartLink} /> : null}
      </div>
    </div>
  );
};

export const Version4 = (props: HeaderSTProps) => (
  <HeaderSTScrollFrame
    className={props.params?.styles}
    isEditing={Boolean(props.page?.mode?.isEditing)}
  >
    <HeaderSTVersion4View {...props} />
  </HeaderSTScrollFrame>
);

const version5HeaderHeight = '8.75rem';

const version5UtilityLinks = [
  { label: 'Product Store', path: '' },
  { label: 'Our Story', path: 'Our Story' },
  { label: 'R3', path: 'R3' },
  { label: 'Riverbend Ranch', path: 'Riverbend Ranch' },
] as const;

const version5CategoryClass = [
  'flex min-w-0 flex-1 items-center',
  '[&_a]:whitespace-nowrap [&_a]:px-3 [&_a]:py-3 [&_a]:text-xs [&_a]:font-medium [&_a]:uppercase [&_a]:tracking-wide [&_a]:text-primary-foreground',
  '[&_span]:whitespace-nowrap [&_span]:text-xs [&_span]:font-medium [&_span]:uppercase [&_span]:tracking-wide [&_span]:text-primary-foreground',
  '[&_button]:whitespace-nowrap [&_button]:text-xs [&_button]:font-medium [&_button]:uppercase [&_button]:tracking-wide [&_button]:text-primary-foreground',
  '[&_li]:w-auto [&_li]:shrink-0 [&_li]:basis-auto',
].join(' ');

const HeaderSTVersion5View = (props: HeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const showMiniCart = Boolean(props.params?.showMiniCart) && !isChecked(props.params?.HideCart);
  const searchLink = getFieldValue(fields?.SearchLink);
  const loginLink = getFieldValue(fields?.LoginLink);
  const cartLink = getFieldValue(fields?.CartLink);
  const placeholderName = `header-navigation-${props.params?.DynamicPlaceholderId}`;
  const pageContext = props.page as { siteName?: string; locale?: string } | undefined;
  const site = pageContext?.siteName || 'melaleuca';
  const locale = pageContext?.locale || 'en';
  const categoryRowRef = useRef<HTMLUListElement>(null);
  const searchHref = searchLink?.value?.href || `/${site}/${locale}`;

  const contentHref = (path: string) =>
    path ? `/${site}/${locale}/${encodeURI(path)}` : `/${site}/${locale}`;

  const isEditing = Boolean(props.page?.mode?.isEditing);

  return (
    <header
      className={cn(props.params?.styles, 'w-full text-primary-foreground')}
      data-class-change
      data-testid="header-st-version5"
    >
      {!isEditing && (
        <style>{`@media (min-width: 64rem) { header[class~="lg:fixed"] + main { padding-top: ${version5HeaderHeight}; } }`}</style>
      )}
      <div className="bg-dark">
        <div className="mx-auto flex h-9 max-w-[90rem] items-center px-4 lg:px-6">
          <nav aria-label="Sections" className="flex items-center gap-5">
            {version5UtilityLinks.map((item) => (
              <Link
                key={item.label}
                href={contentHref(item.path)}
                prefetch={false}
                className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground hover:opacity-80"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-primary">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-3 lg:gap-5 lg:px-6">
          <ul className="flex shrink-0 items-center">
            <MobileMenuWrapper
              alwaysVisible
              label="Menu"
              className="p-0 text-primary-foreground"
              panelClassName="top-[8.75rem] h-[calc(100vh-8.75rem)]"
            >
              <div className="flex h-full w-full flex-col">
                <ul className="flex flex-col bg-background text-center text-foreground">
                  <AppPlaceholder
                    name={placeholderName}
                    rendering={props.rendering}
                    page={props.page}
                    componentMap={getComponentMap()}
                  />
                </ul>
              </div>
            </MobileMenuWrapper>
          </ul>

          <Link
            href={contentHref('')}
            className="flex h-10 shrink-0 items-center"
            prefetch={false}
            aria-label="Home"
          >
            <ContentSdkImage
              field={getFieldValue(fields?.Logo)}
              className="h-10 w-auto max-w-[14rem] object-contain object-left"
            />
          </Link>

          <form action={searchHref} className="mx-2 hidden min-w-0 flex-1 md:block" role="search">
            <label htmlFor="header-search" className="sr-only">
              Search
            </label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search"
              className="h-10 w-full rounded-full border-0 bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            {loginLink?.value?.href ? (
              <ContentSdkLink
                field={loginLink}
                prefetch={false}
                className="inline-flex h-10 items-center rounded-md border border-primary-foreground px-4 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              />
            ) : (
              <Link
                href={contentHref('Our Story/Become a Member')}
                prefetch={false}
                className="inline-flex h-10 items-center rounded-md border border-primary-foreground px-4 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Sign In
              </Link>
            )}
            {showMiniCart && cartLink ? <MiniCart cartLink={cartLink} /> : null}
          </div>
        </div>
      </div>

      <div className="bg-dark">
        <div className="mx-auto flex max-w-[90rem] items-center pr-2">
          <nav aria-label="Primary" className={version5CategoryClass}>
            <ul
              ref={categoryRowRef}
              className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              <AppPlaceholder
                name={placeholderName}
                rendering={props.rendering}
                page={props.page}
                componentMap={getComponentMap()}
              />
            </ul>
          </nav>
          <button
            type="button"
            aria-label="More categories"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => categoryRowRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
};

export const Version5 = (props: HeaderSTProps) => <HeaderSTVersion5View {...props} />;

const ashaUtilityLinks = [
  { label: 'About', path: 'About' },
  { label: 'Join ASHA', path: 'Join ASHA' },
  { label: 'ASHA Store', href: 'https://www.asha.org/' },
  { label: 'My Account', href: 'https://www.asha.org/' },
  { label: 'Login', href: 'https://www.asha.org/' },
] as const;

const ashaSocialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/ASHAorg', icon: faFacebook },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/american-speech-language-hearing-association', icon: faLinkedinIn },
  { label: 'Instagram', href: 'https://www.instagram.com/ashaweb', icon: faInstagram },
  { label: 'X', href: 'https://x.com/ASHAWeb', icon: faXTwitter },
  { label: 'ASHA Stream', href: 'https://www.asha.org/', icon: faMusic },
  { label: 'YouTube', href: 'https://www.youtube.com/user/ASHAWeb', icon: faYoutube },
] as const;

// Pages forces each mega-menu panel to static and fully open. That stretches every
// primary item to the width of its link list, so only Careers and a sliver of the
// next item stay in the row. Keep the panels out of the row in this variant.
const ashaMenuPanelClass = [
  'relative',
  // Sitecore grid styles set basis-full on each Mega Menu, which makes the first
  // item consume the row and pushes the rest off the right edge.
  '[&_li]:!flex-none [&_li]:!w-auto',
  '[.partial-editing-mode_&_li>div]:!absolute',
  '[.partial-editing-mode_&_li>div]:!top-full',
  '[.partial-editing-mode_&_li>div]:!right-0',
  '[.partial-editing-mode_&_li>div]:!left-0',
  '[.partial-editing-mode_&_li>div]:!h-auto',
  '[.partial-editing-mode_&_li>div]:!w-full',
  '[.partial-editing-mode_&_li>div]:!opacity-0',
  '[.partial-editing-mode_&_li>div]:!pointer-events-none',
  '[.partial-editing-mode_&_li:hover>div]:!opacity-100',
  '[.partial-editing-mode_&_li:hover>div]:!pointer-events-auto',
  '[.partial-editing-mode_&_li:focus-within>div]:!opacity-100',
  '[.partial-editing-mode_&_li:focus-within>div]:!pointer-events-auto',
].join(' ');

const ashaPrimaryNavClass = [
  ashaMenuPanelClass,
  '[&_a]:text-[11px] [&_a]:font-medium [&_a]:uppercase [&_a]:tracking-[0.08em] [&_a]:text-foreground',
  '[&_span]:text-[11px] [&_span]:font-medium [&_span]:uppercase [&_span]:tracking-[0.08em] [&_span]:text-foreground',
  '[&_span.inline-block]:!px-2 [&_span.inline-block]:!py-3',
].join(' ');

const ashaAudienceNavClass = [
  ashaMenuPanelClass,
  '[&_a]:text-[13px] [&_a]:font-normal [&_a]:normal-case [&_a]:tracking-normal [&_a]:text-primary-foreground',
  '[&_span]:text-[13px] [&_span]:font-normal [&_span]:normal-case [&_span]:tracking-normal [&_span]:text-primary-foreground',
  '[&_span.inline-block]:!px-2 [&_span.inline-block]:!py-2.5',
].join(' ');

const HeaderSTAshaView = (props: HeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const pageContext = props.page as { siteName?: string; locale?: string } | undefined;
  const site = pageContext?.siteName || 'asha';
  const locale = pageContext?.locale || 'en';
  const dynamicId = props.params?.DynamicPlaceholderId;
  const placeholderName = `header-navigation-${dynamicId}`;
  const audiencePlaceholderName = `header-audience-${dynamicId}`;
  const identityPlaceholderName = `header-identity-${dynamicId}`;
  const searchLink = getFieldValue(fields?.SearchLink);
  const pageHref = (path: string) =>
    path ? `/${site}/${locale}/${encodeURI(path)}` : `/${site}/${locale}`;

  return (
    <header
      className={cn(props.params?.styles, 'w-full bg-background text-foreground')}
      data-class-change
      data-testid="header-st-asha"
    >
      <div className="mx-auto flex max-w-[90rem] items-start justify-between gap-6 px-6 pt-4">
        <Link href={pageHref('')} prefetch={false} aria-label="ASHA home" className="shrink-0">
          <ContentSdkImage field={getFieldValue(fields?.Logo)} className="h-14 w-auto object-contain" />
        </Link>
        <div className="flex flex-col items-end gap-2">
          <nav aria-label="Utility" className="flex flex-wrap justify-end gap-x-4 gap-y-1">
            {ashaUtilityLinks.map((item) => (
              <Link
                key={item.label}
                href={'href' in item ? item.href : pageHref(item.path)}
                prefetch={false}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-foreground" data-testid="header-st-asha-social">
            {ashaSocialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-7 items-center justify-center hover:text-primary"
              >
                <FontAwesomeIcon icon={item.icon} className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-8 px-6 pb-4 pt-2">
        <div className="min-w-0 [&_.component-content_p:first-child]:text-lg [&_.component-content_p:first-child]:font-semibold [&_.component-content_p:first-child]:leading-tight [&_.component-content_p+p]:mt-1 [&_.component-content_p+p]:text-sm">
          <AppPlaceholder
            name={identityPlaceholderName}
            rendering={props.rendering}
            page={props.page}
            componentMap={getComponentMap()}
          />
        </div>
        <form
          action={searchLink?.value?.href || pageHref('')}
          role="search"
          className="flex w-full max-w-xs shrink-0"
        >
          <label htmlFor="asha-header-search" className="sr-only">
            Search
          </label>
          <input
            id="asha-header-search"
            name="q"
            type="search"
            placeholder="Search"
            className="h-9 min-w-0 flex-1 border border-border bg-background px-3 text-sm text-foreground outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground"
          >
            <Search className="size-4" aria-hidden />
          </button>
        </form>
      </div>

      <nav aria-label="Primary" className={cn('border-t border-border', ashaPrimaryNavClass)}>
        <ul className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-4 [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:justify-between">
          <AppPlaceholder
            name={placeholderName}
            rendering={props.rendering}
            page={props.page}
            componentMap={getComponentMap()}
          />
        </ul>
      </nav>

      <nav aria-label="Audiences" className={cn('bg-primary text-primary-foreground', ashaAudienceNavClass)}>
        <ul className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-3 px-4 [&>div]:flex [&>div]:w-full [&>div]:items-center [&>div]:justify-between">
          <AppPlaceholder
            name={audiencePlaceholderName}
            rendering={props.rendering}
            page={props.page}
            componentMap={getComponentMap()}
          />
        </ul>
      </nav>
    </header>
  );
};

export const Asha = (props: HeaderSTProps) => <HeaderSTAshaView {...props} />;
