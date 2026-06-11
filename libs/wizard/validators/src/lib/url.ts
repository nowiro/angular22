/**
 * Loose URL format check (http/https only). Used for optional company
 * website fields.
 */
export function isValidWebsiteUrl(value: string): boolean {
  if (value === '') return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
