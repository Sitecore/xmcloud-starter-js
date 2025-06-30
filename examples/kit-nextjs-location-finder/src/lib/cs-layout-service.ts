import { FetchOptions } from '@sitecore-content-sdk/core/client';
import {
  GraphQLLayoutService,
  LayoutServiceData,
  RouteOptions,
} from '@sitecore-content-sdk/core/layout';
import { GraphQLLayoutServiceConfig, debug } from '@sitecore-content-sdk/nextjs';

export class CSLayoutService extends GraphQLLayoutService {
  constructor(public serviceConfig: GraphQLLayoutServiceConfig) {
    super(serviceConfig);
  }

  async fetchLayoutData(
    itemPath: string,
    routeOptions: RouteOptions,
    fetchOptions: FetchOptions
  ): Promise<LayoutServiceData> {
    const query = this.getLayoutQuery(itemPath, '', routeOptions.locale?.toString() || 'en');
    const accessToken = process.env.CONTENT_SERVICE_ACCESS_TOKEN || '';

    if (fetchOptions === undefined) {
      fetchOptions = {};
    }
    if (fetchOptions.headers === undefined) {
      fetchOptions.headers = {};
    }
    fetchOptions.headers['Authorization'] = `Bearer ${accessToken}`;
    fetchOptions.headers['Content-Type'] = 'application/json';

    const data = await this.graphQLClient.request<{
      manyLayoutItem: {
        results: [
          {
            rendered: LayoutServiceData;
          }
        ];
      };
    }>(query, {}, fetchOptions);

    const layoutResponse = data.manyLayoutItem.results[0]?.rendered;
    return (
      layoutResponse || {
        sitecore: {
          context: { pageEditing: false, language: routeOptions?.locale },
          route: null,
        },
      }
    );
  }

  getLayoutQuery = (itemPath: string, site: string, language: string): string => {
    debug.layout('build content service layout query', itemPath, site, language);
    return `query ManyLayoutItem {
        manyLayoutItem(minimumPageSize: 1, filter: {
          AND: [
            { path: { equals: "${itemPath.toLowerCase()}" }},
            { system: { locale: { equals: "${language}" }}}
          ]
        }) {
          results {
            rendered
          }
        }
      }
    `;
  };
}
