import { describe, expect, it } from 'vitest';
import sample from '../samples/workflow-approved.json';
import { normalizeGuid, parseWorkflowPayload } from '../src/payload';

const NOW = new Date('2026-01-01T10:00:00Z');

describe('parseWorkflowPayload', () => {
  it('queues an approved source-language item', () => {
    const result = parseWorkflowPayload(sample, 'en', NOW);

    expect(result).toEqual({
      kind: 'translate',
      request: {
        itemId: '2c8e2214-0d54-4a82-8f84-b60c08f169a9',
        itemName: 'About Us',
        sourceLanguage: 'en',
        sourceVersion: 3,
        workflowName: 'Page Workflow',
        approvedBy: 'sitecore\\author@example.com',
        receivedAt: '2026-01-01T10:00:00.000Z',
      },
    });
  });

  it('skips other languages, which also stops translations from re-triggering themselves', () => {
    const body = { ...sample, DataItem: { ...sample.DataItem, Language: 'de-DE' } };
    const result = parseWorkflowPayload(body, 'en', NOW);
    expect(result.kind).toBe('skip');
  });

  it('compares languages case-insensitively', () => {
    const body = { ...sample, DataItem: { ...sample.DataItem, Language: 'EN' } };
    expect(parseWorkflowPayload(body, 'en', NOW).kind).toBe('translate');
  });

  it.each([
    ['a non-object body', 'hello'],
    ['a missing DataItem', { ActionName: 'x' }],
    ['a missing item ID', { DataItem: { Language: 'en' } }],
    ['a non-GUID item ID', { DataItem: { Id: 'home', Language: 'en' } }],
    ['a missing language', { DataItem: { Id: '2c8e2214-0d54-4a82-8f84-b60c08f169a9' } }],
  ])('rejects %s', (_label, body) => {
    expect(parseWorkflowPayload(body, 'en', NOW).kind).toBe('invalid');
  });
});

describe('normalizeGuid', () => {
  it.each([
    '{2C8E2214-0D54-4A82-8F84-B60C08F169A9}',
    '2c8e22140d544a828f84b60c08f169a9',
    '2c8e2214-0d54-4a82-8f84-b60c08f169a9',
  ])('normalises %s', (value) => {
    expect(normalizeGuid(value)).toBe('2c8e2214-0d54-4a82-8f84-b60c08f169a9');
  });

  it('rejects non-GUIDs', () => {
    expect(normalizeGuid('not-a-guid')).toBeUndefined();
  });
});
