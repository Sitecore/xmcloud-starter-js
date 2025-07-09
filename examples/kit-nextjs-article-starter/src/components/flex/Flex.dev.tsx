import { cn } from '@/lib/utils';
import * as e from '@/lib/enum';

import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentFields, getFieldValue } from '@sitecore-content-sdk/nextjs';
import { Slot } from '@radix-ui/react-slot';
import { EnumValues } from '@/enumerations/generic.enum';
import { twMerge } from 'tailwind-merge';

/** Flex Component
 * This component is designed for easy layout within a container,
 * with no padding or margin of its own.
 */

const flexVariants = {
  direction: {
    [e.FlexDirection.ROW]: 'flex-row',
    [e.FlexDirection.ROW_REVERSE]: 'flex-row-reverse',
    [e.FlexDirection.COLUMN]: 'flex-col',
  },
  justify: {
    [e.FlexJustify.START]: 'justify-start',
    [e.FlexJustify.CENTER]: 'justify-center',
    [e.FlexJustify.END]: 'justify-end',
    [e.FlexJustify.BETWEEN]: 'justify-between',
    [e.FlexJustify.AROUND]: 'justify-around',
    [e.FlexJustify.EVENLY]: 'justify-evenly',
  },
  align: {
    [e.FlexAlign.START]: 'items-start',
    [e.FlexAlign.CENTER]: 'items-center',
    [e.FlexAlign.END]: 'items-end',
    [e.FlexAlign.STRETCH]: 'items-stretch',
    [e.FlexAlign.BASELINE]: 'items-baseline',
  },
  gap: {
    [e.FlexGap.GAP_0]: 'gap-0',
    [e.FlexGap.GAP_1]: 'gap-1',
    [e.FlexGap.GAP_2]: 'gap-2',
    [e.FlexGap.GAP_3]: 'gap-3',
    [e.FlexGap.GAP_4]: 'gap-4',
    [e.FlexGap.GAP_5]: 'gap-5',
    [e.FlexGap.GAP_6]: 'gap-6',
    [e.FlexGap.GAP_7]: 'gap-7',
    [e.FlexGap.GAP_8]: 'gap-8',
  },
  wrap: {
    [e.FlexWrap.WRAP]: 'flex-wrap',
    [e.FlexWrap.NO_WRAP]: 'flex-nowrap',
    [e.FlexWrap.WRAP_REVERSE]: 'flex-wrap-reverse',
  },
  grow: {
    [e.FlexGrow.GROW_0]: 'grow-0',
    [e.FlexGrow.GROW_1]: 'grow',
  },
  shrink: {
    [e.FlexShrink.SHRINK_0]: 'shrink-0',
    [e.FlexShrink.SHRINK_1]: 'shrink',
  },
  basis: {
    [e.FlexBasis.AUTO]: 'basis-auto',
    [e.FlexBasis.FULL]: 'basis-full',
    [e.FlexBasis.BASIS_0]: 'basis-0',
    [e.FlexBasis.BASIS_1_2]: 'basis-1/2',
    [e.FlexBasis.BASIS_1_3]: 'basis-1/3',
    [e.FlexBasis.BASIS_2_3]: 'basis-2/3',
    [e.FlexBasis.BASIS_1_4]: 'basis-1/4',
    [e.FlexBasis.BASIS_2_4]: 'basis-2/4',
    [e.FlexBasis.BASIS_3_4]: 'basis-3/4',
    [e.FlexBasis.BASIS_1_5]: 'basis-1/5',
    [e.FlexBasis.BASIS_2_5]: 'basis-2/5',
    [e.FlexBasis.BASIS_3_5]: 'basis-3/5',
    [e.FlexBasis.BASIS_4_5]: 'basis-4/5',
    [e.FlexBasis.BASIS_1_6]: 'basis-1/6',
    [e.FlexBasis.BASIS_2_6]: 'basis-2/6',
    [e.FlexBasis.BASIS_3_6]: 'basis-3/6',
    [e.FlexBasis.BASIS_4_6]: 'basis-4/6',
    [e.FlexBasis.BASIS_5_6]: 'basis-5/6',

    [e.FlexBasis.BASIS_1_8]: 'basis-1/8',
    [e.FlexBasis.BASIS_2_8]: 'basis-2/8',
    [e.FlexBasis.BASIS_3_8]: 'basis-3/8',
    [e.FlexBasis.BASIS_4_8]: 'basis-4/8',
    [e.FlexBasis.BASIS_5_8]: 'basis-5/8',
    [e.FlexBasis.BASIS_6_8]: 'basis-6/8',
    [e.FlexBasis.BASIS_7_8]: 'basis-7/8',

    [e.FlexBasis.BASIS_1_10]: 'basis-1/10',
    [e.FlexBasis.BASIS_2_10]: 'basis-2/10',
    [e.FlexBasis.BASIS_3_10]: 'basis-3/10',
    [e.FlexBasis.BASIS_4_10]: 'basis-4/10',
    [e.FlexBasis.BASIS_5_10]: 'basis-5/10',
    [e.FlexBasis.BASIS_6_10]: 'basis-6/10',
    [e.FlexBasis.BASIS_7_10]: 'basis-7/10',
    [e.FlexBasis.BASIS_8_10]: 'basis-8/10',
    [e.FlexBasis.BASIS_9_10]: 'basis-9/10',

    [e.FlexBasis.BASIS_1_12]: 'basis-1/12',
    [e.FlexBasis.BASIS_2_12]: 'basis-2/12',
    [e.FlexBasis.BASIS_3_12]: 'basis-3/12',
    [e.FlexBasis.BASIS_4_12]: 'basis-4/12',
    [e.FlexBasis.BASIS_5_12]: 'basis-5/12',
    [e.FlexBasis.BASIS_6_12]: 'basis-6/12',
    [e.FlexBasis.BASIS_7_12]: 'basis-7/12',
    [e.FlexBasis.BASIS_8_12]: 'basis-8/12',
    [e.FlexBasis.BASIS_9_12]: 'basis-9/12',
    [e.FlexBasis.BASIS_10_12]: 'basis-10/12',
    [e.FlexBasis.BASIS_11_12]: 'basis-11/12',

    [e.FlexBasis.BASIS_1_14]: 'basis-1/14',
    [e.FlexBasis.BASIS_2_14]: 'basis-2/14',
    [e.FlexBasis.BASIS_3_14]: 'basis-3/14',
    [e.FlexBasis.BASIS_4_14]: 'basis-4/14',
    [e.FlexBasis.BASIS_5_14]: 'basis-5/14',
    [e.FlexBasis.BASIS_6_14]: 'basis-6/14',
    [e.FlexBasis.BASIS_7_14]: 'basis-7/14',
    [e.FlexBasis.BASIS_8_14]: 'basis-8/14',
    [e.FlexBasis.BASIS_9_14]: 'basis-9/14',
    [e.FlexBasis.BASIS_10_14]: 'basis-10/14',
    [e.FlexBasis.BASIS_11_14]: 'basis-11/14',
    [e.FlexBasis.BASIS_12_14]: 'basis-12/14',
    [e.FlexBasis.BASIS_13_14]: 'basis-13/14',

    [e.FlexBasis.BASIS_1_16]: 'basis-1/16',
    [e.FlexBasis.BASIS_2_16]: 'basis-2/16',
    [e.FlexBasis.BASIS_3_16]: 'basis-3/16',
    [e.FlexBasis.BASIS_4_16]: 'basis-4/16',
    [e.FlexBasis.BASIS_5_16]: 'basis-5/16',
    [e.FlexBasis.BASIS_6_16]: 'basis-6/16',
    [e.FlexBasis.BASIS_7_16]: 'basis-7/16',
    [e.FlexBasis.BASIS_8_16]: 'basis-8/16',
    [e.FlexBasis.BASIS_9_16]: 'basis-9/16',
    [e.FlexBasis.BASIS_10_16]: 'basis-10/16',
    [e.FlexBasis.BASIS_11_16]: 'basis-11/16',
    [e.FlexBasis.BASIS_12_16]: 'basis-12/16',
    [e.FlexBasis.BASIS_13_16]: 'basis-13/16',
    [e.FlexBasis.BASIS_14_16]: 'basis-14/16',
    [e.FlexBasis.BASIS_15_16]: 'basis-15/16',
  },
  width: {
    [e.Width.AUTO]: 'w-auto',
    [e.Width.FULL]: 'w-full',
    [e.Width.WIDTH_0]: 'w-0',
    [e.Width.WIDTH_1_2]: 'w-1/2',
    [e.Width.WIDTH_1_3]: 'w-1/3',
    [e.Width.WIDTH_2_3]: 'w-2/3',
    [e.Width.WIDTH_1_4]: 'w-1/4',
    [e.Width.WIDTH_2_4]: 'w-2/4',
    [e.Width.WIDTH_3_4]: 'w-3/4',
    [e.Width.WIDTH_1_5]: 'w-1/5',
    [e.Width.WIDTH_2_5]: 'w-2/5',
    [e.Width.WIDTH_3_5]: 'w-3/5',
    [e.Width.WIDTH_4_5]: 'w-4/5',
    [e.Width.WIDTH_1_6]: 'w-1/6',
    [e.Width.WIDTH_2_6]: 'w-2/6',
    [e.Width.WIDTH_3_6]: 'w-3/6',
    [e.Width.WIDTH_4_6]: 'w-4/6',
    [e.Width.WIDTH_5_6]: 'w-5/6',

    [e.Width.WIDTH_1_8]: 'w-1/8',
    [e.Width.WIDTH_2_8]: 'w-2/8',
    [e.Width.WIDTH_3_8]: 'w-3/8',
    [e.Width.WIDTH_4_8]: 'w-4/8',
    [e.Width.WIDTH_5_8]: 'w-5/8',
    [e.Width.WIDTH_6_8]: 'w-6/8',
    [e.Width.WIDTH_7_8]: 'w-7/8',

    [e.Width.WIDTH_1_10]: 'w-1/10',
    [e.Width.WIDTH_2_10]: 'w-2/10',
    [e.Width.WIDTH_3_10]: 'w-3/10',
    [e.Width.WIDTH_4_10]: 'w-4/10',
    [e.Width.WIDTH_5_10]: 'w-5/10',
    [e.Width.WIDTH_6_10]: 'w-6/10',
    [e.Width.WIDTH_7_10]: 'w-7/10',
    [e.Width.WIDTH_8_10]: 'w-8/10',
    [e.Width.WIDTH_9_10]: 'w-9/10',

    [e.Width.WIDTH_1_12]: 'w-1/12',
    [e.Width.WIDTH_2_12]: 'w-2/12',
    [e.Width.WIDTH_3_12]: 'w-3/12',
    [e.Width.WIDTH_4_12]: 'w-4/12',
    [e.Width.WIDTH_5_12]: 'w-5/12',
    [e.Width.WIDTH_6_12]: 'w-6/12',
    [e.Width.WIDTH_7_12]: 'w-7/12',
    [e.Width.WIDTH_8_12]: 'w-8/12',
    [e.Width.WIDTH_9_12]: 'w-9/12',
    [e.Width.WIDTH_10_12]: 'w-10/12',
    [e.Width.WIDTH_11_12]: 'w-11/12',

    [e.Width.WIDTH_1_14]: 'w-1/14',
    [e.Width.WIDTH_2_14]: 'w-2/14',
    [e.Width.WIDTH_3_14]: 'w-3/14',
    [e.Width.WIDTH_4_14]: 'w-4/14',
    [e.Width.WIDTH_5_14]: 'w-5/14',
    [e.Width.WIDTH_6_14]: 'w-6/14',
    [e.Width.WIDTH_7_14]: 'w-7/14',
    [e.Width.WIDTH_8_14]: 'w-8/14',
    [e.Width.WIDTH_9_14]: 'w-9/14',
    [e.Width.WIDTH_10_14]: 'w-10/14',
    [e.Width.WIDTH_11_14]: 'w-11/14',
    [e.Width.WIDTH_12_14]: 'w-12/14',
    [e.Width.WIDTH_13_14]: 'w-13/14',

    [e.Width.WIDTH_1_16]: 'w-1/16',
    [e.Width.WIDTH_2_16]: 'w-2/16',
    [e.Width.WIDTH_3_16]: 'w-3/16',
    [e.Width.WIDTH_4_16]: 'w-4/16',
    [e.Width.WIDTH_5_16]: 'w-5/16',
    [e.Width.WIDTH_6_16]: 'w-6/16',
    [e.Width.WIDTH_7_16]: 'w-7/16',
    [e.Width.WIDTH_8_16]: 'w-8/16',
    [e.Width.WIDTH_9_16]: 'w-9/16',
    [e.Width.WIDTH_10_16]: 'w-10/16',
    [e.Width.WIDTH_11_16]: 'w-11/16',
    [e.Width.WIDTH_12_16]: 'w-12/16',
    [e.Width.WIDTH_13_16]: 'w-13/16',
    [e.Width.WIDTH_14_16]: 'w-14/16',
    [e.Width.WIDTH_15_16]: 'w-15/16',
  },

  alignSelf: {
    [e.FlexAlignSelf.AUTO]: 'self-auto',
    [e.FlexAlignSelf.FLEX_START]: 'self-flex-start',
    [e.FlexAlignSelf.FLEX_END]: 'self-flex-end',
    [e.FlexAlignSelf.CENTER]: 'self-center',
    [e.FlexAlignSelf.BASELINE]: 'self-baseline',
    [e.FlexAlignSelf.STRETCH]: 'self-stretch',
  },
};
// Define the possible keys of the flexVariants object
type FlexVariantKey = keyof typeof flexVariants;

