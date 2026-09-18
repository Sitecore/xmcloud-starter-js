import { computed, type Signal } from '@angular/core';

type LayoutParams = { RenderingIdentifier?: string; Styles?: string };

/**
 * CSS class/id helpers for component wrappers.
 */
export function computedRenderingId(
  params: () => { [key: string]: string } | undefined,
): Signal<string | undefined> {
  return computed(() => {
    const layoutParams = params() as LayoutParams | undefined;
    const id = layoutParams?.RenderingIdentifier?.trim();
    return id || undefined;
  });
}
