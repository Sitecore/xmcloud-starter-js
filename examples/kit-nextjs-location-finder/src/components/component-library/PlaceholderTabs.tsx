import {
  ComponentRendering,
  Text as ContentSdkText,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { useMemo, type JSX } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'shadcd/components/ui/tabs';
import { IGQLTextField } from 'types/igql';

type Fields = {
  data: {
    datasource: {
      children: {
        results: {
          id: string;
          title: IGQLTextField;
        }[];
      };
    };
  };
};

type PlaceholderTabsProps = {
  rendering: ComponentRendering;
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: PlaceholderTabsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const phSuffixes = ['one', 'two', 'three', 'four', 'five'];

  const tabs = datasource.children.results.slice(0, phSuffixes.length);

  const tabsTriggerActiveStyles =
    'data-[state=active]:pt-3 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-b-white data-[state=active]:z-20';
  const tabsTriggerInactiveStyles =
    'data-[state=inactive]:bg-gray-200 data-[state=inactive]:border-b-2 data-[state=inactive]:border-t-gray-300 data-[state=inactive]:border-s-gray-300 data-[state=inactive]:border-e-gray-300';

  return (
    <section className={`px-4 ${props.params.styles || ''}`} data-component="tabs">
      <div className="container mx-auto">
        {!!tabs.length && (
          <Tabs defaultValue={tabs[0].id} className="relative w-full">
            <div className="sticky bg-white top-0 w-full flex justify-center pt-10 border-b-2 z-10">
              <TabsList className="relative top-[2px] w-auto self-center flex flex-row justify-center items-end">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`relative basis-auto px-4 py-2 -ml-[2px] first:ml-0 border-2 !border-e-2 rounded-tr-sm rounded-tl-sm text-base transition-all hover:pt-3 ${tabsTriggerActiveStyles} ${tabsTriggerInactiveStyles}`}
                  >
                    <ContentSdkText field={tab.title.jsonValue} />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab, index) => (
              <TabsContent key={tab.id} value={tab.id} className="relative border-0 p-0">
                <Placeholder
                  name={`tab-content-${phSuffixes[index]}-${props.params.DynamicPlaceholderId}`}
                  rendering={props.rendering}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};
