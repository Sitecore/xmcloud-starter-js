import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { GlobalFooterProps } from '@/components/global-footer/global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { Default as FooterNavigationColumn } from './FooterNavigationColumn.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { AnimatedHoverNav } from '@/components/ui/animated-hover-nav';

export const GlobalFooterBlueCompact: React.FC<GlobalFooterProps> = (props) => {
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
        {/* Background logo - semi-transparent */}
        <div
          className=" @md:inset-unset @md:-right-[100px] @md:bottom-0 pointer-events-none absolute inset-0 z-0 opacity-90"
          data-component="footer-logo"
          aria-hidden="true"
        >
          <div className="@md:justify-end flex h-full w-full items-end justify-center leading-none">
            <div className="bg-primary-gradient text-fill-transparent text-50-clamp @md:-mb-[80px] -mb-[40px] bg-clip-text text-center font-bold leading-none text-transparent">
              Alaris
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="border-primary-foreground px-4 py-16">
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
                <div className="mt-10 max-w-[400px]">
                  <Text
                    className="font-body mb-4 text-xl font-medium"
                    field={emailSubscriptionTitle?.jsonValue}
                    tag="p"
                  />
                  <div className="@sm:flex-row flex flex-col gap-2 ">
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

              {/* Right section with subscription form */}
              <div className="@md:max-w-[400px] @md:items-end ms-auto flex w-full flex-col items-center gap-4">
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
          </div>
        </div>

        {/* Bottom footer with social icons and copyright */}
        <div className="relative z-0 mx-auto block border-t-2   px-4 py-8"></div>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer" />;
};
