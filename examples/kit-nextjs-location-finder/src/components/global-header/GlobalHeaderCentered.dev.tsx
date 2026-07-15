'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import { Menu } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { GlobalHeaderProps } from './global-header.props';
import { Button } from '@/components/ui/button';
import { useMatchMedia } from '@/hooks/use-match-media';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';

export const GlobalHeaderCentered: React.FC<GlobalHeaderProps> = (props) => {
  const { fields, isPageEditing } = props ?? {};
  const { logo, primaryNavigationLinks, headerContact } =
    fields?.data?.item ?? {};
  const [isOpen, setIsOpen] = useState(false);
  const [sheetAnimationComplete, setSheetAnimationComplete] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const navRef = useRef<HTMLDivElement>(null);
  // Reset sheet animation state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSheetAnimationComplete(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY < prevScrollY) {
        setVisible(true);
      } else if (currentScrollY > 10 && currentScrollY > prevScrollY) {
        setVisible(false);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Sheet animation duration in seconds
  const sheetAnimationDuration = isReducedMotion ? 0 : 0.3;

  return (
    <AnimatePresence mode="wait" data-component="GlobalHeader">
      <m.header
        initial={{ opacity: 1 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: isReducedMotion ? 0 : 0.2 }}
        className={cn(
          'bg-background/80 @container sticky top-0 z-50 flex h-[96px] w-full items-center justify-center border-b backdrop-blur-md',
        )}
      >
        <div className="@xl:px-8 relative mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4">
          {/* Desktop Navigation */}
          <nav className="@lg:flex @lg:flex-[2] z-10 hidden" ref={navRef} aria-label="Primary navigation">
            <NavigationMenu className="w-full">
              <div className="relative w-full">
                <AnimatedHoverNav
                  mobileBreakpoint="xs"
                  parentRef={navRef}
                  indicatorClassName="bg-primary rounded-sm absolute inset-0 z-[-1] block"
                >
                  <NavigationMenuList className="flex w-full justify-between">
                    {primaryNavigationLinks?.targetItems &&
                      primaryNavigationLinks.targetItems.length > 0 &&
                      primaryNavigationLinks?.targetItems.map((item, index) => (
                        <NavigationMenuItem
                          key={`${item.link?.jsonValue?.value?.text}-${index}`}
                        >
                          {item.link?.jsonValue && (isPageEditing || item.link.jsonValue?.value?.href) && (
                            <Button
                              variant="ghost"
                              asChild
                              className="font-body bg-transparent text-base font-medium hover:bg-transparent"
                            >
                              <CompatibleLink
                                field={item.link?.jsonValue}
                                editable={isPageEditing}
                                prefetch={false}
                              />
                            </Button>
                          )}
                        </NavigationMenuItem>
                      ))}
                  </NavigationMenuList>
                </AnimatedHoverNav>
              </div>
            </NavigationMenu>
          </nav>
          <div className="absolute left-1/2 top-1/2 flex w-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center [&_.image-container]:mx-auto [&_.image-container]:w-full">
            {!isPageEditing ? (
              <Link href="/" className="flex items-center justify-center">
                <ImageWrapper
                  image={logo?.jsonValue}
                  className="w-full object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="Home"
                  page={props.page}
                />
              </Link>
            ) : (
              <ImageWrapper
                image={logo?.jsonValue}
                className="w-full object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Home"
                page={props.page}
              />
            )}
          </div>
          {/* Desktop CTA */}
          {headerContact?.jsonValue?.value && (
            <div className="@lg:flex @lg:items-center @lg:justify-end @lg:flex-1 z-10 hidden">
              <Button asChild className="font-heading text-base font-medium">
                <CompatibleLink
                  field={headerContact.jsonValue}
                  editable={isPageEditing}
                  prefetch={false}
                />
              </Button>
            </div>
          )}
          {/* Mobile Navigation */}
          <div className="@lg:hidden z-10 flex flex-1 justify-end">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <AnimatePresence>
                {isOpen && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-background/30 fixed inset-0 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                  />
                )}
              </AnimatePresence>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent [&_svg]:size-8"
                >
                  <Menu />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="bg-background/60 h-[100dvh] border-t-0 p-0 backdrop-blur-md [&>button_svg]:size-8"
              >
                <m.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{
                    duration: sheetAnimationDuration,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() => setSheetAnimationComplete(true)}
                  className="my-12 flex h-full w-full flex-col p-6"
                >
                  <AnimatePresence>
                    {sheetAnimationComplete && (
                      <m.nav
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col space-y-4"
                      >
                        {primaryNavigationLinks?.targetItems &&
                          primaryNavigationLinks.targetItems.length > 0 &&
                          primaryNavigationLinks?.targetItems.map(
                            (item, index) => (
                              <m.div
                                key={`${item.link?.jsonValue?.value?.text}-mobile`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 0.05 * index,
                                  duration: isReducedMotion ? 0 : 0.3,
                                }}
                                className="flex justify-center"
                              >
                                <Button
                                  variant="ghost"
                                  asChild
                                  onClick={() => setIsOpen(false)}
                                >
                                  <CompatibleLink
                                    field={item.link?.jsonValue}
                                    editable={isPageEditing}
                                    prefetch={false}
                                  />
                                </Button>
                              </m.div>
                            ),
                          )}
                        {headerContact?.jsonValue?.value && (
                          <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: primaryNavigationLinks?.targetItems?.length
                                ? 0.05 *
                                  primaryNavigationLinks.targetItems.length
                                : 0,
                              duration: isReducedMotion ? 0 : 0.3,
                            }}
                            className="flex justify-center"
                          >
                            <Button asChild onClick={() => setIsOpen(false)}>
                              <CompatibleLink
                                field={headerContact.jsonValue}
                                editable={isPageEditing}
                                prefetch={false}
                              />
                            </Button>
                          </m.div>
                        )}
                      </m.nav>
                    )}
                  </AnimatePresence>
                </m.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </m.header>
    </AnimatePresence>
  );
};
