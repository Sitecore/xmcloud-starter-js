import React, { JSX } from "react";
import { hasRichText, hasText } from "@/lib/field-utils";
import {
  Field,
  ImageField,
  LinkField,
  Link as ContentSdkLink,
  RichTextField,
  Text,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
} from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { SitecoreFrame, SITECORE_GRADIENT } from "@/lib/demo-ui/sitecore-ui";

interface LandingSocialProofRouteFields {
  testimonialQuote?: RichTextField;
  testimonialAuthorName?: Field<string>;
  testimonialAuthorTitle?: Field<string>;
  testimonialAuthorImage?: ImageField;
  partnerLogosImage?: ImageField;
  customerEvidenceName?: Field<string>;
  customerEvidenceSummary?: RichTextField;
  customerEvidenceLink?: LinkField;
}

const LandingSocialProofDefaultComponent = (): JSX.Element => (
  <div className="component landing-social-proof">
    <div className="component-content">
      <span className="is-empty-hint">LandingSocialProof</span>
    </div>
  </div>
);

function getRouteFields(
  page: ComponentProps["page"],
): LandingSocialProofRouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingSocialProofRouteFields) : null;
}

function usesCustomerEvidence(
  fields: LandingSocialProofRouteFields,
  isEditing?: boolean,
): boolean {
  const name = hasText(fields.customerEvidenceName?.value);
  const summary = hasRichText(fields.customerEvidenceSummary?.value);
  const source = hasText(fields.customerEvidenceLink?.value?.href);
  return isEditing ? name || summary || source : name && summary && source;
}

