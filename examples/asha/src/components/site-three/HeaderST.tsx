'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import { Search, User } from 'lucide-react';
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
