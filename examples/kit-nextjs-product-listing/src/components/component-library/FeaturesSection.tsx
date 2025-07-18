import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { Button } from 'shadcd/components/ui/button';
import { useMemo, useState, useRef, useEffect, type JSX } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'shadcd/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'shadcd/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'shadcd/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useVisibility from '@/hooks/useVisibility';
import React from 'react';

interface Fields {
  data: {
    datasource: {
      children: {
        results: FeatureFields[];
      };
      heading: IGQLTextField;
      tagLine: IGQLTextField;
      body: IGQLRichTextField;
      image: IGQLImageField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

interface FeatureFields {
  id: string;
  featureTagLine: IGQLTextField;
  featureHeading: IGQLTextField;
  featureDescription: IGQLTextField;
  featureIcon: IGQLImageField;
  featureImage: IGQLImageField;
  featureLink1: IGQLLinkField;
  featureLink2: IGQLLinkField;
}

type FeatureSectionProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type FeatureSectionButtonsProps = {
  link1: IGQLLinkField;
  link2: IGQLLinkField;
};

type FeatureBoxProps = React.HTMLProps<HTMLDivElement> & {
  feature: FeatureFields;
  type:
    | 'simple'
    | 'horizontal'
    | 'oneLiner'
    | 'extended'
    | 'extendedLarge'
    | 'withBackgroundImageSm'
    | 'withBackgroundImageLg'
    | 'MSCardSmall'
    | 'MSCardSmallIcon';
  withLinks?: boolean;
  centered?: boolean;
};

const FeatureSectionButtons = (props: FeatureSectionButtonsProps): JSX.Element => (
  <div className="flex flex-wrap gap-6 mt-4">
    <Button asChild={true}>
      <ContentSdkLink field={props.link1.jsonValue} prefetch={false} />
    </Button>
    <Button variant="link" asChild={true} className="ps-0">
      <ContentSdkLink field={props.link2.jsonValue} prefetch={false} />
    </Button>
  </div>
);

const MSCardButtons = (props: FeatureSectionButtonsProps): JSX.Element => (
  <div className="flex flex-wrap items-center gap-6 mt-4">
    <ContentSdkLink
      field={props.link1.jsonValue}
      className="flex items-center gap-2 text-sm font-bold"
      prefetch={false}
    >
      <span className="p-2 bg-black rounded-md">
        <ChevronRight className="h-5 w-5 text-white" />
      </span>
      {props.link1.jsonValue.value.text}
    </ContentSdkLink>
  </div>
);

const FeatureBox = React.forwardRef<HTMLDivElement, FeatureBoxProps>((props, ref): JSX.Element => {
  switch (props.type) {
    case 'horizontal':
      return (
        <div className={`flex gap-4 items-start ${props.className}`}>
          <ContentSdkImage
            field={props.feature.featureIcon?.jsonValue}
            width={30}
            height={30}
            className="shrink-0"
          />
          <div>
            <h3 className="text-xl font-bold mb-4">
              <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
            </h3>
            <p>
              <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
            </p>
            {props.withLinks && (
              <FeatureSectionButtons
                link1={props.feature.featureLink1}
                link2={props.feature.featureLink2}
              />
            )}
          </div>
        </div>
      );
    case 'oneLiner':
      return (
        <div className={props.className}>
          <div className={`flex gap-4 items-start`}>
            <ContentSdkImage field={props.feature.featureIcon?.jsonValue} width={20} height={20} />
            <h3>
              <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
            </h3>
          </div>
          {props.withLinks && (
            <FeatureSectionButtons
              link1={props.feature.featureLink1}
              link2={props.feature.featureLink2}
            />
          )}
        </div>
      );
    case 'extended':
      return (
        <div
          className={`${props.centered ? 'flex flex-col items-center text-center' : ''} ${
            props.className
          }`}
        >
          <ContentSdkImage
            field={props.feature.featureIcon?.jsonValue}
            width={48}
            height={48}
            className="mb-4"
          />
          <h3 className="text-4xl font-bold mb-6">
            <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
          </h3>
          <p className="mb-6">
            <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
          </p>
          {props.withLinks && (
            <FeatureSectionButtons
              link1={props.feature.featureLink1}
              link2={props.feature.featureLink2}
            />
          )}
        </div>
      );
    case 'extendedLarge':
      return (
        <div className={props.className}>
          <ContentSdkImage
            field={props.feature.featureImage?.jsonValue}
            width={800}
            height={600}
            className="aspect-3/2 w-full object-cover mb-4"
          />
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={props.feature.featureTagLine?.jsonValue} />
          </h6>
          <h3 className="text-4xl font-bold mb-6">
            <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
          </h3>
          <p className="mb-6">
            <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
          </p>
          {props.withLinks && (
            <FeatureSectionButtons
              link1={props.feature.featureLink1}
              link2={props.feature.featureLink2}
            />
          )}
        </div>
      );
    case 'withBackgroundImageSm':
      return (
        <div className={`relative flex flex-col justify-center p-8 text-white ${props.className}`}>
          <ContentSdkImage
            field={props.feature.featureImage?.jsonValue}
            width={600}
            height={600}
            className="absolute w-full h-full object-cover inset-0 brightness-50 z-10"
          />
          <div className="relative z-20">
            <ContentSdkImage
              field={props.feature.featureIcon?.jsonValue}
              width={48}
              height={48}
              className="inline-block mb-4"
            />
            <h3 className="text-3xl font-bold mb-4">
              <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
            </h3>
            <p>
              <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
            </p>
            {props.withLinks && (
              <FeatureSectionButtons
                link1={props.feature.featureLink1}
                link2={props.feature.featureLink2}
              />
            )}
          </div>
        </div>
      );
    case 'withBackgroundImageLg':
      return (
        <div className={`relative flex flex-col justify-center p-12 text-white ${props.className}`}>
          <ContentSdkImage
            field={props.feature.featureImage?.jsonValue}
            width={600}
            height={600}
            className="absolute w-full h-full object-cover inset-0 brightness-50 z-10"
          />
          <div className="relative z-20">
            <ContentSdkImage
              field={props.feature.featureIcon?.jsonValue}
              width={48}
              height={48}
              className="inline-block mb-6"
            />
            <h3 className="text-4xl font-bold mb-6">
              <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
            </h3>
            <p className="mb-6">
              <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
            </p>
            {props.withLinks && (
              <FeatureSectionButtons
                link1={props.feature.featureLink1}
                link2={props.feature.featureLink2}
              />
            )}
          </div>
        </div>
      );
    case 'MSCardSmall':
      return (
        <div
          key={props.feature.id}
          className={`group flex flex-col p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg ${props.className}`}
          style={props.style}
          ref={ref}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden mb-4">
            <ContentSdkImage
              field={props.feature.featureImage?.jsonValue}
              width={700}
              height={300}
              className="w-full aspect-7/3 object-cover rounded-2xl transition-transform duration-1000 ease-in-out group-hover:scale-115"
            />
          </div>
          <div className="flex flex-col basis-full p-4">
            <h6 className="font-semibold text-xs mb-2">
              <ContentSdkText field={props.feature.featureTagLine?.jsonValue} />
            </h6>
            <h3 className="text-xl font-medium mb-4">
              <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
            </h3>
            <p className="text-base mb-6">
              <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
            </p>
            <div className="mt-auto">
              <MSCardButtons
                link1={props.feature.featureLink1}
                link2={props.feature.featureLink2}
              />
            </div>
          </div>
        </div>
      );
    case 'MSCardSmallIcon':
      return (
        <div
          key={props.feature.id}
          className={`flex flex-col p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg ${props.className}`}
          style={props.style}
          ref={ref}
        >
          <div className="self-start border p-3 m-4 mb-0 rounded-md">
            <ContentSdkImage
              field={props.feature.featureIcon?.jsonValue}
              width={24}
              height={24}
              className="aspect-square w-6 object-contain"
            />
          </div>
          <div className="flex flex-col basis-full p-4">
            <h6 className="font-semibold text-xs mb-2">
              <ContentSdkText field={props.feature.featureTagLine?.jsonValue} />
            </h6>
            <h3 className="text-xl font-medium mb-4">
              <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
            </h3>
            <div className="mt-auto">
              <MSCardButtons
                link1={props.feature.featureLink1}
                link2={props.feature.featureLink2}
              />
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div
          className={`${props.centered ? 'flex flex-col items-center text-center' : ''} ${
            props.className
          }`}
        >
          <ContentSdkImage
            field={props.feature.featureIcon?.jsonValue}
            width={48}
            height={48}
            className="mb-4"
          />
          <h3 className="text-xl font-bold mb-4">
            <ContentSdkText field={props.feature.featureHeading?.jsonValue} />
          </h3>
          <p>
            <ContentSdkText field={props.feature.featureDescription?.jsonValue} />
          </p>
          {props.withLinks && (
            <FeatureSectionButtons
              link1={props.feature.featureLink1}
              link2={props.feature.featureLink2}
            />
          )}
        </div>
      );
  }
});
FeatureBox.displayName = 'FeatureBox';

const useMultipleVisibility = (count: number) => {
  const [visibilities, setVisibilities] = useState<boolean[]>(Array(count).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>(Array(count).fill(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setVisibilities((prev) => {
              const next = [...prev];
              next[index] = entry.isIntersecting;
              return next;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return [visibilities, refs.current] as const;
};

export const Default = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;
  if (!props.fields?.data?.datasource) {
    return (
      <div data-class-change className={props.params.styles} id={id ? id : undefined}>
        <div className="component-content">
          <h3>Feature Section</h3>
          <p>No data source</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="simple" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div>
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection1 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;
  if (!props.fields?.data?.datasource) {
    return (
      <div data-class-change className={props.params.styles} id={id ? id : undefined}>
        <div className="component-content">
          <h3>Feature Section</h3>
          <p>No data source</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="horizontal" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div>
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection2 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;
  if (!props.fields?.data?.datasource) {
    return (
      <div data-class-change className={props.params.styles} id={id ? id : undefined}>
        <div className="component-content">
          <h3>Feature Section</h3>
          <p>No data source</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid gap-y-4 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="oneLiner" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div>
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="aspect-square object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection3 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;
  if (!props.fields?.data?.datasource) {
    return (
      <div data-class-change className={props.params.styles} id={id ? id : undefined}>
        <div className="component-content">
          <h3>Feature Section</h3>
          <p>No data source</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
          </div>
          <div>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="simple" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <ContentSdkImage
          field={datasource.image?.jsonValue}
          width={1600}
          height={900}
          className="w-full aspect-16/9 object-cover mt-20"
        />
      </div>
    </section>
  );
};

export const FeaturesSection4 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;
  if (!props.fields?.data?.datasource) {
    return (
      <div data-class-change className={props.params.styles} id={id ? id : undefined}>
        <div className="component-content">
          <h3>Feature Section</h3>
          <p>No data source</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
          </div>
          <div>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="horizontal" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <ContentSdkImage
          field={datasource.image?.jsonValue}
          width={1600}
          height={900}
          className="w-full aspect-16/9 object-cover mt-20"
        />
      </div>
    </section>
  );
};

export const FeaturesSection5 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
          </div>
          <div>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid gap-y-4 my-8">
              {datasource.children.results.map((feature) => (
                <FeatureBox key={feature.id} feature={feature} type="oneLiner" />
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <ContentSdkImage
          field={datasource.image?.jsonValue}
          width={1600}
          height={900}
          className="w-full aspect-16/9 object-cover mt-20"
        />
      </div>
    </section>
  );
};

export const FeaturesSection6 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg mb-8">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div>
            <div className="grid gap-y-4">
              {datasource.children.results.map((feature, i) => (
                <div className={`flex gap-8 py-10`} key={feature.id}>
                  <div className="shrink-0 relative">
                    <ContentSdkImage
                      field={feature.featureIcon?.jsonValue}
                      width={40}
                      height={40}
                      className="shrink-0"
                    />
                    {i !== datasource.children.results.length - 1 && (
                      <span className="absolute top-18 bottom-0 left-[calc(50%-1px)] w-[2px] h-full bg-black"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      <ContentSdkText field={feature.featureHeading?.jsonValue} />
                    </h3>
                    <p>
                      <ContentSdkText field={feature.featureDescription?.jsonValue} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection7 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {datasource.children.results.map((feature) => (
            <FeatureBox key={feature.id} feature={feature} type="extended" withLinks />
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection8 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {datasource.children.results.map((feature) => (
            <FeatureBox key={feature.id} feature={feature} type="extendedLarge" withLinks />
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection9 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
          <div>
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 py-8">
            {datasource.children.results.map((feature) => (
              <FeatureBox key={feature.id} feature={feature} type="simple" withLinks />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection10 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
          <div>
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid gap-x-8 gap-y-12 py-8">
            {datasource.children.results.map((feature) => (
              <FeatureBox key={feature.id} feature={feature} type="horizontal" withLinks />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection11 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="grid grid-flow-dense md:grid-cols-3 gap-x-20 gap-y-12 my-12">
          <ContentSdkImage
            field={datasource.image?.jsonValue}
            width={800}
            height={800}
            className="w-full h-full object-cover md:row-span-2 md:col-start-2"
          />
          {datasource.children.results.map((feature) => (
            <FeatureBox
              key={feature.id}
              feature={feature}
              type="simple"
              centered
              className="my-4"
            />
          ))}
        </div>
        <div className="flex justify-center">
          <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection12 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [activeTab, setActiveTab] = useState(datasource.children.results[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
          <div>
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <div className="grid my-8">
              {datasource.children.results.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => handleTabClick(feature.id)}
                  className={`ps-6 py-4 cursor-pointer border-s-2 ${
                    activeTab !== feature.id ? 'border-transparent' : ''
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">
                    <ContentSdkText field={feature.featureHeading?.jsonValue} />
                  </h3>
                  <p>
                    <ContentSdkText field={feature.featureDescription?.jsonValue} />
                  </p>
                </div>
              ))}
            </div>
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div className="relative min-h-80">
            {datasource.children.results.map((feature) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab !== feature.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ContentSdkImage
                  field={feature.featureImage?.jsonValue}
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

export const FeaturesSection13 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [activeTab, setActiveTab] = useState(datasource.children.results[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <div className="flex justify-center">
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-12 mt-20">
          <div className="relative aspect-square">
            {datasource.children.results.map((feature) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab !== feature.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ContentSdkImage
                  field={feature.featureImage?.jsonValue}
                  width={800}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <Accordion
            type="single"
            defaultValue={datasource.children.results[0].id}
            className="grid my-8"
          >
            {datasource.children.results.map((feature) => (
              <AccordionItem
                value={feature.id}
                key={feature.id}
                onClick={() => handleTabClick(feature.id)}
                className={`py-4 ${activeTab !== feature.id ? 'opacity-25' : ''}`}
              >
                <AccordionTrigger noIcon className="cursor-pointer hover:no-underline">
                  <div className="flex gap-6">
                    <ContentSdkImage
                      field={feature.featureIcon?.jsonValue}
                      width={32}
                      height={32}
                      className="shrink-0"
                    />
                    <h3 className="text-3xl font-bold mb-2">
                      <ContentSdkText field={feature.featureHeading?.jsonValue} />
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="ps-14">
                    <ContentSdkText field={feature.featureDescription?.jsonValue} />
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection14 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <div className="flex justify-center">
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {datasource.children.results.map((feature) => (
            <FeatureBox
              key={feature.id}
              feature={feature}
              type={
                datasource.children.results.length < 3
                  ? 'withBackgroundImageLg'
                  : 'withBackgroundImageSm'
              }
              withLinks
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection15 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <div className="flex justify-center">
            <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="grid grid-flow-dense gap-8 md:grid-cols-4 mt-12">
          {datasource.children.results.map((feature, i) => (
            <FeatureBox
              key={feature.id}
              feature={feature}
              type={i === 0 || i === 3 ? 'withBackgroundImageLg' : 'withBackgroundImageSm'}
              withLinks
              className={`${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${
                i === 3 ? 'md:col-span-2' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection16 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative basis-[150%] p-12">
            <ContentSdkImage
              field={datasource.image?.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 w-full h-full object-cover brightness-50 z-10"
            />
            <div className="relative h-full flex flex-col justify-center max-w-2xl mx-auto text-white text-center z-20">
              <h6 className="font-semibold mb-4">
                <ContentSdkText field={datasource.tagLine?.jsonValue} />
              </h6>
              <h2 className="text-5xl font-bold mb-6">
                <ContentSdkText field={datasource.heading?.jsonValue} />
              </h2>
              <div className="text-lg mb-6">
                <ContentSdkRichText field={datasource.body?.jsonValue} />
              </div>
              <div className="flex justify-center">
                <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
              </div>
            </div>
          </div>
          <div className="grid gap-8 basis-[100%]">
            {datasource.children.results.map((feature) => (
              <FeatureBox
                key={feature.id}
                feature={feature}
                type="extended"
                centered
                withLinks
                className="border p-8"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection17 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>

        <Tabs
          defaultValue={datasource.children.results[0].id}
          className="grid md:grid-cols-3 mt-20"
        >
          <TabsList className="md:flex-col">
            {datasource.children.results.map((feature) => (
              <TabsTrigger
                value={feature.id}
                key={feature.id}
                className="md:border-b-0 md:last:border-b md:data-[state=active]:border-b-inherit md:border-e md:data-[state=active]:border-e-transparent"
              >
                <h6 className="text-xl font-bold">
                  <ContentSdkText field={feature.featureTagLine?.jsonValue} />
                </h6>
              </TabsTrigger>
            ))}
          </TabsList>

          {datasource.children.results.map((feature) => (
            <TabsContent
              value={feature.id}
              key={feature.id}
              className="md:border-t md:border-s-0 md:col-span-2 md:p-16"
            >
              <div className="max-w-2xl">
                <ContentSdkImage
                  field={feature.featureIcon?.jsonValue}
                  width={50}
                  height={50}
                  className="mb-4"
                />
                <h3 className="text-4xl font-bold mb-6">
                  <ContentSdkText field={feature.featureHeading?.jsonValue} />
                </h3>
                <p className="mb-6">
                  <ContentSdkText field={feature.featureDescription?.jsonValue} />
                </p>
                <FeatureSectionButtons link1={feature.featureLink1} link2={feature.featureLink2} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export const FeaturesSection18 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>

        <Tabs defaultValue={datasource.children.results[0].id} className="mt-20">
          <TabsList>
            {datasource.children.results.map((feature) => (
              <TabsTrigger value={feature.id} key={feature.id}>
                <h6 className="text-xl font-bold">
                  <ContentSdkText field={feature.featureTagLine?.jsonValue} />
                </h6>
              </TabsTrigger>
            ))}
          </TabsList>

          {datasource.children.results.map((feature) => (
            <TabsContent value={feature.id} key={feature.id}>
              <div className="grid md:grid-cols-2 items-center gap-8">
                <div>
                  <ContentSdkImage
                    field={feature.featureIcon?.jsonValue}
                    width={50}
                    height={50}
                    className="mb-4"
                  />
                  <h3 className="text-4xl font-bold mb-6">
                    <ContentSdkText field={feature.featureHeading?.jsonValue} />
                  </h3>
                  <p className="mb-6">
                    <ContentSdkText field={feature.featureDescription?.jsonValue} />
                  </p>
                  <FeatureSectionButtons
                    link1={feature.featureLink1}
                    link2={feature.featureLink2}
                  />
                </div>
                <div>
                  <ContentSdkImage
                    field={feature.featureImage?.jsonValue}
                    width={800}
                    height={600}
                    className="w-full mb-4"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export const FeaturesSection19 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg mb-6">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <FeatureSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>

        <Accordion
          type="single"
          defaultValue={datasource.children.results[0].id}
          className="flex flex-col md:flex-row mt-20"
        >
          {datasource.children.results.map((feature) => (
            <AccordionItem
              value={feature.id}
              key={feature.id}
              className="flex flex-col md:flex-row border border-b-0 md:border-b md:border-e-0 md:last:border-e last:border-b md:data-[state=open]:basis-full"
            >
              <AccordionTrigger noIcon className="px-10 py-8 cursor-pointer hover:no-underline">
                <div className="flex md:flex-col items-center gap-6 w-full md:h-full">
                  <ContentSdkImage
                    field={feature.featureIcon?.jsonValue}
                    width={24}
                    height={24}
                    className="shrink-0 md:mb-auto"
                  />
                  <h6 className="text-2xl font-bold mx-auto md:mx-0 md:[writing-mode:vertical-rl] md:rotate-180">
                    <ContentSdkText field={feature.featureTagLine?.jsonValue} />
                  </h6>
                </div>
              </AccordionTrigger>
              <AccordionContent className="w-full px-10 py-12">
                <div className="max-w-2xl">
                  <h3 className="text-4xl font-bold mb-6">
                    <ContentSdkText field={feature.featureHeading?.jsonValue} />
                  </h3>
                  <p>
                    <ContentSdkText field={feature.featureDescription?.jsonValue} />
                  </p>
                  <ContentSdkImage
                    field={feature.featureImage?.jsonValue}
                    width={800}
                    height={800}
                    className="mt-10 max-w-full"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export const FeaturesSection20 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-12 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <ul className="flex flex-wrap justify-center gap-8">
          {datasource.children.results.map((feature) => (
            <li className={`flex flex-col items-center gap-4`} key={feature.id}>
              <ContentSdkImage field={feature.featureIcon?.jsonValue} width={40} height={40} />
              <ContentSdkLink
                field={feature.featureLink1.jsonValue}
                className="text-base text-primary font-medium underline text-center"
                prefetch={false}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const FeaturesSection21 = (props: FeatureSectionProps): JSX.Element => {
  const [isVisibleText, textRef] = useVisibility();
  const [isVisibleGrid, gridRef] = useVisibility();

  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [activeTab, setActiveTab] = useState(datasource.children.results[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const id = props.params.RenderingIdentifier;

  return (
    <section
      className={`py-24 px-4 ${props.params.styles}`}
      id={id ? id : undefined}
      data-class-change
    >
      <div className="container mx-auto">
        <div className={`fade-section fade-up ${isVisibleText ? 'is-visible' : ''}`} ref={textRef}>
          <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-medium">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
        </div>
        <div
          className={`grid md:grid-cols-3 items-center gap-x-4 gap-y-12 mt-4 fade-section fade-up ${
            isVisibleGrid ? 'is-visible' : ''
          }`}
          ref={gridRef}
        >
          <Accordion
            type="single"
            defaultValue={datasource.children.results[0].id}
            className="grid my-8"
          >
            {datasource.children.results.map((feature) => (
              <AccordionItem
                value={feature.id}
                key={feature.id}
                onClick={() => handleTabClick(feature.id)}
                className={`relative py-4 ms-12`}
              >
                <span
                  className={`absolute top-0 bottom-0 -left-12 w-[2px] bg-black transition-all duration-300 ${
                    activeTab === feature.id ? 'opacity-100' : 'opacity-0'
                  }`}
                ></span>
                <AccordionTrigger className="cursor-pointer hover:no-underline">
                  <h3 className="text-xl font-semibold mb-2">
                    <ContentSdkText field={feature.featureHeading?.jsonValue} />
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">
                    <ContentSdkText field={feature.featureDescription?.jsonValue} />
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="relative aspect-3/2 md:col-span-2">
            {datasource.children.results.map((feature) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  activeTab !== feature.id ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ContentSdkImage
                  field={feature.featureImage?.jsonValue}
                  width={1000}
                  height={1000}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection22 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [first, ...rest] = datasource.children.results;
  const id = props.params.RenderingIdentifier;

  const [isVisibleFirst, firstRef] = useVisibility();
  const [isVisibleRest, restRefs] = useMultipleVisibility(rest.length);

  return (
    <section
      className={`py-24 px-4 ${props.params.styles}`}
      id={id ? id : undefined}
      data-class-change
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-y-8 gap-x-4">
          {first && (
            <div
              className={`md:col-span-3 grid md:grid-cols-2 gap-8 p-2 rounded-3xl bg-white shadow-md transition-all hover:shadow-lg fade-section fade-up ${
                isVisibleFirst ? 'is-visible' : ''
              }`}
              ref={firstRef}
            >
              <div className="flex flex-col p-4">
                <h6 className="font-semibold text-xs mb-auto">
                  <ContentSdkText field={first.featureTagLine?.jsonValue} />
                </h6>
                <h3 className="text-3xl font-medium mb-6 mt-4">
                  <ContentSdkText field={first.featureHeading?.jsonValue} />
                </h3>
                <p className="text-base mb-4">
                  <ContentSdkText field={first.featureDescription?.jsonValue} />
                </p>
                <div className="mt-auto">
                  <Button asChild={true} variant={'secondary'}>
                    <ContentSdkLink field={first.featureLink1.jsonValue} prefetch={false} />
                  </Button>
                  <Button asChild={true} variant={'link'}>
                    <ContentSdkLink field={first.featureLink2.jsonValue} prefetch={false} />
                  </Button>
                </div>
              </div>
              <ContentSdkImage
                field={first.featureImage?.jsonValue}
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          )}
          {!!rest.length &&
            rest.map((feature, index) => (
              <FeatureBox
                feature={feature}
                key={feature.id}
                type="MSCardSmall"
                ref={(el) => {
                  restRefs[index] = el;
                }}
                className={`fade-section fade-up ${isVisibleRest[index] ? 'is-visible' : ''}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection23 = (props: FeatureSectionProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;

  const [isVisibleText, textRef] = useVisibility();
  const [isVisibleGrid, gridRef] = useVisibility();

  return (
    <section className={`py-24 ${props.params.styles}`} id={id ? id : undefined} data-class-change>
      <div className="container px-4 pb-4 mx-auto">
        <div className="flex flex-wrap justify-between">
          <div
            className={`fade-section fade-up ${isVisibleText ? 'is-visible' : ''}`}
            ref={textRef}
          >
            <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-medium mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
          </div>
          <div>
            <Button asChild={true} variant={'outline'}>
              <ContentSdkLink field={datasource.link1.jsonValue} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={gridRef}>
        <Carousel className="container mx-auto">
          <CarouselContent className="px-4" fullWidth>
            {datasource.children.results.map((feature, index) => {
              return (
                <CarouselItem key={feature.id} className="md:basis-1/2 lg:basis-1/3">
                  <FeatureBox
                    feature={feature}
                    key={feature.id}
                    type="MSCardSmall"
                    className={`h-full fade-section fade-side ${isVisibleGrid ? 'is-visible' : ''}`}
                    style={
                      !isPageEditing
                        ? {
                            transform: `translateX(${index * 200}px)`,
                          }
                        : {}
                    }
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="static flex items-center gap-2 px-4 pt-8">
            <CarouselPrevious className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" />
            <CarouselNext className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const FeaturesSection24 = (props: FeatureSectionProps): JSX.Element => {
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const id = props.params.RenderingIdentifier;

  const [isVisibleText, textRef] = useVisibility();
  const [isVisibleGrid, gridRef] = useVisibility();

  return (
    <section className={`py-24 ${props.params.styles}`} id={id ? id : undefined} data-class-change>
      <div className="container px-4 pb-4 mx-auto">
        <div className="flex flex-wrap justify-between">
          <div
            className={`fade-section fade-up ${isVisibleText ? 'is-visible' : ''}`}
            ref={textRef}
          >
            <h6 className="text-xs font-semibold tracking-widest uppercase mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-medium mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
          </div>
          <div>
            <Button asChild={true} variant={'outline'}>
              <ContentSdkLink field={datasource.link1.jsonValue} prefetch={false} />
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden" ref={gridRef}>
        <Carousel className="container mx-auto">
          <CarouselContent className="px-4" fullWidth>
            {datasource.children.results.map((feature, index) => (
              <CarouselItem key={feature.id} className="md:basis-1/2 lg:basis-1/3">
                <FeatureBox
                  feature={feature}
                  key={feature.id}
                  type="MSCardSmallIcon"
                  className={`h-full fade-section fade-side ${isVisibleGrid ? 'is-visible' : ''}`}
                  style={
                    !isPageEditing
                      ? {
                          transform: `translateX(${index * 200}px)`,
                        }
                      : {}
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="static flex items-center gap-2 px-4 pt-8">
            <CarouselPrevious className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" />
            <CarouselNext className="static inset-0 translate-0 border-black w-12 h-12 bg-transparent hover:bg-transparent hover:text-black" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export const FeaturesSection25 = (props: FeatureSectionProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto bg-[#FFF8F3]">
        <div className="grid lg:grid-cols-3 gap-x-20 gap-y-4 px-16 py-12">
          <div className="max-w-[20rem]">
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-3xl font-semibold">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg mb-8">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <ContentSdkLink
              field={datasource.link1.jsonValue}
              className="flex items-center gap-2 text-base text-primary font-medium"
              prefetch={false}
            >
              {datasource.link1.jsonValue.value.text}
              <FontAwesomeIcon icon={faChevronRight} width={16} height={16} />
            </ContentSdkLink>
          </div>
          <div className="md:col-span-2">
            <ul className="grid md:grid-cols-4 gap-x-8 gap-y-12 my-8">
              {datasource.children.results.map((feature) => (
                <li className={`flex flex-col items-center gap-4`} key={feature.id}>
                  <ContentSdkImage field={feature.featureIcon?.jsonValue} width={30} height={30} />
                  <h6 className="text-sm font-semibold text-center">
                    <ContentSdkText field={feature.featureHeading.jsonValue} />
                  </h6>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
