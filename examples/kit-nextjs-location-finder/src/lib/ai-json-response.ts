import { NextResponse } from 'next/server';

const DEFAULT_MAX_AGE = 86400;

export interface AiJsonResponseOptions {
  maxAge?: number;
  status?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
}

function buildCacheControl(
  maxAge: number,
  options?: { sMaxAge?: number; staleWhileRevalidate?: number }
): string {
  const parts = [`public`, `max-age=${maxAge}`];
  if (options?.sMaxAge != null) parts.push(`s-maxage=${options.sMaxAge}`);
  if (options?.staleWhileRevalidate != null)
    parts.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  return parts.join(', ');
}

export function aiJsonResponse<T>(
  data: T,
  options?: AiJsonResponseOptions
): NextResponse {
  const maxAge = options?.maxAge ?? DEFAULT_MAX_AGE;
  const status = options?.status ?? 200;
  const cacheControl = buildCacheControl(maxAge, {
    sMaxAge: options?.sMaxAge,
    staleWhileRevalidate: options?.staleWhileRevalidate,
  });

  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  });
}
