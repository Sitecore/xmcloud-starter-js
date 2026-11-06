import { app, output, type InvocationContext } from '@azure/functions';
import { getWorker } from '../client';
import { QUEUES, type TranslationRequest } from '../messages';
import { planTranslation } from '../planner';

const pagesQueue = output.storageQueue({ queueName: QUEUES.pages, connection: 'AzureWebJobsStorage' });

/** Turns one approved item into one page task listing the languages to translate into. */
export async function planTranslations(message: unknown, context: InvocationContext): Promise<void> {
  const request = message as TranslationRequest;
  const { config, client } = getWorker();

  const plan = await planTranslation(request, config, client);

  if (plan.kind === 'skip') {
    context.log(`[plan] skipped: ${plan.reason}`);
    return;
  }

  if (plan.notOnSite.length > 0) {
    context.warn(`[plan] TARGET_LANGUAGES not used by the site, ignored: ${plan.notOnSite.join(', ')}`);
  }

  context.extraOutputs.set(pagesQueue, plan.task);
  context.log(
    `[plan] page ${request.itemId} (${plan.task.pageName ?? 'unnamed'}): ` +
      `${request.sourceLanguage} -> ${plan.task.targetLanguages.join(', ')}`
  );
}

app.storageQueue('planTranslations', {
  queueName: QUEUES.requests,
  connection: 'AzureWebJobsStorage',
  extraOutputs: [pagesQueue],
  handler: planTranslations,
});
