'use client';

import { Link as ContentSdkLink, LinkField } from '@sitecore-content-sdk/nextjs';
import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

const DICTIONARY_KEYS = {
  GO_TO_CART_LABEL: 'Go_To_Cart',
  MINI_CART_LABEL: 'Your_Cart',
  CART_EMPTY_LABEL: 'Cart_Empty',
};

export const MiniCart = ({ cartLink }: { cartLink: LinkField }) => {
  const t = useTranslations();
  const { isVisible, setIsVisible, ref } = useToggleWithClickOutside<HTMLDivElement>(false);

  const cartTrigger = <FontAwesomeIcon icon={faShoppingCart} width={24} height={24} />;

  return (
    <div ref={ref}>
      <button
        type="button"
        className="block p-4"
        aria-label="Shopping cart"
        onClick={() => setIsVisible(!isVisible)}
      >
        {cartTrigger}
      </button>

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
          <h2 className="mb-4 uppercase">{t(DICTIONARY_KEYS.MINI_CART_LABEL) || 'Your Cart'}</h2>
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
