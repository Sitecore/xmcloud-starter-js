import React, { JSX } from "react";
import { hasRichText, hasText } from "@/lib/field-utils";
import {
  Field,
  LinkField,
  RichTextField,
  Text,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
} from "@sitecore-content-sdk/nextjs";
import { ComponentProps } from "lib/component-props";
import { cn } from "@/lib/utils";
import { SitecoreFrame, SitecorePill } from "@/lib/demo-ui/sitecore-ui";

interface LandingFinalCTARouteFields {
  finalCtaHeadline?: Field<string>;
  finalCtaSubhead?: RichTextField;
  finalCtaButton?: LinkField;
}

const LandingFinalCTADefaultComponent = (): JSX.Element => (
  <div className="component landing-final-cta">
    <div className="component-content">
      <span className="is-empty-hint">LandingFinalCTA</span>
    </div>
  </div>
);

function getRouteFields(
  page: ComponentProps["page"],
): LandingFinalCTARouteFields | null {
  const fields = page?.layout?.sitecore?.route?.fields;
  return fields ? (fields as unknown as LandingFinalCTARouteFields) : null;
}

export const Default = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFinalCTADefaultComponent />;

  const { finalCtaHeadline, finalCtaSubhead, finalCtaButton } = routeFields;
  if (
    !isEditing &&
    !hasText(finalCtaHeadline?.value) &&
    !hasRichText(finalCtaSubhead?.value) &&
    !finalCtaButton?.value?.href
  ) {
    return (
      <div
        className={cn("component landing-final-cta", styles)}
        id={RenderingIdentifier}
      />
    );
  }

  return (
    <div
      className={cn("component landing-final-cta", styles)}
      id={RenderingIdentifier}
    >
      <section
        className="bg-gray-900 py-16 md:py-24"
        data-testid="landing-final-cta"
      >
        {(hasText(finalCtaHeadline?.value) ||
          isEditing ||
          hasRichText(finalCtaSubhead?.value) ||
          ((finalCtaButton?.value?.href || isEditing) && finalCtaButton)) && (
          <div className="mx-auto max-w-3xl px-4 text-center">
            {(hasText(finalCtaHeadline?.value) || isEditing) && (
              <Text
                field={finalCtaHeadline}
                tag="h2"
                className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                data-testid="final-cta-headline"
              />
            )}
            {(hasRichText(finalCtaSubhead?.value) || isEditing) && (
              <div
                className="mx-auto mt-6 max-w-xl text-lg text-white/80"
                data-testid="final-cta-subhead"
              >
                <ContentSdkRichText field={finalCtaSubhead} />
              </div>
            )}
            {(finalCtaButton?.value?.href || isEditing) && finalCtaButton && (
              <div className="mt-8">
                <ContentSdkLink
                  field={finalCtaButton}
                  className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-base font-semibold text-gray-900 transition hover:bg-gray-100"
                  data-testid="final-cta-button"
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Sitecore — closing band as on sitecore.com: centred light-weight headline,
   supporting copy and a red→violet gradient pill on the soft hero wash.
   ──────────────────────────────────────────── */
export const Sitecore = ({ params, page }: ComponentProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const routeFields = getRouteFields(page);
  if (!routeFields) return <LandingFinalCTADefaultComponent />;

  const { finalCtaHeadline, finalCtaSubhead, finalCtaButton } = routeFields;
  const showHeadline = hasText(finalCtaHeadline?.value) || isEditing;
  const showSubhead = hasRichText(finalCtaSubhead?.value) || isEditing;
  const showButton =
    !!finalCtaButton && (finalCtaButton.value?.href || isEditing);
  if (!showHeadline && !showSubhead && !showButton) {
    return (
      <div
        className={cn("component landing-final-cta", styles)}
        id={RenderingIdentifier}
      />
    );
  }

  return (
    <div
      className={cn("component landing-final-cta", styles)}
      id={RenderingIdentifier}
    >
      <SitecoreFrame
        testId="landing-final-cta"
        className="relative overflow-hidden"
        style={{
          background: "var(--brand-hero-wash, var(--brand-bg))",
          color: "var(--brand-fg)",
        }}
      >
        <div className="relative mx-auto max-w-[880px] px-2 py-20 text-center md:px-10 md:py-28">
          {showHeadline && (
            <Text
              field={finalCtaHeadline}
              tag="h2"
              className="font-heading text-[34px] font-normal leading-[1.15] tracking-[-0.025em] text-balance md:text-[42px] lg:text-[46px]"
              data-testid="final-cta-headline"
            />
          )}
          {showSubhead && (
            <div
              className="mx-auto mt-6 max-w-[820px] font-body text-[18px] leading-[1.7] [&_p]:m-0"
              data-testid="final-cta-subhead"
            >
              <ContentSdkRichText field={finalCtaSubhead} />
            </div>
          )}
          {showButton && (
            <div className="mt-9 flex justify-center">
              <SitecorePill
                field={finalCtaButton}
                isEditing={isEditing}
                tone="gradient"
                className="text-[18px]"
                testId="final-cta-button"
              />
            </div>
          )}
        </div>
      </SitecoreFrame>
    </div>
  );
};
