import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "lib/component-props";
import { Sitecore as HeroSitecore } from "@/components/uiim/landing/LandingHero";
import {
  Default as FeaturesDefault,
  Sitecore as FeaturesSitecore,
} from "@/components/uiim/landing/LandingFeatures";
import {
  Default as StatsDefault,
  Sitecore as StatsSitecore,
} from "@/components/uiim/landing/LandingStats";
import {
  Default as SocialProofDefault,
  Sitecore as SocialProofSitecore,
  CustomerEvidence,
} from "@/components/uiim/landing/LandingSocialProof";
import {
  Default as FAQDefault,
  Sitecore as FAQSitecore,
} from "@/components/uiim/landing/LandingFAQ";
import {
  Default as FinalCTADefault,
  Sitecore as FinalCTASitecore,
} from "@/components/uiim/landing/LandingFinalCTA";

type MockField = { value?: unknown };
type LinkValue = { href?: string; text?: string };

jest.mock("@sitecore-content-sdk/nextjs", () => {
  const R = jest.requireActual("react");
  return {
    Text: ({ field, tag, ...rest }: { field?: MockField; tag?: string }) =>
      R.createElement(tag || "span", rest, (field?.value as string) || ""),
    RichText: ({ field, ...rest }: { field?: MockField }) =>
      R.createElement("div", {
        ...rest,
        dangerouslySetInnerHTML: { __html: field?.value || "" },
      }),
    NextImage: ({
      field,
      className,
    }: {
      field?: { value?: { src?: string; alt?: string } };
      className?: string;
    }) =>
      R.createElement("img", {
        src: field?.value?.src,
        alt: field?.value?.alt,
        className,
        "data-testid": "sdk-image",
      }),
    Link: ({
      field,
      children,
      ...rest
    }: {
      field?: { value?: LinkValue };
      children?: React.ReactNode;
      showLinkTextWithChildrenPresent?: boolean;
    }) => {
      delete rest.showLinkTextWithChildrenPresent;
      return R.createElement(
        "a",
        { href: field?.value?.href, ...rest },
        field?.value?.text,
        children,
      );
    },
  };
});

const f = (value: unknown) => ({ value });
const link = (href: string, text: string) => ({ value: { href, text } });

const routeFields = {
  heroEyebrow: f("AI and agents"),
  heroHeadline: f("AI and agents that understand your brand"),
  heroSubhead: f("Put 20+ pre-built agents to work."),
  heroPrimaryCta: link("/demo", "Request a demo"),
  heroSecondaryCta: link("/agents", "Agents in action"),
  heroImage: f({ src: "/hero.jpg", alt: "Hero", width: 1200, height: 800 }),
  feature1IconName: f("Bot"),
  feature1Title: f("Create content"),
  feature1Description: f("<p>Briefs, copy and images.</p>"),
  feature2Title: f("Get discovered"),
  feature2Description: f("<p>Search and AI visibility.</p>"),
  feature3Title: f("Make it personal"),
  feature3Description: f("<p>ABM at scale.</p>"),
  stat1Number: f("20+"),
  stat1Label: f("Pre-built agents"),
  stat2Number: f("3x"),
  stat2Label: f("Faster content"),
  stat3Number: f("0"),
  stat3Label: f("Token limits"),
  testimonialQuote: f("<p>SitecoreAI changed how we work.</p>"),
  testimonialAuthorName: f("Jane Smith"),
  testimonialAuthorTitle: f("CMO, Example"),
  testimonialAuthorImage: f({ src: "/jane.jpg", alt: "Jane" }),
  partnerLogosImage: f({ src: "/logos.png", alt: "Partners" }),
  faq1Question: f("What is SitecoreAI?"),
  faq1Answer: f("<p>A cloud-native DXP.</p>"),
  faq2Question: f("Do I pay extra for AI?"),
  faq2Answer: f("<p>No.</p>"),
  finalCtaHeadline: f("Put AI agents to work"),
  finalCtaSubhead: f("<p>See it in action.</p>"),
  finalCtaButton: link("/demo", "Request a demo"),
};

