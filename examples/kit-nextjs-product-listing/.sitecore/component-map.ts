// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as zipcodemodaldev from 'src/components/zipcode-modal/zipcode-modal.dev';
import * as VerticalImageAccordion from 'src/components/vertical-image-accordion/VerticalImageAccordion';
import * as TopicListing from 'src/components/topic-listing/TopicListing';
import * as TopicItemdev from 'src/components/topic-listing/TopicItem.dev';
import * as themeproviderdev from 'src/components/theme-provider/theme-provider.dev';
import * as TextBannerTextTopdev from 'src/components/text-banner/TextBannerTextTop.dev';
import * as TextBannerDefaultdev from 'src/components/text-banner/TextBannerDefault.dev';
import * as TextBannerBlueTitleRightdev from 'src/components/text-banner/TextBannerBlueTitleRight.dev';
import * as TextBanner02dev from 'src/components/text-banner/TextBanner02.dev';
import * as TextBanner01dev from 'src/components/text-banner/TextBanner01.dev';
import * as TextBanner from 'src/components/text-banner/TextBanner';
import * as TestimonialCarouselItem from 'src/components/testimonial-carousel/TestimonialCarouselItem';
import * as TestimonialCarousel from 'src/components/testimonial-carousel/TestimonialCarousel';
import * as Title from 'src/components/sxa/Title';
import * as RowSplitter from 'src/components/sxa/RowSplitter';
import * as RichText from 'src/components/sxa/RichText';
import * as Promo from 'src/components/sxa/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/sxa/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/sxa/PageContent';
import * as NavigationMenuToggleclient from 'src/components/sxa/NavigationMenuToggle.client';
import * as NavigationListclient from 'src/components/sxa/NavigationList.client';
import * as Navigation from 'src/components/sxa/Navigation';
import * as LinkList from 'src/components/sxa/LinkList';
import * as Image from 'src/components/sxa/Image';
import * as ContentBlock from 'src/components/sxa/ContentBlock';
import * as Container from 'src/components/sxa/Container';
import * as ColumnSplitter from 'src/components/sxa/ColumnSplitter';
import * as ButtonNavigationclient from 'src/components/sxa/ButtonNavigation.client';
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as SubmissionFormDefaultdev from 'src/components/submission-form/SubmissionFormDefault.dev';
import * as SubmissionFormCentereddev from 'src/components/submission-form/SubmissionFormCentered.dev';
import * as SubmissionForm from 'src/components/submission-form/SubmissionForm';
import * as StructuredData from 'src/components/structured-data/StructuredData';
import * as SlideCarouseldev from 'src/components/slide-carousel/SlideCarousel.dev';
import * as Video from 'src/components/site-three/Video';
import * as TextSlider from 'src/components/site-three/TextSlider';
import * as SignupBanner from 'src/components/site-three/SignupBanner';
import * as ProductPageHeader from 'src/components/site-three/ProductPageHeader';
import * as ProductComparison from 'src/components/site-three/ProductComparison';
import * as PageHeaderST from 'src/components/site-three/PageHeaderST';
import * as MultiPromo from 'src/components/site-three/MultiPromo';
import * as MobileMenuWrapper from 'src/components/site-three/MobileMenuWrapper';
import * as MegaMenuItemWrapper from 'src/components/site-three/MegaMenuItemWrapper';
import * as MegaMenuItem from 'src/components/site-three/MegaMenuItem';
import * as ImageCarousel from 'src/components/site-three/ImageCarousel';
import * as ImageBanner from 'src/components/site-three/ImageBanner';
import * as HeroST from 'src/components/site-three/HeroST';
import * as HeaderST from 'src/components/site-three/HeaderST';
import * as FooterST from 'src/components/site-three/FooterST';
import * as FeatureBanner from 'src/components/site-three/FeatureBanner';
import * as AccordionBlock from 'src/components/site-three/AccordionBlock';
import * as SearchBox from 'src/components/site-three/non-sitecore/SearchBox';
import * as MiniCart from 'src/components/site-three/non-sitecore/MiniCart';
import * as SiteMetadata from 'src/components/site-metadata/SiteMetadata';
import * as SecondaryNavigation from 'src/components/secondary-navigation/SecondaryNavigation';
import * as SearchExperienceLoadMore from 'src/components/search-experience/SearchExperience.LoadMore';
import * as SearchExperience from 'src/components/search-experience/SearchExperience';
import * as useSearchField from 'src/components/search-experience/search-components/useSearchField';
import * as useRouter from 'src/components/search-experience/search-components/useRouter';
import * as useParams from 'src/components/search-experience/search-components/useParams';
import * as useEvent from 'src/components/search-experience/search-components/useEvent';
import * as useDebounce from 'src/components/search-experience/search-components/useDebounce';
import * as SearchSkeletonItem from 'src/components/search-experience/search-components/SearchSkeletonItem';
import * as SearchPagination from 'src/components/search-experience/search-components/SearchPagination';
import * as SearchItemCommon from 'src/components/search-experience/search-components/SearchItemCommon';
import * as SearchInput from 'src/components/search-experience/search-components/SearchInput';
import * as SearchError from 'src/components/search-experience/search-components/SearchError';
import * as SearchEmptyResults from 'src/components/search-experience/search-components/SearchEmptyResults';
import * as models from 'src/components/search-experience/search-components/models';
import * as constants from 'src/components/search-experience/search-components/constants';
import * as SearchItemTitle from 'src/components/search-experience/search-components/SearchItem/SearchItemTitle';
import * as SearchItemTags from 'src/components/search-experience/search-components/SearchItem/SearchItemTags';
import * as SearchItemSummary from 'src/components/search-experience/search-components/SearchItem/SearchItemSummary';
import * as SearchItemSubTitle from 'src/components/search-experience/search-components/SearchItem/SearchItemSubTitle';
import * as SearchItemLink from 'src/components/search-experience/search-components/SearchItem/SearchItemLink';
import * as SearchItemImage from 'src/components/search-experience/search-components/SearchItem/SearchItemImage';
import * as SearchItemCategory from 'src/components/search-experience/search-components/SearchItem/SearchItemCategory';
import * as index from 'src/components/search-experience/search-components/SearchItem/index';
import * as RichTextBlock from 'src/components/rich-text-block/RichTextBlock';
import * as PromoImageTitlePartialOverlaydev from 'src/components/promo-image/PromoImageTitlePartialOverlay.dev';
import * as PromoImageRightdev from 'src/components/promo-image/PromoImageRight.dev';
import * as PromoImageMiddledev from 'src/components/promo-image/PromoImageMiddle.dev';
import * as PromoImageLeftdev from 'src/components/promo-image/PromoImageLeft.dev';
import * as PromoImageDefaultdev from 'src/components/promo-image/PromoImageDefault.dev';
import * as PromoImage from 'src/components/promo-image/PromoImage';
import * as PromoBlock from 'src/components/promo-block/PromoBlock';
import * as PromoAnimatedImageRightdev from 'src/components/promo-animated/PromoAnimatedImageRight.dev';
import * as PromoAnimatedEmptyImageEditing from 'src/components/promo-animated/PromoAnimatedEmptyImageEditing';
import * as PromoAnimatedDefaultdev from 'src/components/promo-animated/PromoAnimatedDefault.dev';
import * as PromoAnimated from 'src/components/promo-animated/PromoAnimated';
import * as promoanimatedutil from 'src/components/promo-animated/promo-animated.util';
import * as ProductListingThreeUpdev from 'src/components/product-listing/ProductListingThreeUp.dev';
import * as ProductListingSliderdev from 'src/components/product-listing/ProductListingSlider.dev';
import * as ProductListingDefaultdev from 'src/components/product-listing/ProductListingDefault.dev';
import * as ProductListingCarddev from 'src/components/product-listing/ProductListingCard.dev';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as productlistingdictionary from 'src/components/product-listing/product-listing.dictionary';
import * as portaldev from 'src/components/portal/portal.dev';
import * as PageHeaderFiftyFiftydev from 'src/components/page-header/PageHeaderFiftyFifty.dev';
import * as PageHeaderDefaultdev from 'src/components/page-header/PageHeaderDefault.dev';
import * as PageHeaderCentereddev from 'src/components/page-header/PageHeaderCentered.dev';
import * as PageHeaderBlueTextdev from 'src/components/page-header/PageHeaderBlueText.dev';
import * as PageHeaderBlueBackgrounddev from 'src/components/page-header/PageHeaderBlueBackground.dev';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as MultiPromoTabs from 'src/components/multi-promo-tabs/MultiPromoTabs';
import * as MultiPromoTabdev from 'src/components/multi-promo-tabs/MultiPromoTab.dev';
import * as modetoggledev from 'src/components/mode-toggle/mode-toggle.dev';
import * as MediaSectiondev from 'src/components/media-section/MediaSection.dev';
import * as meteors from 'src/components/magicui/meteors';
import * as LogoTabs from 'src/components/logo-tabs/LogoTabs';
import * as LogoItem from 'src/components/logo-tabs/LogoItem';
import * as Logodev from 'src/components/logo/Logo.dev';
import * as utils from 'src/components/location-search/utils';
import * as LocationSearchTitleZipCentereddev from 'src/components/location-search/LocationSearchTitleZipCentered.dev';
import * as LocationSearchMapTopAllCentereddev from 'src/components/location-search/LocationSearchMapTopAllCentered.dev';
import * as LocationSearchMapRightTitleZipCentereddev from 'src/components/location-search/LocationSearchMapRightTitleZipCentered.dev';
import * as LocationSearchMapRightdev from 'src/components/location-search/LocationSearchMapRight.dev';
import * as LocationSearchItemdev from 'src/components/location-search/LocationSearchItem.dev';
import * as LocationSearchDefaultdev from 'src/components/location-search/LocationSearchDefault.dev';
import * as LocationSearch from 'src/components/location-search/LocationSearch';
import * as GoogleMapdev from 'src/components/location-search/GoogleMap.dev';
import * as ImageGalleryNoSpacingdev from 'src/components/image-gallery/ImageGalleryNoSpacing.dev';
import * as ImageGalleryGriddev from 'src/components/image-gallery/ImageGalleryGrid.dev';
import * as ImageGalleryFiftyFiftydev from 'src/components/image-gallery/ImageGalleryFiftyFifty.dev';
import * as ImageGalleryFeaturedImagedev from 'src/components/image-gallery/ImageGalleryFeaturedImage.dev';
import * as ImageGallerydev from 'src/components/image-gallery/ImageGallery.dev';
import * as ImageGallery from 'src/components/image-gallery/ImageGallery';
import * as nextImageSrcdev from 'src/components/image/nextImageSrc.dev';
import * as ImageWrapperdev from 'src/components/image/ImageWrapper.dev';
import * as ImageWrapperclient from 'src/components/image/ImageWrapper.client';

