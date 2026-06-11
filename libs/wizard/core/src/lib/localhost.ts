/**
 * Dev-only gate — the fill panel renders exclusively on local hosts so the
 * feature can ship in the bundle without ever surfacing on a deployed origin.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isLocalhost(hostname?: string): boolean {
  const host = hostname ?? globalThis.location?.hostname ?? '';
  return LOCAL_HOSTNAMES.has(host);
}
