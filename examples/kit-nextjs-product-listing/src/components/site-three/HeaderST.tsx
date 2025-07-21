'use client';

import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Link as ContentSdkLink,
  NextImage as ContentSdkImage,
  LinkField,
  ImageField,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { MiniCart } from './non-sitecore/MiniCart';
import { SearchBox } from './non-sitecore/SearchBox';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Logo: ImageField;
  SupportLink: LinkField;
  SearchLink: LinkField;
  CartLink: LinkField;
}

type HeaderSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: HeaderSTProps) => {
  const { isVisible: isMobileMenuVisible, setIsVisible: setIsMobileMenuVisible } =
    useToggleWithClickOutside<HTMLDivElement>(false);

  return (
    <section className={`${props.params.styles}`} data-class-change>
      <div className="flex justify-between items-start">
        <Link
          href="/"
          className="relative flex justify-center items-center grow-0 shrink-0 w-24 lg:w-32 h-24 lg:h-32 p-4 lg:p-6 bg-primary z-100"
          prefetch={false}
        >
          <ContentSdkImage field={props.fields.Logo} className="w-full h-full object-contain" />
        </Link>

        <div className="relative flex [.partial-editing-mode_&]:flex-col-reverse justify-between items-start gap-10 grow max-w-7xl lg:px-4 bg-background">
          <div
            className={`${
              isMobileMenuVisible
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            } lg:!opacity-100 lg:!pointer-events-auto
              fixed lg:static top-14 left-0 right-0
              flex flex-col lg:flex-row items-center justify-center
              h-[calc(100vh-3.5rem)] lg:h-auto p-4 lg:p-0
              overflow-auto bg-background transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col my-auto lg:my-0 lg:flex-row lg:[.partial-editing-mode_&]:!flex-col text-center lg:text-left bg-background">
              <Placeholder
                name={`header-navigation-${props.params.DynamicPlaceholderId}`}
                rendering={props.rendering}
              />
            </ul>
            <hr className="lg:hidden w-full border-border" />
            <ul className="lg:hidden">
              <li>
                <ContentSdkLink
                  field={props.fields.SupportLink}
                  prefetch={false}
                  className="block p-4 font-(family-name:--font-accent) font-medium"
                />
              </li>
            </ul>
          </div>
          <div className="basis-full lg:basis-auto lg:ml-auto">
            <ul className="flex">
              <li className="hidden lg:block">
                <ContentSdkLink
                  field={props.fields.SupportLink}
                  prefetch={false}
                  className="block p-4 font-(family-name:--font-accent) font-medium"
                />
              </li>
              <li className="mr-auto lg:mr-0">
                {props.params.showSearchBox ? (
                  <SearchBox searchLink={props.fields.SearchLink} />
                ) : (
                  <ContentSdkLink
                    field={props.fields.SearchLink}
                    prefetch={false}
                    className="block p-4 font-(family-name:--font-accent) font-medium"
                  />
                )}
              </li>
              <li
                className="lg:hidden flex justify-center items-center p-4 cursor-pointer"
                onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
              >
                <span className="relative w-5 h-4">
                  <span
                    className={`absolute left-0 top-0 w-full h-0.5 bg-current origin-top-right transition-transform duration-300 ease-in-out ${
                      isMobileMenuVisible ? '-rotate-47' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      isMobileMenuVisible ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`absolute left-0 bottom-0 w-full h-0.5 bg-current origin-bottom-right transition-transform duration-300 ease-in-out ${
                      isMobileMenuVisible ? 'rotate-47' : ''
                    }`}
                  />
                </span>
              </li>
              <li>
                {props.params.showMiniCart ? (
                  <MiniCart cartLink={props.fields.CartLink} />
                ) : (
                  <ContentSdkLink
                    field={props.fields.CartLink}
                    prefetch={false}
                    className="block p-4"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />
                  </ContentSdkLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