export interface FlexProps {
  direction?: EnumValues<typeof flexVariants.direction>; // Flex direction
  justify?: EnumValues<typeof flexVariants.justify>; // Flex justify options
  align?: EnumValues<typeof flexVariants.align>; // Align items options
  gap?: EnumValues<typeof flexVariants.gap>; // Gap between items, e.g., '4', '6', '8'
  wrap?: EnumValues<typeof flexVariants.wrap>; // Flex wrap options
  children?: React.ReactNode; // Children elements
  className?: string; // Additional Tailwind classes, e.g., md:flex-row
  as?: React.ElementType; // e.g., "div" or "section"
  asChild?: boolean; // Merges component with child
  fullBleed?: boolean; // Full bleed container
}

export interface FlexItemProps {
  children: React.ReactNode;
  className?: string;
  grow?: EnumValues<typeof flexVariants.grow>;
  shrink?: EnumValues<typeof flexVariants.shrink>;
  basis?: EnumValues<typeof flexVariants.basis>;
  alignSelf?: EnumValues<typeof flexVariants.alignSelf>;
  as?: React.ElementType; // e.g., "div" or "section"
  asChild?: boolean; // Merges component with child
  fullBleed?: boolean;
}

// XM Cloud Component Props
export interface XMComponent {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: ComponentFields;
}

