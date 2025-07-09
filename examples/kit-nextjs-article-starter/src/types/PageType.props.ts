import { PageTitles } from './PageTitles.props';
import { PageImages } from './PageImages.props';
import { PageTexts } from './PageTexts.props';

import { RouteData } from '@sitecore-content-sdk/nextjs';

export type PageType = {
  fields: PageTitles & PageTexts & PageImages;
};

export type PageRouteData = RouteData & PageType;
