export function isMobile(): boolean {
  if (typeof window === 'undefined') return false; // Server-side rendering check
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
