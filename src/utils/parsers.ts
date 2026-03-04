/**
 * Parsers utility module
 * Contains functions for parsing string data into structured types
 */

/**
 * Parses a range string into min/max values
 * Supports formats like "100-500" and "500+"
 * @param range - The range string to parse (e.g., "100-500", "500+")
 * @returns Object with min and max values (max is Infinity for "+" ranges)
 */
export function parseRange(range: string): { min: number; max: number } {
  const clean = range.trim();
  if (clean.endsWith("+")) {
    const min = Number(clean.slice(0, -1));
    return { min, max: Infinity };
  }
  const [a, b] = clean.split("-").map((s) => Number(s.trim()));
  return { min: a, max: b };
}
