/**
 * Dictionary mapping
 *
 * The key should be referenced in the rendering files,
 * and the value to should be the name of the dictionary item
 * in Sitecore.
 */

import { GlobalFooterDictionaryKeys } from '@/components/global-footer/global-footer.dictionary';
import { HeroDictionaryKeys } from '@/components/hero/hero.dictionary';
import { SubmitInfoFormDictionaryKeys } from '@/components/forms/submitinfo/submit-info-form.dictionary';
import { ProductListingDictionaryKeys } from '@/components/product-listing/product-listing.dictionary';

export const dictionaryKeys = {
  ...GlobalFooterDictionaryKeys,
  ...HeroDictionaryKeys,
  ...SubmitInfoFormDictionaryKeys,
  ...ProductListingDictionaryKeys,
};

export const mockDictionary = (dictionary: Record<string, string>): Record<string, string> => {
  const temp: Record<string, string> = {};
  Object.keys(dictionary).map((key) => (temp[`${dictionary[`${key}`]}`] = dictionary[key]));
  const withTokens = {};
  return Object.assign(temp, withTokens);
};
