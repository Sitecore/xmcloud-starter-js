import { ArrowRight } from 'lucide-react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { Button } from 'shadcd/components/ui/button';
import { IGQLImageField, IGQLLinkField, IGQLRichTextField, IGQLTextField } from 'src/types/igql';

import type { JSX } from 'react';

interface Fields {
  data: {
    datasource: {
      children: {
        results: LogoFields[];
      };
      title: IGQLTextField;
      bodyText: IGQLRichTextField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

interface LogoFields {
  logoImage: IGQLImageField;
  logoLink: IGQLLinkField;
}

type LogoCloudProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: LogoCloudProps): JSX.Element => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;

  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32 border rounded-lg ${props.params.styles}`}
      data-class-change
    >
      <div className="container mx-auto px-8 md:px-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tigher sm:text-4xl md:text=6xl">
              <ContentSdkText field={props.fields.data.datasource.title?.jsonValue} />
            </h2>
            <div className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              <ContentSdkRichText field={props.fields.data.datasource.bodyText?.jsonValue} />
            </div>
            <div className="flex flex-wrap gap-4">
              {props.fields.data.datasource.link1?.jsonValue?.value?.href || isEditing ? (
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild={true}>
                  <ContentSdkLink
                    field={props.fields.data.datasource.link1?.jsonValue}
                    prefetch={false}
                  />
                </Button>
              ) : null}
              {props.fields.data.datasource.link2?.jsonValue?.value?.href || isEditing ? (
                <Button variant="link" className="gap-1 group" asChild={true}>
                  <>
                    <ContentSdkLink
                      field={props.fields.data.datasource.link2?.jsonValue}
                      prefetch={false}
                    />
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {props.fields.data.datasource.children.results.map((item, index) => {
              return (
                <div key={index} className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <ContentSdkImage
                      field={item.logoImage.jsonValue}
                      className="max-h-12 w-auto h-12"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
