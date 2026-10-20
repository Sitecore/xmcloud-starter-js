// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';


import * as TextBannerTextTopdev from 'src/components/text-banner/TextBannerTextTop.dev';
import * as TextBannerDefaultdev from 'src/components/text-banner/TextBannerDefault.dev';
import * as TextBannerBlueTitleRightdev from 'src/components/text-banner/TextBannerBlueTitleRight.dev';
import * as TextBanner02dev from 'src/components/text-banner/TextBanner02.dev';
import * as TextBanner01dev from 'src/components/text-banner/TextBanner01.dev';
import * as TextBanner from 'src/components/text-banner/TextBanner';
import * as SubscriptionBanner from 'src/components/subscription-banner/SubscriptionBanner';
import * as PageHeaderFiftyFiftydev from 'src/components/page-header/PageHeaderFiftyFifty.dev';
import * as PageHeaderDefaultdev from 'src/components/page-header/PageHeaderDefault.dev';
import * as PageHeaderCentereddev from 'src/components/page-header/PageHeaderCentered.dev';
import * as PageHeaderBlueTextdev from 'src/components/page-header/PageHeaderBlueText.dev';
import * as PageHeaderBlueBackgrounddev from 'src/components/page-header/PageHeaderBlueBackground.dev';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as Meteors from 'src/components/magicui/meteors';
import * as ImageWrapperclient from 'src/components/image/ImageWrapper.client';
import * as Icon from 'src/components/icon/Icon';
import * as HeroImageRightdev from 'src/components/hero/HeroImageRight.dev';
import * as HeroImageBottomInsetdev from 'src/components/hero/HeroImageBottomInset.dev';
import * as HeroImageBottomdev from 'src/components/hero/HeroImageBottom.dev';
import * as HeroImageBackgrounddev from 'src/components/hero/HeroImageBackground.dev';
import * as HeroDefaultdev from 'src/components/hero/HeroDefault.dev';
import * as MultiPromo from 'src/components/multi-promo/MultiPromo';
import * as Hero from 'src/components/hero/Hero';
import * as GlobalHeaderDefaultdev from 'src/components/global-header/GlobalHeaderDefault.dev';
import * as GlobalHeaderCentereddev from 'src/components/global-header/GlobalHeaderCentered.dev';
import * as GlobalHeader from 'src/components/global-header/GlobalHeader';
import * as GlobalFooterDefaultdev from 'src/components/global-footer/GlobalFooterDefault.dev';
import * as GlobalFooterBlueCompactdev from 'src/components/global-footer/GlobalFooterBlueCompact.dev';
import * as GlobalFooterBlueCentereddev from 'src/components/global-footer/GlobalFooterBlueCentered.dev';
import * as GlobalFooterBlackLargedev from 'src/components/global-footer/GlobalFooterBlackLarge.dev';
import * as GlobalFooterBlackCompactdev from 'src/components/global-footer/GlobalFooterBlackCompact.dev';
import * as GlobalFooter from 'src/components/global-footer/GlobalFooter';
import * as FooterNavigationColumndev from 'src/components/global-footer/FooterNavigationColumn.dev';
import * as FooterNavigationColumn from 'src/components/global-footer/FooterNavigationColumn';
import * as ZipcodeSearchFormdev from 'src/components/forms/zipcode/ZipcodeSearchForm.dev';
import * as EmailSignupFormdev from 'src/components/forms/email/EmailSignupForm.dev';
import * as AnimatedSectiondev from 'src/components/animated-section/AnimatedSection.dev';
import * as Navigation from 'src/components/navigation/Navigation';
import * as ContentBlock from 'src/components/content-block/ContentBlock';

export const componentMap = new Map<string, NextjsContentSdkComponent>([

  ['TextBannerTextTop', { ...TextBannerTextTopdev }],
  ['TextBannerDefault', { ...TextBannerDefaultdev }],
  ['TextBannerBlueTitleRight', { ...TextBannerBlueTitleRightdev }],
  ['TextBanner02', { ...TextBanner02dev }],
  ['TextBanner01', { ...TextBanner01dev }],
  ['TextBanner', { ...TextBanner }],
  ['SubscriptionBanner', { ...SubscriptionBanner }],
  ['PageHeaderFiftyFifty', { ...PageHeaderFiftyFiftydev }],
  ['PageHeaderDefault', { ...PageHeaderDefaultdev }],
  ['PageHeaderCentered', { ...PageHeaderCentereddev }],
  ['PageHeaderBlueText', { ...PageHeaderBlueTextdev }],
  ['PageHeaderBlueBackground', { ...PageHeaderBlueBackgrounddev }],
  ['PageHeader', { ...PageHeader }],
  ['meteors', { ...Meteors }],
  ['ImageWrapper', { ...ImageWrapperclient }],
  ['Icon', { ...Icon }],
  ['HeroImageRight', { ...HeroImageRightdev }],
  ['HeroImageBottomInset', { ...HeroImageBottomInsetdev }],
  ['HeroImageBottom', { ...HeroImageBottomdev }],
  ['HeroImageBackground', { ...HeroImageBackgrounddev }],
  ['HeroDefault', { ...HeroDefaultdev }],
  ['MultiPromo', { ...MultiPromo }],
  ['Hero', { ...Hero }],
  ['GlobalHeaderDefault', { ...GlobalHeaderDefaultdev }],
  ['GlobalHeaderCentered', { ...GlobalHeaderCentereddev }],
  ['GlobalHeader', { ...GlobalHeader }],
  ['GlobalFooterDefault', { ...GlobalFooterDefaultdev }],
  ['GlobalFooterBlueCompact', { ...GlobalFooterBlueCompactdev }],
  ['GlobalFooterBlueCentered', { ...GlobalFooterBlueCentereddev }],
  ['GlobalFooterBlackLarge', { ...GlobalFooterBlackLargedev }],
  ['GlobalFooterBlackCompact', { ...GlobalFooterBlackCompactdev }],
  ['GlobalFooter', { ...GlobalFooter }],
  ['FooterNavigationColumn', { ...FooterNavigationColumndev, ...FooterNavigationColumn }],
  ['ZipcodeSearchForm', { ...ZipcodeSearchFormdev }],
  ['EmailSignupForm', { ...EmailSignupFormdev }],
  ['AnimatedSection', { ...AnimatedSectiondev }],
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['Navigation', { ...Navigation }],
  ['ContentBlock', { ...ContentBlock }],
]);

export default componentMap;
