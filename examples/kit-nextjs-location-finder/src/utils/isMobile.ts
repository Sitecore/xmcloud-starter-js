/**
 * Detects mobile/touch devices using modern feature detection.
 * Avoids deprecated navigator.userAgent sniffing (Lighthouse Best Practices).
 *
 * Uses `navigator.maxTouchPoints` (supported in all modern browsers) and
 * `matchMedia` for coarse pointer detection as a progressive fallback.
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;

  // Primary: touch capability + narrow viewport
  const hasTouch = navigator.maxTouchPoints > 0;
  const isNarrow = window.matchMedia('(max-width: 768px)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  return hasTouch && (isNarrow || hasCoarsePointer);
}
