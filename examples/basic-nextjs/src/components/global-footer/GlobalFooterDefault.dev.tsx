'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import { FooterSocialLink, GlobalFooterProps } from '@/components/global-footer/global-footer.props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { Default as EmailSignupForm } from '@/components/forms/email/EmailSignupForm.dev';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';

/** Shown when no logo is configured; mirrors the header fallback. */
const FALLBACK_WORDMARK = 'williams lea';
const LINKS_PER_COLUMN = 3;

/**
 * Black corporate footer: wordmark and tagline, link columns, newsletter sign-up,
 * then a bottom bar with social icons and the copyright line.
 */
export const GlobalFooterDefault: React.FC<GlobalFooterProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { dictionary } = fields ?? {};
  const { footerNavLinks, footerCopyright, socialLinks, tagline, emailSubscriptionTitle } =
    getDatasource(fields as any) ?? {};

  if (!fields) {
    return <NoDataFallback componentName="Global Footer" />;
  }

  const links = footerNavLinks?.results ?? [];
  const columns = Array.from({ length: Math.ceil(links.length / LINKS_PER_COLUMN) }, (_, i) =>
    links.slice(i * LINKS_PER_COLUMN, (i + 1) * LINKS_PER_COLUMN)
  );

  return (
    <footer data-component="GlobalFooter" className="w-full bg-black text-white [--font-body:var(--font-wl-footer)]">
      <div className="mx-auto max-w-screen-2xl px-4 pb-8 pt-[71px] lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_2fr_1.3fr]">
          <div>
            <p className="mb-6 flex items-center gap-2 text-[22px] leading-none">
              <span className="inline-block size-3 rounded-full border-[3px] border-current" aria-hidden="true" />
              {FALLBACK_WORDMARK}
            </p>
            <Text
              tag="p"
              field={getFieldValue(tagline as any)}
              className="max-w-xs text-pretty text-2xl font-light leading-snug"
            />
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-3.5">
                {column.map((item: any, index: number) => {
                  const link = getFieldValue(item?.link as any);
                  if (!link) return null;
                  return (
                    <li key={`${link?.value?.text}-${index}`}>
                      <CompatibleLink
                        field={link}
                        editable={isPageEditing}
                        prefetch={false}
                        className="text-base font-light text-white hover:underline"
                      />
                    </li>
                  );
                })}
              </ul>
            ))}
          </nav>

          <aside aria-label="Newsletter subscription" className="flex flex-col gap-4">
            <Text tag="p" className="text-lg font-light" field={getFieldValue(emailSubscriptionTitle as any)} />
            <EmailSignupForm
              fields={{
                buttonVariant: 'secondary',
                emailPlaceholder: { value: dictionary?.FOOTER_EmailPlaceholder },
                emailSubmitLabel: { value: dictionary?.FOOTER_EmailSubmitLabel },
                emailErrorMessage: { value: dictionary?.FOOTER_EmailErrorMessage },
                emailSuccessMessage: { value: dictionary?.FOOTER_EmailSuccessMessage },
              }}
            />
          </aside>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-6 text-[13px] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <Text tag="p" field={getFieldValue(footerCopyright as any)} encode={false} />
          {socialLinks?.results?.length ? (
            <ul className="flex list-none gap-4">
              {socialLinks.results.map((socialLink: FooterSocialLink, index: number) => (
                <li key={index}>
                  <EditableButton
                    buttonLink={getFieldValue(socialLink?.link as any)}
                    className="relative text-white hover:bg-transparent"
                    variant="ghost"
                    size={isPageEditing ? 'default' : 'icon'}
                    isPageEditing={isPageEditing}
                    icon={getFieldValue(socialLink?.socialIcon as any)}
                    asIconLink={true}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
};
