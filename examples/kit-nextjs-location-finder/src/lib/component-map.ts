// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, FEaaSWrapper, NextjsJssComponent } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
import * as AccordionBlock from 'components/accordion-block/AccordionBlock';
import * as AlertBanner from 'components/alert-banner/AlertBanner.dev';
import * as ArticleHeader from 'components/article-header/ArticleHeader';
import * as BackgroundThumbnail from 'components/background-thumbnail/BackgroundThumbnail.dev';
import * as Breadcrumbs from 'components/breadcrumbs/Breadcrumbs';
import * as ButtonComponent from 'components/button-component/ButtonComponent';
import * as CallToAction from 'components/component-library/calltoaction';
import * as Card from 'components/card/Card.dev';
import * as CardSpotlight from 'components/card-spotlight/card-spotlight.dev';
import * as Carousel from 'components/carousel/Carousel';
import * as CdpPageView from 'components/sxa/CdpPageView';
import * as CLHero from 'components/component-library/hero';
import * as ColumnSplitter from 'components/sxa/ColumnSplitter';
import * as ContactSection from 'components/component-library/ContactSection';
import * as Container from 'components/sxa/Container';
import * as Container25252525 from 'components/container/container-25252525/Container25252525';
import * as Container303030 from 'components/container/container-303030/Container303030';
import * as Container3070 from 'components/container/container-3070/Container3070';
import * as Container4060 from 'components/container/container-4060/Container4060';
import * as Container5050 from 'components/container/container-5050/Container5050';
import * as Container6040 from 'components/container/container-6040/Container6040';
import * as Container6321 from 'components/container/container-6321/Container6321';
import * as Container7030 from 'components/container/container-7030/Container7030';
import * as Container70 from 'components/container/container-70/Container70';
import * as ContainerFullBleed from 'components/container/container-full-bleed/ContainerFullBleed';
import * as ContainerFullWidth from 'components/container/container-full-width/ContainerFullWidth';
import * as ContentBlock from 'components/sxa/ContentBlock';
import * as CtaBanner from 'components/cta-banner/CtaBanner';
import * as FAQ from 'components/component-library/FAQ';
import * as FEAASScripts from 'components/sxa/FEAASScripts';
import * as FeaturesSection from 'components/component-library/FeaturesSection';
import * as Flex from 'components/flex/Flex.dev';
import * as FloatingDock from 'components/floating-dock/floating-dock.dev';
import * as FooterNavigationCallout from 'components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as FooterNavigationColumn from 'components/global-footer/FooterNavigationColumn.dev';
import * as GlobalFooter from 'components/global-footer/GlobalFooter';
import * as GlobalHeader from 'components/global-header/GlobalHeader';
import * as Header from 'components/component-library/Header';
import * as Hero from 'components/hero/Hero';
import * as Icon from 'components/icon/Icon';
import * as Image from 'components/sxa/Image';
import * as ImageBlock from 'components/image/ImageBlock';
import * as ImageCarousel from 'components/image-carousel/ImageCarousel';
import * as ImageGallery from 'components/image-gallery/ImageGallery';
import * as ImageWrapper from 'components/image/ImageWrapper.dev';
import * as LinkList from 'components/sxa/LinkList';
import * as LocationSearch from 'components/location-search/LocationSearch';
import * as Logo from 'components/logo/Logo.dev';
import * as LogoCloud from 'components/component-library/logo-cloud';
import * as LogoTabs from 'components/logo-tabs/LogoTabs';
import * as MediaSection from 'components/media-section/MediaSection.dev';
import * as ModeToggle from 'components/mode-toggle/mode-toggle.dev';
import * as MultiPromo from 'components/multi-promo/MultiPromo';
import * as MultiPromoTabs from 'components/multi-promo-tabs/MultiPromoTabs';
import * as Navigation from 'components/sxa/Navigation';
import * as NewsletterSection from 'components/component-library/NewsletterSection';
import * as PageContent from 'components/sxa/PageContent';
import * as PageHeader from 'components/page-header/PageHeader';
import * as PartialDesignDynamicPlaceholder from 'components/sxa/PartialDesignDynamicPlaceholder';
import * as PlaceholderTabs from 'components/component-library/PlaceholderTabs';
import * as Portal from 'components/portal/portal.dev';
import * as ProductListing from 'components/product-listing/ProductListing';
import * as ProductsSection from 'components/component-library/ProductsSection';
import * as Promo from 'components/sxa/Promo';
import * as PromoAnimated from 'components/promo-animated/PromoAnimated';
import * as PromoBlock from 'components/promo-block/PromoBlock';
import * as PromoImage from 'components/promo-image/PromoImage';
import * as RichText from 'components/sxa/RichText';
import * as RichTextBlock from 'components/rich-text-block/RichTextBlock';
import * as RowSplitter from 'components/sxa/RowSplitter';
import * as SecondaryNavigation from 'components/secondary-navigation/SecondaryNavigation';
import * as SiteMetadata from 'components/site-metadata/SiteMetadata';
import * as SitecoreStyles from 'components/sxa/SitecoreStyles';
import * as SlideCarousel from 'components/slide-carousel/SlideCarousel.dev';
import * as StatsSection from 'components/component-library/StatsSection';
import * as SubmissionForm from 'components/submission-form/SubmissionForm';
import * as SubscriptionBanner from 'components/subscription-banner/SubscriptionBanner';
import * as TeamSection from 'components/component-library/TeamSection';
import * as TestimonialCarousel from 'components/testimonial-carousel/TestimonialCarousel';
import * as Testimonials from 'components/component-library/testimonials';
import * as TextBanner from 'components/text-banner/TextBanner';
import * as ThemeProvider from 'components/theme-provider/theme-provider.dev';
import * as Title from 'components/sxa/Title';
import * as TopicListing from 'components/topic-listing/TopicListing';
import * as VerticalImageAccordion from 'components/vertical-image-accordion/VerticalImageAccordion';
import * as Video from 'components/video/Video';
import * as ZipcodeModal from 'components/zipcode-modal/zipcode-modal.dev';

