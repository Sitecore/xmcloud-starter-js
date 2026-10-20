'use client';

import type React from 'react';

import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { FooterSocialLink, GlobalFooterProps } from './global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';
import { Default as FooterNavigationColumn } from './FooterNavigationColumn.dev';

export const GlobalFooterBlueCentered: React.FC<GlobalFooterProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { dictionary } = fields;
  const { footerNavLinks, footerCopyright, socialLinks, tagline, emailSubscriptionTitle } =
    getDatasource(fields as any) ?? {};

  const footerRef = useRef<HTMLDivElement>(null);

  if (fields) {
    return (
      <footer
        className="@container bg-primary text-primary-foreground border-primary-foreground relative w-full overflow-hidden border-b-2"
        ref={footerRef}
      >
        {/* Background logo - semi-transparent */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-90" aria-hidden="true">
          <div className="flex h-full w-full items-center justify-center leading-none">
            <div className="bg-primary-gradient text-fill-transparent text-50-clamp bg-clip-text font-bold leading-none text-transparent">
              Alaris
            </div>
          </div>
        </div>
        {/* Main footer content */}
        <div className="border-foreground relative border-b-2 px-4 py-16">
          <div className="@xl:px-8 relative z-10 mx-auto max-w-screen-2xl">
            <div className=" grid grid-cols-1 gap-8">
              {/* Left section with heading */}
              <div>
                <Text
                  tag="h2"
                  field={getFieldValue(tagline as any)}
                  className="font-heading mb-8 text-pretty text-center text-5xl font-light antialiased"
                />
                {/* Navigation links */}
                <FooterNavigationColumn
                  items={footerNavLinks?.results}
                  isPageEditing={isPageEditing}
                  parentRef={footerRef}
                  alignItems="center"
                  listClassName="flex items-center justify-center gap-0 @md:gap-8 @md:flex-row flex-col"
                />
              </div>

              {/* Right section with subscription form */}
              <div className="@md:max-w-[400px] mx-auto flex w-full flex-col items-center gap-4">
                <Text
                  className="font-body mb-4 w-full text-center text-xl font-medium"
                  field={getFieldValue(emailSubscriptionTitle as any)}
                />
                <div className="@sm:flex-row flex flex-col gap-2">
                  <EmailSignupForm
                    fields={{
                      buttonVariant: 'secondary',
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
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer with social icons and copyright */}
        <div className="relative mx-auto flex max-w-screen-2xl flex-col justify-center px-4 py-8 ">
          <div className="@sm:flex-row flex flex-col items-center justify-between">
            {/* Social media icons */}
            <AnimatedHoverNav
              parentRef={footerRef}
              mobileBreakpoint={null}
              indicatorClassName="h-0-5 bg-secondary rounded-default bottom-0"
            >
              <ul className="@sm:mb-0 mb-0 flex list-none gap-6">
                {socialLinks?.results?.map((socialLink: FooterSocialLink, index: number) => (
                  <li key={index}>
                    <EditableButton
                      buttonLink={getFieldValue(socialLink?.link as any)}
                      className={cn('relative hover:bg-transparent')}
                      variant="ghost"
                      size={isPageEditing ? 'default' : 'icon'}
                      isPageEditing={isPageEditing}
                      icon={getFieldValue(socialLink?.socialIcon as any)}
                      asIconLink={true}
                    />
                  </li>
                ))}
              </ul>
            </AnimatedHoverNav>
            {/* Copyright text */}
            <Text field={getFieldValue(footerCopyright as any)} encode={false} />
          </div>
        </div>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer - Blue Centered" />;
};


