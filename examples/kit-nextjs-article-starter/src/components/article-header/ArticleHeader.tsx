'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Facebook, Linkedin, Twitter, Link, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Field,
  Item,
  ImageField,
  LinkField,
  Text,
  DateField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

import { NoDataFallback } from '@/utils/NoDataFallback';
import { Badge } from '@/components/ui/badge';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Button } from '@/components/ui/button';
import { FloatingDock } from '@/components/floating-dock/floating-dock.dev';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useI18n } from 'next-localization';
import { dictionaryKeys } from '@/variables/dictionary';
import { formatDateInUTC } from '@/utils/date-utils';
import { Default as Icon } from '@/components/icon/Icon';

interface ArticleHeaderParams {
  [key: string]: any; // eslint-disable-line
}

type ReferenceField = {
  id: string;
  name: string;
  url?: string;
  displayName?: string;
  fields?: {
    [key: string]: Field | Item[] | ReferenceField | null;
  };
};

type AuthorReferenceField = ReferenceField & {
  fields: PersonItem;
};

interface ArticleHeaderFields {
  imageRequired?: { jsonValue: ImageField };
  eyebrowOptional?: { jsonValue: Field<string> };
}

interface ArticleHeaderExternalFields {
  pageHeaderTitle: { jsonValue: Field<string> };
  pageReadTime?: { jsonValue: Field<string> };
  pageDisplayDate?: { jsonValue: Field<string> };
  pageAuthor?: { jsonValue: AuthorReferenceField };
}

interface ArticleHeaderProps extends ComponentProps {
  params: ArticleHeaderParams;
  fields: {
    data: {
      datasource: ArticleHeaderFields;
      externalFields: ArticleHeaderExternalFields;
    };
  };
}

interface PersonItem {
  personProfileImage?: ImageField;
  personFirstName: Field<string>;
  personLastName: Field<string>;
  personJobTitle?: Field<string>;
  personBio?: Field<string>;
  personLinkedIn?: LinkField;
}