// end of components imported from the app itself

// Components must be registered with to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsJssComponent>([
  ['AccordionBlock', AccordionBlock],
  ['AlertBanner', AlertBanner],
  ['ArticleHeader', ArticleHeader],
  ['BackgroundThumbnail', BackgroundThumbnail],
  ['Breadcrumbs', Breadcrumbs],
  ['ButtonComponent', ButtonComponent],
  ['BYOCWrapper', BYOCWrapper],
  ['CallToAction', CallToAction],
  ['Card', Card],
  ['CardSpotlight', CardSpotlight],
  ['Carousel', Carousel],
  ['CdpPageView', CdpPageView],
  ['CLHero', CLHero],
  ['ColumnSplitter', ColumnSplitter],
  ['ContactSection', ContactSection],
  ['Container', Container],
  ['Container25252525', Container25252525],
  ['Container303030', Container303030],
  ['Container3070', Container3070],
  ['Container4060', Container4060],
  ['Container5050', Container5050],
  ['Container6040', Container6040],
  ['Container6321', Container6321],
  ['Container7030', Container7030],
  ['Container70', Container70],
  ['ContainerFullBleed', ContainerFullBleed],
  ['ContainerFullWidth', ContainerFullWidth],
  ['ContentBlock', ContentBlock],
  ['CtaBanner', CtaBanner],
  ['FAQ', FAQ],
  ['FEaaSWrapper', FEaaSWrapper],
  ['FEAASScripts', FEAASScripts],
  ['FeaturesSection', FeaturesSection],
  ['Flex', Flex],
  ['FloatingDock', FloatingDock],
  ['FooterNavigationCallout', FooterNavigationCallout],
  ['FooterNavigationColumn', FooterNavigationColumn],
  ['Form', Form],
  ['GlobalFooter', GlobalFooter],
  ['GlobalHeader', GlobalHeader],
  ['Header', Header],
  ['Hero', Hero],
  ['Icon', Icon],
  ['Image', Image],
  ['ImageBlock', ImageBlock],
  ['ImageCarousel', ImageCarousel],
  ['ImageGallery', ImageGallery],
  ['ImageWrapper', ImageWrapper],
  ['LinkList', LinkList],
  ['LocationSearch', LocationSearch],
  ['Logo', Logo],
  ['LogoCloud', LogoCloud],
  ['LogoTabs', LogoTabs],
  ['MediaSection', MediaSection],
  ['ModeToggle', ModeToggle],
  ['MultiPromo', MultiPromo],
  ['MultiPromoTabs', MultiPromoTabs],
  ['Navigation', Navigation],
  ['NewsletterSection', NewsletterSection],
  ['PageContent', PageContent],
  ['PageHeader', PageHeader],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['PlaceholderTabs', PlaceholderTabs],
  ['Portal', Portal],
  ['ProductListing', ProductListing],
  ['ProductsSection', ProductsSection],
  ['Promo', Promo],
  ['PromoAnimated', PromoAnimated],
  ['PromoBlock', PromoBlock],
  ['PromoImage', PromoImage],
  ['RichText', RichText],
  ['RichTextBlock', RichTextBlock],
  ['RowSplitter', RowSplitter],
  ['SecondaryNavigation', SecondaryNavigation],
  ['SiteMetadata', SiteMetadata],
  ['SitecoreStyles', SitecoreStyles],
  ['SlideCarousel', SlideCarousel],
  ['StatsSection', StatsSection],
  ['SubmissionForm', SubmissionForm],
  ['SubscriptionBanner', SubscriptionBanner],
  ['TeamSection', TeamSection],
  ['TestimonialCarousel', TestimonialCarousel],
  ['Testimonials', Testimonials],
  ['TextBanner', TextBanner],
  ['ThemeProvider', ThemeProvider],
  ['Title', Title],
  ['TopicListing', TopicListing],
  ['VerticalImageAccordion', VerticalImageAccordion],
  ['Video', Video],
  ['ZipcodeModal', ZipcodeModal],
]);

export default componentMap;
