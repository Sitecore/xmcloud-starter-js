import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';
import { Button } from 'shadcd/components/ui/button';
import { useMemo, type JSX } from 'react';

interface Fields {
  data: {
    datasource: {
      children: {
        results: StatisticFields[];
      };
      heading: IGQLTextField;
      tagLine: IGQLTextField;
      body: IGQLRichTextField;
      image1: IGQLImageField;
      image2: IGQLImageField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

interface StatisticFields {
  id: string;
  statValue: IGQLTextField;
  statHeading: IGQLTextField;
  statBody: IGQLTextField;
}

type StatsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type StatBoxProps = {
  stat: StatisticFields;
  type: 'simple' | 'bordered' | 'boxed' | 'boxedSimple';
  isSmall?: boolean;
  className?: string;
};

type StatSectionButtonsProps = {
  link1: IGQLLinkField;
  link2: IGQLLinkField;
};

const StatBox = (props: StatBoxProps): JSX.Element => {
  switch (props.type) {
    case 'bordered':
      return (
        <div className={`border-s ps-8 ${props.className}`}>
          <h4 className={`${props.isSmall ? 'text-6xl' : 'text-7xl'} font-bold mb-6`}>
            <ContentSdkText field={props.stat.statValue?.jsonValue} />
          </h4>
          <h3 className="text-xl font-bold">
            <ContentSdkText field={props.stat.statHeading?.jsonValue} />
          </h3>
          <p>
            <ContentSdkText field={props.stat.statBody?.jsonValue} />
          </p>
        </div>
      );
    case 'boxed':
      return (
        <div className={`border p-8 flex flex-col ${props.className}`}>
          <h3 className="text-xl font-bold mb-12">
            <ContentSdkText field={props.stat.statHeading?.jsonValue} />
          </h3>
          <h4
            className={`${
              props.isSmall ? 'text-6xl' : 'text-7xl'
            } font-bold pb-4 mb-4 text-right border-b mt-auto`}
          >
            <ContentSdkText field={props.stat.statValue?.jsonValue} />
          </h4>
          <p className="text-right">
            <ContentSdkText field={props.stat.statBody?.jsonValue} />
          </p>
        </div>
      );
    case 'boxedSimple':
      return (
        <div className={`border p-8 flex flex-col ${props.className}`}>
          <h4 className={`${props.isSmall ? 'text-6xl' : 'text-7xl'} font-bold mb-12`}>
            <ContentSdkText field={props.stat.statValue?.jsonValue} />
          </h4>
          <h3 className="text-xl font-bold mt-auto">
            <ContentSdkText field={props.stat.statHeading?.jsonValue} />
          </h3>
          <p>
            <ContentSdkText field={props.stat.statBody?.jsonValue} />
          </p>
        </div>
      );
    default:
      return (
        <div className={props.className}>
          <h4 className={`${props.isSmall ? 'text-6xl' : 'text-7xl'} font-bold mb-6`}>
            <ContentSdkText field={props.stat.statValue?.jsonValue} />
          </h4>
          <h3 className="text-xl font-bold">
            <ContentSdkText field={props.stat.statHeading?.jsonValue} />
          </h3>
          <p>
            <ContentSdkText field={props.stat.statBody?.jsonValue} />
          </p>
        </div>
      );
  }
};

const StatSectionButtons = (props: StatSectionButtonsProps): JSX.Element => (
  <div className="mt-4">
    <Button asChild={true}>
      <ContentSdkLink field={props.link1.jsonValue} prefetch={false} />
    </Button>
    <Button variant="ghost" asChild={true}>
      <ContentSdkLink field={props.link2.jsonValue} prefetch={false} />
    </Button>
  </div>
);

export const Default = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4 mb-20">
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
            <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
          {datasource.children.results.map((stat) => (
            <StatBox key={stat.id} stat={stat} type="bordered" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const StatsSection1 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`relative py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="absolute inset-0 h-full w-full z-1">
        <ContentSdkImage
          field={datasource.image1.jsonValue}
          width={800}
          height={800}
          className="h-full w-full object-cover brightness-50"
        />
      </div>
      <div className="relative container mx-auto text-white z-2">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4 mb-20">
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
            <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
          {datasource.children.results.map((stat) => (
            <StatBox key={stat.id} stat={stat} type="bordered" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const StatsSection2 = (props: StatsProps): JSX.Element => {
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
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 my-12">
          {datasource.children.results.map((stat) => (
            <StatBox key={stat.id} stat={stat} type="boxed" />
          ))}
        </div>
        <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
      </div>
    </section>
  );
};

export const StatsSection3 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  const statGridLayout = useMemo(
    () => (datasource.children.results.length > 2 ? 'md:grid-cols-2' : ''),
    [datasource.children.results.length]
  );

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
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
            <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div className={`grid ${statGridLayout} gap-x-8 gap-y-12`}>
            {datasource.children.results.map((stat) => (
              <StatBox key={stat.id} stat={stat} type="bordered" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatsSection4 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  const statGridLayout = useMemo(
    () => (datasource.children.results.length > 2 ? 'md:grid-cols-2' : ''),
    [datasource.children.results.length]
  );

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-20 items-start">
          <div className="md:col-span-2">
            <h6 className="font-semibold mb-4">
              <ContentSdkText field={datasource.tagLine?.jsonValue} />
            </h6>
            <h2 className="text-5xl font-bold mb-6">
              <ContentSdkText field={datasource.heading?.jsonValue} />
            </h2>
            <div className="text-lg">
              <ContentSdkRichText field={datasource.body?.jsonValue} />
            </div>
            <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
          <div className={`grid ${statGridLayout} gap-x-8 gap-y-12 col-span-3`}>
            {datasource.children.results.map((stat) => (
              <StatBox key={stat.id} stat={stat} type="boxedSimple" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatsSection5 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>
        <div className="flex flex-col md:flex-row gap-x-20 gap-y-4">
          <div className="relative basis-2/3 shrink pt-[70%] md:pt-0">
            <ContentSdkImage
              field={datasource.image1.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col basis-1/3 grow py-8 gap-16">
            {datasource.children.results.map((stat) => (
              <StatBox key={stat.id} stat={stat} type="simple" isSmall />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatsSection6 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl text-center mb-20 mx-auto">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative basis-1/3 shrink pt-[70%] md:pt-0">
            <ContentSdkImage
              field={datasource.image1.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col basis-1/3 grow gap-8">
            {datasource.children.results.map((stat) => (
              <StatBox key={stat.id} stat={stat} type="boxed" isSmall />
            ))}
          </div>
          <div className="relative basis-1/3 shrink pt-[70%] md:pt-0">
            <ContentSdkImage
              field={datasource.image2.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatsSection7 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="max-w-3xl mb-20">
          <h6 className="font-semibold mb-4">
            <ContentSdkText field={datasource.tagLine?.jsonValue} />
          </h6>
          <h2 className="text-5xl font-bold mb-6">
            <ContentSdkText field={datasource.heading?.jsonValue} />
          </h2>
          <div className="text-lg">
            <ContentSdkRichText field={datasource.body?.jsonValue} />
          </div>
          <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative basis-2/3 pt-[70%] md:pt-0">
            <ContentSdkImage
              field={datasource.image1.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col basis-1/3 gap-8">
            {datasource.children.results.map((stat) => (
              <StatBox key={stat.id} stat={stat} type="boxedSimple" isSmall />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatsSection8 = (props: StatsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  return (
    <section className={`py-24 px-4 ${props.params.styles}`} data-class-change>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-4 mb-20">
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
            <StatSectionButtons link1={datasource.link1} link2={datasource.link2} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-8">
          <div className="relative row-start-2 pt-[70%] md:row-start-2 md:col-start-2 lg:row-start-auto lg:col-start-2 lg:pt-0">
            <ContentSdkImage
              field={datasource.image1.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="relative row-start-4 pt-[70%] md:row-start-3 md:col-start-1 lg:row-start-2 lg:col-start-3 lg:pt-0">
            <ContentSdkImage
              field={datasource.image2.jsonValue}
              width={800}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {datasource.children.results.map((stat, i) => (
            <StatBox
              key={stat.id}
              stat={stat}
              type="boxed"
              className={i === 0 ? 'md:col-start-1 md:row-start-1 md:row-span-2' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
