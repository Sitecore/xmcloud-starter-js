import type { ReactNode } from 'react';
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Link as ContentSdkLink,
  LinkField,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import type { FooterSTProps, SocialLinksProps } from './footer-st.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';

/** Returns true if the link field has a valid href (not a placeholder like # or http://#). */
function hasValidLink(field: LinkField | undefined): boolean {
  const href = field?.value?.href;
  return !!(href && href !== '#' && !href.startsWith('http://#'));
}

const SocialLinks = ({ fields }: SocialLinksProps) => (
  <div className="flex justify-center gap-4">
    {hasValidLink(getFieldValue(fields?.FacebookLink)) ? (
      <ContentSdkLink
        field={getFieldValue(fields?.FacebookLink)!}
        prefetch={false}
        aria-label="Facebook"
      >
        <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
      </span>
    )}
    {hasValidLink(getFieldValue(fields?.InstagramLink)) ? (
      <ContentSdkLink
        field={getFieldValue(fields?.InstagramLink)!}
        prefetch={false}
        aria-label="Instagram"
      >
        <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
      </span>
    )}
    {hasValidLink(getFieldValue(fields?.LinkedinLink)) ? (
      <ContentSdkLink
        field={getFieldValue(fields?.LinkedinLink)!}
        prefetch={false}
        aria-label="LinkedIn"
      >
        <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
      </ContentSdkLink>
    ) : (
      <span role="img" aria-label="LinkedIn">
        <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
      </span>
    )}
  </div>
);

