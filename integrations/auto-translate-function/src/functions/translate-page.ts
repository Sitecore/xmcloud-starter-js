import { app, output, type InvocationContext } from '@azure/functions';
import { getWorker } from '../client';
import { QUEUES, type PageTranslationTask } from '../messages';
import { translatePageSequentially } from '../translator';

/** Attempts per page task before giving up on the languages left. */
export const MAX_ATTEMPTS = 5;

const pagesQueue = output.storageQueue({ queueName: QUEUES.pages, connection: 'AzureWebJobsStorage' });

/**
 * Translates one page into its target languages, one language at a time (see
 * translatePageSequentially). After a retryable failure it re-queues the same page with only
 * the languages left, so finished languages are never translated twice.
 */
export async function translatePage(message: unknown, context: InvocationContext): Promise<void> {
  const task = message as PageTranslationTask;
  const label = `page ${task.pageId} (${task.pageName ?? 'unnamed'})`;
  const { client } = getWorker();

  if (task.attempt > 1) {
    // Back off before a retry: 15 s, 30 s, 45 s, 60 s.
    await new Promise((resolve) => setTimeout(resolve, Math.min(60, 15 * (task.attempt - 1)) * 1000));
  }

  context.log(
    `[translate] ${label} attempt ${task.attempt}: ${task.sourceLanguage} -> ${task.targetLanguages.join(', ')}`
  );

  const result = await translatePageSequentially(task, client, {
    log: (line) => context.log(`[translate] ${label} ${line}`),
  });

  for (const outcome of result.outcomes) {
    const line = `[translate] ${label} ${outcome.language}: ${outcome.outcome} in ${outcome.seconds}s${
      outcome.detail ? ` (${outcome.detail})` : ''
    }${outcome.workflow ? `; workflow ${outcome.workflow}` : ''}`;
    if (outcome.workflowResetFailed) {
      context.error(`${line} -- REVIEW BEFORE PUBLISHING: this translation may be publishable without approval`);
    } else if (outcome.outcome === 'translated') context.log(line);
    else if (outcome.outcome === 'failed-permanently') context.error(line);
    else context.warn(line);
  }

  const completed = [
    ...task.completedLanguages,
    ...result.outcomes.filter((outcome) => outcome.outcome !== 'failed-permanently').map((outcome) => outcome.language),
  ];

  if (!result.retry) {
    context.log(`[translate] ${label} finished: ${completed.join(', ') || 'no languages'}`);
    return;
  }

  if (task.attempt >= MAX_ATTEMPTS) {
    context.error(
      `[translate] ${label} GAVE UP after ${task.attempt} attempts; not translated: ` +
        `${result.retry.languages.join(', ')}. Last error: ${result.retry.reason}`
    );
    return;
  }

  const next: PageTranslationTask = {
    ...task,
    targetLanguages: result.retry.languages,
    completedLanguages: completed,
    attempt: task.attempt + 1,
  };
  context.extraOutputs.set(pagesQueue, next);
  context.warn(
    `[translate] ${label} will retry ${next.targetLanguages.join(', ')} (attempt ${next.attempt}): ${result.retry.reason}`
  );
}

app.storageQueue('translatePage', {
  queueName: QUEUES.pages,
  connection: 'AzureWebJobsStorage',
  extraOutputs: [pagesQueue],
  handler: translatePage,
});
