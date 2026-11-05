'use client';

import React, { JSX, useState, useEffect } from 'react';
import { hasText } from '@/lib/field-utils';
import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';
import { TypeaheadSearchBox } from '@/lib/search-ui/TypeaheadSearchBox';
import { SITECORE_GRADIENT } from '@/lib/demo-ui/sitecore-ui';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

interface NavigationLinkFields {
  id: string;
  linkText: { jsonValue: Field<string> };
  linkUrl: { jsonValue: LinkField };
}

interface NavigationHeaderDatasource {
  brandLogo: { jsonValue: ImageField };
  ctaLabel: { jsonValue: Field<string> };
  ctaLink: { jsonValue: LinkField };
  // Optional header search slot — renders a typeahead in the nav row when
  // SearchIndex is filled on the datasource. Empty = no search box.
  searchIndex?: { jsonValue: Field<string> };
  titleMapping?: { jsonValue: Field<string> };
  linkMapping?: { jsonValue: Field<string> };
  resultsPage?: { jsonValue: LinkField };
  maxSuggestions?: { jsonValue: Field<string> };
  children: {
    results: NavigationLinkFields[];
  };
}

interface NavigationHeaderFields {
  data: {
    datasource: NavigationHeaderDatasource;
  };
}

type NavigationHeaderProps = ComponentProps & {
  fields: NavigationHeaderFields;
};

const NavigationHeaderDefaultComponent = (): JSX.Element => (
  <div className="component navigation-header">
    <div className="component-content">
      <span className="is-empty-hint">NavigationHeader</span>
    </div>
  </div>
);

const Logo = ({ className, brandLogo }: { className?: string; brandLogo?: ImageField }) => {
  const hasImage = brandLogo?.value?.src;
  return (
    <Link
      href="/"
      className={cn('flex items-center text-xl font-bold tracking-tight', className)}
      style={{ color: 'var(--brand-header-fg, inherit)' }}
    >
      {hasImage ? (
        <ContentSdkImage field={brandLogo} className="h-8 w-auto object-contain sm:h-10" />
      ) : (
        <>
          <span style={{ color: 'var(--brand-primary)' }}>Brand</span>Logo
        </>
      )}
    </Link>
  );
};

const NavLinks = ({ className, items }: { className?: string; items: NavigationLinkFields[] }) => (
  <nav className={cn('hidden md:flex items-center gap-6', className)}>
    {items.map((item) => (
      <ContentSdkLink
        key={item.id}
        field={item.linkUrl?.jsonValue}
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--brand-header-fg, inherit)' }}
      >
        {hasText(item.linkText?.jsonValue?.value) && <Text field={item.linkText?.jsonValue} />}
      </ContentSdkLink>
    ))}
  </nav>
);

const MobileMenu = ({
  items,
  open,
  onClose,
}: {
  items: NavigationLinkFields[];
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="md:hidden border-t" style={{ borderColor: 'var(--brand-border, #e5e7eb)' }}>
      <div className="px-4 py-4 flex flex-col gap-4">
        {items.map((item) => (
          <ContentSdkLink
            key={item.id}
            field={item.linkUrl?.jsonValue}
            className="text-sm font-medium"
            style={{ color: 'var(--brand-header-fg, inherit)' }}
            onClick={onClose}
          >
            {hasText(item.linkText?.jsonValue?.value) && <Text field={item.linkText?.jsonValue} />}
          </ContentSdkLink>
        ))}
      </div>
    </div>
  );
};

const CtaButton = ({
  className,
  label,
  link,
  isEditing,
}: {
  className?: string;
  label?: Field<string>;
  link?: LinkField;
  isEditing?: boolean;
}) => {
  if (!link?.value?.href && !isEditing) return null;

  const ctaClassName = cn(
    'hidden md:inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90',
    className,
  );
  const ctaStyle = {
    backgroundColor: 'var(--brand-primary)',
    color: 'var(--brand-primary-foreground)',
  };

  if (!link) {
    return (
      <span className={ctaClassName} style={ctaStyle}>
        {hasText(label?.value) && <Text field={label} />}
      </span>
    );
  }

  return (
    <ContentSdkLink field={link} className={ctaClassName} style={ctaStyle}>
      {hasText(label?.value) && <Text field={label} />}
    </ContentSdkLink>
  );
};

// The in-row search slot: glass pill sized for the nav bar, only when the
// datasource carries a search index. Hidden on mobile (the bar is too tight).
const HeaderSearch = ({
  datasource,
  page,
  rendering,
}: Pick<ComponentProps, 'page' | 'rendering'> & {
  datasource: NavigationHeaderDatasource;
}) => {
  if (!datasource.searchIndex?.jsonValue?.value) return null;
  return (
    <div className="hidden md:block">
      <TypeaheadSearchBox
        compact
        onDark
        fields={{
          SearchIndex: datasource.searchIndex?.jsonValue,
          TitleMapping: datasource.titleMapping?.jsonValue,
          LinkMapping: datasource.linkMapping?.jsonValue,
          ResultsPage: datasource.resultsPage?.jsonValue,
          MaxSuggestions: datasource.maxSuggestions?.jsonValue,
        }}
        page={page}
        rendering={rendering}
        className="w-44 lg:w-64"
      />
    </div>
  );
};

