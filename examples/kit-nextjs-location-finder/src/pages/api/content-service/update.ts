/* eslint-disable @typescript-eslint/no-explicit-any */
import { debug } from '@sitecore-content-sdk/core';
import { executeCsQuery, getContentServiceToken } from 'lib/cs-service';
import type { NextApiRequest, NextApiResponse } from 'next';

interface LayoutResponse {
  sitecore: any;
}

interface GraphQLResponse {
  data?: {
    layout: {
      item: {
        rendered: any;
      };
    };
  };
  errors?: Array<{
    message: string;
    locations: Array<{ line: number; column: number }>;
  }>;
}

interface ContentItem {
  Name: string;
  Label: string;
  Locale: string;
  ContentTypeId: string;
  Fields: {
    Path: {
      value: string;
    };
    Rendered: {
      value: LayoutResponse;
    };
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { Path, Locale, Key } = req.body;

    if (!Key || Key !== process.env.PREVIEW_XMC_GQL_KEY) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // 1. First GraphQL call - Layout
    const layoutResponse = await fetch(process.env.PREVIEW_XMC_GQL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        sc_apikey: process.env.PREVIEW_XMC_GQL_KEY || '',
      },
      body: JSON.stringify({
        query: `query {
          layout(routePath: "${Path}", language: "${Locale}", site: "microsoft") {
            item {
              rendered
            }
          }
        }`,
      }),
    });

    const layoutData: GraphQLResponse = await layoutResponse.json();
    debug.layout('udpate.ts: layoutData:', layoutData);

    if (layoutData.errors) {
      return res.status(400).json({ errors: layoutData.errors });
    }

    // 2. Second GraphQL call - ManyLayoutItem
    debug.layout('update.ts: fetching ManyLayoutItem');
    const manyLayoutData = await executeCsQuery(`query ManyLayoutItem() {
          manyLayoutItem(minimumPageSize: 1, filter: {
            AND: [
              {
                path: { equals: "${Path}"}
              }
            ]
          }) {
            results {
              system {
                id
                name
                version
                locale
              }
              path
              rendered
            }
          }
        }`);

    debug.layout('udpate.ts: manyLayoutData:', manyLayoutData);

    // 3. Create the new JSON object combining both responses
    const contentItem: ContentItem = {
      Name: layoutData.data?.layout.item.rendered.sitecore.route.name,
      Label: layoutData.data?.layout.item.rendered.sitecore.route.displayName,
      Locale: 'en',
      ContentTypeId: '2w1TIjBl6WKfYwVqztGsFX',
      Fields: {
        Path: {
          value: Path,
        },
        Rendered: layoutData.data?.layout.item.rendered || {},
      },
    };

    // 4. Make the final API call to content service
    debug.layout('update.ts: making final API call to content service');
    const existingItem = manyLayoutData.data?.manyLayoutItem.results[0];
    debug.layout('update.ts: existingItem:', existingItem);
    debug.layout('update.ts: newItem:', contentItem);

    const baseUrl = 'https://cs-euw-prd-s1.sitecorecloud.io/api/v2/environments/main/content-items';
    const url = existingItem ? `${baseUrl}/${existingItem.system.id}?locale=${Locale}` : baseUrl;
    const method = existingItem ? 'PUT' : 'POST';

    debug.layout('update.ts: getting access token');
    const accessToken = await getContentServiceToken();

    debug.layout('update.ts: making API call to content service', url, method);
    const contentServiceResponse = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(contentItem),
    });

    const result = await contentServiceResponse.text();
    debug.layout('update.ts: result2:', result, contentServiceResponse.status);
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
