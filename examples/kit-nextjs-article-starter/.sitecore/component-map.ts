// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// SXA components (alphabetical)
import * as CdpPageView from 'components/content-sdk/CdpPageView';
import * as ColumnSplitter from 'components/sxa/ColumnSplitter';
import * as Container from 'components/sxa/Container';
import * as ContentBlock from 'components/sxa/ContentBlock';
import * as FEAASScripts from 'components/content-sdk/FEAASScripts';
import * as Image from 'components/sxa/Image';
import * as LinkList from 'components/sxa/LinkList';
import * as Navigation from 'components/sxa/Navigation';
import * as PageContent from 'components/sxa/PageContent';
import * as PartialDesignDynamicPlaceholder from 'components/sxa/PartialDesignDynamicPlaceholder';
import * as Promo from 'components/sxa/Promo';
import * as RichText from 'components/sxa/RichText';
import * as RowSplitter from 'components/sxa/RowSplitter';
import * as SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import * as Title from 'components/sxa/Title';

// Additional components (alphabetical)
import * as AccordionBlock from 'components/accordion-block/AccordionBlock';
import * as AlertBanner from 'components/alert-banner/AlertBanner.dev';
import * as AnimatedSection from 'components/animated-section/AnimatedSection.dev';
import * as ArticleHeader from 'components/article-header/ArticleHeader';
import * as ArticleListing from 'components/article-listing/ArticleListing';
import * as BackgroundThumbnail from 'components/background-thumbnail/BackgroundThumbnail.dev';
import * as Breadcrumbs from 'components/breadcrumbs/Breadcrumbs';
import * as Card from 'components/card/Card.dev';
import * as Container25252525 from 'components/container/container-25252525/Container25252525';
import * as Container303030 from 'components/container/container-303030/Container303030';
import * as Container3070 from 'components/container/container-3070/Container3070';
import * as Container4060 from 'components/container/container-4060/Container4060';
import * as Container5050 from 'components/container/container-5050/Container5050';
import * as Container6040 from 'components/container/container-6040/Container6040';
import * as Container6321 from 'components/container/container-6321/Container6321';
import * as Container70 from 'components/container/container-70/Container70';
import * as Container7030 from 'components/container/container-7030/Container7030';
import * as ContainerFullBleed from 'components/container/container-full-bleed/ContainerFullBleed';
import * as ContainerFullWidth from 'components/container/container-full-width/ContainerFullWidth';
import * as CtaBanner from 'components/cta-banner/CtaBanner';
import * as FooterNavigationCallout from 'components/footer-navigation-callout/FooterNavigationCallout.dev';
import * as FooterNavigationColumn from 'components/global-footer/FooterNavigationColumn';
import * as GlobalFooter from 'components/global-footer/GlobalFooter';
import * as GlobalHeader from 'components/global-header/GlobalHeader';
import * as Hero from 'components/hero/Hero';
import * as Icon from 'components/icon/Icon';
import * as ImageBlock from 'components/image/ImageBlock';
import * as Logo from 'components/logo/Logo.dev';
import * as LogoTabs from 'components/logo-tabs/LogoTabs';
import * as MediaSection from 'components/media-section/MediaSection.dev';
import * as MultiPromo from 'components/multi-promo/MultiPromo';
import * as MultiPromoTabs from 'components/multi-promo-tabs/MultiPromoTabs';
import * as PageHeader from 'components/page-header/PageHeader';
import * as PromoAnimated from 'components/promo-animated/PromoAnimated';
import * as PromoBlock from 'components/promo-block/PromoBlock';
import * as RichTextBlock from 'components/rich-text-block/RichTextBlock';
import * as SecondaryNavigation from 'components/secondary-navigation/SecondaryNavigation';
import * as SiteMetadata from 'components/site-metadata/SiteMetadata';
import * as SubscriptionBanner from 'components/subscription-banner/SubscriptionBanner';
import * as TestimonialCarousel from 'components/testimonial-carousel/TestimonialCarousel';
import * as TextBanner from 'components/text-banner/TextBanner';
import * as TopicListing from 'components/topic-listing/TopicListing';
import * as VerticalImageAccordion from 'components/vertical-image-accordion/VerticalImageAccordion';
import * as Video from 'components/video/Video';

// Components must be registered with to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsContentSdkComponent>([
  // Built-in components
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],

  // All components (alphabetical)
  ['AccordionBlock', AccordionBlock],
  ['AlertBanner', AlertBanner],
  ['AnimatedSection', AnimatedSection],
  ['ArticleHeader', ArticleHeader],
  ['ArticleListing', ArticleListing],
  ['BackgroundThumbnail', BackgroundThumbnail],
  ['Breadcrumbs', Breadcrumbs],
  ['Card', Card],
  ['CdpPageView', CdpPageView],
  ['ColumnSplitter', ColumnSplitter],
  ['Container', Container],
  ['Container25252525', Container25252525],
  ['Container303030', Container303030],
  ['Container3070', Container3070],
  ['Container4060', Container4060],
  ['Container5050', Container5050],
  ['Container6040', Container6040],
  ['Container6321', Container6321],
  ['Container70', Container70],
  ['Container7030', Container7030],
  ['ContainerFullBleed', ContainerFullBleed],
  ['ContainerFullWidth', ContainerFullWidth],
  ['ContentBlock', ContentBlock],
  ['CtaBanner', CtaBanner],
  ['FEAASScripts', FEAASScripts],
  ['FooterNavigationCallout', FooterNavigationCallout],
  ['FooterNavigationColumn', FooterNavigationColumn],
  ['GlobalFooter', GlobalFooter],
  ['GlobalHeader', GlobalHeader],
  ['Hero', Hero],
  ['Icon', Icon],
  ['Image', Image],
  ['ImageBlock', ImageBlock],
  ['LinkList', LinkList],
  ['Logo', Logo],
  ['LogoTabs', LogoTabs],
  ['MediaSection', MediaSection],
  ['MultiPromo', MultiPromo],
  ['MultiPromoTabs', MultiPromoTabs],
  ['Navigation', Navigation],
  ['PageContent', PageContent],
  ['PageHeader', PageHeader],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['Promo', Promo],
  ['PromoAnimated', PromoAnimated],
  ['PromoBlock', PromoBlock],
  ['RichText', RichText],
  ['RichTextBlock', RichTextBlock],
  ['RowSplitter', RowSplitter],
  ['SecondaryNavigation', SecondaryNavigation],
  ['SitecoreStyles', SitecoreStyles],
  ['SiteMetadata', SiteMetadata],
  ['SubscriptionBanner', SubscriptionBanner],
  ['TestimonialCarousel', TestimonialCarousel],
  ['TextBanner', TextBanner],
  ['Title', Title],
  ['TopicListing', TopicListing],
  ['VerticalImageAccordion', VerticalImageAccordion],
  ['Video', Video],
]);

export default componentMap;
