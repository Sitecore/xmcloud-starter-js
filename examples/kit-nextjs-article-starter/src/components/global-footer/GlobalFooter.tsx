import type React from 'react';
import { Placeholder, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { GlobalFooterProps } from '@/components/global-footer/global-footer.props';
import { Default as FooterCallout } from '@/components/footer-navigation-callout/FooterNavigationCallout.dev';
import { Default as Logo } from '@/components/logo/Logo.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableImageButton } from 'components/button-component/ButtonComponent';
import { cn } from 'lib/utils';

export const Default: React.FC<GlobalFooterProps> = (props) => {
  const { fields, rendering } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const {
    footerCopyright,
    footerLogo,
    footerPromoDescription,
    footerPromoLink,
    footerPromoTitle,
    footerSocialLinks,
  } = fields?.data?.datasource ?? {};

  if (fields) {
    return (
      <footer className="@container bg-primary text-white">
        <div className="@md:grid-cols-2 @lg:grid-cols-12 @lg:gap-8 @xl:px-8 mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-8 px-4  py-12">
          {/* Logo section */}
          <div className="@lg:col-span-2">
            <div className="max-w-[121px]">
              <Logo logo={footerLogo?.jsonValue} />
            </div>
          </div>
          {/* Main footer columns */}
          <div className="@md:grid-cols-3 @md:col-span-2 @lg:col-span-6 grid grid-cols-1 gap-8">
            <Placeholder name="container-footer-column" rendering={rendering} />
          </div>
          {/* Callout section */}
          <div className="@md:col-span-2 @lg:col-span-4">
            <FooterCallout
              fields={{
                title: footerPromoTitle?.jsonValue,
                description: footerPromoDescription?.jsonValue,
                linkOptional: footerPromoLink?.jsonValue,
              }}
            />
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="global-footer__bottom @md:flex-row @xl:px-8 mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-6">
            {/* Social links */}
            <div className="flex space-x-4">
              {footerSocialLinks?.results?.map((socialLink, index) => (
                <EditableImageButton
                  key={socialLink?.link?.jsonValue?.value.href || index}
                  buttonLink={socialLink?.link?.jsonValue}
                  className={cn('relative hover:bg-transparent')}
                  variant="ghost"
                  size={isPageEditing ? 'default' : 'icon'}
                  isPageEditing={isPageEditing}
                  icon={socialLink?.socialIcon?.jsonValue}
                  asIconLink={true}
                />
              ))}
            </div>
            {/* Copyright text */}
            <Text
              className="text-sm text-white/80"
              field={footerCopyright?.jsonValue}
              encode={false}
            />
          </div>
        </div>
      </footer>
    );
  }
  return <NoDataFallback componentName="Global Footer" />;
};
