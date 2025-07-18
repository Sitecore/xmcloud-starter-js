'use client';

import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import {
  Text as ContentSdkText,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  LinkField,
  Placeholder,
  Field,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from 'next-localization';
import Link from 'next/link';

interface Fields {
  Title: Field<string>;
  Link: LinkField;
  FeaturedProduct: {
    id: string;
    url: string;
    fields: {
      ProductName: Field<string>;
      FeaturedImage: ImageField;
    };
  };
}

type MegaMenuItemProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

const DICTIONARY_KEYS = {
  EXPLORE_BUTTON_LABEL: 'Explore',
  BACK_BUTTON_LABEL: 'Back',
};

export const Default = (props: MegaMenuItemProps) => {
  const { t } = useI18n();

  const {
    isVisible: isSubmenuVisible,
    setIsVisible: setIsSubmenuVisible,
    ref: menuRef,
  } = useToggleWithClickOutside<HTMLLIElement>(false);

  const featuredProduct = props.fields.FeaturedProduct;

  return (
    <li
      ref={menuRef}
      className={`font-(family-name:--font-accent) font-medium ${props.params.styles}`}
      data-class-change
    >
      {props.params.isSimpleLink ? (
        <ContentSdkLink
          field={props.fields.Link}
          className="inline-block p-4 font-[inherit] whitespace-nowrap cursor-pointer"
        />
      ) : (
        <>
          <span
            className="inline-block p-4 font-[inherit] whitespace-nowrap cursor-pointer"
            onClick={() => setIsSubmenuVisible(!isSubmenuVisible)}
          >
            <ContentSdkText field={props.fields.Title} />
          </span>
          <div
            className={`fixed lg:absolute top-14 left-0 right-0 lg:top-full lg:left-0 lg:right-0
                    h-[calc(100vh-3.5rem)] lg:h-auto overflow-auto
                    ${
                      isSubmenuVisible
                        ? 'opacity-100 translate-x-0 lg:translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-x-full lg:translate-x-0 lg:translate-y-2 pointer-events-none'
                    }
                    bg-background transition-all duration-300 ease-in-out
                    [.partial-editing-mode_&]:!static [.partial-editing-mode_&]:!opacity-100 [.partial-editing-mode_&]:!translate-0 [.partial-editing-mode_&]:!pointer-events-auto`}
          >
            <div className="grid lg:grid-cols-[2fr_2fr_3fr] gap-8 items-start pt-18 pl-8 pb-8 lg:pt-8 lg:pb-0 text-left">
              <div
                className="lg:hidden flex gap-4 items-center text-sm text-secondary-foreground **:font-(family-name:--font-heading) uppercase cursor-pointer"
                onClick={() => setIsSubmenuVisible(false)}
              >
                <ArrowLeft className="w-6 h-6" />
                {t(DICTIONARY_KEYS.BACK_BUTTON_LABEL) || 'Back'}
              </div>
              <div className="text-2xl **:font-(family-name:--font-heading) uppercase pb-8">
                <Placeholder
                  name={`mega-menu-item-primary-links-${props.params.DynamicPlaceholderId}`}
                  rendering={props.rendering}
                />
              </div>
              <div className="flex flex-col gap-6 pb-8">
                <Placeholder
                  name={`mega-menu-item-secondary-links-${props.params.DynamicPlaceholderId}`}
                  rendering={props.rendering}
                />
              </div>

              {featuredProduct && (
                <div className="relative self-end lg:justify-self-end max-w-lg pb-12 lg:pb-0 lg:pl-[20%]">
                  <div className="aspect-square">
                    <ContentSdkImage
                      field={featuredProduct.fields.FeaturedImage}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 lg:bottom-8 left-0 p-4 text-center bg-background shadow-lg">
                    <h5 className="mb-4 text-sm">
                      <ContentSdkText field={featuredProduct.fields.ProductName} />
                    </h5>
                    <Link href={featuredProduct.url} className="btn btn-primary btn-sharp">
                      {t(DICTIONARY_KEYS.EXPLORE_BUTTON_LABEL) || 'Explore'}
                      {featuredProduct.fields.ProductName.value}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </li>
  );
};
