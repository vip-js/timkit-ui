export function progressPercent(value: number | null | undefined, min = 0, max = 100) {
  if (value == null || !Number.isFinite(value)) return null
  const span = max - min
  if (!Number.isFinite(span) || span <= 0) return 0
  return Math.min(100, Math.max(0, ((value - min) / span) * 100))
}
