import { readWorkerConfig, type WorkerConfig } from './config';
import { SitecoreApiClient } from './sitecore-api';

let cached: { config: WorkerConfig; client: SitecoreApiClient } | undefined;

/** One config and API client per worker process, so the JWT and site lookup are reused. */
export function getWorker(): { config: WorkerConfig; client: SitecoreApiClient } {
  if (!cached) {
    const config = readWorkerConfig();
    cached = { config, client: new SitecoreApiClient(config) };
  }
  return cached;
}