export const Default = (props: ComponentProps): JSX.Element => {
  const { params, page } = props;
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingSocialProofDefaultComponent />;
  if (usesCustomerEvidence(routeFields, isEditing))
    return <CustomerEvidence {...props} />;

  const {
    testimonialQuote,
    testimonialAuthorName,
    testimonialAuthorTitle,
    testimonialAuthorImage,
    partnerLogosImage,
  } = routeFields;

  const hasTestimonial =
    hasRichText(testimonialQuote?.value) ||
    hasText(testimonialAuthorName?.value) ||
    hasText(testimonialAuthorTitle?.value) ||
    isEditing;
  const hasLogos = partnerLogosImage?.value?.src || isEditing;

  if (!hasTestimonial && !hasLogos) {
    return (
      <div
        className={cn("component landing-social-proof", styles)}
        id={RenderingIdentifier}
      />
    );
  }

  return (
    <div
      className={cn("component landing-social-proof", styles)}
      id={RenderingIdentifier}
    >
      <section
        className="bg-gray-50 py-16 md:py-24"
        data-testid="landing-social-proof"
      >
        <div className="mx-auto max-w-4xl px-4">
          {hasTestimonial && (
            <figure className="text-center" data-testid="testimonial">
              {(hasRichText(testimonialQuote?.value) || isEditing) && (
                <blockquote
                  className="text-2xl font-medium leading-relaxed text-gray-900 md:text-3xl"
                  data-testid="testimonial-quote"
                >
                  <ContentSdkRichText field={testimonialQuote} />
                </blockquote>
              )}
              <figcaption className="mt-8 flex items-center justify-center gap-4">
                {(testimonialAuthorImage?.value?.src || isEditing) && (
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <ContentSdkImage
                      field={testimonialAuthorImage}
                      className="h-full w-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                )}
                {(hasText(testimonialAuthorName?.value) ||
                  isEditing ||
                  hasText(testimonialAuthorTitle?.value)) && (
                  <div className="text-left">
                    {(hasText(testimonialAuthorName?.value) || isEditing) && (
                      <Text
                        field={testimonialAuthorName}
                        tag="p"
                        className="font-semibold text-gray-900"
                        data-testid="testimonial-author-name"
                      />
                    )}
                    {(hasText(testimonialAuthorTitle?.value) || isEditing) && (
                      <Text
                        field={testimonialAuthorTitle}
                        tag="p"
                        className="text-sm text-gray-600"
                        data-testid="testimonial-author-title"
                      />
                    )}
                  </div>
                )}
              </figcaption>
            </figure>
          )}

          {hasLogos && (
            <div
              className="mt-16 flex justify-center"
              data-testid="partner-logos"
            >
              <ContentSdkImage
                field={partnerLogosImage}
                className="h-auto max-w-full opacity-70"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore — navy (#090342) testimonial panel with a soft red/violet glow,
   oversized gradient quote mark and light-weight quote type; the partner logo
   strip sits beneath in a white framed band, as on sitecore.com.
   ──────────────────────────────────────────── */
/** Decorative opening quote mark filled with the brand red→violet gradient. */
const GradientQuoteMark = (): JSX.Element => (
  <svg
    aria-hidden="true"
    viewBox="0 0 48 36"
    className="mx-auto h-9 w-12 md:h-11 md:w-[58px]"
    fill="none"
  >
    <defs>
      <linearGradient
        id="landing-quote-gradient"
        x1="0"
        y1="0"
        x2="48"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" style={{ stopColor: "var(--brand-primary)" }} />
        <stop
          offset="1"
          style={{ stopColor: "var(--brand-secondary, var(--brand-accent))" }}
        />
      </linearGradient>
    </defs>
    <path
      fill="url(#landing-quote-gradient)"
      d="M0 36V22.4C0 9.9 6.9 2.4 19.2 0l2.1 5.1C14.5 7.3 11 11.5 10.6 17.6H20V36H0Zm27.2 0V22.4C27.2 9.9 34.1 2.4 46.4 0l1.6 5.1c-6.8 2.2-10.3 6.4-10.7 12.5h9.3V36H27.2Z"
    />
  </svg>
);

export const Sitecore = (props: ComponentProps): JSX.Element => {
  const { params, page } = props;
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingSocialProofDefaultComponent />;
  if (usesCustomerEvidence(routeFields, isEditing))
    return <CustomerEvidence {...props} />;

  const {
    testimonialQuote,
    testimonialAuthorName,
    testimonialAuthorTitle,
    testimonialAuthorImage,
    partnerLogosImage,
  } = routeFields;

  const hasTestimonial =
    hasRichText(testimonialQuote?.value) ||
    hasText(testimonialAuthorName?.value) ||
    hasText(testimonialAuthorTitle?.value) ||
    isEditing;
  const hasLogos = partnerLogosImage?.value?.src || isEditing;
  const hasAuthor =
    hasText(testimonialAuthorName?.value) ||
    hasText(testimonialAuthorTitle?.value) ||
    isEditing;

  return (
    <div
      className={cn("component landing-social-proof", styles)}
      id={RenderingIdentifier}
      data-testid="landing-social-proof"
    >
      {hasTestimonial && (
        <SitecoreFrame
          dark
          topRule={false}
          className="relative overflow-hidden"
          style={{
            background: "var(--brand-dark, #090342)",
            color: "var(--brand-dark-foreground, #fff)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-48 h-[360px] w-[360px] rounded-full opacity-30 blur-[100px] md:-right-40 md:-top-40 md:h-[520px] md:w-[520px] md:opacity-40 md:blur-[120px]"
            style={{ background: SITECORE_GRADIENT }}
          />
          <figure
            className="relative mx-auto max-w-[980px] px-2 py-20 text-center md:px-10 md:py-28"
            data-testid="testimonial"
          >
            <GradientQuoteMark />
            {(hasRichText(testimonialQuote?.value) || isEditing) && (
              <blockquote
                className="mt-8 font-heading text-[26px] font-light leading-[1.35] tracking-[-0.02em] md:text-[34px] lg:text-[38px] [&_p]:m-0"
                data-testid="testimonial-quote"
              >
                <ContentSdkRichText field={testimonialQuote} />
              </blockquote>
            )}
            {hasAuthor && (
              <figcaption className="mt-12 flex items-center justify-center gap-4">
                {(testimonialAuthorImage?.value?.src || isEditing) && (
                  <div
                    className="rounded-full p-[2px]"
                    style={{ background: SITECORE_GRADIENT }}
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-white/10">
                      <ContentSdkImage
                        field={testimonialAuthorImage}
                        className="h-full w-full object-cover"
                        width={56}
                        height={56}
                      />
                    </div>
                  </div>
                )}
                <div className="text-left">
                  {(hasText(testimonialAuthorName?.value) || isEditing) && (
                    <Text
                      field={testimonialAuthorName}
                      tag="p"
                      className="m-0 font-body text-[17px] font-semibold"
                      data-testid="testimonial-author-name"
                    />
                  )}
                  {(hasText(testimonialAuthorTitle?.value) || isEditing) && (
                    <Text
                      field={testimonialAuthorTitle}
                      tag="p"
                      className="m-0 mt-0.5 font-body text-[15px] text-white/70"
                      data-testid="testimonial-author-title"
                    />
                  )}
                </div>
              </figcaption>
            )}
          </figure>
        </SitecoreFrame>
      )}

      {hasLogos && (
        <SitecoreFrame
          topRule={false}
          style={{ background: "var(--brand-bg)" }}
        >
          <div
            className="flex justify-center border-b border-[var(--brand-border)] px-6 py-10 md:px-10 md:py-12"
            data-testid="partner-logos"
          >
            <ContentSdkImage
              field={partnerLogosImage}
              className="h-auto max-h-24 w-auto max-w-full"
            />
          </div>
        </SitecoreFrame>
      )}
    </div>
  );
};

/** Text-first, source-linked evidence; legacy portrait/logo fields remain untouched. */
export const CustomerEvidence = ({
  params,
  page,
}: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const fields = getRouteFields(page);
  if (!fields) return <LandingSocialProofDefaultComponent />;
  if (!isEditing && !usesCustomerEvidence(fields)) {
    return (
      <div
        className={cn("component landing-social-proof", styles)}
        id={RenderingIdentifier}
      />
    );
  }
  const showQuote = hasRichText(fields.testimonialQuote?.value) || isEditing;
  return (
    <div
      className={cn("component landing-social-proof", styles)}
      id={RenderingIdentifier}
      data-testid="landing-social-proof"
    >
      <SitecoreFrame
        testId="customer-evidence"
        style={{ background: "var(--brand-bg)" }}
      >
        <div className="mx-auto max-w-4xl px-2 py-16 md:px-10 md:py-24">
          <Card className="relative overflow-hidden border-[var(--brand-border)] bg-[var(--brand-bg)] shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: SITECORE_GRADIENT }}
            />
            <CardContent className="space-y-6 p-8 md:p-10">
              <Text
                field={fields.customerEvidenceName}
                tag="h2"
                className="font-heading text-3xl font-medium text-[var(--brand-fg)]"
                data-testid="customer-evidence-name"
              />
              <div
                className="font-body text-lg text-[var(--brand-muted-foreground)] [&_p]:m-0"
                data-testid="customer-evidence-summary"
              >
                <ContentSdkRichText field={fields.customerEvidenceSummary} />
              </div>
              {showQuote && (
                <figure className="space-y-4 border-l-2 border-[var(--brand-accent)] pl-6">
                  <blockquote
                    className="font-body text-xl text-[var(--brand-fg)] [&_p]:m-0"
                    data-testid="customer-evidence-quote"
                  >
                    <ContentSdkRichText field={fields.testimonialQuote} />
                  </blockquote>
                  <figcaption className="text-sm text-[var(--brand-muted-foreground)]">
                    {(hasText(fields.testimonialAuthorName?.value) ||
                      isEditing) && (
                      <Text
                        field={fields.testimonialAuthorName}
                        tag="p"
                        className="font-semibold"
                        data-testid="customer-evidence-author-name"
                      />
                    )}
                    {(hasText(fields.testimonialAuthorTitle?.value) ||
                      isEditing) && (
                      <Text
                        field={fields.testimonialAuthorTitle}
                        tag="p"
                        data-testid="customer-evidence-author-title"
                      />
                    )}
                  </figcaption>
                </figure>
              )}
              <ContentSdkLink
                field={
                  fields.customerEvidenceLink ?? {
                    value: { href: "", text: "" },
                  }
                }
                className="inline-flex font-body font-semibold text-[var(--brand-accent)] underline underline-offset-4"
                data-testid="customer-evidence-link"
              />
            </CardContent>
          </Card>
        </div>
      </SitecoreFrame>
    </div>
  );
};
