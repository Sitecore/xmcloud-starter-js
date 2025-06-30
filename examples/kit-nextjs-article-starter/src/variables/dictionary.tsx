/**
 * Dictionary mapping
 *
 * The key should be referenced in the rendering files,
 * and the value to should be the name of the dictionary item
 * in Sitecore.
 */

import { ArticleHeaderDictionaryKeys } from '@/components/article-header/article-header.dictionary';
import { SubscriptionBannerDictionaryKeys } from '@/components/subscription-banner/subscription-banner.dictionary';

export const dictionaryKeys = {
  ...SubscriptionBannerDictionaryKeys,
  ...ArticleHeaderDictionaryKeys,
};

export const mockDictionary = (dictionary: Record<string, string>): Record<string, string> => {
  const temp: Record<string, string> = {};
  Object.keys(dictionary).map((key) => (temp[`${dictionary[`${key}`]}`] = dictionary[key]));
  const withTokens = {};
  return Object.assign(temp, withTokens);
};
