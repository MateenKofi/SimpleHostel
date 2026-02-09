// utils/parseRange.ts
export function parseRange(range: string) {
  const clean = range.trim();
  if (clean.endsWith("+")) {
    const min = Number(clean.slice(0, -1));
    return { min, max: Infinity };
  }
  const [a, b] = clean.split("-").map((s) => Number(s.trim()));
  return { min: a, max: b };
}
