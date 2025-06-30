/* eslint-disable @typescript-eslint/no-explicit-any */
import { debug } from '@sitecore-content-sdk/core';
import { getContentServiceToken } from 'lib/cs-service';
import { NextApiRequest, NextApiResponse } from 'next';

interface LayoutItem {
  id: string;
  name: string;
  version: number;
  system: {
    publishStatus: string;
  };
}

interface GraphQLResponse<T> {
  count: number;
  next: string;
  data: T;
}

interface WorkSetProcess {
  id: string;
  name: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const Key = req.headers['x-sitecore-apikey'];
    const { items, type = 0 } = req.body;
    if (!Key || Key !== process.env.PREVIEW_XMC_GQL_KEY) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    const accessToken = await getContentServiceToken();
    const contenItemsRequest = await fetch(
      'https://cs-euw-prd-s1.sitecorecloud.io/api/v2/environments/main/content-items',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const contentItems: { count: number; next: string; data: LayoutItem[] } =
      await contenItemsRequest.json();
    debug.layout('publish.ts: contenItems:', contentItems);

    const worksetProcesses: GraphQLResponse<WorkSetProcess[]> = await listWorksetProcesses(
      accessToken
    );
    debug.layout('publish.ts: worksetProcesses:', worksetProcesses);

    const publishProcesses = worksetProcesses?.data?.find(
      (process: any) => process.name === 'Publish'
    );
    debug.layout('publish.ts: publishProcesses:', publishProcesses);

    if (!publishProcesses) {
      return res.status(400).json({ message: 'No publish process found' });
    }

    const itemsToPublish = [];
    for (const item of items) {
      let version = 1;
      const layoutItemVersions: LayoutItem[] = contentItems.data.filter(
        (li: any) => li.id === item.id
      );
      debug.layout('publish.ts: layoutItemVersions:', layoutItemVersions);

      for (const li of layoutItemVersions) {
        if (li.version > version) {
          version = li.version;
        }
      }

      debug.layout('publish.ts: version:', version);

      itemsToPublish.push({
        id: item.id,
        version: version,
        Type: type,
        Locale: 'en',
      });
    }

    debug.layout('publish.ts: itemsToPublish:', itemsToPublish);

    const workset = await fetch(
      'https://cs-euw-prd-s1.sitecorecloud.io/api/v2/environments/main/worksets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: 'ContentItemPublish',
          description: 'Publish items through API',
          items: itemsToPublish,
          options: {
            source: {
              sourceId: 'Content Services',
            },
          },
        }),
      }
    );

    const worksetData = await workset.json();
    debug.layout('publish.ts: worksetData:', worksetData);

    if (worksetData.errors) {
      return res.status(400).json({ errors: worksetData.errors });
    }

    await createWorksetProcessExecution(accessToken, publishProcesses.id, worksetData.id);
    return res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const listWorksetProcesses = async (accessToken: string) => {
  const apiUrl =
    'https://cs-euw-prd-s1.sitecorecloud.io/api/v2/environments/main/worksets/processes';

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data;
};

const createWorksetProcessExecution = async (
  accessToken: string,
  processId: string,
  worksetId: string
) => {
  const apiUrl = `https://cs-euw-prd-s1.sitecorecloud.io/api/v2/environments/main/worksets/processes/executions`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: 'Process workset',
      description: `Process workset ${worksetId} using process ${processId}`,
      workSetId: worksetId,
      worksetProcessId: processId,
    }),
  });

  const data = await response.json();
  debug.layout('publish.ts: worksetProcessExecution:', data);
  return data;
};
