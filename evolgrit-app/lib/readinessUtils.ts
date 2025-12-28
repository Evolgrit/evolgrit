export function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, n));
}
