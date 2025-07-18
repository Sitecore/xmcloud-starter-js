import { faFacebook, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  Link as ContentSdkLink,
  Field,
  RichTextField,
  LinkField,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Title: Field<string>;
  CopyrightText: RichTextField;
  FacebookLink: LinkField;
  InstagramLink: LinkField;
  LinkedinLink: LinkField;
}

type FooterSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterSTProps) => {
  return (
    <section
      className={`relative bg-primary pt-16 lg:pt-30 pb-8 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl lg:text-7xl mb-10 lg:mb-20 uppercase">
          <ContentSdkText field={props.fields.Title} />
        </h2>
        <div className="max-w-5xl mx-auto mb-6 lg:mb-12 font-(family-name:--font-heading) text-2xl uppercase">
          <Placeholder
            name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
          />
        </div>
        <div className="max-w-5xl mx-auto font-(family-name:--font-accent) font-medium">
          <Placeholder
            name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
            rendering={props.rendering}
          />
        </div>
      </div>
      <div className="h-20 lg:h-40 bg-sound-waves bg-contain bg-repeat bg-center my-12 lg:my-16"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between">
          <div className="flex justify-center gap-4">
            <ContentSdkLink field={props.fields.FacebookLink} prefetch={false}>
              <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.InstagramLink} prefetch={false}>
              <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.LinkedinLink} prefetch={false}>
              <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
            </ContentSdkLink>
          </div>
          <div>
            <ContentSdkRichText field={props.fields.CopyrightText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const LogoLeft = (props: FooterSTProps) => {
  return (
    <section
      className={`relative bg-primary pt-16 lg:pt-30 bg-cover bg-center ${props.params.styles}`}
      style={{ backgroundImage: 'url("/footer-texture.webp")' }}
      data-class-change
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2">
          <h2 className="text-4xl lg:text-7xl mb-10 lg:mb-0 uppercase">
            <ContentSdkText field={props.fields.Title} />
          </h2>
          <div className="lg:flex justify-end items-start gap-12">
            <div className="mb-6 lg:mb-0 font-(family-name:--font-heading) uppercase text-2xl">
              <Placeholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <Placeholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-8">
          <div className="flex justify-center gap-4">
            <ContentSdkLink field={props.fields.FacebookLink} prefetch={false}>
              <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.InstagramLink} prefetch={false}>
              <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.LinkedinLink} prefetch={false}>
              <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
            </ContentSdkLink>
          </div>
          <div>
            <ContentSdkRichText field={props.fields.CopyrightText} />
          </div>
        </div>
      </div>
      <div className="h-10 lg:h-20 bg-sound-waves bg-[length:auto_200%] bg-repeat bg-top bg-center-x mt-12 lg:mt-16"></div>
    </section>
  );
};

export const LogoRight = (props: FooterSTProps) => {
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
            <ContentSdkText field={props.fields.Title} />
          </h2>
          <div className="lg:flex items-start gap-12">
            <div className="mb-6 lg:mb-0 font-(family-name:--font-heading) uppercase text-2xl">
              <Placeholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <Placeholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:flex-row lg:justify-between mt-8">
          <div className="flex justify-center gap-4">
            <ContentSdkLink field={props.fields.FacebookLink} prefetch={false}>
              <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.InstagramLink} prefetch={false}>
              <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
            </ContentSdkLink>
            <ContentSdkLink field={props.fields.LinkedinLink} prefetch={false}>
              <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
            </ContentSdkLink>
          </div>
          <div>
            <ContentSdkRichText field={props.fields.CopyrightText} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Centered = (props: FooterSTProps) => {
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
            <ContentSdkText field={props.fields.Title} />
          </h2>
          <div>
            <div className="mb-6 lg:mb-12 font-(family-name:--font-heading) uppercase text-2xl">
              <Placeholder
                name={`footer-primary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
            <div className="font-(family-name:--font-accent) font-medium">
              <Placeholder
                name={`footer-secondary-links-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center lg:items-end lg:self-end mt-8">
            <div className="flex justify-center gap-4">
              <ContentSdkLink field={props.fields.FacebookLink} prefetch={false}>
                <FontAwesomeIcon icon={faFacebook} width={20} height={20} />
              </ContentSdkLink>
              <ContentSdkLink field={props.fields.InstagramLink} prefetch={false}>
                <FontAwesomeIcon icon={faInstagram} width={22} height={22} />
              </ContentSdkLink>
              <ContentSdkLink field={props.fields.LinkedinLink} prefetch={false}>
                <FontAwesomeIcon icon={faLinkedinIn} width={24} height={24} />
              </ContentSdkLink>
            </div>
            <div>
              <ContentSdkRichText field={props.fields.CopyrightText} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
