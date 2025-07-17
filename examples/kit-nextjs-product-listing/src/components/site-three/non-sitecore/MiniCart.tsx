'use client';

import { Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'next-localization';

const DICTIONARY_KEYS = {
  GO_TO_CART_LABEL: 'Go_To_Cart',
  MINI_CART_LABEL: 'Your_Cart',
  CART_EMPTY_LABEL: 'Cart_Empty',
};

export const MiniCart = ({ cartLink }: { cartLink: LinkField }) => {
  const { t } = useI18n();
  const { isVisible, setIsVisible, ref } = useToggleWithClickOutside<HTMLDivElement>(false);

  return (
    <div ref={ref}>
      <ContentSdkLink
        field={cartLink}
        prefetch={false}
        className="block p-4"
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      >
        <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />
      </ContentSdkLink>

      <div
        className={`fixed lg:absolute top-14 left-0 right-0 lg:top-full lg:left-0 lg:right-0
          h-[calc(100vh-3.5rem)] lg:h-auto overflow-auto
          ${
            isVisible
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 lg:translate-y-2 pointer-events-none'
          }
          bg-background transition-all duration-300 ease-in-out
        `}
      >
        <div className="pt-18 p-8 lg:pt-8">
          <h5 className="mb-4 uppercase">{t(DICTIONARY_KEYS.MINI_CART_LABEL) || 'Your Cart'}</h5>
          <p className="mb-8">
            {t(DICTIONARY_KEYS.CART_EMPTY_LABEL) || 'Your cart is currently empty.'}
          </p>
          <ContentSdkLink field={cartLink} className="btn btn-primary btn-sharp">
            {t(DICTIONARY_KEYS.GO_TO_CART_LABEL) || 'Go to Cart'}
          </ContentSdkLink>
        </div>
      </div>
    </div>
  );
};