import * as imageoptimizationcontext from 'src/components/image/image-optimization.context';
import * as Icon from 'src/components/icon/Icon';
import * as YoutubeIcondev from 'src/components/icon/svg/YoutubeIcon.dev';
import * as TwitterIcondev from 'src/components/icon/svg/TwitterIcon.dev';
import * as signaldev from 'src/components/icon/svg/signal.dev';
import * as playdev from 'src/components/icon/svg/play.dev';
import * as LinkedInIcondev from 'src/components/icon/svg/LinkedInIcon.dev';
import * as lineplaydev from 'src/components/icon/svg/line-play.dev';
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
import * as herodictionary from 'src/components/hero/hero.dictionary';
import * as GlobalHeaderDefaultdev from 'src/components/global-header/GlobalHeaderDefault.dev';
import * as GlobalHeaderCentereddev from 'src/components/global-header/GlobalHeaderCentered.dev';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as GlobalFooterDefaultdev from 'src/components/global-footer/GlobalFooterDefault.dev';
import * as GlobalFooterBlueCompactdev from 'src/components/global-footer/GlobalFooterBlueCompact.dev';
import * as GlobalFooterBlueCentereddev from 'src/components/global-footer/GlobalFooterBlueCentered.dev';
import * as GlobalFooterBlackLargedev from 'src/components/global-footer/GlobalFooterBlackLarge.dev';
import * as GlobalFooterBlackCompactdev from 'src/components/global-footer/GlobalFooterBlackCompact.dev';
import * as GlobalFooter from 'src/components/global-footer/GlobalFooter';
import * as globalfooterdictionary from 'src/components/global-footer/global-footer.dictionary';
import * as FooterNavigationColumndev from 'src/components/global-footer/FooterNavigationColumn.dev';
import * as FooterNavigationColumn from 'src/components/global-footer/FooterNavigationColumn';
import * as ZipcodeSearchFormdev from 'src/components/forms/zipcode/ZipcodeSearchForm.dev';
import * as successcompactdev from 'src/components/forms/success/success-compact.dev';
import * as SubmitInfoFormdev from 'src/components/forms/submitinfo/SubmitInfoForm.dev';
import * as submitinfoformdictionary from 'src/components/forms/submitinfo/submit-info-form.dictionary';
import * as EmailSignupFormdev from 'src/components/forms/email/EmailSignupForm.dev';
import * as FooterNavigationCalloutdev from 'src/components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as floatingdockdev from 'src/components/floating-dock/floating-dock.dev';
import * as Flexdev from 'src/components/flex/Flex.dev';
import * as CtaBanner from 'src/components/cta-banner/CtaBanner';
import * as ContentSdkRichText from 'src/components/content-sdk-rich-text/ContentSdkRichText';
import * as containerutil from 'src/components/container/container.util';
import * as ContainerFullWidth from 'src/components/container/container-full-width/ContainerFullWidth';
import * as ContainerFullBleed from 'src/components/container/container-full-bleed/ContainerFullBleed';
import * as Container7030 from 'src/components/container/container-7030/Container7030';
import * as Container70 from 'src/components/container/container-70/Container70';
import * as Container6321 from 'src/components/container/container-6321/Container6321';
import * as Container6040 from 'src/components/container/container-6040/Container6040';
import * as Container5050 from 'src/components/container/container-5050/Container5050';
import * as Container4060 from 'src/components/container/container-4060/Container4060';
import * as Container3070 from 'src/components/container/container-3070/Container3070';
import * as Container303030 from 'src/components/container/container-303030/Container303030';
import * as Container25252525 from 'src/components/container/container-25252525/Container25252525';
import * as Testimonials from 'src/components/component-library/Testimonials';
import * as TeamSection from 'src/components/component-library/TeamSection';
import * as StatsSection from 'src/components/component-library/StatsSection';
import * as ProductsSection from 'src/components/component-library/ProductsSection';
import * as PlaceholderTabs from 'src/components/component-library/PlaceholderTabs';
import * as NewsletterSection from 'src/components/component-library/NewsletterSection';
import * as logocloud from 'src/components/component-library/logo-cloud';
import * as Header from 'src/components/component-library/Header';
import * as FeaturesSection from 'src/components/component-library/FeaturesSection';
import * as FAQ from 'src/components/component-library/FAQ';
import * as ContactSection from 'src/components/component-library/ContactSection';
import * as CLHero from 'src/components/component-library/CLHero';
import * as CallToAction from 'src/components/component-library/CallToAction';
import * as Carousel from 'src/components/carousel/Carousel';
import * as cardspotlightdev from 'src/components/card-spotlight/card-spotlight.dev';
import * as Carddev from 'src/components/card/Card.dev';
import * as ButtonComponent from 'src/components/button-component/ButtonComponent';
import * as Breadcrumbs from 'src/components/breadcrumbs/Breadcrumbs';
import * as BackgroundThumbnaildev from 'src/components/background-thumbnail/BackgroundThumbnail.dev';
import * as ArticleHeader from 'src/components/article-header/ArticleHeader';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as AlertBannerdev from 'src/components/alert-banner/AlertBanner.dev';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['zipcode-modal', { ...zipcodemodaldev }],
  ['VerticalImageAccordion', { ...VerticalImageAccordion, componentType: 'client' }],
  ['TopicListing', { ...TopicListing }],
  ['TopicItem', { ...TopicItemdev }],
  ['theme-provider', { ...themeproviderdev }],
  ['TextBannerTextTop', { ...TextBannerTextTopdev }],
  ['TextBannerDefault', { ...TextBannerDefaultdev }],
  ['TextBannerBlueTitleRight', { ...TextBannerBlueTitleRightdev }],
  ['TextBanner02', { ...TextBanner02dev }],
  ['TextBanner01', { ...TextBanner01dev }],
  ['TextBanner', { ...TextBanner, componentType: 'client' }],
  ['TestimonialCarouselItem', { ...TestimonialCarouselItem }],
  ['TestimonialCarousel', { ...TestimonialCarousel, componentType: 'client' }],
  ['Title', { ...Title }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['NavigationMenuToggle', { ...NavigationMenuToggleclient }],
  ['NavigationList', { ...NavigationListclient }],
  ['Navigation', { ...Navigation }],
  ['LinkList', { ...LinkList, componentType: 'client' }],
  ['Image', { ...Image }],
  ['ContentBlock', { ...ContentBlock, componentType: 'client' }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['ButtonNavigation', { ...ButtonNavigationclient }],
  ['SubscriptionBanner', { ...SubscriptionBanner, componentType: 'client' }],
  ['SubmissionFormDefault', { ...SubmissionFormDefaultdev }],
  ['SubmissionFormCentered', { ...SubmissionFormCentereddev }],
  ['SubmissionForm', { ...SubmissionForm }],
  ['StructuredData', { ...StructuredData }],
  ['SlideCarousel', { ...SlideCarouseldev }],
  ['Video', { ...Video }],
  ['TextSlider', { ...TextSlider, componentType: 'client' }],
  ['SignupBanner', { ...SignupBanner }],
  ['ProductPageHeader', { ...ProductPageHeader, componentType: 'client' }],
  ['ProductComparison', { ...ProductComparison, componentType: 'client' }],
  ['PageHeaderST', { ...PageHeaderST }],
  ['MultiPromo', { ...MultiPromo, componentType: 'client' }],
  ['MobileMenuWrapper', { ...MobileMenuWrapper, componentType: 'client' }],
  ['MegaMenuItemWrapper', { ...MegaMenuItemWrapper, componentType: 'client' }],
  ['MegaMenuItem', { ...MegaMenuItem }],
  ['ImageCarousel', { ...ImageCarousel, componentType: 'client' }],
  ['ImageBanner', { ...ImageBanner }],
  ['HeroST', { ...HeroST, componentType: 'client' }],
  ['HeaderST', { ...HeaderST }],
  ['FooterST', { ...FooterST }],
  ['FeatureBanner', { ...FeatureBanner, componentType: 'client' }],
  ['AccordionBlock', { ...AccordionBlock, componentType: 'client' }],
  ['SearchBox', { ...SearchBox, componentType: 'client' }],
  ['MiniCart', { ...MiniCart, componentType: 'client' }],
  ['SiteMetadata', { ...SiteMetadata }],
  ['SecondaryNavigation', { ...SecondaryNavigation, componentType: 'client' }],
  ['SearchExperience', { ...SearchExperienceLoadMore, ...SearchExperience, componentType: 'client' }],
  ['useSearchField', { ...useSearchField, componentType: 'client' }],
  ['useRouter', { ...useRouter, componentType: 'client' }],
  ['useParams', { ...useParams, componentType: 'client' }],
  ['useEvent', { ...useEvent, componentType: 'client' }],
  ['useDebounce', { ...useDebounce, componentType: 'client' }],
  ['SearchSkeletonItem', { ...SearchSkeletonItem, componentType: 'client' }],
  ['SearchPagination', { ...SearchPagination, componentType: 'client' }],
  ['SearchItemCommon', { ...SearchItemCommon, componentType: 'client' }],
  ['SearchInput', { ...SearchInput, componentType: 'client' }],
  ['SearchError', { ...SearchError, componentType: 'client' }],
  ['SearchEmptyResults', { ...SearchEmptyResults, componentType: 'client' }],
  ['models', { ...models }],
  ['constants', { ...constants }],
  ['SearchItemTitle', { ...SearchItemTitle, componentType: 'client' }],
  ['SearchItemTags', { ...SearchItemTags, componentType: 'client' }],
  ['SearchItemSummary', { ...SearchItemSummary, componentType: 'client' }],
  ['SearchItemSubTitle', { ...SearchItemSubTitle, componentType: 'client' }],
  ['SearchItemLink', { ...SearchItemLink, componentType: 'client' }],
  ['SearchItemImage', { ...SearchItemImage, componentType: 'client' }],
  ['SearchItemCategory', { ...SearchItemCategory, componentType: 'client' }],
  ['index', { ...index, componentType: 'client' }],
  ['RichTextBlock', { ...RichTextBlock }],
  ['PromoImageTitlePartialOverlay', { ...PromoImageTitlePartialOverlaydev }],
  ['PromoImageRight', { ...PromoImageRightdev }],
  ['PromoImageMiddle', { ...PromoImageMiddledev }],
  ['PromoImageLeft', { ...PromoImageLeftdev }],
  ['PromoImageDefault', { ...PromoImageDefaultdev }],
  ['PromoImage', { ...PromoImage }],
  ['PromoBlock', { ...PromoBlock }],
  ['PromoAnimatedImageRight', { ...PromoAnimatedImageRightdev }],
  ['PromoAnimatedEmptyImageEditing', { ...PromoAnimatedEmptyImageEditing }],
  ['PromoAnimatedDefault', { ...PromoAnimatedDefaultdev }],
  ['PromoAnimated', { ...PromoAnimated, componentType: 'client' }],
  ['promo-animated', { ...promoanimatedutil }],
  ['ProductListingThreeUp', { ...ProductListingThreeUpdev }],
  ['ProductListingSlider', { ...ProductListingSliderdev }],
  ['ProductListingDefault', { ...ProductListingDefaultdev }],
  ['ProductListingCard', { ...ProductListingCarddev }],
  ['ProductListing', { ...ProductListing, componentType: 'client' }],
  ['product-listing', { ...productlistingdictionary }],
  ['portal', { ...portaldev }],
  ['PageHeaderFiftyFifty', { ...PageHeaderFiftyFiftydev }],
  ['PageHeaderDefault', { ...PageHeaderDefaultdev }],
  ['PageHeaderCentered', { ...PageHeaderCentereddev }],
  ['PageHeaderBlueText', { ...PageHeaderBlueTextdev }],
  ['PageHeaderBlueBackground', { ...PageHeaderBlueBackgrounddev }],
  ['PageHeader', { ...PageHeader, componentType: 'client' }],
  ['MultiPromoTabs', { ...MultiPromoTabs, componentType: 'client' }],
  ['MultiPromoTab', { ...MultiPromoTabdev }],
  ['mode-toggle', { ...modetoggledev }],
  ['MediaSection', { ...MediaSectiondev }],
  ['meteors', { ...meteors, componentType: 'client' }],
  ['LogoTabs', { ...LogoTabs, componentType: 'client' }],
  ['LogoItem', { ...LogoItem }],
  ['Logo', { ...Logodev }],
  ['utils', { ...utils }],
  ['LocationSearchTitleZipCentered', { ...LocationSearchTitleZipCentereddev }],
  ['LocationSearchMapTopAllCentered', { ...LocationSearchMapTopAllCentereddev }],
  ['LocationSearchMapRightTitleZipCentered', { ...LocationSearchMapRightTitleZipCentereddev }],
  ['LocationSearchMapRight', { ...LocationSearchMapRightdev }],
  ['LocationSearchItem', { ...LocationSearchItemdev }],
  ['LocationSearchDefault', { ...LocationSearchDefaultdev }],
  ['LocationSearch', { ...LocationSearch, componentType: 'client' }],
  ['GoogleMap', { ...GoogleMapdev }],
  ['ImageGalleryNoSpacing', { ...ImageGalleryNoSpacingdev }],
  ['ImageGalleryGrid', { ...ImageGalleryGriddev }],
  ['ImageGalleryFiftyFifty', { ...ImageGalleryFiftyFiftydev }],
  ['ImageGalleryFeaturedImage', { ...ImageGalleryFeaturedImagedev }],
  ['ImageGallery', { ...ImageGallerydev, ...ImageGallery, componentType: 'client' }],
  ['nextImageSrc', { ...nextImageSrcdev }],
  ['ImageWrapper', { ...ImageWrapperdev, ...ImageWrapperclient }],

  ['image-optimization', { ...imageoptimizationcontext }],
  ['Icon', { ...Icon, componentType: 'client' }],
  ['YoutubeIcon', { ...YoutubeIcondev }],
  ['TwitterIcon', { ...TwitterIcondev }],
  ['signal', { ...signaldev }],
  ['play', { ...playdev }],
  ['LinkedInIcon', { ...LinkedInIcondev }],
  ['line-play', { ...lineplaydev }],
  ['InternalIcon', { ...InternalIcondev }],
  ['InstagramIcon', { ...InstagramIcondev }],
  ['FileIcon', { ...FileIcondev }],
  ['FacebookIcon', { ...FacebookIcondev }],
  ['ExternalIcon', { ...ExternalIcondev }],
  ['EmailIcon', { ...EmailIcondev }],
  ['diversity', { ...diversitydev }],
  ['cross-arrows', { ...crossarrowsdev }],
  ['communities', { ...communitiesdev }],
  ['arrow-up-right', { ...arrowuprightdev }],
  ['arrow-right', { ...arrowrightdev }],
  ['arrow-left', { ...arrowleftdev }],
  ['HeroImageRight', { ...HeroImageRightdev }],
  ['HeroImageBottomInset', { ...HeroImageBottomInsetdev }],
  ['HeroImageBottom', { ...HeroImageBottomdev }],
  ['HeroImageBackground', { ...HeroImageBackgrounddev }],
  ['HeroDefault', { ...HeroDefaultdev }],
  ['Hero', { ...Hero, componentType: 'client' }],
  ['hero', { ...herodictionary }],
  ['GlobalHeaderDefault', { ...GlobalHeaderDefaultdev }],
  ['GlobalHeaderCentered', { ...GlobalHeaderCentereddev }],
  ['GlobalHeader', { ...GlobalHeader, componentType: 'client' }],
  ['GlobalFooterDefault', { ...GlobalFooterDefaultdev }],
  ['GlobalFooterBlueCompact', { ...GlobalFooterBlueCompactdev }],
  ['GlobalFooterBlueCentered', { ...GlobalFooterBlueCentereddev }],
  ['GlobalFooterBlackLarge', { ...GlobalFooterBlackLargedev }],
  ['GlobalFooterBlackCompact', { ...GlobalFooterBlackCompactdev }],
  ['GlobalFooter', { ...GlobalFooter, componentType: 'client' }],
  ['global-footer', { ...globalfooterdictionary }],
  ['FooterNavigationColumn', { ...FooterNavigationColumndev, ...FooterNavigationColumn, componentType: 'client' }],
  ['ZipcodeSearchForm', { ...ZipcodeSearchFormdev }],
  ['success-compact', { ...successcompactdev }],
  ['SubmitInfoForm', { ...SubmitInfoFormdev }],
  ['submit-info-form', { ...submitinfoformdictionary }],
  ['EmailSignupForm', { ...EmailSignupFormdev }],
  ['FooterNavigationCallout', { ...FooterNavigationCalloutdev }],
  ['floating-dock', { ...floatingdockdev }],
  ['Flex', { ...Flexdev }],
  ['CtaBanner', { ...CtaBanner }],
  ['ContentSdkRichText', { ...ContentSdkRichText }],
  ['container', { ...containerutil }],
  ['ContainerFullWidth', { ...ContainerFullWidth }],
  ['ContainerFullBleed', { ...ContainerFullBleed }],
  ['Container7030', { ...Container7030 }],
  ['Container70', { ...Container70 }],
  ['Container6321', { ...Container6321 }],
  ['Container6040', { ...Container6040 }],
  ['Container5050', { ...Container5050 }],
  ['Container4060', { ...Container4060 }],
  ['Container3070', { ...Container3070 }],
  ['Container303030', { ...Container303030 }],
  ['Container25252525', { ...Container25252525 }],
  ['Testimonials', { ...Testimonials }],
  ['TeamSection', { ...TeamSection }],
  ['StatsSection', { ...StatsSection }],
  ['ProductsSection', { ...ProductsSection, componentType: 'client' }],
  ['PlaceholderTabs', { ...PlaceholderTabs }],
  ['NewsletterSection', { ...NewsletterSection }],
  ['logo-cloud', { ...logocloud }],
  ['Header', { ...Header, componentType: 'client' }],
  ['FeaturesSection', { ...FeaturesSection, componentType: 'client' }],
  ['FAQ', { ...FAQ, componentType: 'client' }],
  ['ContactSection', { ...ContactSection, componentType: 'client' }],
  ['CLHero', { ...CLHero }],
  ['CallToAction', { ...CallToAction }],
  ['Carousel', { ...Carousel, componentType: 'client' }],
  ['card-spotlight', { ...cardspotlightdev }],
  ['Card', { ...Carddev }],
  ['ButtonComponent', { ...ButtonComponent }],
  ['Breadcrumbs', { ...Breadcrumbs }],
  ['BackgroundThumbnail', { ...BackgroundThumbnaildev }],
  ['ArticleHeader', { ...ArticleHeader, componentType: 'client' }],
  ['AnimatedSection', { ...AnimatedSectiondev }],
  ['AlertBanner', { ...AlertBannerdev }],
]);

export default componentMap;
