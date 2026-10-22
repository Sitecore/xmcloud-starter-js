import { Text, Link } from '@sitecore-content-sdk/nextjs';
import { CtaBannerProps } from './cta-banner.props';
import { Button } from '@/components/ui/button';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

/**
 * Closing call-to-action band: brand gradient, centred light headline,
 * optional supporting line and a white button.
 */
export const Default: React.FC<CtaBannerProps> = (props) => {
  const { page, fields } = props;
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return <NoDataFallback componentName="CTA Banner" />;
  }

  const { titleRequired, descriptionOptional, linkOptional } = fields;
  const hasLink = isPageEditing || Boolean(linkOptional?.value?.href);

  return (
    <section
      data-component="CtaBanner"
      className="bg-brand-cta flex min-h-[278px] w-full items-center justify-center px-6 py-16 text-center text-white"
    >
      <AnimatedSection direction="up" isPageEditing={isPageEditing} className="mx-auto max-w-4xl">
        <Text
          tag="h2"
          className="mb-4 text-balance text-3xl font-light leading-tight text-white md:text-[2.6875rem]"
          field={titleRequired}
        />
        {(descriptionOptional?.value || isPageEditing) && (
          <Text tag="p" className="mx-auto mb-8 max-w-xl text-lg font-light text-white/85" field={descriptionOptional} />
        )}
        {hasLink && linkOptional && (
          <Button variant="secondary" className="rounded-none px-4 py-3 text-base" asChild>
            <Link field={linkOptional} editable={isPageEditing} />
          </Button>
        )}
      </AnimatedSection>
    </section>
  );
};