const MenuButton = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button
    className="md:hidden p-2"
    onClick={onClick}
    aria-label="Toggle menu"
    style={{ color: 'var(--brand-header-fg, inherit)' }}
  >
    {open ? (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ) : (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    )}
  </button>
);

export const Default = ({
  fields,
  params,
  page,
  rendering,
}: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [menuOpen, setMenuOpen] = useState(false);

  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = datasource.children?.results || [];
  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className="w-full border-b"
        style={{
          backgroundColor: 'var(--brand-header-bg, #ffffff)',
          borderColor: 'var(--brand-border, #e5e7eb)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo brandLogo={brandLogo} />
          <NavLinks items={links} />
          <div className="flex items-center gap-3">
            <HeaderSearch datasource={datasource} page={page} rendering={rendering} />
            <LanguageSwitcher page={page} className="text-[color:var(--brand-header-fg,inherit)]" />
            <CtaButton
              label={datasource.ctaLabel?.jsonValue}
              link={datasource.ctaLink?.jsonValue}
              isEditing={isEditing}
            />
            <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};

export const Transparent = ({ fields, params, page }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const datasource = fields?.data?.datasource;

  useEffect(() => {
    if (!datasource) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [datasource]);

  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = datasource.children?.results || [];
  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
          scrolled ? 'border-b shadow-sm' : '',
        )}
        style={{
          backgroundColor: scrolled ? 'var(--brand-header-bg, #ffffff)' : 'transparent',
          borderColor: scrolled ? 'var(--brand-border, #e5e7eb)' : 'transparent',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo
            brandLogo={brandLogo}
            className={cn('transition-colors duration-300', !scrolled && 'drop-shadow-sm')}
          />
          <NavLinks
            items={links}
            className={cn(
              'transition-colors duration-300',
              !scrolled && '[&_a]:!text-white [&_a]:drop-shadow-sm',
            )}
          />
          <div className="flex items-center gap-2">
            <LanguageSwitcher
              page={page}
              className={cn(
                'transition-colors duration-300',
                scrolled ? 'text-[color:var(--brand-header-fg,inherit)]' : 'text-white drop-shadow-sm',
              )}
            />
            <CtaButton
              label={datasource.ctaLabel?.jsonValue}
              link={datasource.ctaLink?.jsonValue}
              isEditing={isEditing}
            />
            <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};

export const Minimal = ({ fields, params }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;

  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className="w-full"
        style={{
          backgroundColor: 'var(--brand-header-bg, #ffffff)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6">
          <Logo brandLogo={brandLogo} />
        </div>
      </header>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore variant — white 96px bar with a hairline border: logo, 18px nav
   links, compact search and a red→violet gradient "Request a demo" pill.
   ──────────────────────────────────────────── */
export const Sitecore = ({
  fields,
  params,
  page,
  rendering,
}: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [menuOpen, setMenuOpen] = useState(false);

  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = datasource.children?.results || [];
  const ctaLink = datasource.ctaLink?.jsonValue;
  const ctaLabel = datasource.ctaLabel?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className="w-full border-b"
        style={{
          backgroundColor: 'var(--brand-header-bg)',
          borderColor: 'var(--brand-border)',
          color: 'var(--brand-header-fg)',
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-4 md:h-[96px] md:px-12">
          <div className="flex items-center gap-8">
            <Logo brandLogo={datasource.brandLogo?.jsonValue} className="[&_img]:h-[30px] [&_img]:sm:h-[34px]" />
            <NavLinks items={links} className="gap-4 lg:gap-6 [&_a]:font-body [&_a]:text-[18px] [&_a]:font-normal" />
          </div>
          <div className="flex items-center gap-4">
            <HeaderSearch datasource={datasource} page={page} rendering={rendering} />
            <LanguageSwitcher page={page} />
            {(ctaLink?.value?.href || isEditing) && (
              <ContentSdkLink
                field={ctaLink}
                className="hidden items-center rounded-[var(--brand-button-radius,9999px)] px-4 py-2 font-body text-[17px] transition hover:brightness-110 md:inline-flex"
                style={{ background: SITECORE_GRADIENT, color: 'var(--brand-primary-foreground)' }}
              >
                {(hasText(ctaLabel?.value) || isEditing) && <Text field={ctaLabel} />}
              </ContentSdkLink>
            )}
            <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};
