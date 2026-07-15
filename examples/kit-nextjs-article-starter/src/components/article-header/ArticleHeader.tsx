'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Facebook, Linkedin, Twitter, Link, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Text, DateField } from '@sitecore-content-sdk/nextjs';
import { ArticleHeaderProps } from './article-header.props';

import { NoDataFallback } from '@/utils/NoDataFallback';
import { Badge } from '@/components/ui/badge';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Button } from '@/components/ui/button';
import { FloatingDock } from '@/components/floating-dock/floating-dock.dev';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useTranslations } from 'next-intl';
import { dictionaryKeys } from '@/variables/dictionary';
import { formatDateInUTC } from '@/utils/date-utils';
import { Default as Icon } from '@/components/icon/Icon';
import { StructuredData } from '@/components/structured-data/StructuredData';
import {
  generateArticleSchema,
  generatePersonSchema,
} from '@/lib/structured-data/schema';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { hasDocument, hasNavigator, isBrowser } from '@/utils/browser';


export const Default: React.FC<ArticleHeaderProps> = ({ fields, page }) => {
  const datasource = getDatasource(fields);
  const { imageRequired, eyebrowOptional } = datasource ?? {};
  const externalFields = fields?.data?.externalFields;
  const pageHeaderTitle = externalFields?.pageHeaderTitle ?? null;
  const pageReadTime = externalFields?.pageReadTime ?? null;
  const pageDisplayDate = externalFields?.pageDisplayDate ?? null;
  const pageAuthor = externalFields?.pageAuthor ?? null;
  const imageField = getFieldValue(imageRequired);
  const eyebrowField = getFieldValue(eyebrowOptional);
  const pageHeaderTitleField = getFieldValue(pageHeaderTitle);
  const pageReadTimeField = getFieldValue(pageReadTime);
  const pageDisplayDateField = getFieldValue(pageDisplayDate);
  const pageAuthorField = getFieldValue(pageAuthor);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceCollapse] = useState(true);
  const copyNotificationRef = useRef<HTMLDivElement>(null);
  const isPageEditing = page.mode.isEditing;
  const t = useTranslations();
  const dictionary = {
    ARTICLE_HEADER_BACKTONEWS: t(dictionaryKeys.ARTICLE_HEADER_BACKTONEWS),
    ARTICLE_HEADER_AUTHOR_LABEL: t(dictionaryKeys.ARTICLE_HEADER_AUTHOR_LABEL),
  };

  useEffect(() => {
    if (!isBrowser || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isBrowser) return;

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

  if (fields) {
    const parallaxStyle = imageField?.value?.src
      ? {
          transform: prefersReducedMotion
            ? 'none'
            : `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
          transition: prefersReducedMotion ? 'none' : 'transform 200ms ease-out',
        }
      : {};

    const handleShare = (platform: string) => {
      if (!isBrowser) return;

      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(hasDocument ? document.title : '');
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
          if (hasNavigator() && navigator.clipboard) {
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
          }
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

    // Generate Article schema structured data
    const articleSchema = pageHeaderTitleField?.value
      ? generateArticleSchema({
          headline: pageHeaderTitleField.value,
          description: pageHeaderTitleField.value,
          image: imageField?.value?.src
            ? [imageField.value.src]
            : undefined,
          datePublished: pageDisplayDateField?.value
            ? new Date(String(pageDisplayDateField.value)).toISOString()
            : undefined,
          dateModified: pageDisplayDateField?.value
            ? new Date(String(pageDisplayDateField.value)).toISOString()
            : undefined,
          author: pageAuthorField
            ? {
                name: `${pageAuthorField.fields?.personFirstName?.value || ''} ${
                  pageAuthorField.fields?.personLastName?.value || ''
                }`.trim(),
              }
            : undefined,
          url: isBrowser ? window.location.href : undefined,
        })
      : null;

    // Generate Person schema for author
    const personSchema = pageAuthorField
      ? generatePersonSchema({
          name: `${pageAuthorField.fields?.personFirstName?.value || ''} ${
            pageAuthorField.fields?.personLastName?.value || ''
          }`.trim(),
          jobTitle: pageAuthorField.fields?.personJobTitle?.value,
          image: pageAuthorField.fields?.personProfileImage?.value?.src,
        })
      : null;

    // Get ISO date string for time element
    const publishedDateISO = pageDisplayDateField?.value
      ? new Date(String(pageDisplayDateField.value)).toISOString()
      : undefined;

    return (
      <>
        {articleSchema && <StructuredData id="article-schema" data={articleSchema} />}
        {personSchema && <StructuredData id="author-person-schema" data={personSchema} />}
        <header
          className={cn('@container article-header relative mb-[86px] overflow-hidden')}
          ref={headerRef}
        >
          <article itemScope={true} itemType="https://schema.org/Article">
          <div className="relative z-0 h-[auto] overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <div
              className="z-5 absolute inset-0 h-[120%] w-[120%] bg-cover bg-center opacity-70 transition-transform duration-200 ease-out"
              style={parallaxStyle}
            >
              <ImageWrapper
                image={imageField}
                alt={pageHeaderTitleField?.value}
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
                    if (isBrowser) {
                      window.history.back();
                    }
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
                {(eyebrowField?.value || isPageEditing) && (
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent font-body mx-auto  mb-4 inline-block text-[14px] font-medium tracking-tighter">
                    <Text field={eyebrowField} />
                  </Badge>
                )}
                {/* Title */}
                <Text
                  tag="h1"
                  className="@md:text-[62px] @md:mb-0 font-heading line-height-[69px] mx-auto max-w-4xl text-pretty px-6 text-center text-4xl font-normal tracking-tighter text-white"
                  field={pageHeaderTitleField}
                />
                {/* Read Time and Date - Centered */}
                {(pageReadTimeField?.value ||
                  pageDisplayDateField?.value ||
                  isPageEditing) && (
                  <div className="@md:flex-row @xl:px-8 mb-8 flex flex-col items-center justify-center space-x-2 px-4 text-center text-sm text-white subpixel-antialiased">
                    {(pageReadTimeField?.value || isPageEditing) && (
                      <Text
                        tag="span"
                        field={pageReadTimeField}
                        className="@md:inline-block block text-pretty"
                      />
                    )}
                    {((pageReadTimeField?.value && pageDisplayDateField?.value) ||
                      isPageEditing) && (
                      <span className="@md:inline-block hidden text-pretty">•</span>
                    )}
                    {pageDisplayDateField?.value && (
                      <time
                        dateTime={publishedDateISO}
                        itemProp="datePublished"
                        className="@md:inline-block block text-pretty"
                      >
                        <DateField
                          tag="span"
                          field={pageDisplayDateField}
                          render={(date) => formatDateInUTC(String(date))}
                        />
                      </time>
                    )}
                  </div>
                )}
              </div>
              <div className="@lg:grid @lg:max-w-screen-3xl @lg:mx-auto @lg:w-full @lg:gap-8 @lg:grid-cols-12 mx-6 mb-auto grid grid-cols-2 items-start justify-between">
                <div className="@lg:col-span-3 @lg:justify-end @lg:pt-4 @lg:h-[250px] @lg:items-start col-span-1 flex h-[auto] flex-wrap items-center justify-center gap-4 p-6 subpixel-antialiased">
                  {pageAuthorField && (
                    <div className="grid gap-y-3">
                      <p className="flex min-h-10 flex-col justify-center text-sm text-white">
                        {dictionary.ARTICLE_HEADER_AUTHOR_LABEL}
                      </p>
                      <Avatar>
                        <AvatarImage
                          src={pageAuthorField?.fields?.personProfileImage?.value?.src}
                          alt={`${pageAuthorField?.fields?.personFirstName?.value} ${pageAuthorField?.fields?.personLastName?.value}`}
                        />
                        <AvatarFallback>{`${pageAuthorField?.fields?.personFirstName?.value} ${pageAuthorField?.fields?.personLastName?.value}`}</AvatarFallback>
                      </Avatar>
                      <div className="relative">
                        <p className="text-pretty font-medium text-white">
                          {pageAuthorField?.fields?.personFirstName?.value}{' '}
                          {pageAuthorField?.fields?.personLastName?.value}
                        </p>
                        {pageAuthorField?.fields?.personJobTitle && (
                          <Text
                            tag={'p'}
                            field={pageAuthorField?.fields?.personJobTitle}
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
                <figure className="@lg:col-span-6 relative z-10 col-span-2 mx-auto flex aspect-[16/9] w-full max-w-[800px] justify-center overflow-hidden rounded-[24px]">
                  <ImageWrapper
                    image={imageField}
                    alt={pageHeaderTitleField?.value}
                    className="h-full w-full object-cover "
                    wrapperClass="w-full relative"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    ref={imageRef}
                  />
                </figure>

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
          </article>
        </header>
        <Toaster />
      </>
    );
  }

  return <NoDataFallback componentName="ArticleHeader" />;
};
