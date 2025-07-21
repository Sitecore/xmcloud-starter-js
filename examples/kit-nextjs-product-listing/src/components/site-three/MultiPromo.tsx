import { useMemo } from 'react';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'types/igql';
import { NoDataFallback } from '@/utils/NoDataFallback';

interface Fields {
  data: {
    datasource: {
      title: IGQLTextField;
      description: IGQLTextField;
      children: {
        results: SimplePromoFields[];
      };
    };
  };
}

interface SimplePromoFields {
  id: string;
  heading: IGQLTextField;
  description: IGQLTextField;
  image: IGQLImageField;
  link: IGQLLinkField;
}

type MultiPromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type PromoItemProps = SimplePromoFields & {
  isHorizontal?: boolean;
};

const PromoItem = ({ isHorizontal, ...promo }: PromoItemProps) => {
  return (
    <div className={`grid gap-8 ${isHorizontal ? 'lg:grid-cols-[1fr_2fr]' : ''}`}>
      <ContentSdkImage
        field={promo.image?.jsonValue}
        className="w-full h-full aspect-square object-cover shadow-2xl"
      />
      <div>
        <h4 className="text-xl lg:text-2xl mb-2 uppercase">
          <ContentSdkText field={promo.heading?.jsonValue} />
        </h4>
        <p className="lg:text-lg mb-2">
          <ContentSdkText field={promo.description?.jsonValue} />
        </p>
        <ContentSdkLink field={promo.link?.jsonValue} className="btn btn-ghost" />
      </div>
    </div>
  );
};

const parentBasedGridClasses =
  'grid lg:[.multipromo-2-3_&]:grid-cols-[2fr_3fr] lg:[.multipromo-3-2_&]:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] gap-14';
const parentBasedGridItemClasses =
  '[.multipromo-centered_&]:items-center [.bg-gradient_&]:text-white items-start';

export const Default = (props: MultiPromoProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section className={`relative ${props.params.styles}`} data-class-change>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
            <ContentSdkText field={datasource.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource.description?.jsonValue} />
          </p>
        </div>
        <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-12`}>
          {datasource.children.results.map((promo) => {
            return <PromoItem key={promo.id} {...promo} />;
          })}
        </div>
      </div>
    </section>
  );
};

export const Stacked = (props: MultiPromoProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section className={`relative ${props.params.styles} overflow-hidden`} data-class-change>
      <span className="absolute top-1/3 left-1/3 [.multipromo-3-2_&]:-left-1/3 w-screen h-64 bg-primary opacity-50 blur-[400px] -rotate-15 [.multipromo-3-2_&]:rotate-15 z-0"></span>
      <div className="relative container mx-auto px-4 py-16 z-10">
        <div className={`${parentBasedGridClasses}`}>
          <div className="lg:[.multipromo-3-2_&]:col-start-1 lg:[.multipromo-2-3_&]:col-start-2 lg:col-start-2 [.multipromo-2-3_&]:text-right">
            <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
              <ContentSdkText field={datasource.title?.jsonValue} />
            </h2>
            <p className="text-lg">
              <ContentSdkText field={datasource.description?.jsonValue} />
            </p>
          </div>
        </div>
        <div className={`${parentBasedGridClasses} ${parentBasedGridItemClasses} mt-30`}>
          {datasource.children.results.map((promo) => {
            return (
              <div
                key={promo.id}
                className="lg:odd:-mt-8 lg:[.multipromo-3-2_&]:even:-mt-8 lg:[.multipromo-3-2_&]:odd:mt-0"
              >
                <PromoItem {...promo} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const SingleColumn = (props: MultiPromoProps) => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);

  if (!datasource) {
    return <NoDataFallback componentName="MultiPromo" />;
  }

  return (
    <section className={`relative ${props.params.styles}`} data-class-change>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mb-16">
          <h2 className="mb-6 text-2xl lg:text-5xl uppercase">
            <ContentSdkText field={datasource.title?.jsonValue} />
          </h2>
          <p className="text-lg">
            <ContentSdkText field={datasource.description?.jsonValue} />
          </p>
        </div>
        <div className="grid gap-14">
          {datasource.children.results.map((promo) => {
            return <PromoItem key={promo.id} {...promo} isHorizontal />;
          })}
        </div>
      </div>
    </section>
  );
};
