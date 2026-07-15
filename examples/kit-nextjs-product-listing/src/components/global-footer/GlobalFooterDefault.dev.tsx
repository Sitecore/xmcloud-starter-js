'use client';

import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { FooterSocialLink, GlobalFooterProps } from '@/components/global-footer/global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { Default as FooterNavigationColumn } from './FooterNavigationColumn.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';

export const GlobalFooterDefault: React.FC<GlobalFooterProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { dictionary } = fields;
  const { footerNavLinks, footerCopyright, socialLinks, tagline, emailSubscriptionTitle } =
    getDatasource(fields as any) ?? {};

  const footerRef = useRef<HTMLDivElement>(null);

  if (fields) {
    return (
      <footer
        className="@container bg-primary text-primary-foreground border-foreground relative w-full overflow-hidden border-b-2"
        ref={footerRef}
      >
        {/* Main footer content */}
        <section className="border-foreground border-b-2 px-4 py-16" aria-label="Footer main content">
          <div className="@xl:px-8 relative z-10 mx-auto max-w-screen-2xl">
            <div className="@lg:grid-cols-[2fr,1fr] grid grid-cols-1 items-end justify-end gap-8">
              {/* Left section with heading */}
              <div>
                <Text
                  tag="h2"
                  field={getFieldValue(tagline as any)}
                  className="font-heading mb-8 text-pretty text-5xl font-light antialiased"
                />
                {/* Navigation links */}
                <nav aria-label="Footer navigation">
                  <FooterNavigationColumn
                    items={footerNavLinks?.results}
                    isPageEditing={isPageEditing}
                    parentRef={footerRef}
                  />
                </nav>
              </div>

              {/* Right section with subscription form */}
              <aside className="@md:max-w-[400px] ms-auto flex w-full flex-col gap-4" aria-label="Newsletter subscription">
                <Text
                  className="font-body mb-4 text-xl font-medium"
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
              </aside>
            </div>
          </div>
        </section>

        {/* Background logo - semi-transparent */}
        <div className="-z-1 pointer-events-none absolute inset-0 opacity-90" aria-hidden="true">
          <div className="flex h-full w-full items-end justify-center leading-none">
            <div className="bg-primary-gradient text-fill-transparent text-50-clamp -mb-14 bg-clip-text font-bold leading-none text-transparent">
              Alaris
            </div>
          </div>
        </div>

        {/* Bottom footer with social icons and copyright */}
        <section className="@md:min-h-[430px] relative z-0 mx-auto mt-8 flex max-w-screen-2xl flex-col justify-end px-4 py-8" aria-label="Footer bottom">
          <div className="@sm:flex-row flex flex-col items-center justify-between">
            {/* Social media icons */}
            <nav aria-label="Social media links">
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
            </nav>
            {/* Copyright text */}
            <Text field={getFieldValue(footerCopyright as any)} encode={false} />
          </div>
        </section>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer" />;
};


