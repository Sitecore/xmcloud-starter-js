import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { Button } from 'shadcd/components/ui/button';
import { useMemo, useState, type JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Fields {
  data: {
    datasource: {
      children: {
        results: ContactFields[];
      };
      tagLine: IGQLTextField;
      heading: IGQLTextField;
      body: IGQLRichTextField;
      image: IGQLImageField;
    };
  };
}

interface ContactFields {
  id: string;
  image: IGQLImageField;
  heading: IGQLTextField;
  description: IGQLTextField;
  contactLink: IGQLLinkField;
  buttonLink: IGQLLinkField;
}

type ContactSectionProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ContactCardImageProps = {
  contact: ContactFields;
  size: 'xs' | 'sm' | 'md' | 'lg';
};

type ContactCardProps = {
  contact: ContactFields;
  type: 'sm' | 'md' | 'lg' | 'horizontal' | 'noImage';
  centered?: boolean;
};

const ContactCardImage = (props: ContactCardImageProps) => {
  switch (props.size) {
    case 'sm':
      return (
        <div className="w-6 h-6">
          <ContentSdkImage
            field={props.contact.image?.jsonValue}
            width={50}
            height={50}
            className="w-full h-full object-contain"
          />
        </div>
      );
    case 'lg':
      return (
        <div className="w-full">
          <ContentSdkImage
            field={props.contact.image?.jsonValue}
            width={500}
            height={500}
            className="w-full h-full aspect-[3/2] object-cover"
          />
        </div>
      );
    default:
      return (
        <div className="w-12 h-12">
          <ContentSdkImage
            field={props.contact.image?.jsonValue}
            width={50}
            height={50}
            className="w-full h-full object-contain"
          />
        </div>
      );
  }
};

const ContactCard = (props: ContactCardProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  const buttons = useMemo(
    () => (
      <>
        <ContentSdkLink
          field={props.contact.contactLink?.jsonValue}
          className="underline"
          prefetch={false}
        />
        {props.contact.buttonLink?.jsonValue.value.href || isEditing ? (
          <Button variant={'ghost'} className="px-0">
            <ContentSdkLink field={props.contact.buttonLink?.jsonValue} prefetch={false} />
            <FontAwesomeIcon icon={faChevronRight} width={16} height={16} />
          </Button>
        ) : (
          <></>
        )}
      </>
    ),
    [props.contact.buttonLink?.jsonValue, props.contact.contactLink?.jsonValue, isEditing]
  );

  switch (props.type) {
    case 'sm':
      return (
        <div
          className={`basis-full flex flex-col ${
            props.centered ? 'items-center text-center' : 'items-start'
          }`}
        >
          <ContactCardImage contact={props.contact} size={'sm'} />
          <h3 className="text-xl font-bold mt-4 mb-2">
            <ContentSdkText field={props.contact.heading?.jsonValue} />
          </h3>
          <p className="mb-2 empty:mb-0">
            <ContentSdkText field={props.contact.description?.jsonValue} />
          </p>
          <div
            className={`grid gap-2 ${
              props.centered ? 'justify-items-center' : 'justify-items-start'
            }`}
          >
            {buttons}
          </div>
        </div>
      );
    case 'lg':
      return (
        <div
          className={`basis-full flex flex-col ${
            props.centered ? 'items-center text-center' : 'items-start'
          }`}
        >
          <ContactCardImage contact={props.contact} size={'lg'} />
          <h3 className="text-4xl font-bold mt-8 mb-4">
            <ContentSdkText field={props.contact.heading?.jsonValue} />
          </h3>
          <p className="mb-6 empty:mb-0">
            <ContentSdkText field={props.contact.description?.jsonValue} />
          </p>
          <div
            className={`grid gap-2 ${
              props.centered ? 'justify-items-center' : 'justify-items-start'
            }`}
          >
            {buttons}
          </div>
        </div>
      );
    case 'horizontal':
      return (
        <div className="basis-full flex gap-4 items-start">
          <ContactCardImage contact={props.contact} size={'sm'} />
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold mb-2">
              <ContentSdkText field={props.contact.heading?.jsonValue} />
            </h3>
            <p className="mb-2 empty:mb-0">
              <ContentSdkText field={props.contact.description?.jsonValue} />
            </p>
            <div className="grid gap-2 justify-items-start">{buttons}</div>
          </div>
        </div>
      );
    case 'noImage':
      return (
        <div className="flex flex-col items-start">
          <h3 className="text-2xl font-bold mb-2">
            <ContentSdkText field={props.contact.heading?.jsonValue} />
          </h3>
          <p className="mb-2 empty:mb-0">
            <ContentSdkText field={props.contact.description?.jsonValue} />
          </p>
          <div className="grid gap-2 justify-items-start">{buttons}</div>
        </div>
      );
    default:
      return (
        <div
          className={`basis-full flex flex-col ${
            props.centered ? 'items-center text-center' : 'items-start'
          }`}
        >
          <ContactCardImage contact={props.contact} size={'md'} />
          <h3 className="text-3xl font-bold mt-6 mb-4">
            <ContentSdkText field={props.contact.heading?.jsonValue} />
          </h3>
          <p className="mb-6 empty:mb-0">
            <ContentSdkText field={props.contact.description?.jsonValue} />
          </p>
          <div
            className={`grid gap-4 ${
              props.centered ? 'justify-items-center' : 'justify-items-start'
            }`}
          >
            {buttons}
          </div>
        </div>
      );
  }
};

export const Default = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
          {datasource.children.results.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="md" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection1 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
          {datasource.children.results.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="md" centered />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection2 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-x-20 gap-y-12 mt-20">
          <div className="flex flex-col gap-x-8 gap-y-12">
            {datasource.children.results.map((contact) => (
              <ContactCard key={contact.id} contact={contact} type="sm" />
            ))}
          </div>
          <div className="relative md:col-span-2 min-h-80">
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection3 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-x-12 gap-y-20">
          <div className="max-w-3xl md:col-span-3">
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-4">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
          </div>
          <div className="flex flex-col gap-x-8 gap-y-12 md:col-span-2">
            {datasource.children.results.map((contact) => (
              <ContactCard key={contact.id} contact={contact} type="horizontal" />
            ))}
          </div>
        </div>
        <ContentSdkImage
          field={datasource.image?.jsonValue}
          width={800}
          height={800}
          className="w-full h-full aspect-16/9 object-cover mt-20"
        />
      </div>
    </section>
  );
};

export const ContactSection4 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
          {datasource.children.results.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="lg" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection5 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-12 mt-20">
          {datasource.children.results.map((contact) => (
            <ContactCard key={contact.id} contact={contact} type="lg" centered />
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection6 = (props: ContactSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [activeTab, setActiveTab] = useState(datasource.children.results[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-4">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="grid gap-10">
            {datasource.children.results.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleTabClick(contact.id)}
                className={`ps-8 cursor-pointer border-s-2 ${
                  activeTab !== contact.id ? 'border-transparent' : ''
                }`}
              >
                <ContactCard contact={contact} type="noImage" />
              </div>
            ))}
          </div>
          <div className="relative md:col-span-2 min-h-80">
            {datasource.children.results.map((contact) => (
              <div
                key={contact.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab !== contact.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ContentSdkImage
                  field={contact.image.jsonValue}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
