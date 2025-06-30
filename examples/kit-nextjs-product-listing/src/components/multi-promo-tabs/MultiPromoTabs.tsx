/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useId } from 'react';
import { useSitecoreContext, Text } from '@sitecore-content-sdk/nextjs';
import { AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { MultiPromoTabsProps } from './multi-promo-tabs.props';
import { Default as PromoTab } from './MultiPromoTab.dev';

export const Default: React.FC<MultiPromoTabsProps> = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const { fields } = props;

  const { sitecoreContext } = useSitecoreContext();

  const id = useId();

  if (fields) {
    const tabItems = fields.data.datasource.children?.results ?? [];

    return (
      <div className="multi-promo-tabs @container bg-primary @md:p-12 @md:my-16 my-8 w-full group-[.is-inset]:px-4 sm:group-[.is-inset]:px-0">
        <Text
          tag="h2"
          field={fields.data.datasource.title?.jsonValue}
          className="text-box-trim-both-baseline text-primary-foreground @md:text-6xl font-heading border-accent @sm:text-5xl -ml-1 mb-8 max-w-[20ch] text-pretty text-4xl font-normal leading-[1.1333] tracking-tighter antialiased md:max-w-[17.5ch]"
        />

        <div className="@md:hidden flex flex-col">
          {fields.data.datasource.droplistLabel?.jsonValue && (
            <Text
              htmlFor={id}
              tag="label"
              className="text-primary-foreground font-body mb-2 block text-base font-normal"
              field={fields.data.datasource.droplistLabel?.jsonValue}
            />
          )}
          <Select
            onValueChange={(value: any) => setActiveTab(Number(value))}
            defaultValue={activeTab.toString()}
          >
            <SelectTrigger
              id={id}
              className="text-primary-foreground  w-full  border-0 bg-black/20"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item, index) => (
                <SelectItem key={index} value={index.toString()} className="capitalize">
                  {item.title?.jsonValue.value || `Tab ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs
          value={activeTab.toString()}
          onValueChange={(value) => setActiveTab(Number(value))}
          className="w-full"
        >
          <TabsList className="@md:flex hidden justify-start gap-2 border-0 bg-transparent">
            {tabItems.map((item, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="font-body letter-spacing-[-0.8] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:hover:bg-accent/90 hover:bg-accent hover:text-accent-foreground border-accent rounded-md border bg-transparent px-4 py-2 text-base font-normal text-white transition-colors"
              >
                <Text field={item.title?.jsonValue} />
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {tabItems.map((item, index) => (
              <TabsContent key={index} value={index.toString()}>
                <PromoTab {...item} isEditMode={sitecoreContext?.pageEditing ?? false} />
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    );
  }

  return <NoDataFallback componentName="Tabbed Multi-Promo" />;
};