const getVariantString = <T extends FlexVariantKey>(
  key: T,
  value: EnumValues<(typeof flexVariants)[T]>
) => {
  return flexVariants[key][value as keyof (typeof flexVariants)[T]] || '';
};
export const Flex: React.FC<FlexProps> = ({
  direction = e.FlexDirection.COLUMN,
  justify = e.FlexJustify.START,
  align = e.FlexAlign.CENTER,
  gap = e.FlexGap.GAP_4,
  wrap = e.FlexWrap.WRAP,
  children,
  className,
  as: Comp = 'div', // Default to 'div' if 'as' is not provided
  asChild,
  fullBleed = false,
}) => {
  const Component = asChild ? Slot : Comp;

  //md:flex-row controls the flex breakppoint in the future we can add more breakpoints and make this dynamic

  return (
    <Component
      className={cn(
        !fullBleed && 'mx-auto max-w-screen-xl px-4 xl:px-8',
        twMerge(' mx-auto flex md:flex-row'),
        getVariantString('direction', direction),
        getVariantString('justify', justify),
        getVariantString('align', align),
        getVariantString('gap', gap),
        getVariantString('wrap', wrap),
        className
      )}
    >
      {children}
    </Component>
  );
};

export const FlexItem: React.FC<FlexItemProps> = ({
  children,
  className = '',
  grow = e.FlexGrow.GROW_0,
  shrink = e.FlexShrink.SHRINK_1,
  basis = e.FlexBasis.AUTO,
  alignSelf = e.FlexAlignSelf.FLEX_START,
  as: Comp = 'div', // Default to 'div' if 'as' is not provided
  asChild,
}) => {
  const Component = asChild ? Slot : Comp;
  return (
    <Component
      className={cn(
        getVariantString('grow', grow),
        getVariantString('shrink', shrink),
        getVariantString('basis', basis),
        //for now width and basis will be the same
        `md:${getVariantString('width', basis)}`,
        getVariantString('alignSelf', alignSelf),
        'w-full',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const XMFlex: React.FC<XMComponent> = ({ params, rendering, fields }) => {
  const phKey = `flex-${params.DynamicPlaceholderId}`;
  return (
    <Flex
      direction={getFieldValue(fields, 'direction')}
      justify={getFieldValue(fields, 'justify')}
      align={getFieldValue(fields, 'align')}
      gap={getFieldValue(fields, 'gap')}
      className={getFieldValue(fields, 'className')}
    >
      <Placeholder name={phKey} rendering={rendering} />
    </Flex>
  );
};

export const XMFlexItem: React.FC<XMComponent> = ({ params, rendering, fields }) => {
  const phKey = `flex-item-${params.DynamicPlaceholderId}`;
  return (
    <FlexItem
      grow={getFieldValue(fields, 'grow')}
      shrink={getFieldValue(fields, 'shrink')}
      basis={getFieldValue(fields, 'basis')}
      alignSelf={getFieldValue(fields, 'alignSelf')}
      className={getFieldValue(fields, 'className')}
    >
      <Placeholder name={phKey} rendering={rendering} />
    </FlexItem>
  );
};
