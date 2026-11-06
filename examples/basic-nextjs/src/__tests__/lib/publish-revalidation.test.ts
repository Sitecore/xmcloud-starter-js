import {
  checkRevalidateSecret,
  parseWebhookBody,
  summarizeWebhookBody,
} from '@/lib/publish-revalidation';

describe('checkRevalidateSecret', () => {
  test('accepts the configured secret', () => {
    expect(checkRevalidateSecret('s3cret-value', 's3cret-value')).toBe('ok');
    expect(checkRevalidateSecret(' s3cret-value ', 's3cret-value\n')).toBe('ok');
  });

  test.each([
    ['wrong secret', 'nope', 's3cret-value'],
    ['missing header', null, 's3cret-value'],
    ['prefix of the secret', 's3cret', 's3cret-value'],
  ])('rejects a %s', (_, provided, configured) => {
    expect(checkRevalidateSecret(provided, configured)).toBe('unauthorized');
  });

  test.each([undefined, '', '   '])('stays closed when no secret is configured (%p)', (configured) => {
    expect(checkRevalidateSecret('anything', configured)).toBe('not-configured');
    expect(checkRevalidateSecret(null, configured)).toBe('not-configured');
  });
});

describe('webhook bodies', () => {
  test('summarises an OnUpdate body', () => {
    const body = parseWebhookBody(
      JSON.stringify({
        invocation_id: '6a271d7b-92de-4d14-8002-8fc97a46c290',
        updates: [
          { identifier: 'B43D07BD61D5448F93238B6ACAD4F3C4-layout', entity_definition: 'LayoutData', operation: 'Update', entity_culture: 'ja-JP' },
          { identifier: 'main-website', entity_definition: 'SiteInfo', operation: 'Update', entity_culture: 'all' },
        ],
        continues: true,
      })
    );
    expect(summarizeWebhookBody(body)).toEqual({
      invocationId: '6a271d7b-92de-4d14-8002-8fc97a46c290',
      updates: 2,
      continues: true,
    });
  });

  test.each(['', '   ', 'not json', '{"source":"edge-webhook"}', '[]'])(
    'tolerates an OnEnd or unexpected body %p',
    (text) => {
      expect(summarizeWebhookBody(parseWebhookBody(text))).toEqual({
        invocationId: null,
        updates: 0,
        continues: false,
      });
    }
  );
});
