'use client';

import { useContainerOffsets } from '@/hooks/useContainerOffsets';
import {
  Text as ContentSdkText,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
} from '@sitecore-content-sdk/nextjs';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { normalizeSitecoreImageField } from '@/lib/sitecore-image';
import type { PageHeaderSTProps } from './hero-st.props';

const heroBtnPrimary = 'btn btn-primary btn-sharp !rounded-none !text-primary-foreground';
const heroBtnSecondary = 'btn btn-secondary btn-sharp !rounded-none !text-primary';

const heroViewportHeight = (params?: { HeroHeight?: string }) => {
  const value = Number.parseInt(params?.HeroHeight ?? '', 10);
  if (!Number.isInteger(value) || value < 10 || value > 100 || value % 10 !== 0) return '';
  return `${value}vh`;
};

const heroFrameStyle = (viewportHeight: string): React.CSSProperties | undefined => {
  if (!viewportHeight) return undefined;
  return {
    height: viewportHeight,
    minHeight: viewportHeight,
    '--hero-scale': String(Number.parseInt(viewportHeight, 10) / 100),
  } as React.CSSProperties;
};

const heroFrameClass = (viewportHeight: string) =>
  viewportHeight
    ? 'overflow-hidden [container-type:size] border-[length:calc(2rem*var(--hero-scale))] lg:border-[length:calc(4rem*var(--hero-scale))]'
    : 'border-8 lg:border-16';

const heroCopyPad = (viewportHeight: string) =>
  viewportHeight
    ? 'mt-0 h-full max-h-full min-h-0 justify-center px-[clamp(0.75rem,4cqh,1rem)] py-[clamp(0.5rem,3cqh,2rem)] lg:p-[clamp(0.75rem,4cqh,2rem)]'
    : 'mt-10 justify-center lg:mt-0 px-4 py-8 lg:p-8';

const heroEyebrowClass = (viewportHeight: string) =>
  viewportHeight
    ? 'pb-[clamp(0.2rem,1.2cqh,1rem)] text-[clamp(0.7rem,4cqh,1.25rem)] leading-tight lg:text-[clamp(0.8rem,4.5cqh,1.875rem)]'
    : 'pb-4 text-xl lg:text-3xl';

const heroTitleClass = (viewportHeight: string, large = true) =>
  viewportHeight
    ? `text-[clamp(1.15rem,8cqh,2.25rem)] leading-[0.95] ${large ? 'lg:text-[clamp(1.5rem,12cqh,4.5rem)]' : 'lg:text-[clamp(1.35rem,10cqh,3.75rem)]'}`
    : large
      ? 'text-4xl lg:text-7xl'
      : 'text-4xl lg:text-6xl';

const heroActionsClass = (viewportHeight: string) =>
  viewportHeight
    ? 'mt-[clamp(0.5rem,3cqh,2rem)] [&_.btn]:!mr-[clamp(0.4rem,2cqh,1rem)] [&_.btn]:!px-[clamp(0.7rem,2.5cqh,1.25rem)] [&_.btn]:!py-[clamp(0.4rem,2.5cqh,0.75rem)] [&_.btn]:!text-[clamp(0.75rem,2.8cqh,0.875rem)]'
    : 'mt-8';

const heroContentRow = (viewportHeight: string) =>
  viewportHeight ? 'flex h-full min-h-0 items-center' : '';

const heroBlurClass =
  'backdrop-blur-[20px] bg-[linear-gradient(136deg,_rgba(255,255,255,0.21)_2.61%,_rgba(255,255,255,0.42)_73.95%)]';

const heroBlurOverlay = (params?: { BlurOverlay?: string }) => {
  const value = params?.BlurOverlay?.trim().toLowerCase();
  if (value === 'off' || value === '0' || value === 'false') return '';
  return heroBlurClass;
};

const heroImageCount = (params?: { ImageCount?: string }) =>
  params?.ImageCount?.trim() === '1' ? 1 : 2;

