export function hasContents(remaining: string): boolean {
  return remaining.indexOf('</') !== 0 && remaining.indexOf('<') !== 0;
}
