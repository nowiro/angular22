/**
 * Dev-only gate — the fill panel renders exclusively on local hosts so the
 * feature can ship in the bundle without ever surfacing on a deployed origin.
 *
 * NOTE: `location.hostname` serializes an IPv6 host WITH brackets, so the real
 * loopback value is `[::1]` (verified: `new URL('http://[::1]/').hostname === '[::1]'`).
 * `::1` is kept too for callers that pass a bare, unbracketed address — do NOT
 * "clean up" `[::1]` as dead code; it is the value the browser actually reports.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isLocalhost(hostname?: string): boolean {
  const host = hostname ?? globalThis.location?.hostname ?? '';
  return LOCAL_HOSTNAMES.has(host);
}
