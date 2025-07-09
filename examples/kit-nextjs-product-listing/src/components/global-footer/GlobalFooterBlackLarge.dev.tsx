'use client';

import type React from 'react';

import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { GlobalFooterProps } from './global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';
import { Default as FooterNavigationColumn } from './FooterNavigationColumn.dev';
import { useContainerQuery } from '@/hooks/use-container-query';

export const GlobalFooterBlackLarge: React.FC<GlobalFooterProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { dictionary } = fields;
  const { footerNavLinks, footerCopyright, socialLinks, tagline, emailSubscriptionTitle } =
    fields.data.datasource ?? {};
  const footerRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const socialContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useContainerQuery(footerRef, 'md', 'max');

  if (fields) {
    return (
      <footer
        className="@container bg-background text-foreground relative w-full overflow-hidden"
        ref={footerRef}
      >
        {/* Main footer content */}
        <div className="px-4 pb-16 pt-12">
          <div className="relative z-10 mx-auto max-w-screen-2xl">
            <div className="grid grid-cols-1  items-end gap-8 md:grid-cols-[1fr,auto]">
              {/* Left section with heading and subscription */}
              <div>
                {/* Left section with heading */}
                <div className="max-w-[400px]">
                  <Text
                    tag="h2"
                    field={tagline?.jsonValue}
                    className="font-heading text-75xl mb-10 text-pretty font-light antialiased"
                  />
                  {/* Navigation links */}
                </div>

                <Text
                  className="font-body mb-4 text-xl font-medium"
                  field={emailSubscriptionTitle?.jsonValue}
                  tag="p"
                />

                <div className="@md:mb-[100px] @sm:flex-row flex max-w-md flex-col gap-2">
                  <EmailSignupForm
                    fields={{
                      buttonVariant: 'default',
                      emailPlaceholder: {
                        value: dictionary?.FOOTER_EmailPlaceholder,
                      },
                      emailSubmitLabel: {
                        value: dictionary?.FOOTER_EmailSubmitLabel,
                      },
                      emailErrorMessage: {
                        value: dictionary?.FOOTER_EmailErrorMessage,
                      },
                      emailSuccessMessage: {
                        value: dictionary?.FOOTER_EmailSuccessMessage,
                      },
                    }}
                  />
                </div>
                <div
                  className="@md:bottom-0 @md:-right-[100px] @md:inset-unset pointer-events-none absolute inset-0 -z-10 opacity-30"
                  aria-hidden="true"
                >
                  <div className="@md:justify-end flex h-full w-full items-end justify-center leading-none">
                    <div className="bg-dark-gradient text-fill-transparent text-50-clamp @md:-mb-[130px] -mb-[85px] bg-clip-text text-center font-bold leading-none text-transparent">
                      Alaris
                    </div>
                  </div>
                </div>
              </div>

              {/* Right section with navigation links - using vertical AnimatedHoverNav */}
              <div className="@md:items-end flex flex-col gap-2 text-right" ref={navContainerRef}>
                <FooterNavigationColumn
                  items={footerNavLinks?.results}
                  isPageEditing={isPageEditing}
                  parentRef={footerRef}
                  indicatorClassName="h-0-5 bg-white rounded-default mt-10"
                  alignItems={isMobile ? 'start' : 'end'}
                  orientation="vertical"
                  listClassName="gap-0 flex list-none flex-wrap p-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with social icons and copyright */}
        <div className="border-foreground border-t">
          <div className="@sm:flex-row @sm:justify-between mx-auto flex max-w-screen-2xl flex-col items-center justify-start gap-4 px-4 py-12">
            {/* Social media icons - using responsive AnimatedHoverNav */}
            <div ref={socialContainerRef}>
              <AnimatedHoverNav
                parentRef={footerRef}
                orientation="horizontal"
                indicatorClassName="h-0-5 bg-white rounded-default bottom-0 mt-10"
                mobileBreakpoint={null}
              >
                <ul className="@sm:gap-6 mx-auto flex items-center gap-4">
                  {socialLinks?.results?.map((socialLink, index) => (
                    <li key={index} className="relative z-10">
                      <EditableButton
                        buttonLink={socialLink?.link?.jsonValue}
                        className={cn('relative hover:bg-transparent')}
                        variant="ghost"
                        size={isPageEditing ? 'default' : 'icon'}
                        isPageEditing={isPageEditing}
                        icon={socialLink?.socialIcon?.jsonValue}
                        asIconLink={true}
                      />
                    </li>
                  ))}
                </ul>
              </AnimatedHoverNav>
            </div>
            {/* Copyright text */}
            <Text field={footerCopyright?.jsonValue} encode={false} />
          </div>
        </div>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer - Black Large" />;
};
