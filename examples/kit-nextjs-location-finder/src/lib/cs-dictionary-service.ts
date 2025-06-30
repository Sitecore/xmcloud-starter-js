import { FetchOptions } from '@sitecore-content-sdk/core/client';
import {
  DictionaryPhrases,
  GraphQLDictionaryService,
  GraphQLDictionaryServiceConfig,
  debug,
} from '@sitecore-content-sdk/nextjs';

export class CSDictionaryService extends GraphQLDictionaryService {
  constructor(public options: GraphQLDictionaryServiceConfig) {
    super(options);
  }

  async fetchDictionaryData(
    site: string,
    locale: string,
    fetchOptions: FetchOptions
  ): Promise<DictionaryPhrases> {
    // Disabling dictionary service for now
    debug.dictionary(
      'CSDictionary service, disabled',
      site,
      locale,
      fetchOptions ?? 'options not provided'
    );
    return {};
  }
}
