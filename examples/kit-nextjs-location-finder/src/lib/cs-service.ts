import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
} from '@sitecore-content-sdk/core';
import { FetchOptions } from '@sitecore-content-sdk/core/client';
import { SitecoreConfigInput } from '@sitecore-content-sdk/core/config';

export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param {GraphQLClientOptions} options content sdk config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLCSClientFactory = (options: GraphQLClientOptions) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  if (options.api?.edge?.contextId) {
    clientConfig = {
      endpoint: process.env.NEXT_PUBLIC_CONTENT_SERVICE_EDGE_ENDPOINT ?? '',
    };
  } else if (options.api?.local?.apiKey && options.api?.local?.apiHost) {
    clientConfig = {
      endpoint: `${options.api.local.apiHost}${options.api.local.path}`,
      apiKey: options.api.local.apiKey,
    };
  } else {
    throw new Error(
      'Please configure and use either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }
  return GraphQLRequestClient.createClientFactory({ ...clientConfig, ...options });
};

export const getContentServiceToken = async () => {
  const accessTokenResponse = await fetch(process.env.CS_IDENTITY_SERVER || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CS_CLIENT_ID || '',
      client_secret: process.env.CS_CLIENT_SECRET || '',
      audience: process.env.CS_AUDIENCE || '',
    }),
  });

  const accessTokenData = await accessTokenResponse.json();
  return accessTokenData.access_token;
};

export const executeCsQuery = async (query: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_CONTENT_SERVICE_EDGE_ENDPOINT || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CONTENT_SERVICE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      query,
    }),
  });

  const data = await response.json();
  return data;
};

export const getQueryForContentType = (contentType: string, id: string) => {
  switch (contentType) {
    case 'heroDatasource':
      return getHeroDatasourceQuery(id);
    default:
      return '';
  }
};

const getHeroDatasourceQuery = (id: string) => {
  return `query HeroDatasource {
    heroDatasource(id: "${id}", locale: "en") {
        title
        heroImage
        description
        bannerText
        bannerCTA
        serachLink
        system {
            id
            version
        }
    }
}`;
};