export const Default = (props: PageHeaderSTProps) => {
  const { containerRef, rightOffset } = useContainerOffsets();
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const blurOverlay = heroBlurOverlay(props.params);
  const singleImage = heroImageCount(props.params) === 1;

  return (
    <section
      className={`relative flex border-background ${viewportHeight ? 'items-stretch' : 'items-center'} ${heroFrameClass(viewportHeight)} ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={singleImage ? '1' : '2'}
      data-class-change
    >
      <div className="absolute inset-0 z-10" data-hero-background="full">
        <ContentSdkImage
          field={getFieldValue(fields?.Image1)}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
        <div className={`relative z-20 mx-auto w-full lg:container lg:flex ${heroContentRow(viewportHeight)}`} ref={containerRef}>
        <div className={`flex flex-col lg:w-2/3 ${viewportHeight ? '' : 'lg:min-h-[50rem]'} ${heroCopyPad(viewportHeight)} ${blurOverlay}`} data-blur-overlay={blurOverlay ? 'on' : 'off'}>
          <div className="lg:max-w-3xl">
            <h1 className={`text-primary uppercase ${heroEyebrowClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
            </h1>
            <h1 className={`uppercase ${heroTitleClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Title)} />
            </h1>
            <div className={heroActionsClass(viewportHeight)}>
              <ContentSdkLink
                field={getFieldValue(fields?.Link1)!}
                prefetch={false}
                className={`${heroBtnPrimary} mr-4`}
              />
              <ContentSdkLink
                field={getFieldValue(fields?.Link2)!}
                prefetch={false}
                className={heroBtnSecondary}
              />
            </div>
          </div>
        </div>
        {!singleImage && (
          <div
            className={`lg:absolute top-0 bottom-0 left-2/3`}
            style={{ right: `-${rightOffset - 16}px` }}
          >
            <ContentSdkImage
              field={getFieldValue(fields?.Image1)}
              width={1920}
              height={1080}
              priority={true}
              fetchPriority="high"
              className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export const Right = (props: PageHeaderSTProps) => {
  const { containerRef, leftOffset } = useContainerOffsets();
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const blurOverlay = heroBlurOverlay(props.params);
  const singleImage = heroImageCount(props.params) === 1;

  return (
    <section
      className={`relative flex border-background ${viewportHeight ? 'items-stretch' : 'items-center'} ${heroFrameClass(viewportHeight)} ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={singleImage ? '1' : '2'}
      data-class-change
    >
      <div className="absolute inset-0 z-10" data-hero-background="full">
        <ContentSdkImage
          field={getFieldValue(fields?.Image1)}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`relative z-20 mx-auto w-full lg:container lg:flex lg:flex-row-reverse ${heroContentRow(viewportHeight)}`}
        ref={containerRef}
      >
        <div className={`flex flex-col lg:w-2/3 ${viewportHeight ? '' : 'lg:min-h-[50rem]'} ${heroCopyPad(viewportHeight)} ${blurOverlay}`} data-blur-overlay={blurOverlay ? 'on' : 'off'}>
          <div className="lg:max-w-3xl lg:ml-auto text-right">
            <h1 className={`text-primary uppercase ${heroEyebrowClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
            </h1>
            <h1 className={`uppercase ${heroTitleClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Title)} />
            </h1>
            <div className={heroActionsClass(viewportHeight)}>
              <ContentSdkLink
                field={getFieldValue(fields?.Link1)!}
                prefetch={false}
                className={`${heroBtnPrimary} mr-4`}
              />
              <ContentSdkLink
                field={getFieldValue(fields?.Link2)!}
                prefetch={false}
                className={heroBtnSecondary}
              />
            </div>
          </div>
        </div>
        {!singleImage && (
          <div
            className={`lg:absolute top-0 bottom-0 right-2/3`}
            style={{ left: `-${leftOffset - 16}px` }}
          >
            <ContentSdkImage
              field={getFieldValue(fields?.Image1)}
              width={1920}
              height={1080}
              className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export const Centered = (props: PageHeaderSTProps) => {
  const { containerRef, rightOffset } = useContainerOffsets();
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const blurOverlay = heroBlurOverlay(props.params);
  const singleImage = heroImageCount(props.params) === 1;

  return (
    <section
      className={`relative flex border-background ${viewportHeight ? 'items-stretch' : 'items-center'} ${heroFrameClass(viewportHeight)} ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={singleImage ? '1' : '2'}
      data-class-change
    >
      <div className="absolute inset-0 z-10" data-hero-background="full">
        <ContentSdkImage
          field={getFieldValue(fields?.Image1)}
          width={1920}
          height={1080}
          priority={true}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>
      <div className={`relative z-20 mx-auto w-full lg:container lg:flex ${heroContentRow(viewportHeight)}`} ref={containerRef}>
        <div className={`${singleImage ? 'w-full' : 'lg:relative lg:left-1/6 lg:w-2/3'} flex flex-col ${viewportHeight ? '' : 'lg:min-h-[50rem]'} ${heroCopyPad(viewportHeight)} ${blurOverlay}`} data-blur-overlay={blurOverlay ? 'on' : 'off'}>
          <div className="lg:max-w-3xl lg:mx-auto text-center">
            <h1 className={`text-primary uppercase ${heroEyebrowClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
            </h1>
            <h1 className={`uppercase ${heroTitleClass(viewportHeight)}`}>
              <ContentSdkText field={getFieldValue(fields?.Title)} />
            </h1>
            <div className={heroActionsClass(viewportHeight)}>
              <ContentSdkLink
                field={getFieldValue(fields?.Link1)!}
                prefetch={false}
                className={`${heroBtnPrimary} mr-4`}
              />
              <ContentSdkLink
                field={getFieldValue(fields?.Link2)!}
                prefetch={false}
                className={heroBtnSecondary}
              />
            </div>
          </div>
        </div>
        {!singleImage && (
          <div
            className={`lg:absolute top-0 bottom-0 left-5/6`}
            style={{ right: `-${rightOffset - 16}px` }}
          >
            <ContentSdkImage
              field={getFieldValue(fields?.Image1)}
              width={1920}
              height={1080}
              className="aspect-7/4 lg:aspect-auto w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export const SplitScreen = (props: PageHeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const blurOverlay = heroBlurOverlay(props.params);
  const singleImage = heroImageCount(props.params) === 1;

  return (
    <section
      className={`relative bg-primary border-background ${heroFrameClass(viewportHeight)} ${!viewportHeight && singleImage ? 'overflow-hidden' : ''} ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={singleImage ? '1' : '2'}
      data-class-change
    >
      {singleImage && (
        <div className="absolute inset-0 z-10" data-hero-background="full">
          <ContentSdkImage
            field={getFieldValue(fields?.Image1)}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className={`relative z-20 flex flex-col ${singleImage ? '' : 'lg:flex-row'} ${viewportHeight ? 'h-full min-h-0' : 'lg:min-h-[50rem]'}`}>
        <div
          className={`${viewportHeight ? heroCopyPad(viewportHeight) : 'justify-center p-8 lg:p-14'} lg:self-center ${singleImage ? `lg:w-2/3 ${blurOverlay}` : 'lg:basis-full'}`}
          data-blur-overlay={singleImage ? (blurOverlay ? 'on' : 'off') : undefined}
        >
          <h1 className={`uppercase ${heroEyebrowClass(viewportHeight)}`}>
            <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
          </h1>
          <h1 className={`uppercase ${heroTitleClass(viewportHeight, false)}`}>
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h1>
          <div className={heroActionsClass(viewportHeight)}>
            <ContentSdkLink
              field={getFieldValue(fields?.Link1)!}
              prefetch={false}
              className={`${heroBtnSecondary} mr-4`}
            />
            <ContentSdkLink
              field={getFieldValue(fields?.Link2)!}
              prefetch={false}
              className={heroBtnSecondary}
            />
          </div>
        </div>
        {!singleImage && (
        <div className={`relative lg:basis-full ${viewportHeight ? 'h-full min-h-0' : 'aspect-3/2 lg:aspect-auto'}`}>
          <ContentSdkImage
            field={getFieldValue(fields?.Image1)}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`relative h-full ${blurOverlay} z-20`} data-blur-overlay={blurOverlay ? 'on' : 'off'}>
            <div className="absolute  inset-8 lg:inset-14">
              <ContentSdkImage
                field={getFieldValue(fields?.Image1)}
                width={1920}
                height={1080}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export const Stacked = (props: PageHeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const blurOverlay = heroBlurOverlay(props.params);
  const singleImage = heroImageCount(props.params) === 1;

  return (
    <section
      className={`relative flex flex-col lg:flex-row lg:items-center ${singleImage ? 'overflow-hidden' : 'bg-primary lg:bg-transparent'} ${viewportHeight ? 'overflow-hidden [container-type:size]' : 'lg:min-h-[50rem]'} ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={singleImage ? '1' : '2'}
      data-class-change
    >
      {singleImage && (
        <div className="absolute inset-0 z-10" data-hero-background="full">
          <ContentSdkImage
            field={getFieldValue(fields?.Image1)}
            width={1920}
            height={1080}
            priority={true}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className={`container px-4 mx-auto ${singleImage ? 'relative z-20' : ''}`}>
        <div
          className={`relative z-20 lg:w-1/2 ${viewportHeight ? heroCopyPad(viewportHeight) : 'justify-center px-6 py-12'} ${singleImage ? blurOverlay : 'bg-primary'}`}
          data-blur-overlay={singleImage ? (blurOverlay ? 'on' : 'off') : undefined}
        >
          <h1 className={`uppercase ${heroEyebrowClass(viewportHeight)}`}>
            <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
          </h1>
          <h1 className={`uppercase ${heroTitleClass(viewportHeight, false)}`}>
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h1>
          <div className={heroActionsClass(viewportHeight)}>
            <ContentSdkLink
              field={getFieldValue(fields?.Link1)!}
              prefetch={false}
              className={`${heroBtnSecondary} mr-4`}
            />
            <ContentSdkLink
              field={getFieldValue(fields?.Link2)!}
              prefetch={false}
              className={heroBtnSecondary}
            />
          </div>
        </div>
      </div>
      {!singleImage && (
      <div className="relative aspect-3/2 lg:absolute lg:aspect-auto inset-0 flex z-10">
        <div className="relative w-1/3">
          <ContentSdkImage
            field={getFieldValue(fields?.Image2)}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover"
          />
        </div>
        <div className="relative w-2/3">
          <ContentSdkImage
            field={getFieldValue(fields?.Image1)}
            width={1920}
            height={1080}
            className="absolute w-full h-full inset-0 object-cover z-10"
          />
          <div className={`absolute inset-0 ${blurOverlay} z-20`} data-blur-overlay={blurOverlay ? 'on' : 'off'}>
            <ContentSdkImage
              field={getFieldValue(fields?.Image1)}
              width={1920}
              height={1080}
              className="absolute w-[calc(100%-5rem)] h-full left-20 top-0 right-0 bottom-0 object-cover"
            />
          </div>
        </div>
      </div>
      )}
    </section>
  );
};

export const BlogHeader = (props: PageHeaderSTProps) => {
  const fields = getDatasource(props.fields);
  const viewportHeight = heroViewportHeight(props.params);
  const link1 = getFieldValue(fields?.Link1);
  const link2 = getFieldValue(fields?.Link2);
  const image1 = normalizeSitecoreImageField(getFieldValue(fields?.Image1) ?? fields?.Image1);
  const hasLink1 = Boolean(link1?.value?.href || link1?.value?.text);
  const hasLink2 = Boolean(link2?.value?.href || link2?.value?.text);

  return (
    <section
      className={`relative overflow-hidden ${props?.params?.styles || ''}`}
      style={heroFrameStyle(viewportHeight)}
      data-hero-height={viewportHeight || undefined}
      data-hero-images={heroImageCount(props.params) === 1 ? '1' : '2'}
      data-class-change
    >
      <div className={`relative overflow-hidden ${viewportHeight ? 'h-full min-h-0' : 'min-h-[10rem] lg:min-h-[12rem]'}`}>
        <div className="absolute inset-0" data-hero-background="full">
          {image1 && (
            <ContentSdkImage
              field={image1}
              fill
              sizes="100vw"
              priority={true}
              fetchPriority="high"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className={`relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 py-6 lg:px-8 lg:py-8 ${viewportHeight ? 'h-full min-h-0' : 'min-h-[10rem] lg:min-h-[12rem]'}`}>
          <p className="pb-1 text-xs uppercase tracking-wide text-white/80 lg:text-sm">
            <ContentSdkText field={getFieldValue(fields?.Eyebrow)} />
          </p>
          <h1 className="max-w-3xl text-2xl font-semibold text-white lg:text-4xl">
            <ContentSdkText field={getFieldValue(fields?.Title)} />
          </h1>
          {(hasLink1 || hasLink2) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {link1 && hasLink1 && (
                <ContentSdkLink field={link1} prefetch={false} className={heroBtnPrimary} />
              )}
              {link2 && hasLink2 && (
                <ContentSdkLink field={link2} prefetch={false} className={heroBtnSecondary} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