export const Default: React.FC<ArticleHeaderProps> = ({ fields }) => {
  const { imageRequired, eyebrowOptional } = fields.data?.datasource ?? {};
  const { pageHeaderTitle, pageReadTime, pageDisplayDate, pageAuthor } =
    fields?.data?.externalFields ?? {};
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceCollapse] = useState(true);
  const copyNotificationRef = useRef<HTMLDivElement>(null);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const { t } = useI18n();
  const dictionary = {
    ARTICLE_HEADER_BACKTONEWS: t(dictionaryKeys.ARTICLE_HEADER_BACKTONEWS),
    ARTICLE_HEADER_AUTHOR_LABEL: t(dictionaryKeys.ARTICLE_HEADER_AUTHOR_LABEL),
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;

      // Use requestAnimationFrame to optimize performance
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const rect = headerRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (fields.data.datasource) {
    const parallaxStyle = imageRequired?.jsonValue?.value?.src
      ? {
          transform: prefersReducedMotion
            ? 'none'
            : `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
          transition: prefersReducedMotion ? 'none' : 'transform 200ms ease-out',
        }
      : {};

    const handleShare = (platform: string) => {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${url}`;
          window.location.href = shareUrl;
          return;
        case 'copy':
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              // Show toast notification
              toast({
                title: 'Link copied!',
                description: 'The link has been copied to your clipboard.',
                duration: 3000, // Explicitly set duration
              });

              setCopySuccess(true);

              if (copyNotificationRef.current) {
                copyNotificationRef.current.textContent = 'Link copied to clipboard';
              }
            })
            .catch((err) => {
              console.error('Failed to copy: ', err);
              toast({
                title: 'Copy failed',
                description: 'Could not copy the link to clipboard.',
                variant: 'destructive',
              });
            });
          return;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const links = [
      {
        title: 'Share on Facebook',
        icon: (
          <Facebook className="h-full w-full text-white dark:text-neutral-300" aria-hidden="true" />
        ),
        href: '#',
        onClick: () => handleShare('facebook'),
        ariaLabel: 'Share on Facebook',
      },
      {
        title: 'Share on Twitter',
        icon: (
          <Twitter className="h-full w-full text-white dark:text-neutral-300" aria-hidden="true" />
        ),
        href: '#',
        onClick: () => handleShare('twitter'),
        ariaLabel: 'Share on Twitter',
      },
      {
        title: 'Share on LinkedIn',
        icon: (
          <Linkedin className="h-full w-full text-white dark:text-neutral-300" aria-hidden="true" />
        ),
        href: '#',
        onClick: () => handleShare('linkedin'),
        ariaLabel: 'Share on LinkedIn',
      },
      {
        title: 'Share via Email',
        icon: (
          <Mail className="h-full w-full text-white dark:text-neutral-300" aria-hidden="true" />
        ),
        href: '#',
        onClick: () => handleShare('email'),
        ariaLabel: 'Share via Email',
      },
      {
        title: 'Copy Link',
        icon: copySuccess ? (
          <Check className="h-full w-full text-green-500 dark:text-green-400" aria-hidden="true" />
        ) : (
          <Link className="h-full w-full text-white dark:text-neutral-300" aria-hidden="true" />
        ),
        href: '#',
        onClick: () => handleShare('copy'),
        ariaLabel: copySuccess ? 'Link copied' : 'Copy link',
      },
    ];

    return (
      <>
        <header
          className={cn('@container article-header relative mb-[86px] overflow-hidden')}
          ref={headerRef}
        >
          <div className="relative z-0 h-[auto] overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <div
              className="z-5 absolute inset-0 h-[120%] w-[120%] bg-cover bg-center opacity-70 transition-transform duration-200 ease-out"
              style={parallaxStyle}
            >
              <ImageWrapper
                image={imageRequired?.jsonValue}
                alt={pageHeaderTitle?.jsonValue.value}
                className="h-full w-full object-cover"
                wrapperClass="h-full w-full"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                ref={imageRef}
              />
            </div>
            {/* Blur overlay - separate for better performance */}
            <div className="absolute inset-0 backdrop-blur-md"></div>
            {/* White Section */}
            {/* in order to be fully responsive the height of this section needs to be half of the height of the image */}
            <div
              data-component="white-bar"
              className="@xs:h-[125px] @sm:h-[150px] @md:h-[140px] @lg:h-[90px] @xl:h-[180px] absolute bottom-0 h-[90px] w-full  bg-white"
            ></div>

            {/* Content */}
            <div className="z-10 @md:pb-0 relative mx-auto flex h-full flex-col justify-between gap-12 p-0 pb-6 pt-[120px]">
              <div className="flex flex-col">
                {/* Back Button */}
                <Button
                  className="absolute left-0 top-[41px] mb-8 inline-flex items-center text-white transition-colors hover:text-white"
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                >
                  <Icon iconName="arrow-left" className="ml-2" />
                  {!dictionary.ARTICLE_HEADER_BACKTONEWS && isPageEditing ? (
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-2xl relative"
                      role="alert"
                    >
                      <span className="block sm:inline">
                        Dictionary Entry is Missing for {dictionaryKeys.ARTICLE_HEADER_BACKTONEWS}
                      </span>
                    </div>
                  ) : (
                    dictionary.ARTICLE_HEADER_BACKTONEWS
                  )}
                </Button>
                {/* Category Badge */}
                {(eyebrowOptional?.jsonValue?.value || isPageEditing) && (
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent font-body mx-auto  mb-4 inline-block text-[14px] font-medium tracking-tighter">
                    <Text field={eyebrowOptional?.jsonValue} />
                  </Badge>
                )}
                {/* Title */}
                <Text
                  tag="h1"
                  className="@md:text-[62px] @md:mb-0 font-heading line-height-[69px] mx-auto max-w-4xl text-pretty px-6 text-center text-4xl font-normal tracking-tighter text-white"
                  field={pageHeaderTitle?.jsonValue}
                />
                {/* Read Time and Date - Centered */}
                {(pageReadTime?.jsonValue?.value ||
                  pageDisplayDate?.jsonValue?.value ||
                  isPageEditing) && (
                  <div className="@md:flex-row @xl:px-8 mb-8 flex flex-col items-center justify-center space-x-2 px-4 text-center text-sm text-white subpixel-antialiased">
                    {(pageReadTime?.jsonValue?.value || isPageEditing) && (
                      <Text
                        tag="span"
                        field={pageReadTime?.jsonValue}
                        className="@md:inline-block block text-pretty"
                      />
                    )}
                    {((pageReadTime?.jsonValue?.value && pageDisplayDate?.jsonValue?.value) ||
                      isPageEditing) && (
                      <span className="@md:inline-block hidden text-pretty">•</span>
                    )}
                    {pageDisplayDate?.jsonValue?.value && (
                      <DateField
                        tag="span"
                        field={pageDisplayDate?.jsonValue}
                        render={(date) => formatDateInUTC(String(date))}
                        className="@md:inline-block block text-pretty"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="@lg:grid @lg:max-w-screen-3xl @lg:mx-auto @lg:w-full @lg:gap-8 @lg:grid-cols-12 mx-6 mb-auto grid grid-cols-2 items-start justify-between">
                <div className="@lg:col-span-3 @lg:justify-end @lg:pt-4 @lg:h-[250px] @lg:items-start col-span-1 flex h-[auto] flex-wrap items-center justify-center gap-4 p-6 subpixel-antialiased">
                  {pageAuthor?.jsonValue && (
                    <div className="grid gap-y-3">
                      <p className="flex min-h-10 flex-col justify-center text-sm text-white">
                        {dictionary.ARTICLE_HEADER_AUTHOR_LABEL}
                      </p>
                      <Avatar>
                        <AvatarImage
                          src={pageAuthor?.jsonValue?.fields?.personProfileImage?.value?.src}
                          alt={`${pageAuthor?.jsonValue?.fields?.personFirstName?.value} ${pageAuthor?.jsonValue?.fields?.personLastName?.value}`}
                        />
                        <AvatarFallback>{`${pageAuthor?.jsonValue?.fields?.personFirstName?.value} ${pageAuthor?.jsonValue?.fields?.personLastName?.value}`}</AvatarFallback>
                      </Avatar>
                      <div className="relative">
                        <p className="text-pretty font-medium text-white">
                          {pageAuthor?.jsonValue?.fields?.personFirstName?.value}{' '}
                          {pageAuthor?.jsonValue?.fields?.personLastName?.value}
                        </p>
                        {pageAuthor?.jsonValue?.fields?.personJobTitle && (
                          <Text
                            tag={'p'}
                            field={pageAuthor?.jsonValue?.fields?.personJobTitle}
                            className="text-pretty text-sm text-white"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Share Section - Mobile Only */}
                <div className="@lg:hidden col-span-1 flex h-[auto] items-center justify-center gap-4 p-6">
                  <p className="@lg:mb-2 m-0 flex items-center justify-center text-pretty text-sm font-medium text-white subpixel-antialiased">
                    Share
                  </p>
                  <FloatingDock items={links} forceCollapse={forceCollapse} />
                </div>

                {/* Featured Image */}
                <div className="@lg:col-span-6 relative z-10 col-span-2 mx-auto flex aspect-[16/9] w-full max-w-[800px] justify-center overflow-hidden rounded-[24px]">
                  <ImageWrapper
                    image={imageRequired?.jsonValue}
                    alt={pageHeaderTitle?.jsonValue?.value}
                    className="h-full w-full object-cover "
                    wrapperClass="w-full relative"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    ref={imageRef}
                  />
                </div>

                {/* Share Section - Desktop Only */}
                <div className="@lg:col-span-3 @lg:justify-start @lg:pt-4 @lg:h-[250px] @lg:items-start @lg:flex hidden h-[auto] items-center justify-center gap-4 p-6">
                  <p className="@lg:mt-2 m-0 mb-2 flex items-center justify-center text-pretty text-sm font-medium text-white subpixel-antialiased">
                    Share
                  </p>
                  <FloatingDock items={links} forceCollapse={forceCollapse} />
                </div>
              </div>
            </div>
          </div>
          {/* Screen reader notification */}
          <div ref={copyNotificationRef} className="sr-only" aria-live="polite"></div>
        </header>
        <Toaster />
      </>
    );
  }

  return <NoDataFallback componentName="ArticleHeader" />;
};
