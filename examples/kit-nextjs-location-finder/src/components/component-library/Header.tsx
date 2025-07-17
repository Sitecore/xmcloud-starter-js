import { Button } from 'shadcn/components/ui/button';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-content-sdk/nextjs';
import { Input } from 'shadcd/components/ui/input';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useVisibility from '@/hooks/useVisibility';

interface Fields {
  Tagline: Field<string>;
  Heading: Field<string>;
  Body: Field<string>;
  Link1: LinkField;
  Link2: LinkField;
  Image: ImageField;
  FormDisclaimer: Field<string>;
}

type HeaderProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type HeaderTemplateProps = HeaderProps & {
  centered?: boolean;
  withColumns?: boolean;
  withBackgroundImage?: boolean;
  withForm?: boolean;
};

const HeaderTemplate = (props: HeaderTemplateProps) => {
  const [isVisible, domRef] = useVisibility();

  return (
    <section className={`relative py-24 px-4 ${props.params.styles}`} data-class-change>
      {props.withBackgroundImage && (
        <div className="absolute inset-0 h-full w-full z-1">
          <ContentSdkImage
            field={props.fields.Image}
            width={800}
            height={800}
            className="h-full w-full object-cover brightness-50"
          />
        </div>
      )}
      <div
        className={`container mx-auto ${
          props.withBackgroundImage ? 'relative text-white z-2' : ''
        }`}
      >
        <div
          className={`${
            props.withColumns ? 'grid gap-x-12 lg:grid-cols-2' : 'max-w-3xl flex flex-col'
          } ${
            props.centered ? 'mx-auto items-center text-center max-w-4xl' : ''
          } fade-section fade-up ${isVisible ? 'is-visible' : ''} `}
          ref={domRef}
        >
          <div>
            <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
              <ContentSdkText field={props.fields.Tagline} />
            </h6>
            <h1 className="text-5xl font-medium mb-6">
              <ContentSdkText field={props.fields.Heading} />
            </h1>
          </div>
          <div>
            <div className="text-base">
              <ContentSdkRichText field={props.fields.Body} />
            </div>
            {props.withForm ? (
              <div className={`flex w-full ${props.centered ? 'justify-center' : ''} gap-2 mt-8`}>
                <div className={`max-w-[30rem]`}>
                  <div className="flex gap-4">
                    <Input type="email" placeholder="Enter your email" />
                    <Button type="submit">Subscribe</Button>
                  </div>
                  <div className="text-xs mt-3">
                    <ContentSdkRichText field={props.fields.FormDisclaimer} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex ${props.centered ? 'justify-center' : ''} gap-4 mt-8`}>
                <Button asChild={true} variant={'secondary'}>
                  <ContentSdkLink field={props.fields.Link1} prefetch={false} />
                </Button>
                <Button asChild={true} variant={'outline'}>
                  <ContentSdkLink field={props.fields.Link2} prefetch={false} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Default = (props: HeaderProps) => {
  return <HeaderTemplate {...props} />;
};

export const Header1 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} centered />;
};

export const Header2 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} withColumns />;
};

export const Header3 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} withBackgroundImage />;
};

export const Header4 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} centered withBackgroundImage />;
};

export const Header5 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} withColumns withBackgroundImage />;
};

export const Header6 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} withForm />;
};

export const Header7 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} centered withForm />;
};

export const Header8 = (props: HeaderProps) => {
  return <HeaderTemplate {...props} withColumns withForm />;
};

export const Header9 = (props: HeaderProps) => {
  const [isVisible, domRef] = useVisibility();

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div
          className={`grid gap-4 items-center lg:grid-cols-2 fade-section fade-up ${
            isVisible ? 'is-visible' : ''
          }`}
          ref={domRef}
        >
          <div>
            <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
              <ContentSdkText field={props.fields.Tagline} />
            </h6>
            <h1 className="text-6xl font-medium mb-6">
              <ContentSdkText field={props.fields.Heading} />
            </h1>
            <div className="text-lg">
              <ContentSdkRichText field={props.fields.Body} />
            </div>
            <div className={`flex gap-4 mt-8`}>
              <Button asChild={true} variant={'secondary'}>
                <ContentSdkLink field={props.fields.Link1} prefetch={false} />
              </Button>
              <Button asChild={true} variant={'outline'}>
                <ContentSdkLink field={props.fields.Link2} prefetch={false} />
              </Button>
            </div>
          </div>
          <div>
            <div className="backdrop-blur-lg p-6 rounded-2xl">
              <ContentSdkImage
                field={props.fields.Image}
                width={800}
                height={800}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header10 = (props: HeaderProps) => {
  return (
    <section className={`relative py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className={`container mx-auto`}>
        <div className="max-w-3xl">
          <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
            <ContentSdkText field={props.fields.Tagline} />
          </h6>
          <h2 className="text-4xl font-bold mb-6">
            <ContentSdkText field={props.fields.Heading} />
          </h2>
          <div className="text-base">
            <ContentSdkRichText field={props.fields.Body} />
          </div>
          <div className="flex gap-4 mt-8">
            <ContentSdkLink
              field={props.fields.Link1}
              prefetch={false}
              className="flex items-center gap-2 text-base text-primary font-medium"
            >
              {props.fields.Link1.value.text}
              <FontAwesomeIcon icon={faChevronRight} width={16} height={16} />
            </ContentSdkLink>
          </div>
        </div>
      </div>
    </section>
  );
};
