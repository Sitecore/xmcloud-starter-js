import type { ImageField } from '@sitecore-content-sdk/nextjs';

type ImageValue = {
  src?: string;
  alt?: string;
  mediaid?: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : null;

const mediaIdFromXml = (xml: string): { id: string; alt: string } | null => {
  const mediaMatch = xml.match(/mediaid=["']\{?([0-9a-fA-F-]+)\}?["']/i);
  if (!mediaMatch?.[1]) return null;
  const altMatch = xml.match(/alt=["']([^"']*)["']/i);
  return { id: mediaMatch[1], alt: altMatch?.[1] || '' };
};

export const toMediaUrl = (mediaId: string): string =>
  `/-/media/${mediaId.replace(/[{}-]/g, '')}.ashx`;

export const repairMediaSrc = (src: string): string => {
  let next = (src || '').trim();
  next = next.replace(/^https:\/\/https\/+/i, '/');
  next = next.replace(/^https:\/\/-\//i, '/-/');
  return next;
};

export const normalizeSitecoreImageField = (field?: unknown): ImageField | undefined => {
  if (!field) return undefined;

  const record = asRecord(field);
  const jsonValue = asRecord(record?.jsonValue);
  const value = jsonValue?.value ?? record?.value ?? field;

  if (typeof value === 'string') {
    const parsed = mediaIdFromXml(value);
    if (!parsed) return undefined;
    return { value: { src: toMediaUrl(parsed.id), alt: parsed.alt } };
  }

  const nested = asRecord(value);
  const src =
    (typeof nested?.src === 'string' && nested.src) ||
    (typeof record?.src === 'string' && record.src) ||
    '';
  const mediaid =
    (typeof nested?.mediaid === 'string' && nested.mediaid) ||
    (typeof record?.mediaid === 'string' && record.mediaid) ||
    '';
  const alt =
    (typeof nested?.alt === 'string' && nested.alt) ||
    (typeof record?.alt === 'string' && record.alt) ||
    '';

  const resolvedSrc = repairMediaSrc(src || (mediaid ? toMediaUrl(mediaid) : ''));
  if (!resolvedSrc) return undefined;

  return { value: { src: resolvedSrc, alt } satisfies ImageValue };
};
