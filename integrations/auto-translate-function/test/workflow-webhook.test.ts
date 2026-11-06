import { HttpRequest, InvocationContext } from '@azure/functions';
import { describe, expect, it } from 'vitest';
import sample from '../samples/workflow-approved.json';
import { requestsQueue, workflowWebhook } from '../src/functions/workflow-webhook';

function post(body: string) {
  return new HttpRequest({
    method: 'POST',
    url: 'http://localhost:7071/api/sitecore/workflow-approved',
    body: { string: body },
  });
}

function silentContext() {
  return new InvocationContext({ logHandler: () => undefined });
}

describe('workflowWebhook', () => {
  it('queues an approved English page and answers 202', async () => {
    const context = silentContext();
    const response = await workflowWebhook(post(JSON.stringify(sample)), context);

    expect(response.status).toBe(202);
    expect(context.extraOutputs.get(requestsQueue)).toMatchObject({
      itemId: '2c8e2214-0d54-4a82-8f84-b60c08f169a9',
      sourceLanguage: 'en',
    });
  });

  it('answers 200 without queueing for a translated version', async () => {
    const context = silentContext();
    const body = { ...sample, DataItem: { ...sample.DataItem, Language: 'ja-JP' } };
    const response = await workflowWebhook(post(JSON.stringify(body)), context);

    expect(response.status).toBe(200);
    expect(context.extraOutputs.get(requestsQueue)).toBeUndefined();
  });

  it('answers 400 for a body that is not JSON', async () => {
    const response = await workflowWebhook(post('<event/>'), silentContext());
    expect(response.status).toBe(400);
  });
});
