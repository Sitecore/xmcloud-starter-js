import { Button } from 'shadcn/components/ui/button';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  ImageField,
  Field,
} from '@sitecore-content-sdk/nextjs';
import { Input } from 'shadcd/components/ui/input';

interface Fields {
  Tagline: Field<string>;
  Heading: Field<string>;
  Body: Field<string>;
  Image: ImageField;
  FormDisclaimer: Field<string>;
}

type NewsletterSectionProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type NewsletterSectionTemplateProps = NewsletterSectionProps & {
  centered?: boolean;
  withColumns?: boolean;
  withBackgroundImage?: boolean;
  bordered?: boolean;
};

const NewsletterSectionTemplate = (props: NewsletterSectionTemplateProps) => {
  return (
    <section className={`relative py-24 px-4 ${props.params.styles}`}>
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
        }  ${props.bordered ? `border p-12 ${props.withColumns ? '' : 'py-20'}` : ''}`}
      >
        <div
          className={`${
            props.withColumns
              ? 'grid gap-x-12 lg:grid-cols-2 items-center'
              : 'max-w-3xl flex flex-col'
          } ${props.centered ? 'mx-auto items-center text-center' : ''} `}
        >
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={props.fields.Tagline} />
            </h6>
            <h1 className={`${props.withColumns ? 'text-5xl' : 'text-6xl'} font-bold mb-6`}>
              <ContentSdkText field={props.fields.Heading} />
            </h1>
            <div className="text-lg">
              <ContentSdkRichText field={props.fields.Body} />
            </div>
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
          </div>
          {props.withColumns && (
            <div className="mt-8 lg:mt-0">
              <ContentSdkImage
                field={props.fields.Image}
                width={800}
                height={800}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const Default = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} centered />;
};

export const NewsletterSection1 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} centered withBackgroundImage />;
};

export const NewsletterSection2 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} />;
};

export const NewsletterSection3 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} withBackgroundImage />;
};

export const NewsletterSection4 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} withColumns />;
};

export const NewsletterSection5 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} withColumns bordered />;
};

export const NewsletterSection6 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} centered bordered />;
};

export const NewsletterSection7 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} centered bordered withBackgroundImage />;
};

export const NewsletterSection8 = (props: NewsletterSectionProps) => {
  return <NewsletterSectionTemplate {...props} />;
};
