import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { GlobalFooterProps } from '@/components/global-footer/global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { Default as FooterNavigationColumn } from './FooterNavigationColumn.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';

export const GlobalFooterDefault: React.FC<GlobalFooterProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { dictionary } = fields;
  const { footerNavLinks, footerCopyright, socialLinks, tagline, emailSubscriptionTitle } =
    fields.data.datasource ?? {};

  const footerRef = useRef<HTMLDivElement>(null);

  if (fields) {
    return (
      <footer
        className="@container bg-primary text-primary-foreground border-foreground relative w-full overflow-hidden border-b-2"
        ref={footerRef}
      >
        {/* Main footer content */}
        <div className="border-foreground border-b-2 px-4 py-16">
          <div className="@xl:px-8 relative z-10 mx-auto max-w-screen-2xl">
            <div className="@lg:grid-cols-[2fr,1fr] grid grid-cols-1 items-end justify-end gap-8">
              {/* Left section with heading */}
              <div>
                <Text
                  tag="h2"
                  field={tagline?.jsonValue}
                  className="font-heading mb-8 text-pretty text-5xl font-light antialiased"
                />
                {/* Navigation links */}
                <FooterNavigationColumn
                  items={footerNavLinks?.results}
                  isPageEditing={isPageEditing}
                  parentRef={footerRef}
                />
              </div>

              {/* Right section with subscription form */}
              <div className="@md:max-w-[400px] ms-auto flex w-full flex-col gap-4">
                <Text
                  className="font-body mb-4 text-xl font-medium"
                  field={emailSubscriptionTitle?.jsonValue}
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

        {/* Background logo - semi-transparent */}
        <div className="-z-1 pointer-events-none absolute inset-0 opacity-90" aria-hidden="true">
          <div className="flex h-full w-full items-end justify-center leading-none">
            <div className="bg-primary-gradient text-fill-transparent text-50-clamp -mb-14 bg-clip-text font-bold leading-none text-transparent">
              Alaris
            </div>
          </div>
        </div>

        {/* Bottom footer with social icons and copyright */}
        <div className="@md:min-h-[430px] relative z-0 mx-auto mt-8 flex max-w-screen-2xl flex-col justify-end px-4 py-8">
          <div className="@sm:flex-row flex flex-col items-center justify-between">
            {/* Social media icons */}
            <AnimatedHoverNav
              parentRef={footerRef}
              mobileBreakpoint={null}
              indicatorClassName="h-0-5 bg-secondary rounded-default bottom-0"
            >
              <ul className="@sm:mb-0 mb-0 flex list-none gap-6">
                {socialLinks?.results?.map((socialLink, index) => (
                  <li key={index}>
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
            {/* Copyright text */}
            <Text field={footerCopyright?.jsonValue} encode={false} />
          </div>
        </div>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer" />;
};