export const Default = (props: FooterSTProps) => {
  const fields = getDatasource(props.fields);

  return (
    <section
      className={`relative bg-primary pt-16 lg:pt-30 pb-8 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl lg:text-7xl mb-10 lg:mb-20 uppercase">
          <ContentSdkText field={getFieldValue(fields?.Title)} />
        </h2>
        <div className="max-w-5xl mx-auto mb-6 lg:mb-12 font-(family-name:--font-heading) text-2xl uppercase">
          <AppPlaceholder
            name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        </div>
        <div className="max-w-5xl mx-auto font-(family-name:--font-accent) font-medium">
          <AppPlaceholder
            name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
            page={props.page}
            componentMap={componentMap}
          />
        </div>
      </div>
      <div className="h-20 lg:h-40 bg-sound-waves bg-contain bg-repeat bg-center my-12 lg:my-16"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between">
          <SocialLinks fields={fields} />
          <div>
            <ContentSdkRichText field={getFieldValue(fields?.CopyrightText)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const LogoLeft = (props: FooterSTProps) => {
  const fields = getDatasource(props.fields);

  return (
    <section
      className={`relative bg-primary pt-16 lg:pt-30 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2">
          <h2 className="text-4xl lg:text-7xl mb-10 lg:mb-0 uppercase">
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h2>
          <div className="lg:flex justify-end items-start gap-12">
            <div className="mb-6 lg:mb-0 font-(family-name:--font-heading) uppercase text-2xl">
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-8">
          <SocialLinks fields={fields} />
          <div>
            <ContentSdkRichText field={getFieldValue(fields?.CopyrightText)} />
          </div>
        </div>
      </div>
      <div className="h-10 lg:h-20 bg-sound-waves bg-[length:auto_200%] bg-repeat bg-top bg-center-x mt-12 lg:mt-16"></div>
    </section>
  );
};

export const LogoRight = (props: FooterSTProps) => {
  const fields = getDatasource(props.fields);

  return (
    <section
      className={`relative bg-primary pb-8 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="h-10 lg:h-20 bg-sound-waves bg-[length:auto_200%] bg-repeat bg-bottom bg-center-x mb-12 lg:mb-16"></div>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2">
          <h2 className="lg:order-2 text-4xl lg:text-7xl mb-10 lg:mb-0 lg:text-right uppercase">
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h2>
          <div className="lg:flex items-start gap-12">
            <div className="mb-6 lg:mb-0 font-(family-name:--font-heading) uppercase text-2xl">
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-8">
          <SocialLinks fields={fields} />
          <div>
            <ContentSdkRichText field={getFieldValue(fields?.CopyrightText)} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: FooterSTProps) => {
  const fields = getDatasource(props.fields);

  return (
    <section
      className={`relative bg-primary py-8 lg:py-20 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-20 lg:h-40 bg-sound-waves bg-contain bg-repeat bg-center filter invert opacity-75 z-10"></div>
      <div className="relative container mx-auto px-4 z-20">
        <div className="grid lg:grid-cols-3 lg:gap-4">
          <h2 className="text-4xl lg:text-5xl mb-10 lg:mb-0 uppercase">
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h2>
          <div>
            <div className="mb-6 lg:mb-12 font-(family-name:--font-heading) uppercase text-2xl">
              <AppPlaceholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <AppPlaceholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center lg:items-end lg:self-end mt-8">
            <SocialLinks fields={fields} />
            <div>
              <ContentSdkRichText field={getFieldValue(fields?.CopyrightText)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BCAA_SOCIAL = [
  { href: 'https://www.facebook.com/BCAA', label: 'Facebook', icon: faFacebook },
  { href: 'https://x.com/BCAA', label: 'X', icon: faXTwitter },
  { href: 'https://www.youtube.com/user/BCAA', label: 'YouTube', icon: faYoutube },
  { href: 'https://www.instagram.com/bcaa/', label: 'Instagram', icon: faInstagram },
] as const;

export const Version2 = (props: FooterSTProps) => {
  const fields = getDatasource(props.fields);
  const placeholderId = props.params?.DynamicPlaceholderId;
  const facebookField = getFieldValue(fields?.FacebookLink);
  const instagramField = getFieldValue(fields?.InstagramLink);

  const socialItems = [
    {
      href: hasValidLink(facebookField) ? facebookField!.value.href : BCAA_SOCIAL[0].href,
      label: 'Facebook',
      icon: faFacebook,
    },
    BCAA_SOCIAL[1],
    BCAA_SOCIAL[2],
    {
      href: hasValidLink(instagramField) ? instagramField!.value.href : BCAA_SOCIAL[3].href,
      label: 'Instagram',
      icon: faInstagram,
    },
  ];

  return (
    <section
      className={`bg-primary text-primary-foreground ${props.params?.styles || ''}`}
      data-class-change
      data-testid="footerst-version2"
    >
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5 [&_a]:text-primary-foreground [&_h2]:text-primary-foreground [&_h3]:text-primary-foreground"
            data-testid="footerst-version2-columns"
          >
            <AppPlaceholder
              name={`footer-primary-links-${placeholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
            />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-3">
            <div>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
                <ContentSdkText field={getFieldValue(fields?.Title)} />
              </h2>
              <AppPlaceholder
                name={`footer-secondary-links-${placeholderId}`}
                rendering={props.rendering}
                page={props.page}
                componentMap={componentMap}
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide">Follow BCAA</p>
              <div className="flex items-center gap-4" data-testid="footerst-version2-social">
                {socialItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="text-primary-foreground hover:opacity-80"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={item.icon} width={18} height={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-10 border-primary-foreground/25" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div
            className="inline-flex shrink-0 items-center border border-primary-foreground px-3 py-1 text-sm font-bold tracking-[0.35em]"
            aria-label="BCAA"
          >
            BCAA
          </div>
          <div className="max-w-3xl text-xs leading-relaxed text-primary-foreground/80 [&_a]:underline [&_p]:mb-3">
            <ContentSdkRichText field={getFieldValue(fields?.CopyrightText)} />
          </div>
        </div>
      </div>
    </section>
  );
};

const MELALEUCA_FOOTER_LINKS = [
  { label: 'Product Store', href: 'https://www.melaleuca.com/productstore' },
  { label: 'Our Story', href: 'https://www.melaleuca.com/our-story' },
  { label: 'Ingredients Philosophy', href: 'https://www.melaleuca.com/ingredients' },
  { label: 'Privacy Policy', href: 'https://www.melaleuca.com/privacy-policy' },
  { label: 'Income Statistics', href: 'https://www.melaleuca.com/income-statistics' },
  { label: 'Terms of Use', href: 'https://www.melaleuca.com/terms-of-use' },
  { label: 'Careers', href: 'https://www.melaleuca.com/careers' },
] as const;

const MELALEUCA_SOCIAL = [
  { href: 'https://www.facebook.com/Melaleuca', label: 'Facebook', icon: faFacebook },
  { href: 'https://www.instagram.com/melaleuca/', label: 'Instagram', icon: faInstagram },
  { href: 'https://x.com/Melaleuca', label: 'X', icon: faXTwitter },
] as const;

const ashaFooterLinkClass = 'text-sm text-primary hover:underline';

const AshaFooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h2 className="border-b border-foreground/30 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
      {title}
    </h2>
    <div className="mt-3">{children}</div>
  </div>
);

export const Asha = (_props: FooterSTProps) => (
  <footer className="w-full" data-class-change data-testid="footerst-asha">
    <div className="bg-muted text-foreground">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-10 md:grid-cols-3">
        <AshaFooterColumn title="About ASHA">
          <p className="text-sm leading-relaxed">
            The American Speech-Language-Hearing Association (ASHA) is the national professional,
            scientific, and credentialing association for 247,000 members, certificate holders, and
            affiliates who are audiologists; speech-language pathologists; speech, language, and
            hearing scientists; audiology and speech-language pathology assistants; and students.
          </p>
          <a href="https://www.asha.org/about/" className={`${ashaFooterLinkClass} mt-3 inline-block uppercase`}>
            Read more
          </a>
          <ul className="mt-4 space-y-1">
            <li>
              <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                All ASHA Websites
              </a>
            </li>
            <li>
              <a href="https://www.asha.org/careers/asha-jobs/" className={ashaFooterLinkClass}>
                Work at ASHA
              </a>
            </li>
            <li>
              <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                Marketing Solutions
              </a>
            </li>
          </ul>
        </AshaFooterColumn>

        <div className="space-y-8">
          <AshaFooterColumn title="Information For">
            <ul className="space-y-1">
              {[
                'Audiologists',
                'Speech-Language Pathologists',
                'Academic & Faculty',
                'Audiology & SLP Assistants',
                'Students',
                'Public',
              ].map((label) => (
                <li key={label}>
                  <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </AshaFooterColumn>
          <AshaFooterColumn title="Get Involved">
            <ul className="space-y-1">
              {['ASHA Community', 'Become a Mentor', 'Become a Volunteer'].map((label) => (
                <li key={label}>
                  <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </AshaFooterColumn>
        </div>

        <div className="space-y-8">
          <AshaFooterColumn title="Connect With ASHA">
            <p className="text-sm font-semibold">American Speech-Language-Hearing Association</p>
            <p className="mt-1 text-sm">2200 Research Blvd., Rockville, MD 20850</p>
            <p className="mt-2 text-sm">Members: 800-498-2071</p>
            <p className="text-sm">Non-Member: 800-638-8255</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em]">More ways to connect</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                  E-mail the Action Center
                </a>
              </li>
              <li>
                <a href="https://www.asha.org/" className={ashaFooterLinkClass}>
                  Provide Feedback to the Board of Directors
                </a>
              </li>
            </ul>
          </AshaFooterColumn>
          <AshaFooterColumn title="Media Resources">
            <ul className="space-y-1">
              <li>
                <a href="https://www.asha.org/about/press-room/" className={ashaFooterLinkClass}>
                  Press Room
                </a>
              </li>
              <li>
                <a href="https://www.asha.org/about/press-room/" className={ashaFooterLinkClass}>
                  Press Queries
                </a>
              </li>
            </ul>
          </AshaFooterColumn>
        </div>
      </div>
    </div>

    <div className="bg-dark text-dark-foreground">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-xs">
          <p className="uppercase tracking-wide">
            <a href="https://www.asha.org/" className="hover:underline">
              Site Help
            </a>
            <span className="px-2">|</span>
            <a href="https://www.asha.org/" className="hover:underline">
              A–Z Topic Index
            </a>
            <span className="px-2">|</span>
            <a href="https://www.asha.org/" className="hover:underline">
              Privacy Statement
            </a>
            <span className="px-2">|</span>
            <a href="https://www.asha.org/" className="hover:underline">
              Terms of Use
            </a>
          </p>
          <p className="mt-2 normal-case">© 1997-2026 American Speech-Language-Hearing Association</p>
        </div>
        <img
          src="/asha-logo.png"
          alt="ASHA"
          className="h-12 w-auto brightness-0 invert"
        />
      </div>
    </div>
  </footer>
);

export const Version3 = (props: FooterSTProps) => (
  <section
    className={`relative overflow-hidden bg-[#10261c] text-white ${props.params?.styles || ''}`}
    style={{
      backgroundImage:
        'radial-gradient(900px 420px at 12% 0%, rgba(86, 122, 78, 0.28), transparent 60%), radial-gradient(1100px 640px at 88% 100%, rgba(22, 58, 36, 0.72), transparent 58%), linear-gradient(180deg, rgba(10, 24, 16, 0.72), rgba(8, 18, 12, 0.88))',
    }}
    data-class-change
    data-testid="footerst-version3"
  >
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8 lg:py-16">
      <div className="mb-10 flex justify-center lg:mb-12" aria-label="Melaleuca">
        <div className="text-center">
          <svg viewBox="0 0 48 48" className="mx-auto mb-2 h-10 w-10" aria-hidden="true">
            <path
              d="M24 4c2 8 2 12 0 18 6-2 12-1 16 4-6 1-10 4-12 10 2-8 1-14 0-20-4 3-8 4-14 3 6-4 10-8 10-15z"
              fill="currentColor"
            />
          </svg>
          <p className="font-serif text-4xl leading-none tracking-wide">Melaleuca</p>
          <p className="mt-1 text-[11px] tracking-[0.28em] uppercase">The Wellness Company</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
        <div className="text-sm leading-6">
          <p>Melaleuca, Inc.</p>
          <p>4609 West 65th South</p>
          <p>Idaho Falls, ID 83402</p>
          <p className="mt-4">
            <a href="tel:+12085220700" className="hover:underline">
              (208) 522-0700
            </a>
          </p>
          <p>
            <a href="mailto:info@melaleuca.com" className="hover:underline">
              info@melaleuca.com
            </a>
          </p>
          <div className="mt-6 flex items-start gap-3">
            <svg viewBox="0 0 60 32" className="mt-1 h-6 w-10 shrink-0" aria-hidden="true">
              <rect width="60" height="32" fill="#b22234" />
              <rect y="2.46" width="60" height="2.46" fill="#fff" />
              <rect y="7.38" width="60" height="2.46" fill="#fff" />
              <rect y="12.3" width="60" height="2.46" fill="#fff" />
              <rect y="17.22" width="60" height="2.46" fill="#fff" />
              <rect y="22.15" width="60" height="2.46" fill="#fff" />
              <rect y="27.07" width="60" height="2.46" fill="#fff" />
              <rect width="24" height="17.2" fill="#3c3b6e" />
            </svg>
            <p className="max-w-[16rem] text-xs leading-5">
              Wellness products made in America from exceptional unique ingredients sourced from all
              over the globe
            </p>
          </div>
          <div
            className="mt-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/80 p-2 text-center text-[9px] leading-tight tracking-wide uppercase"
            aria-label="Member of Direct Selling Association"
          >
            Member of Direct Selling Association
          </div>
        </div>

        <ul className="space-y-3 text-xs tracking-[0.16em] uppercase">
          {MELALEUCA_FOOTER_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div>
          <p className="text-xs tracking-[0.16em] uppercase">Become a Member Today!</p>
          <a href="https://www.melaleuca.com/" className="mt-3 inline-block text-sm hover:underline">
            Learn how you can become a Melaleuca Member.
          </a>
          <div
            className="mt-6 inline-flex items-center gap-2 border border-white/80 px-3 py-2"
            aria-label="BBB Accredited Business"
          >
            <span className="text-lg font-bold leading-none">BBB</span>
            <span className="text-[10px] leading-tight tracking-wide uppercase">
              Accredited
              <br />
              Business
            </span>
          </div>
        </div>
      </div>

      <hr className="my-8 border-white/80" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="melaleuca-footer-language"
            className="mb-2 block text-[11px] tracking-[0.18em] uppercase"
          >
            Select language
          </label>
          <select
            id="melaleuca-footer-language"
            defaultValue="en-US"
            className="min-w-56 border border-white/80 bg-transparent px-3 py-2 text-sm"
          >
            <option value="en-US" className="text-black">
              United States - English
            </option>
          </select>
        </div>
        <div className="flex gap-3" data-testid="footerst-version3-social">
          {MELALEUCA_SOCIAL.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white hover:bg-white/10"
            >
              <FontAwesomeIcon icon={item.icon} width={14} height={14} />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-xs">© Copyright 2025 Melaleuca Inc. All Rights Reserved</p>
    </div>
  </section>
);
