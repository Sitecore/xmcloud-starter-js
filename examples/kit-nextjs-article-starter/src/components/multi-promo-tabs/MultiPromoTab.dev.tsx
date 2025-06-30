import type React from 'react';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { motion } from 'framer-motion';
import { EditableButton as Button } from '../button-component/ButtonComponent';

import type { MultiPromoTabsFields } from './multi-promo-tabs.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

const Default = (props: MultiPromoTabsFields) => {
  const { link1, link2, image1, image2, isEditMode } = props;

  // Create empty link field for undefined links
  const getEmptyLinkField = (): LinkField => ({
    value: {
      href: '',
      text: 'Add link',
      linktype: 'external',
      url: '',
      anchor: '',
      target: '',
    },
  });

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    url: string,
    external = false
  ) => {
    // Only prevent default and handle navigation when not in edit mode and URL exists
    if (!isEditMode && url !== '') {
      e.preventDefault();
      if (external) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  };

  // Different layout for edit mode vs regular
  if (isEditMode) {
    return (
      <div className="multi-promo-tab @md:grid-cols-2 @md:my-16 my-8 grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl">
            <ImageWrapper
              image={image1?.jsonValue as ImageField}
              className="h-full w-full object-cover"
              wrapperClass="w-full h-full"
            />
          </div>
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] flex w-fit items-center gap-2 rounded-lg px-4 py-2"
            buttonLink={link1?.jsonValue || getEmptyLinkField()}
            isPageEditing={true}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl">
            <ImageWrapper
              image={image2?.jsonValue as ImageField}
              className="h-full w-full object-cover"
              wrapperClass="w-full h-full"
            />
          </div>
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] flex w-fit items-center gap-2 rounded-lg px-4 py-2"
            buttonLink={link2?.jsonValue || getEmptyLinkField()}
            isPageEditing={true}
          />
        </div>
      </div>
    );
  }

  // Regular interactive mode
  return (
    <div className="multi-promo-tab @md:grid-cols-2 @md:my-16 my-8 grid grid-cols-1 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group/card1 relative block overflow-hidden rounded-2xl"
        onClick={(e) =>
          handleClick(
            e,
            link1?.jsonValue?.value?.href || '',
            link1?.jsonValue?.value?.target == '_blank'
          )
        }
      >
        <div className="flex h-full w-full overflow-hidden">
          <ImageWrapper
            image={image1?.jsonValue as ImageField}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card1:scale-105"
          />
        </div>
        {link1?.jsonValue?.value?.href && (
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-500 group-hover/card1:translate-x-2"
            buttonLink={link1.jsonValue}
            isPageEditing={false}
          />
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group/card2 relative block overflow-hidden rounded-2xl"
        onClick={(e) =>
          handleClick(
            e,
            link2?.jsonValue?.value?.href || '',
            link2?.jsonValue?.value?.target == '_blank'
          )
        }
      >
        <div className="flex h-full w-full overflow-hidden">
          <ImageWrapper
            image={image2?.jsonValue as ImageField}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card2:scale-105"
          />
        </div>
        {link2?.jsonValue?.value?.href && (
          <Button
            icon={{ value: 'arrow-up-right' }}
            iconClassName="h-4 w-4"
            className="bg-popover hover:bg-popover hover:text-popover-foreground text-popover-foreground font-body letter-spacing-[-0.8] absolute bottom-4 left-4 flex items-center gap-2 rounded-lg px-4 py-2 backdrop-blur-sm transition-all duration-500 group-hover/card2:translate-x-2"
            buttonLink={link2.jsonValue}
            isPageEditing={false}
          />
        )}
      </motion.div>
    </div>
  );
};

export { Default };
