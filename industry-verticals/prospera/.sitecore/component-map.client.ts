// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as ThemeSwitcher from 'src/components/utilities/ThemeSwitcher';
import * as SiteTheme from 'src/components/utilities/SiteTheme';
import * as LoanCalculator from 'src/components/utilities/LoanCalculator';
import * as LanguageSwitcher from 'src/components/utilities/LanguageSwitcher';
import * as ContactForm from 'src/components/utilities/ContactForm';
import * as ApplicationForm from 'src/components/utilities/ApplicationForm';
import * as ColumnSplitter from 'src/components/pagestructure/ColumnSplitter';
import * as TwoColumnCta from 'src/components/pagecontent/TwoColumnCta';
import * as ThreeColumnCta from 'src/components/pagecontent/ThreeColumnCta';
import * as Testimonials from 'src/components/pagecontent/Testimonials';
import * as StatsCounter from 'src/components/pagecontent/StatsCounter';
import * as RichText from 'src/components/pagecontent/RichText';
import * as Quote from 'src/components/pagecontent/Quote';
import * as Questions from 'src/components/pagecontent/Questions';
import * as PromoCta from 'src/components/pagecontent/PromoCta';
import * as ProjectList from 'src/components/pagecontent/ProjectList';
import * as ProjectDetails from 'src/components/pagecontent/ProjectDetails';
import * as ParallaxBanner from 'src/components/pagecontent/ParallaxBanner';
import * as PageBackground from 'src/components/pagecontent/PageBackground';
import * as ImageGallery from 'src/components/pagecontent/ImageGallery';
import * as HeroBanner from 'src/components/pagecontent/HeroBanner';
import * as Hero from 'src/components/pagecontent/Hero';
import * as HeadingCta from 'src/components/pagecontent/HeadingCta';
import * as FourColumnCta from 'src/components/pagecontent/FourColumnCta';
import * as FiveColumnCta from 'src/components/pagecontent/FiveColumnCta';
import * as Features from 'src/components/pagecontent/Features';
import * as DocumentsList from 'src/components/pagecontent/DocumentsList';
import * as CtaBanner from 'src/components/pagecontent/CtaBanner';
import * as Comparison from 'src/components/pagecontent/Comparison';
import * as Carousel from 'src/components/pagecontent/Carousel';
import * as AuthorWidget from 'src/components/pagecontent/AuthorWidget';
import * as AuthorList from 'src/components/pagecontent/AuthorList';
import * as AuthorDetails from 'src/components/pagecontent/AuthorDetails';
import * as ArticleList from 'src/components/pagecontent/ArticleList';
import * as ArticleDetails from 'src/components/pagecontent/ArticleDetails';
import * as AppPromo from 'src/components/pagecontent/AppPromo';
import * as Accordion from 'src/components/pagecontent/Accordion';
import * as ParallaxBackgroundImage from 'src/components/non-sitecore/ParallaxBackgroundImage';
import * as IconAccent from 'src/components/non-sitecore/IconAccent';
import * as DottedAccent from 'src/components/non-sitecore/DottedAccent';
import * as CountUp from 'src/components/non-sitecore/CountUp';
import * as Navigation from 'src/components/navigation/Navigation';
import * as Header from 'src/components/navigation/Header';
import * as Footer from 'src/components/navigation/Footer';
import * as Eyebrow from 'src/components/navigation/Eyebrow';
import * as Breadcrumb from 'src/components/navigation/Breadcrumb';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['ThemeSwitcher', { ...ThemeSwitcher }],
  ['SiteTheme', { ...SiteTheme }],
  ['LoanCalculator', { ...LoanCalculator }],
  ['LanguageSwitcher', { ...LanguageSwitcher }],
  ['ContactForm', { ...ContactForm }],
  ['ApplicationForm', { ...ApplicationForm }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['TwoColumnCta', { ...TwoColumnCta }],
  ['ThreeColumnCta', { ...ThreeColumnCta }],
  ['Testimonials', { ...Testimonials }],
  ['StatsCounter', { ...StatsCounter }],
  ['RichText', { ...RichText }],
  ['Quote', { ...Quote }],
  ['Questions', { ...Questions }],
  ['PromoCta', { ...PromoCta }],
  ['ProjectList', { ...ProjectList }],
  ['ProjectDetails', { ...ProjectDetails }],
  ['ParallaxBanner', { ...ParallaxBanner }],
  ['PageBackground', { ...PageBackground }],
  ['ImageGallery', { ...ImageGallery }],
  ['HeroBanner', { ...HeroBanner }],
  ['Hero', { ...Hero }],
  ['HeadingCta', { ...HeadingCta }],
  ['FourColumnCta', { ...FourColumnCta }],
  ['FiveColumnCta', { ...FiveColumnCta }],
  ['Features', { ...Features }],
  ['DocumentsList', { ...DocumentsList }],
  ['CtaBanner', { ...CtaBanner }],
  ['Comparison', { ...Comparison }],
  ['Carousel', { ...Carousel }],
  ['AuthorWidget', { ...AuthorWidget }],
  ['AuthorList', { ...AuthorList }],
  ['AuthorDetails', { ...AuthorDetails }],
  ['ArticleList', { ...ArticleList }],
  ['ArticleDetails', { ...ArticleDetails }],
  ['AppPromo', { ...AppPromo }],
  ['Accordion', { ...Accordion }],
  ['ParallaxBackgroundImage', { ...ParallaxBackgroundImage }],
  ['IconAccent', { ...IconAccent }],
  ['DottedAccent', { ...DottedAccent }],
  ['CountUp', { ...CountUp }],
  ['Navigation', { ...Navigation }],
  ['Header', { ...Header }],
  ['Footer', { ...Footer }],
  ['Eyebrow', { ...Eyebrow }],
  ['Breadcrumb', { ...Breadcrumb }],
]);

export default componentMap;