const without = (fields: Record<string, unknown>, ...keys: string[]) =>
  Object.fromEntries(Object.entries(fields).filter(([k]) => !keys.includes(k)));

const makeProps = (fields: Record<string, unknown> | null, isEditing = false) =>
  ({
    rendering: { componentName: "Landing" },
    params: { styles: "custom-style", RenderingIdentifier: "rid" },
    page: {
      mode: { isEditing },
      layout: { sitecore: { route: fields ? { fields } : null } },
    },
  }) as unknown as ComponentProps;

const variants = [
  ["LandingHero", HeroSitecore],
  ["LandingFeatures", FeaturesSitecore],
  ["LandingStats", StatsSitecore],
  ["LandingSocialProof", SocialProofSitecore],
  ["LandingFAQ", FAQSitecore],
  ["LandingFinalCTA", FinalCTASitecore],
] as const;

describe("Landing Sitecore variants", () => {
  it.each(variants)(
    "%s renders the empty-state hint without route fields",
    (name, Variant) => {
      render(<Variant {...makeProps(null)} />);
      expect(screen.getByText(name)).toBeInTheDocument();
    },
  );

  it.each(variants)(
    "%s keeps params.styles and RenderingIdentifier on the wrapper",
    (_n, Variant) => {
      const { container } = render(<Variant {...makeProps(routeFields)} />);
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("component", "custom-style");
      expect(wrapper).toHaveAttribute("id", "rid");
    },
  );

  describe("LandingHero", () => {
    it("renders eyebrow, headline, subhead, both CTAs and media", () => {
      render(<HeroSitecore {...makeProps(routeFields)} />);
      expect(screen.getByTestId("hero-eyebrow")).toHaveTextContent(
        "AI and agents",
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "AI and agents that understand your brand",
      );
      expect(screen.getByTestId("hero-subhead")).toBeInTheDocument();
      expect(screen.getByTestId("hero-primary-cta")).toHaveAttribute(
        "href",
        "/demo",
      );
      expect(screen.getByTestId("hero-secondary-cta")).toHaveAttribute(
        "href",
        "/agents",
      );
      expect(screen.getByTestId("hero-media")).toBeInTheDocument();
    });

    it("drops the media column and empty CTA when content is missing", () => {
      render(
        <HeroSitecore
          {...makeProps(without(routeFields, "heroImage", "heroSecondaryCta"))}
        />,
      );
      expect(screen.queryByTestId("hero-media")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("hero-secondary-cta"),
      ).not.toBeInTheDocument();
    });

    it("keeps empty fields editable in the editor", () => {
      render(<HeroSitecore {...makeProps({ heroHeadline: f("") }, true)} />);
      expect(screen.getByTestId("hero-eyebrow")).toBeInTheDocument();
      expect(screen.getByTestId("hero-subhead")).toBeInTheDocument();
      expect(screen.getByTestId("hero-media")).toBeInTheDocument();
    });
  });

  it("LandingFeatures renders one card per authored feature", () => {
    render(<FeaturesSitecore {...makeProps(routeFields)} />);
    expect(screen.getAllByTestId("feature-card")).toHaveLength(3);
    expect(screen.getByText("Create content")).toBeInTheDocument();
  });

  it("LandingStats renders gradient numbers with labels and hides empty tiles", () => {
    render(
      <StatsSitecore
        {...makeProps(without(routeFields, "stat3Number", "stat3Label"))}
      />,
    );
    expect(screen.getAllByTestId("stat-tile")).toHaveLength(2);
    expect(screen.getByText("20+")).toBeInTheDocument();
  });

  describe("CustomerEvidence", () => {
    const evidenceFields = {
      customerEvidenceName: f("Example customer"),
      customerEvidenceSummary: f("<p>A sourced customer-story summary.</p>"),
      customerEvidenceLink: link(
        "https://www.sitecore.com/customers/example",
        "Read customer story",
      ),
    };

    it("renders a text-first customer card and editable source link without images", () => {
      render(<CustomerEvidence {...makeProps(evidenceFields)} />);
      expect(screen.getByTestId("customer-evidence-name")).toHaveTextContent(
        "Example customer",
      );
      expect(screen.getByTestId("customer-evidence-summary")).toHaveTextContent(
        "A sourced customer-story summary.",
      );
      expect(screen.getByTestId("customer-evidence-link")).toHaveAttribute(
        "href",
        "https://www.sitecore.com/customers/example",
      );
      expect(screen.queryAllByTestId("sdk-image")).toHaveLength(0);
    });

    it.each([
      ["Default", SocialProofDefault],
      ["Sitecore", SocialProofSitecore],
    ] as const)(
      "%s switches to evidence only when the new fields are complete",
      (_name, Variant) => {
        const { rerender } = render(
          <Variant {...makeProps({ ...routeFields, ...evidenceFields })} />,
        );
        expect(screen.getByTestId("customer-evidence")).toBeInTheDocument();
        expect(screen.queryByTestId("partner-logos")).not.toBeInTheDocument();
        rerender(
          <Variant
            {...makeProps({
              ...routeFields,
              customerEvidenceName: f("Partial"),
            })}
          />,
        );
        expect(
          screen.queryByTestId("customer-evidence"),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("testimonial-author-name")).toHaveTextContent(
          "Jane Smith",
        );
      },
    );

    it("renders an optional sourced quote and author text without legacy media", () => {
      render(
        <CustomerEvidence
          {...makeProps({ ...routeFields, ...evidenceFields })}
        />,
      );
      expect(screen.getByTestId("customer-evidence-quote")).toHaveTextContent(
        "SitecoreAI changed how we work.",
      );
      expect(
        screen.getByTestId("customer-evidence-author-name"),
      ).toHaveTextContent("Jane Smith");
      expect(screen.queryAllByTestId("sdk-image")).toHaveLength(0);
    });

    it("keeps empty fields editable but collapses incomplete evidence outside editing", () => {
      const { container, rerender } = render(
        <CustomerEvidence
          {...makeProps({ customerEvidenceName: f("Partial") })}
        />,
      );
      expect(container.querySelector("section")).toBeNull();
      expect(container.firstElementChild).toHaveAttribute("id", "rid");
      rerender(<CustomerEvidence {...makeProps({}, true)} />);
      expect(screen.getByTestId("customer-evidence-name")).toBeInTheDocument();
      expect(
        screen.getByTestId("customer-evidence-summary"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("customer-evidence-link")).toBeInTheDocument();
    });
  });

  describe("LandingSocialProof", () => {
    it("renders quote-only social proof without a portrait or logo strip", () => {
      render(
        <SocialProofSitecore
          {...makeProps(
            without(routeFields, "testimonialAuthorImage", "partnerLogosImage"),
          )}
        />,
      );
      expect(
        screen.getByText("SitecoreAI changed how we work."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("testimonial-author-name")).toHaveTextContent(
        "Jane Smith",
      );
      expect(screen.getByTestId("testimonial-author-title")).toHaveTextContent(
        "CMO, Example",
      );
      expect(screen.queryByTestId("partner-logos")).not.toBeInTheDocument();
      expect(screen.queryAllByTestId("sdk-image")).toHaveLength(0);
    });

    it("renders the quote, author and logo strip", () => {
      render(<SocialProofSitecore {...makeProps(routeFields)} />);
      expect(
        screen.getByText("SitecoreAI changed how we work."),
      ).toBeInTheDocument();
      expect(screen.getByTestId("testimonial-author-name")).toHaveTextContent(
        "Jane Smith",
      );
      expect(screen.getByTestId("partner-logos")).toBeInTheDocument();
    });

    it("hides the logo strip when no logos image is set", () => {
      render(
        <SocialProofSitecore
          {...makeProps(without(routeFields, "partnerLogosImage"))}
        />,
      );
      expect(screen.queryByTestId("partner-logos")).not.toBeInTheDocument();
    });
  });

  describe("Empty optional sections", () => {
    const optionalVariants = [
      ["Features Default", FeaturesDefault],
      ["Features Sitecore", FeaturesSitecore],
      ["Stats Default", StatsDefault],
      ["Stats Sitecore", StatsSitecore],
      ["Social proof Default", SocialProofDefault],
      ["Social proof Sitecore", SocialProofSitecore],
      ["FAQ Default", FAQDefault],
      ["FAQ Sitecore", FAQSitecore],
      ["CTA Default", FinalCTADefault],
      ["CTA Sitecore", FinalCTASitecore],
    ] as const;

    it.each(optionalVariants)(
      "%s collapses content but keeps the rendering wrapper",
      (_name, Variant) => {
        const { container, rerender } = render(<Variant {...makeProps({})} />);
        expect(container.querySelector("section")).toBeNull();
        expect(container.firstElementChild).toHaveClass(
          "component",
          "custom-style",
        );
        expect(container.firstElementChild).toHaveAttribute("id", "rid");
        rerender(
          <Variant {...makeProps({ finalCtaButton: link("", "") }, true)} />,
        );
        expect(container.querySelector("section")).not.toBeNull();
      },
    );

    it("does not treat an icon-only feature as content", () => {
      render(
        <FeaturesSitecore {...makeProps({ feature1IconName: f("Bot") })} />,
      );
      expect(screen.queryByTestId("feature-card")).not.toBeInTheDocument();
    });

    it("adapts the stat grid to the number of populated slots", () => {
      render(
        <StatsSitecore
          {...makeProps({
            stat1Number: f("0"),
            stat1Label: f("A sourced metric"),
          })}
        />,
      );
      expect(screen.getAllByTestId("stat-tile")).toHaveLength(1);
      expect(screen.getByTestId("stat-tile").parentElement).toHaveClass(
        "md:grid-cols-1",
      );
    });
  });

  describe("LandingFAQ", () => {
    it("hides empty pairs and opens the first item by default", () => {
      render(<FAQSitecore {...makeProps(routeFields)} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
      expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    });

    it("opens the first populated pair even when earlier slots are empty", () => {
      render(
        <FAQSitecore
          {...makeProps({
            faq3Question: f("A relevant question?"),
            faq3Answer: f("<p>A sourced answer.</p>"),
          })}
        />,
      );
      expect(screen.getAllByRole("button")).toHaveLength(1);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("omits incomplete question/answer pairs outside the editor", () => {
      render(
        <FAQSitecore
          {...makeProps({
            faq1Question: f("No answer yet?"),
            faq2Answer: f("<p>No question yet.</p>"),
          })}
        />,
      );
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    it("toggles items on click", () => {
      render(<FAQSitecore {...makeProps(routeFields)} />);
      const [first, second] = screen.getAllByRole("button");
      fireEvent.click(second);
      expect(first).toHaveAttribute("aria-expanded", "false");
      expect(second).toHaveAttribute("aria-expanded", "true");
      fireEvent.click(second);
      expect(second).toHaveAttribute("aria-expanded", "false");
    });

    it("shows all five items expanded in the editor", () => {
      render(<FAQSitecore {...makeProps({}, true)} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(5);
      buttons.forEach((b) =>
        expect(b).toHaveAttribute("aria-expanded", "true"),
      );
    });
  });

  it("LandingFinalCTA renders headline, subhead and button", () => {
    render(<FinalCTASitecore {...makeProps(routeFields)} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Put AI agents to work",
    );
    expect(screen.getByTestId("final-cta-subhead")).toBeInTheDocument();
    expect(screen.getByTestId("final-cta-button")).toHaveAttribute(
      "href",
      "/demo",
    );
  });
});
