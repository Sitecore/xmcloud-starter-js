'use strict';
/**
 * Where an environment's search source ID lives (ADR 0013 decision 7):
 * docs/ai/config/project.yaml `searchSources.articles` (committed on the branch that owns the
 * environment; not secret), falling back to SITECORE_SEARCH_PUSH_SOURCE_ID in the process env,
 * .env.local or .env. The push API key and endpoint never live in project.yaml.
 */
const fs = require('node:fs');
const path = require('node:path');

function readProjectYaml(app) {
  try {
    // Lazy: js-yaml is an app dependency; this module is also used by plain node scripts.
    const yaml = require('js-yaml');
    return yaml.load(fs.readFileSync(path.join(app, 'docs/ai/config/project.yaml'), 'utf8')) || {};
  } catch {
    return {};
  }
}

function readEnvVar(app, name, env = process.env) {
  if (env[name]) return env[name];
  for (const file of ['.env.local', '.env']) {
    try {
      const match = fs
        .readFileSync(path.join(app, file), 'utf8')
        .match(new RegExp(`^${name}=(.*)$`, 'm'));
      if (match && match[1].trim()) return match[1].trim().replace(/^["']|["']$/g, '');
    } catch {
      // try the next file
    }
  }
  return undefined;
}

/** The articles source ID, or undefined. */
function readSearchSource(app, env = process.env) {
  const fromProject = readProjectYaml(app)?.searchSources?.articles;
  if (typeof fromProject === 'string' && fromProject.trim()) return fromProject.trim();
  return readEnvVar(app, 'SITECORE_SEARCH_PUSH_SOURCE_ID', env);
}

/**
 * The Sitecore languages pushed to the articles source (project.yaml `searchLocales`). They must
 * equal the source's locale codes, which can't be changed after the source is saved. Defaults to
 * English only.
 */
function readSearchLocales(app) {
  const fromProject = readProjectYaml(app)?.searchLocales;
  if (Array.isArray(fromProject)) {
    const locales = fromProject.map((x) => String(x).trim()).filter(Boolean);
    if (locales.length) return locales;
  }
  return ['en'];
}

module.exports = { readSearchSource, readSearchLocales, readEnvVar, readProjectYaml };
