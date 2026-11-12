// Formatting helpers for the mock data layer.

/** 21999 → «21 999 грн» (space as thousands separator, as in the mockup). */
export function money(value: number): string {
  const sign = value < 0 ? '−' : '';
  const digits = Math.abs(Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${digits} грн`;
}

/** Imitates network latency of a backend call. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
