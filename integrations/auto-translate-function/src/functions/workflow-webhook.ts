import { app, output, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { readWebhookConfig } from '../config';
import { QUEUES } from '../messages';
import { parseWorkflowPayload } from '../payload';

export const requestsQueue = output.storageQueue({ queueName: QUEUES.requests, connection: 'AzureWebJobsStorage' });

/**
 * Receives the SitecoreAI "Webhook Submit Action" fired when an item is approved in workflow.
 *
 * It only validates the payload and queues it, then answers straight away; the Sitecore calls
 * happen in the queue functions. Authentication is the function key: in Sitecore, an API key
 * authorization item sends it as the `x-functions-key` header.
 */
export async function workflowWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const { sourceLanguage } = readWebhookConfig();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    context.warn('[webhook] body is not valid JSON');
    return { status: 400, jsonBody: { error: 'Body must be JSON. Set the webhook Serialization Type to JSON.' } };
  }

  const result = parseWorkflowPayload(body, sourceLanguage);

  if (result.kind === 'invalid') {
    context.warn(`[webhook] rejected: ${result.reason}`);
    return { status: 400, jsonBody: { error: result.reason } };
  }

  if (result.kind === 'skip') {
    context.log(`[webhook] skipped: ${result.reason}`);
    return { status: 200, jsonBody: { queued: false, reason: result.reason } };
  }

  context.extraOutputs.set(requestsQueue, result.request);
  context.log(
    `[webhook] queued ${result.request.itemId} (${result.request.itemName ?? 'unnamed'}, ` +
      `${result.request.sourceLanguage}) approved by ${result.request.approvedBy ?? 'unknown'}`
  );
  return { status: 202, jsonBody: { queued: true, itemId: result.request.itemId } };
}

app.http('workflowWebhook', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'sitecore/workflow-approved',
  extraOutputs: [requestsQueue],
  handler: workflowWebhook,
});
