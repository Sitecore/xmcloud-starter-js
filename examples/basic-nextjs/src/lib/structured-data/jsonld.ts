export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

/**
 * Safely serializes JSON-LD for embedding in a <script type="application/ld+json" /> tag.
 * Replaces `<` to avoid ending the script tag early (e.g. `</script>` injection).
 */
export function toJsonLdString(value: JsonLdValue): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

