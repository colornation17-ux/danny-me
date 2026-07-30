/** Tiny className joiner — no clsx dependency. */
export function cn(...parts) {
  return parts.flat().filter(Boolean).join(' ')
}
