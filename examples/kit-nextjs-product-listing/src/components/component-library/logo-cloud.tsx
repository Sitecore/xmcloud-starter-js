import { ArrowRight } from 'lucide-react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { Button } from 'shadcd/components/ui/button';

import type { JSX } from 'react';
import type { LogoCloudProps } from './logo-cloud.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';

export const Default = (props: LogoCloudProps): JSX.Element => {
  const { page } = props;
  const { isEditing } = page.mode;
  const datasource = getDatasource(props.fields);

  if (!datasource) {
    return <></>;
  }

  const titleField = getFieldValue(datasource.title);
  const bodyTextField = getFieldValue(datasource.bodyText);
  const link1Field = getFieldValue(datasource.link1);
  const link2Field = getFieldValue(datasource.link2);
  const items = datasource.children?.results ?? [];

  return (
    <section
      className={`w-full py-12 md:py-24 lg:py-32 border rounded-lg ${props.params.styles}`}
      data-class-change
    >
      <div className="container mx-auto px-8 md:px-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tigher sm:text-4xl md:text=6xl">
              <ContentSdkText field={titleField} />
            </h2>
            <div className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              <ContentSdkRichText field={bodyTextField} />
            </div>
            <div className="flex flex-wrap gap-4">
              {link1Field && (link1Field.value?.href || isEditing) ? (
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild={true}>
                  <ContentSdkLink field={link1Field} prefetch={false} />
                </Button>
              ) : null}
              {link2Field && (link2Field.value?.href || isEditing) ? (
                <Button variant="link" className="gap-1 group" asChild={true}>
                  <>
                    <ContentSdkLink field={link2Field} prefetch={false} />
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {items.map((item, index) => {
              return (
                <div key={index} className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <ContentSdkImage
                      field={getFieldValue(item.logoImage)}
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
