// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
import * as zipcodemodaldev from 'src/components/zipcode-modal/zipcode-modal.dev';
import * as VideoPlayerdev from 'src/components/video/VideoPlayer.dev';
import * as VideoModaldev from 'src/components/video/VideoModal.dev';
import * as Video from 'src/components/video/Video';
import * as videoprops from 'src/components/video/video-props';
import * as VerticalImageAccordion from 'src/components/vertical-image-accordion/VerticalImageAccordion';
import * as TopicListing from 'src/components/topic-listing/TopicListing';
import * as TopicItemdev from 'src/components/topic-listing/TopicItem.dev';
import * as topiclistingprops from 'src/components/topic-listing/topic-listing.props';
import * as themeproviderdev from 'src/components/theme-provider/theme-provider.dev';
import * as TextBannerTextTopdev from 'src/components/text-banner/TextBannerTextTop.dev';
import * as TextBannerDefaultdev from 'src/components/text-banner/TextBannerDefault.dev';
import * as TextBannerBlueTitleRightdev from 'src/components/text-banner/TextBannerBlueTitleRight.dev';
import * as TextBanner02dev from 'src/components/text-banner/TextBanner02.dev';
import * as TextBanner01dev from 'src/components/text-banner/TextBanner01.dev';
import * as TextBanner from 'src/components/text-banner/TextBanner';
import * as textbannerprops from 'src/components/text-banner/text-banner.props';
import * as TestimonialCarouselItem from 'src/components/testimonial-carousel/TestimonialCarouselItem';
import * as TestimonialCarousel from 'src/components/testimonial-carousel/TestimonialCarousel';
import * as testimonialcarouselprops from 'src/components/testimonial-carousel/testimonial-carousel.props';
import * as Title from 'src/components/sxa/Title';
import * as RowSplitter from 'src/components/sxa/RowSplitter';
import * as RichText from 'src/components/sxa/RichText';
import * as Promo from 'src/components/sxa/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/sxa/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/sxa/PageContent';
import * as Navigation from 'src/components/sxa/Navigation';
import * as LinkList from 'src/components/sxa/LinkList';
import * as Image from 'src/components/sxa/Image';
import * as ContentBlock from 'src/components/sxa/ContentBlock';
import * as Container from 'src/components/sxa/Container';
import * as ColumnSplitter from 'src/components/sxa/ColumnSplitter';
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as SubmissionFormDefaultdev from 'src/components/submission-form/SubmissionFormDefault.dev';
import * as SubmissionFormCentereddev from 'src/components/submission-form/SubmissionFormCentered.dev';
import * as SubmissionForm from 'src/components/submission-form/SubmissionForm';
import * as submissionformprops from 'src/components/submission-form/submission-form.props';
import * as SlideCarouseldev from 'src/components/slide-carousel/SlideCarousel.dev';
import * as SiteMetadata from 'src/components/site-metadata/SiteMetadata';
import * as SecondaryNavigation from 'src/components/secondary-navigation/SecondaryNavigation';
import * as RichTextBlock from 'src/components/rich-text-block/RichTextBlock';
import * as PromoImageTitlePartialOverlaydev from 'src/components/promo-image/PromoImageTitlePartialOverlay.dev';
import * as PromoImageRightdev from 'src/components/promo-image/PromoImageRight.dev';
import * as PromoImageMiddledev from 'src/components/promo-image/PromoImageMiddle.dev';
import * as PromoImageLeftdev from 'src/components/promo-image/PromoImageLeft.dev';
import * as PromoImageDefaultdev from 'src/components/promo-image/PromoImageDefault.dev';
import * as PromoImage from 'src/components/promo-image/PromoImage';
import * as promoimageprops from 'src/components/promo-image/promo-image.props';
import * as PromoBlock from 'src/components/promo-block/PromoBlock';
import * as PromoAnimatedImageRightdev from 'src/components/promo-animated/PromoAnimatedImageRight.dev';
import * as PromoAnimatedDefaultdev from 'src/components/promo-animated/PromoAnimatedDefault.dev';
import * as PromoAnimated from 'src/components/promo-animated/PromoAnimated';
import * as promoanimatedutil from 'src/components/promo-animated/promo-animated.util';
import * as promoanimatedprops from 'src/components/promo-animated/promo-animated.props';
import * as ProductListingThreeUpdev from 'src/components/product-listing/ProductListingThreeUp.dev';
import * as ProductListingSliderdev from 'src/components/product-listing/ProductListingSlider.dev';
import * as ProductListingDefaultdev from 'src/components/product-listing/ProductListingDefault.dev';
import * as ProductListingCarddev from 'src/components/product-listing/ProductListingCard.dev';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as productlistingprops from 'src/components/product-listing/product-listing.props';
import * as productlistingdictionary from 'src/components/product-listing/product-listing.dictionary';
import * as portaldev from 'src/components/portal/portal.dev';
import * as PageHeaderFiftyFiftydev from 'src/components/page-header/PageHeaderFiftyFifty.dev';
import * as PageHeaderDefaultdev from 'src/components/page-header/PageHeaderDefault.dev';
import * as PageHeaderCentereddev from 'src/components/page-header/PageHeaderCentered.dev';
import * as PageHeaderBlueTextdev from 'src/components/page-header/PageHeaderBlueText.dev';
import * as PageHeaderBlueBackgrounddev from 'src/components/page-header/PageHeaderBlueBackground.dev';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as pageheaderprops from 'src/components/page-header/page-header.props';
import * as MultiPromoTabs from 'src/components/multi-promo-tabs/MultiPromoTabs';
import * as MultiPromoTabdev from 'src/components/multi-promo-tabs/MultiPromoTab.dev';
import * as multipromotabsprops from 'src/components/multi-promo-tabs/multi-promo-tabs.props';
import * as MultiPromoItemdev from 'src/components/multi-promo/MultiPromoItem.dev';
import * as MultiPromo from 'src/components/multi-promo/MultiPromo';
import * as multipromoprops from 'src/components/multi-promo/multi-promo.props';
import * as modetoggledev from 'src/components/mode-toggle/mode-toggle.dev';
import * as MediaSectiondev from 'src/components/media-section/MediaSection.dev';
import * as meteors from 'src/components/magicui/meteors';
import * as LogoTabs from 'src/components/logo-tabs/LogoTabs';
import * as LogoItem from 'src/components/logo-tabs/LogoItem';
import * as logotabsprops from 'src/components/logo-tabs/logo-tabs.props';
import * as Logodev from 'src/components/logo/Logo.dev';
import * as utils from 'src/components/location-search/utils';
import * as LocationSearchTitleZipCentereddev from 'src/components/location-search/LocationSearchTitleZipCentered.dev';
import * as LocationSearchMapTopAllCentereddev from 'src/components/location-search/LocationSearchMapTopAllCentered.dev';
import * as LocationSearchMapRightTitleZipCentereddev from 'src/components/location-search/LocationSearchMapRightTitleZipCentered.dev';
import * as LocationSearchMapRightdev from 'src/components/location-search/LocationSearchMapRight.dev';
import * as LocationSearchItemdev from 'src/components/location-search/LocationSearchItem.dev';
import * as LocationSearchDefaultdev from 'src/components/location-search/LocationSearchDefault.dev';
import * as LocationSearch from 'src/components/location-search/LocationSearch';
import * as locationsearchprops from 'src/components/location-search/location-search.props';
import * as locationsearchitemprops from 'src/components/location-search/location-search-item.props';
import * as GoogleMapdev from 'src/components/location-search/GoogleMap.dev';
import * as googlemapsprops from 'src/components/location-search/google-maps.props';
import * as JssRichText from 'src/components/jss/JssRichText';
import * as ImageGalleryNoSpacingdev from 'src/components/image-gallery/ImageGalleryNoSpacing.dev';
import * as ImageGalleryGriddev from 'src/components/image-gallery/ImageGalleryGrid.dev';
import * as ImageGalleryFiftyFiftydev from 'src/components/image-gallery/ImageGalleryFiftyFifty.dev';
import * as ImageGalleryFeaturedImagedev from 'src/components/image-gallery/ImageGalleryFeaturedImage.dev';
import * as ImageGallery from 'src/components/image-gallery/ImageGallery';
import * as ImageGallerydev from 'src/components/image-gallery/ImageGallery.dev';
import * as imagegalleryprops from 'src/components/image-gallery/image-gallery.props';
import * as ImageCarouselThumbnailsdev from 'src/components/image-carousel/ImageCarouselThumbnails.dev';
import * as ImageCarouselPreviewBelowdev from 'src/components/image-carousel/ImageCarouselPreviewBelow.dev';
import * as ImageCarouselLeftRightPreviewdev from 'src/components/image-carousel/ImageCarouselLeftRightPreview.dev';
import * as ImageCarouselFullBleeddev from 'src/components/image-carousel/ImageCarouselFullBleed.dev';
import * as ImageCarouselFeaturedImageLeftdev from 'src/components/image-carousel/ImageCarouselFeaturedImageLeft.dev';
import * as ImageCarouselEditModedev from 'src/components/image-carousel/ImageCarouselEditMode.dev';
import * as ImageCarouselDefaultdev from 'src/components/image-carousel/ImageCarouselDefault.dev';
import * as ImageCarousel from 'src/components/image-carousel/ImageCarousel';
import * as imagecarouselprops from 'src/components/image-carousel/image-carousel.props';
import * as nextImageSrcdev from 'src/components/image/nextImageSrc.dev';
import * as ImageWrapperdev from 'src/components/image/ImageWrapper.dev';
import * as ImageBlock from 'src/components/image/ImageBlock';
import * as imageprops from 'src/components/image/image.props';
import * as imageoptimizationcontext from 'src/components/image/image-optimization.context';
import * as Icon from 'src/components/icon/Icon';
import * as YoutubeIcondev from 'src/components/icon/svg/YoutubeIcon.dev';
import * as TwitterIcondev from 'src/components/icon/svg/TwitterIcon.dev';
import * as signaldev from 'src/components/icon/svg/signal.dev';
import * as playdev from 'src/components/icon/svg/play.dev';
import * as LinkedInIcondev from 'src/components/icon/svg/LinkedInIcon.dev';
import * as InternalIcondev from 'src/components/icon/svg/InternalIcon.dev';
import * as InstagramIcondev from 'src/components/icon/svg/InstagramIcon.dev';
import * as FileIcondev from 'src/components/icon/svg/FileIcon.dev';
import * as FacebookIcondev from 'src/components/icon/svg/FacebookIcon.dev';
import * as ExternalIcondev from 'src/components/icon/svg/ExternalIcon.dev';
import * as EmailIcondev from 'src/components/icon/svg/EmailIcon.dev';
import * as diversitydev from 'src/components/icon/svg/diversity.dev';
import * as crossarrowsdev from 'src/components/icon/svg/cross-arrows.dev';
import * as communitiesdev from 'src/components/icon/svg/communities.dev';
import * as arrowuprightdev from 'src/components/icon/svg/arrow-up-right.dev';
import * as arrowrightdev from 'src/components/icon/svg/arrow-right.dev';
import * as arrowleftdev from 'src/components/icon/svg/arrow-left.dev';
import * as HeroImageRightdev from 'src/components/hero/HeroImageRight.dev';
import * as HeroImageBottomInsetdev from 'src/components/hero/HeroImageBottomInset.dev';
import * as HeroImageBottomdev from 'src/components/hero/HeroImageBottom.dev';
import * as HeroImageBackgrounddev from 'src/components/hero/HeroImageBackground.dev';
import * as HeroDefaultdev from 'src/components/hero/HeroDefault.dev';
import * as Hero from 'src/components/hero/Hero';
import * as heroprops from 'src/components/hero/hero.props';
import * as herodictionary from 'src/components/hero/hero.dictionary';
import * as GlobalHeaderDefaultdev from 'src/components/global-header/GlobalHeaderDefault.dev';
import * as GlobalHeaderCentereddev from 'src/components/global-header/GlobalHeaderCentered.dev';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as globalheaderprops from 'src/components/global-header/global-header.props';
import * as GlobalFooterDefaultdev from 'src/components/global-footer/GlobalFooterDefault.dev';
import * as GlobalFooterBlueCompactdev from 'src/components/global-footer/GlobalFooterBlueCompact.dev';
import * as GlobalFooterBlueCentereddev from 'src/components/global-footer/GlobalFooterBlueCentered.dev';
import * as GlobalFooterBlackLargedev from 'src/components/global-footer/GlobalFooterBlackLarge.dev';
import * as GlobalFooterBlackCompactdev from 'src/components/global-footer/GlobalFooterBlackCompact.dev';
import * as GlobalFooter from 'src/components/global-footer/GlobalFooter';
import * as globalfooterprops from 'src/components/global-footer/global-footer.props';
import * as globalfooterdictionary from 'src/components/global-footer/global-footer.dictionary';
import * as FooterNavigationColumndev from 'src/components/global-footer/FooterNavigationColumn.dev';
import * as ZipcodeSearchFormdev from 'src/components/forms/zipcode/ZipcodeSearchForm.dev';
import * as successcompactdev from 'src/components/forms/success/success-compact.dev';
import * as SubmitInfoFormdev from 'src/components/forms/submitinfo/SubmitInfoForm.dev';
import * as submitinfoformdictionary from 'src/components/forms/submitinfo/submit-info-form.dictionary';
import * as EmailSignupFormdev from 'src/components/forms/email/EmailSignupForm.dev';
import * as FooterNavigationCalloutdev from 'src/components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as floatingdockdev from 'src/components/floating-dock/floating-dock.dev';
import * as Flexdev from 'src/components/flex/Flex.dev';
import * as CtaBanner from 'src/components/cta-banner/CtaBanner';
import * as containerutil from 'src/components/container/container.util';
import * as containerprops from 'src/components/container/container.props';
import * as ContainerFullWidth from 'src/components/container/container-full-width/ContainerFullWidth';
import * as containerfullwidthprops from 'src/components/container/container-full-width/container-full-width.props';
import * as ContainerFullBleed from 'src/components/container/container-full-bleed/ContainerFullBleed';
import * as containerfullbleedprops from 'src/components/container/container-full-bleed/container-full-bleed.props';
import * as Container7030 from 'src/components/container/container-7030/Container7030';
import * as container7030props from 'src/components/container/container-7030/container-7030.props';
import * as Container70 from 'src/components/container/container-70/Container70';
import * as container70props from 'src/components/container/container-70/container-70.props';
import * as Container6321 from 'src/components/container/container-6321/Container6321';
import * as Container6040 from 'src/components/container/container-6040/Container6040';
import * as container6040props from 'src/components/container/container-6040/container-6040.props';
import * as Container5050 from 'src/components/container/container-5050/Container5050';
import * as container5050props from 'src/components/container/container-5050/container-5050.props';
import * as Container4060 from 'src/components/container/container-4060/Container4060';
import * as container4060props from 'src/components/container/container-4060/container-4060.props';
import * as Container3070 from 'src/components/container/container-3070/Container3070';
import * as container3070props from 'src/components/container/container-3070/container-3070.props';
import * as Container303030 from 'src/components/container/container-303030/Container303030';
import * as container303030props from 'src/components/container/container-303030/container-303030.props';
import * as Container25252525 from 'src/components/container/container-25252525/Container25252525';
import * as testimonials from 'src/components/component-library/testimonials';
import * as TeamSection from 'src/components/component-library/TeamSection';
import * as StatsSection from 'src/components/component-library/StatsSection';
import * as ProductsSection from 'src/components/component-library/ProductsSection';
import * as PlaceholderTabs from 'src/components/component-library/PlaceholderTabs';
import * as NewsletterSection from 'src/components/component-library/NewsletterSection';
import * as logocloud from 'src/components/component-library/logo-cloud';
import * as hero from 'src/components/component-library/hero';
import * as Header from 'src/components/component-library/Header';
import * as FeaturesSection from 'src/components/component-library/FeaturesSection';
import * as FAQ from 'src/components/component-library/FAQ';
import * as ContactSection from 'src/components/component-library/ContactSection';
import * as calltoaction from 'src/components/component-library/calltoaction';
import * as Carousel from 'src/components/carousel/Carousel';
import * as cardspotlightdev from 'src/components/card-spotlight/card-spotlight.dev';
import * as Carddev from 'src/components/card/Card.dev';
import * as ButtonComponent from 'src/components/button-component/ButtonComponent';
import * as Breadcrumbs from 'src/components/breadcrumbs/Breadcrumbs';
import * as BackgroundThumbnaildev from 'src/components/background-thumbnail/BackgroundThumbnail.dev';
import * as ArticleHeader from 'src/components/article-header/ArticleHeader';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as AlertBannerdev from 'src/components/alert-banner/AlertBanner.dev';
import * as AccordionBlockTwoColumnTitleLeftdev from 'src/components/accordion-block/AccordionBlockTwoColumnTitleLeft.dev';
import * as AccordionBlockOneColumnTitleLeftdev from 'src/components/accordion-block/AccordionBlockOneColumnTitleLeft.dev';
import * as AccordionBlockItemdev from 'src/components/accordion-block/AccordionBlockItem.dev';
import * as AccordionBlockDefaultdev from 'src/components/accordion-block/AccordionBlockDefault.dev';
import * as AccordionBlockCentereddev from 'src/components/accordion-block/AccordionBlockCentered.dev';
import * as AccordionBlock from 'src/components/accordion-block/AccordionBlock';
import * as Accordion5050TitleAbovedev from 'src/components/accordion-block/Accordion5050TitleAbove.dev';
import * as accordionblockprops from 'src/components/accordion-block/accordion-block.props';


