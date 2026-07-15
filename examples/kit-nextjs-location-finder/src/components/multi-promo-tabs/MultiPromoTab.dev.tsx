import { ImageField } from '@sitecore-content-sdk/nextjs';
import { m } from 'framer-motion';
import { ButtonBase as Button } from '../button-component/ButtonComponent';

import { MultiPromoTabsFields } from './multi-promo-tabs.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { getFieldValue } from '@/lib/component-props';

const Default = (props: MultiPromoTabsFields) => {
  const { link1, link2, image1, image2, isEditMode, page } = props;
  const link1Field = getFieldValue(link1);
  const link2Field = getFieldValue(link2);
  const image1Field = getFieldValue(image1);
  const image2Field = getFieldValue(image2);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    url: string,
    external: boolean = false
  ) => {
    // if edit mode we want to ignore click event
    if (isEditMode) {
      e.preventDefault();
    } else if (!isEditMode && url !== '') {
      if (external) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  };

  return (
    <div className="multi-promo-tab @md:grid-cols-2 @md:my-16 my-8 grid grid-cols-1 gap-6">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group relative block overflow-hidden rounded-2xl"
        onClick={(e) =>
          handleClick(
            e,
            link1Field?.value?.href || '',
            link1Field?.value?.target == '_blank'
          )
        }
      >
        <div className="flex h-full w-full overflow-hidden">
          <ImageWrapper image={image1Field} className="h-full w-full object-cover" page={page} />
        </div>
        {link1Field && (
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 text-base text-sm font-medium font-normal backdrop-blur-sm transition-all duration-500 group-hover:translate-x-2"
            buttonLink={link1Field}
            isPageEditing={isEditMode}
          />
        )}
      </m.div>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group relative block overflow-hidden rounded-2xl"
        onClick={(e) =>
          handleClick(
            e,
            link2Field?.value?.href || '',
            link2Field?.value?.target == '_blank'
          )
        }
      >
        <div className="flex h-full w-full overflow-hidden">
          <ImageWrapper
            image={image2Field as ImageField}
            className="  h-full w-full object-cover"
            page={page}
          />
        </div>
        {link2Field && (
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 text-base text-sm font-medium font-normal backdrop-blur-sm transition-all duration-500 group-hover:translate-x-2"
            buttonLink={link2Field}
            isPageEditing={isEditMode}
          />
        )}
      </m.div>
    </div>
  );
};

export { Default };
