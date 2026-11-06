import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import {
  REVALIDATE_SECRET_ENV,
  REVALIDATE_SECRET_HEADER,
  checkRevalidateSecret,
  parseWebhookBody,
  summarizeWebhookBody,
} from '@/lib/publish-revalidation';

export const dynamic = 'force-dynamic';

/**
 * Called by the Experience Edge webhook after every publish (ADR 0015).
 *
 * Marks every page as stale; each one re-renders from Edge on its next request. The whole
 * site is cleared rather than the changed items' pages because a page's HTML depends on many
 * items (datasources, partial designs, the Dictionary) in every language, and the site is small.
 * Edge disables a webhook after 10 failed or >30 s calls, so this answers immediately.
 */
export async function POST(req: NextRequest) {
  const auth = checkRevalidateSecret(
    req.headers.get(REVALIDATE_SECRET_HEADER),
    process.env[REVALIDATE_SECRET_ENV]
  );
  if (auth === 'not-configured') {
    return NextResponse.json(
      { error: `${REVALIDATE_SECRET_ENV} is not set on the rendering host.` },
      { status: 503 }
    );
  }
  if (auth === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const summary = summarizeWebhookBody(parseWebhookBody(await req.text()));
  revalidatePath('/', 'layout');
  console.log('[revalidate] all pages marked stale', summary);

  return NextResponse.json({
    revalidated: true,
    scope: 'all-pages',
    ...summary,
    at: new Date().toISOString(),
  });
}
