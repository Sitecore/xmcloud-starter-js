import { debug } from '@sitecore-content-sdk/core';
import {
  GraphQLClientOptions,
  createGraphQLCSClientFactory,
  getQueryForContentType,
} from 'lib/cs-service';
import scConfig from 'sitecore.config';
import { NextApiRequest, NextApiResponse } from 'next';
import { FetchOptions } from '@sitecore-content-sdk/core/client';
import ContentServiceClient from 'lib/cs-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { contentType, id } = req.query;
    if (!contentType || !id) {
      return res.status(400).json({ message: 'Missing contentType or id' });
    }

    debug.layout('api/content-service/[contentType]/[id].ts', contentType, id);

    const query = getQueryForContentType(contentType.toString(), id.toString());

    const graphQLOptions: GraphQLClientOptions = {
      api: scConfig.api,
      retries: scConfig.retries.count,
      retryStrategy: scConfig.retries.retryStrategy,
    };

    const csService = new ContentServiceClient({
      clientFactory: createGraphQLCSClientFactory(graphQLOptions),
      ...scConfig,
    });

    const accessToken = process.env.CONTENT_SERVICE_ACCESS_TOKEN || '';

    const fetchOptions: FetchOptions = {};
    if (fetchOptions.headers === undefined) {
      fetchOptions.headers = {};
    }
    fetchOptions.headers['Authorization'] = `Bearer ${accessToken}`;
    fetchOptions.headers['Content-Type'] = 'application/json';

    const data = await csService.graphQLClient.request(query, {}, fetchOptions);
    debug.layout('api/content-service/[contentType]/[id].ts', data);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
