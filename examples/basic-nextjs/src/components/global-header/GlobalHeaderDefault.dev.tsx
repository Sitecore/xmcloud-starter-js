'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Menu } from 'lucide-react';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { GlobalHeaderProps } from './global-header.props';
import { Button } from '@/components/ui/button';
import { getFieldValue } from '@/lib/component-props';

/** Shown when no logo image has been set on the header datasource. */
const FALLBACK_WORDMARK = 'williams lea';

/**
 * Two-tier corporate header: a slim brand-colour utility bar above a white
 * navigation bar with the logo, primary links and a contact button.
 */
export const GlobalHeaderDefault: React.FC<GlobalHeaderProps> = (props) => {
  const { fields, isPageEditing } = props ?? {};
  const { logo, primaryNavigationLinks, utilityNavigationLinks, headerContact } =
    fields?.data?.item ?? {};
  const logoField = getFieldValue(logo as any);
  const headerContactField = getFieldValue(headerContact as any);
  const primaryItems = primaryNavigationLinks?.targetItems ?? [];
  const utilityItems = utilityNavigationLinks?.targetItems ?? [];
  const [isOpen, setIsOpen] = useState(false);

  const logoContent = logoField?.value?.src ? (
    <ImageWrapper
      image={logoField}
      className="h-9 w-auto object-contain"
      sizes="160px"
      alt="Home"
    />
  ) : (
    <span className="flex items-center gap-2 text-[22px] leading-none tracking-tight text-primary">
      <span className="inline-block size-3 rounded-full border-[3px] border-current" aria-hidden="true" />
      {FALLBACK_WORDMARK}
    </span>
  );

  return (
    <header data-component="GlobalHeader" className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Utility bar */}
      <div className="bg-primary text-primary-foreground hidden lg:block">
        <ul className="mx-auto flex h-9 max-w-screen-2xl items-center justify-end gap-7 px-12 text-sm">
          {utilityItems.map((item, index) => {
            const link = getFieldValue(item.link as any);
            if (!link || (!isPageEditing && !link?.value?.href)) return null;
            return (
              <li key={`${link?.value?.text}-${index}`}>
                <CompatibleLink field={link} editable={isPageEditing} prefetch={false} className="hover:underline" />
              </li>
            );
          })}
          <li className="flex items-center gap-1">
            <Globe className="size-3.5" aria-hidden="true" />
            English
          </li>
        </ul>
      </div>

      {/* Main bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-[57px] max-w-screen-2xl items-center justify-between gap-6 px-4 lg:px-12">
          {isPageEditing ? (
            logoContent
          ) : (
            <Link href="/" prefetch={false} aria-label="Home">
              {logoContent}
            </Link>
          )}

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            <ul className="flex items-center gap-8 text-sm">
              {primaryItems.map((item, index) => {
                const link = getFieldValue(item.link as any);
                if (!link || (!isPageEditing && !link?.value?.href)) return null;
                return (
                  <li key={`${link?.value?.text}-${index}`} className="flex items-center gap-1.5">
                    <CompatibleLink
                      field={link}
                      editable={isPageEditing}
                      prefetch={false}
                      className="text-foreground hover:text-primary py-4 transition-colors"
                    />
                    {link?.value?.href !== '/' && <ChevronDown className="size-3" aria-hidden="true" />}
                  </li>
                );
              })}
            </ul>
            {(headerContactField?.value?.href || isPageEditing) && (
              <Button asChild className="rounded-none">
                <CompatibleLink field={headerContactField} editable={isPageEditing} prefetch={false} />
              </Button>
            )}
          </nav>

          {/* Mobile navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent lg:hidden [&_svg]:size-6"
                aria-label="Toggle navigation menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
                {[...primaryItems, ...utilityItems].map((item, index) => {
                  const link = getFieldValue(item.link as any);
                  if (!link?.value?.href) return null;
                  return (
                    <CompatibleLink
                      key={`${link?.value?.text}-mobile-${index}`}
                      field={link}
                      editable={false}
                      prefetch={false}
                      className="border-b border-border py-3.5 text-base"
                      onClick={() => setIsOpen(false)}
                    />
                  );
                })}
                {headerContactField?.value?.href && (
                  <Button asChild className="mt-6 rounded-none" onClick={() => setIsOpen(false)}>
                    <CompatibleLink field={headerContactField} editable={false} prefetch={false} />
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
