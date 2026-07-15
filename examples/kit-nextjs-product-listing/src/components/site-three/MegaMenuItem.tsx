import {
  Text as ContentSdkText,
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import componentMap from '.sitecore/component-map';
import { MegaMenuToggle, MegaMenuContent, MegaMenuBackButton } from './MegaMenuItemWrapper';
import type { MegaMenuItemProps } from './mega-menu-item.props';

const DICTIONARY_KEYS = {
  EXPLORE_BUTTON_LABEL: 'Explore',
  BACK_BUTTON_LABEL: 'Back',
};

export const Default = (props: MegaMenuItemProps) => {
  const { page } = props;
  const isPageEditing = page?.mode?.isEditing;
  const t = useTranslations();
  const featuredProduct = props.fields?.FeaturedProduct;
  const menuId = `mega-menu-${props.params?.DynamicPlaceholderId || 'default'}`;

  if (props.params?.isSimpleLink) {
    return (
      <li
        className={`font-(family-name:--font-accent) font-medium ${props.params?.styles}`}
        data-class-change
      >
        {isPageEditing ? (
          <ContentSdkLink
            field={props.fields?.Link}
            className="inline-block p-4 font-[inherit] whitespace-nowrap cursor-pointer"
          />
        ) : (
          props.fields?.Link?.value?.href && (
            <Link
              href={props.fields.Link.value.href}
              className="inline-block p-4 font-[inherit] whitespace-nowrap cursor-pointer"
            >
              {props.fields.Link.value.text}
            </Link>
          )
        )}
      </li>
    );
  }

  return (
    <MegaMenuToggle
      menuId={menuId}
      className={`font-(family-name:--font-accent) font-medium ${props.params?.styles}`}
      trigger={<ContentSdkText field={props.fields?.Title} />}
    >
      <MegaMenuContent menuId={menuId}>
        <div className="grid lg:grid-cols-[2fr_2fr_3fr] gap-8 items-start pt-18 pl-8 pb-8 lg:pt-8 lg:pb-0 text-left">
          <MegaMenuBackButton menuId={menuId}>
            <ArrowLeft className="w-6 h-6" />
            {t(DICTIONARY_KEYS.BACK_BUTTON_LABEL) || 'Back'}
          </MegaMenuBackButton>

          <div className="text-2xl **:font-(family-name:--font-heading) uppercase pb-8">
            <AppPlaceholder
              name={`mega-menu-item-primary-links-${props.params?.DynamicPlaceholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
            />
          </div>
          <div className="flex flex-col gap-6 pb-8">
            <AppPlaceholder
              name={`mega-menu-item-secondary-links-${props.params?.DynamicPlaceholderId}`}
              rendering={props.rendering}
              page={props.page}
              componentMap={componentMap}
            />
          </div>

          {featuredProduct && featuredProduct.fields && featuredProduct.fields.FeaturedImage && (
            <div className="relative self-end lg:justify-self-end max-w-lg pb-12 lg:pb-0 lg:pl-[20%]">
              <div className="aspect-square">
                <ContentSdkImage
                  field={featuredProduct.fields.FeaturedImage}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 lg:bottom-8 left-0 p-4 text-center bg-background shadow-lg">
                <h3 className="mb-4 text-sm">
                  <ContentSdkText field={featuredProduct.fields.ProductName} />
                </h3>
                <Link href={featuredProduct.url} className="btn btn-primary btn-sharp">
                  {t(DICTIONARY_KEYS.EXPLORE_BUTTON_LABEL) || 'Explore'}
                  {featuredProduct.fields.ProductName?.value}
                </Link>
              </div>
            </div>
          )}
        </div>
      </MegaMenuContent>
    </MegaMenuToggle>
  );
};
