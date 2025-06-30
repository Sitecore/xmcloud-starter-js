'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Facebook, Linkedin, Twitter, Link, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import type { ArticleHeaderProps } from './article-header.props';
import { Badge } from '@/components/ui/badge';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ButtonBase } from '../button-component/ButtonComponent';
import { FloatingDock } from '@/components/floating-dock/floating-dock.dev';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export const Default: React.FC<ArticleHeaderProps> = ({ fields, externalFields }) => {
  const { imageRequired, eyebrowOptional } = fields;
  const { pageHeaderTitle, pageReadTime, pageDisplayDate, pageAuthor } = externalFields;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [forceCollapse] = useState(true);
  const copyNotificationRef = useRef<HTMLDivElement>(null);

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

  if (fields) {
    const parallaxStyle = imageRequired?.value?.src
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
          <div className="  relative z-0 h-[auto] overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            <div
              className="z-5 absolute inset-0 h-[120%] w-[120%] bg-cover bg-center opacity-70 transition-transform duration-200 ease-out"
              style={parallaxStyle}
            >
              <ImageWrapper
                image={imageRequired}
                alt={pageHeaderTitle.value}
                className="h-full w-full object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                ref={imageRef}
              />
            </div>
            {/* Blur overlay - separate for better performance */}
            <div className="absolute inset-0 backdrop-blur-md"></div>
            {/* White Section */}
            {/* in order to be fully responsive the hight of this section needs to be half of the height of the image */}
            <div className="@xs:h-[125px] @sm:h-[150px] @md:h-[140px] @lg:h-[140px] absolute bottom-0 h-[90px] w-full  bg-white"></div>

            {/* Content */}
            <div className="z-1 @md:gap-[200px] @md:pb-0 relative mx-auto flex h-full flex-col justify-between p-0 pb-6 pt-[220px]">
              <div className="flex flex-col">
                {/* Back Button */}
                <ButtonBase
                  buttonLink={{ value: { href: '/news', text: 'Back to news' } }}
                  className="absolute left-0 top-[41px] mb-8 inline-flex items-center text-white/90 transition-colors hover:text-white"
                  icon={{ value: 'arrow-left' }}
                  variant="link"
                  iconPosition="leading"
                />
                {/* Category Badge */}
                {eyebrowOptional && (
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent font-body mx-auto  mb-4 inline-block text-[14px] font-medium tracking-tighter">
                    <Text field={eyebrowOptional} />
                  </Badge>
                )}
                {/* Title */}
                <Text
                  tag="h1"
                  className="@md:text-[62px] @md:mb-0 font-heading line-height-[69px] mx-auto max-w-4xl text-pretty px-6 text-center text-4xl font-normal tracking-tighter text-white antialiased"
                  field={pageHeaderTitle}
                />
                {/* Read Time and Date - Centered */}
                {(pageReadTime || pageDisplayDate) && (
                  <div className="@md:flex-row mb-8 flex flex-col items-center justify-center space-x-2 text-center text-white/70">
                    {pageReadTime && (
                      <Text
                        tag="span"
                        field={pageReadTime}
                        className="@md:inline-block block text-pretty antialiased"
                      />
                    )}
                    {pageReadTime && pageDisplayDate && (
                      <span className="@md:inline-block hidden text-pretty antialiased">•</span>
                    )}
                    {pageDisplayDate && (
                      <Text
                        tag="span"
                        field={pageDisplayDate}
                        className="@md:inline-block block text-pretty antialiased"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="@md:grid @md:max-w-screen-3xl @md:mx-auto @md:w-full @md:gap-8 @md:grid-cols-12 mx-6 mb-auto grid grid-cols-2 items-start justify-between">
                {pageAuthor && (
                  <div className="@md:col-span-3 @md:justify-end @md:pt-4 @md:h-[250px] @md:items-start col-span-1 flex h-[auto] items-center justify-center gap-4 p-6 pb-6">
                    <Avatar>
                      <AvatarImage
                        src={pageAuthor.value.personProfileImage?.value?.src}
                        alt={`${pageAuthor.value.personFirstName?.value} ${pageAuthor.value.personLastName?.value}`}
                      />
                      <AvatarFallback>{`${pageAuthor.value.personFirstName?.value} ${pageAuthor.value.personLastName?.value}`}</AvatarFallback>
                    </Avatar>
                    <div className="relative">
                      <p className="text-pretty font-medium text-white antialiased">
                        {pageAuthor.value.personFirstName?.value}{' '}
                        {pageAuthor.value.personLastName?.value}
                      </p>
                      {pageAuthor?.value?.personJobTitle && (
                        <Text
                          tag={'p'}
                          field={pageAuthor.value.personJobTitle}
                          className="text-pretty text-sm text-white/70 antialiased"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Share Section - Mobile Only */}
                <div className="@md:hidden col-span-1 flex h-[auto] items-center justify-center gap-4 p-6 pb-6">
                  <p className="@md:mb-2 m-0 flex items-center justify-center text-pretty font-medium text-white antialiased">
                    Share
                  </p>
                  <FloatingDock items={links} forceCollapse={forceCollapse} />
                </div>

                {/* Featured Image */}
                <div className="@md:col-span-6 relative z-10 col-span-2 mx-auto flex aspect-[16/9] w-full max-w-[800px] justify-center overflow-hidden rounded-[24px]">
                  <ImageWrapper
                    image={imageRequired}
                    alt={pageHeaderTitle.value}
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                    ref={imageRef}
                  />
                </div>

                {/* Share Section - Desktop Only */}
                <div className="@md:col-span-3 @md:justify-start @md:pt-4 @md:h-[250px] @md:items-start @md:flex hidden h-[auto] items-center justify-center gap-4 p-6 pb-6">
                  <p className="@md:mt-2 m-0 mb-2 flex items-center justify-center text-pretty font-medium text-white antialiased">
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
