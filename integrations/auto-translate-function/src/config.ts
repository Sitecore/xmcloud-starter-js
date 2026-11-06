export type TranslationStrategy = 'AddVersion' | 'SkipIfExists';

const STRATEGIES: readonly TranslationStrategy[] = ['AddVersion', 'SkipIfExists'];

export const DEFAULT_API_BASE_URL = 'https://xmapps-api.sitecorecloud.io';
export const DEFAULT_AUTH_URL = 'https://auth.sitecorecloud.io/oauth/token';
export const DEFAULT_AUDIENCE = 'https://api.sitecorecloud.io';

type Env = Record<string, string | undefined>;

/** Settings the webhook needs. It never calls Sitecore, so it needs no credentials. */
export interface WebhookConfig {
  sourceLanguage: string;
}

/** Settings the queue workers need to call the SitecoreAI Sites and Pages APIs. */
export interface WorkerConfig extends WebhookConfig {
  clientId: string;
  clientSecret: string;
  siteName: string;
  environmentId?: string;
  /** Empty means "every language the site uses, except the source language". */
  targetLanguages: string[];
  strategy: TranslationStrategy;
  /**
   * Workflow state (ID) to put new translations in when they land in a final state, for example
   * Sample Workflow's Draft. Translations copy the source version's state, so without this an
   * approved page produces approved, publishable translations. Empty: leave them as they are.
   */
  translationWorkflowState?: string;
  apiBaseUrl: string;
  authUrl: string;
  audience: string;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

function optional(env: Env, name: string): string | undefined {
  const value = env[name]?.trim();
  return value ? value : undefined;
}

function required(env: Env, name: string): string {
  const value = optional(env, name);
  if (!value) throw new ConfigError(`App setting ${name} is not set.`);
  return value;
}

export function parseLanguageList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;|\s]+/)
    .map((language) => language.trim())
    .filter(Boolean);
}

export function readWebhookConfig(env: Env = process.env): WebhookConfig {
  return { sourceLanguage: optional(env, 'SOURCE_LANGUAGE') ?? 'en' };
}

export function readWorkerConfig(env: Env = process.env): WorkerConfig {
  const strategy = optional(env, 'TRANSLATION_STRATEGY') ?? 'AddVersion';
  if (!STRATEGIES.includes(strategy as TranslationStrategy)) {
    throw new ConfigError(
      `TRANSLATION_STRATEGY must be one of ${STRATEGIES.join(', ')} (got "${strategy}").`
    );
  }

  return {
    ...readWebhookConfig(env),
    clientId: required(env, 'SITECORE_CLIENT_ID'),
    clientSecret: required(env, 'SITECORE_CLIENT_SECRET'),
    siteName: required(env, 'SITECORE_SITE_NAME'),
    environmentId: optional(env, 'SITECORE_ENVIRONMENT_ID'),
    targetLanguages: parseLanguageList(optional(env, 'TARGET_LANGUAGES')),
    strategy: strategy as TranslationStrategy,
    translationWorkflowState: optional(env, 'TRANSLATION_WORKFLOW_STATE'),
    apiBaseUrl: (optional(env, 'SITECORE_API_BASE_URL') ?? DEFAULT_API_BASE_URL).replace(/\/+$/, ''),
    authUrl: optional(env, 'SITECORE_AUTH_URL') ?? DEFAULT_AUTH_URL,
    audience: optional(env, 'SITECORE_AUDIENCE') ?? DEFAULT_AUDIENCE,
  };
}
