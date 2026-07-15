/**
 * Lazy-loadable framer-motion feature bundle.
 *
 * `domAnimation` covers: animate, exit, variants, whileHover, whileTap,
 * whileFocus, whileInView — sufficient for every animation in this project.
 */
export async function loadFramerFeatures() {
  const mod = await import('framer-motion');
  return mod.domAnimation;
}