// Components must be registered within the map to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['zipcodemodaldev', zipcodemodaldev],
  ['VideoPlayerdev', VideoPlayerdev],
  ['VideoModaldev', VideoModaldev],
  ['Video', Video],
  ['videoprops', videoprops],
  ['VerticalImageAccordion', VerticalImageAccordion],
  ['TopicListing', TopicListing],
  ['TopicItemdev', TopicItemdev],
  ['topiclistingprops', topiclistingprops],
  ['themeproviderdev', themeproviderdev],
  ['TextBannerTextTopdev', TextBannerTextTopdev],
  ['TextBannerDefaultdev', TextBannerDefaultdev],
  ['TextBannerBlueTitleRightdev', TextBannerBlueTitleRightdev],
  ['TextBanner02dev', TextBanner02dev],
  ['TextBanner01dev', TextBanner01dev],
  ['TextBanner', TextBanner],
  ['textbannerprops', textbannerprops],
  ['TestimonialCarouselItem', TestimonialCarouselItem],
  ['TestimonialCarousel', TestimonialCarousel],
  ['testimonialcarouselprops', testimonialcarouselprops],
  ['Title', Title],
  ['RowSplitter', RowSplitter],
  ['RichText', RichText],
  ['Promo', Promo],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['PageContent', PageContent],
  ['Navigation', Navigation],
  ['LinkList', LinkList],
  ['Image', Image],
  ['ContentBlock', ContentBlock],
  ['Container', Container],
  ['ColumnSplitter', ColumnSplitter],
  ['SubscriptionBanner', SubscriptionBanner],
  ['SubmissionFormDefaultdev', SubmissionFormDefaultdev],
  ['SubmissionFormCentereddev', SubmissionFormCentereddev],
  ['SubmissionForm', SubmissionForm],
  ['submissionformprops', submissionformprops],
  ['SlideCarouseldev', SlideCarouseldev],
  ['SiteMetadata', SiteMetadata],
  ['SecondaryNavigation', SecondaryNavigation],
  ['RichTextBlock', RichTextBlock],
  ['PromoImageTitlePartialOverlaydev', PromoImageTitlePartialOverlaydev],
  ['PromoImageRightdev', PromoImageRightdev],
  ['PromoImageMiddledev', PromoImageMiddledev],
  ['PromoImageLeftdev', PromoImageLeftdev],
  ['PromoImageDefaultdev', PromoImageDefaultdev],
  ['PromoImage', PromoImage],
  ['promoimageprops', promoimageprops],
  ['PromoBlock', PromoBlock],
  ['PromoAnimatedImageRightdev', PromoAnimatedImageRightdev],
  ['PromoAnimatedDefaultdev', PromoAnimatedDefaultdev],
  ['PromoAnimated', PromoAnimated],
  ['promoanimatedutil', promoanimatedutil],
  ['promoanimatedprops', promoanimatedprops],
  ['ProductListingThreeUpdev', ProductListingThreeUpdev],
  ['ProductListingSliderdev', ProductListingSliderdev],
  ['ProductListingDefaultdev', ProductListingDefaultdev],
  ['ProductListingCarddev', ProductListingCarddev],
  ['ProductListing', ProductListing],
  ['productlistingprops', productlistingprops],
  ['productlistingdictionary', productlistingdictionary],
  ['portaldev', portaldev],
  ['PageHeaderFiftyFiftydev', PageHeaderFiftyFiftydev],
  ['PageHeaderDefaultdev', PageHeaderDefaultdev],
  ['PageHeaderCentereddev', PageHeaderCentereddev],
  ['PageHeaderBlueTextdev', PageHeaderBlueTextdev],
  ['PageHeaderBlueBackgrounddev', PageHeaderBlueBackgrounddev],
  ['PageHeader', PageHeader],
  ['pageheaderprops', pageheaderprops],
  ['MultiPromoTabs', MultiPromoTabs],
  ['MultiPromoTabdev', MultiPromoTabdev],
  ['multipromotabsprops', multipromotabsprops],
  ['MultiPromoItemdev', MultiPromoItemdev],
  ['MultiPromo', MultiPromo],
  ['multipromoprops', multipromoprops],
  ['modetoggledev', modetoggledev],
  ['MediaSectiondev', MediaSectiondev],
  ['meteors', meteors],
  ['LogoTabs', LogoTabs],
  ['LogoItem', LogoItem],
  ['logotabsprops', logotabsprops],
  ['Logodev', Logodev],
  ['utils', utils],
  ['LocationSearchTitleZipCentereddev', LocationSearchTitleZipCentereddev],
  ['LocationSearchMapTopAllCentereddev', LocationSearchMapTopAllCentereddev],
  ['LocationSearchMapRightTitleZipCentereddev', LocationSearchMapRightTitleZipCentereddev],
  ['LocationSearchMapRightdev', LocationSearchMapRightdev],
  ['LocationSearchItemdev', LocationSearchItemdev],
  ['LocationSearchDefaultdev', LocationSearchDefaultdev],
  ['LocationSearch', LocationSearch],
  ['locationsearchprops', locationsearchprops],
  ['locationsearchitemprops', locationsearchitemprops],
  ['GoogleMapdev', GoogleMapdev],
  ['googlemapsprops', googlemapsprops],
  ['JssRichText', JssRichText],
  ['ImageGalleryNoSpacingdev', ImageGalleryNoSpacingdev],
  ['ImageGalleryGriddev', ImageGalleryGriddev],
  ['ImageGalleryFiftyFiftydev', ImageGalleryFiftyFiftydev],
  ['ImageGalleryFeaturedImagedev', ImageGalleryFeaturedImagedev],
  ['ImageGallery', ImageGallery],
  ['ImageGallerydev', ImageGallerydev],
  ['imagegalleryprops', imagegalleryprops],
  ['ImageCarouselThumbnailsdev', ImageCarouselThumbnailsdev],
  ['ImageCarouselPreviewBelowdev', ImageCarouselPreviewBelowdev],
  ['ImageCarouselLeftRightPreviewdev', ImageCarouselLeftRightPreviewdev],
  ['ImageCarouselFullBleeddev', ImageCarouselFullBleeddev],
  ['ImageCarouselFeaturedImageLeftdev', ImageCarouselFeaturedImageLeftdev],
  ['ImageCarouselEditModedev', ImageCarouselEditModedev],
  ['ImageCarouselDefaultdev', ImageCarouselDefaultdev],
  ['ImageCarousel', ImageCarousel],
  ['imagecarouselprops', imagecarouselprops],
  ['nextImageSrcdev', nextImageSrcdev],
  ['ImageWrapperdev', ImageWrapperdev],
  ['ImageBlock', ImageBlock],
  ['imageprops', imageprops],
  ['imageoptimizationcontext', imageoptimizationcontext],
  ['Icon', Icon],
  ['YoutubeIcondev', YoutubeIcondev],
  ['TwitterIcondev', TwitterIcondev],
  ['signaldev', signaldev],
  ['playdev', playdev],
  ['LinkedInIcondev', LinkedInIcondev],
  ['InternalIcondev', InternalIcondev],
  ['InstagramIcondev', InstagramIcondev],
  ['FileIcondev', FileIcondev],
  ['FacebookIcondev', FacebookIcondev],
  ['ExternalIcondev', ExternalIcondev],
  ['EmailIcondev', EmailIcondev],
  ['diversitydev', diversitydev],
  ['crossarrowsdev', crossarrowsdev],
  ['communitiesdev', communitiesdev],
  ['arrowuprightdev', arrowuprightdev],
  ['arrowrightdev', arrowrightdev],
  ['arrowleftdev', arrowleftdev],
  ['HeroImageRightdev', HeroImageRightdev],
  ['HeroImageBottomInsetdev', HeroImageBottomInsetdev],
  ['HeroImageBottomdev', HeroImageBottomdev],
  ['HeroImageBackgrounddev', HeroImageBackgrounddev],
  ['HeroDefaultdev', HeroDefaultdev],
  ['Hero', Hero],
  ['heroprops', heroprops],
  ['herodictionary', herodictionary],
  ['GlobalHeaderDefaultdev', GlobalHeaderDefaultdev],
  ['GlobalHeaderCentereddev', GlobalHeaderCentereddev],
  ['GlobalHeader', GlobalHeader],
  ['globalheaderprops', globalheaderprops],
  ['GlobalFooterDefaultdev', GlobalFooterDefaultdev],
  ['GlobalFooterBlueCompactdev', GlobalFooterBlueCompactdev],
  ['GlobalFooterBlueCentereddev', GlobalFooterBlueCentereddev],
  ['GlobalFooterBlackLargedev', GlobalFooterBlackLargedev],
  ['GlobalFooterBlackCompactdev', GlobalFooterBlackCompactdev],
  ['GlobalFooter', GlobalFooter],
  ['globalfooterprops', globalfooterprops],
  ['globalfooterdictionary', globalfooterdictionary],
  ['FooterNavigationColumndev', FooterNavigationColumndev],
  ['ZipcodeSearchFormdev', ZipcodeSearchFormdev],
  ['successcompactdev', successcompactdev],
  ['SubmitInfoFormdev', SubmitInfoFormdev],
  ['submitinfoformdictionary', submitinfoformdictionary],
  ['EmailSignupFormdev', EmailSignupFormdev],
  ['FooterNavigationCalloutdev', FooterNavigationCalloutdev],
  ['floatingdockdev', floatingdockdev],
  ['Flexdev', Flexdev],
  ['CtaBanner', CtaBanner],
  ['containerutil', containerutil],
  ['containerprops', containerprops],
  ['ContainerFullWidth', ContainerFullWidth],
  ['containerfullwidthprops', containerfullwidthprops],
  ['ContainerFullBleed', ContainerFullBleed],
  ['containerfullbleedprops', containerfullbleedprops],
  ['Container7030', Container7030],
  ['container7030props', container7030props],
  ['Container70', Container70],
  ['container70props', container70props],
  ['Container6321', Container6321],
  ['Container6040', Container6040],
  ['container6040props', container6040props],
  ['Container5050', Container5050],
  ['container5050props', container5050props],
  ['Container4060', Container4060],
  ['container4060props', container4060props],
  ['Container3070', Container3070],
  ['container3070props', container3070props],
  ['Container303030', Container303030],
  ['container303030props', container303030props],
  ['Container25252525', Container25252525],
  ['testimonials', testimonials],
  ['TeamSection', TeamSection],
  ['StatsSection', StatsSection],
  ['ProductsSection', ProductsSection],
  ['PlaceholderTabs', PlaceholderTabs],
  ['NewsletterSection', NewsletterSection],
  ['logocloud', logocloud],
  ['hero', hero],
  ['Header', Header],
  ['FeaturesSection', FeaturesSection],
  ['FAQ', FAQ],
  ['ContactSection', ContactSection],
  ['calltoaction', calltoaction],
  ['Carousel', Carousel],
  ['cardspotlightdev', cardspotlightdev],
  ['Carddev', Carddev],
  ['ButtonComponent', ButtonComponent],
  ['Breadcrumbs', Breadcrumbs],
  ['BackgroundThumbnaildev', BackgroundThumbnaildev],
  ['ArticleHeader', ArticleHeader],
  ['AnimatedSectiondev', AnimatedSectiondev],
  ['AlertBannerdev', AlertBannerdev],
  ['AccordionBlockTwoColumnTitleLeftdev', AccordionBlockTwoColumnTitleLeftdev],
  ['AccordionBlockOneColumnTitleLeftdev', AccordionBlockOneColumnTitleLeftdev],
  ['AccordionBlockItemdev', AccordionBlockItemdev],
  ['AccordionBlockDefaultdev', AccordionBlockDefaultdev],
  ['AccordionBlockCentereddev', AccordionBlockCentereddev],
  ['AccordionBlock', AccordionBlock],
  ['Accordion5050TitleAbovedev', Accordion5050TitleAbovedev],
  ['accordionblockprops', accordionblockprops],
]);

export default componentMap;
