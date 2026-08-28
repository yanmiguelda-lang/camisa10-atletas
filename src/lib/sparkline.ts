/** Gera os pontos de uma polyline SVG (viewBox 0 0 100 32) a partir de uma série de números. */
export function sparklinePoints(values: number[]): string {
  if (values.length === 0) return "0,16 100,16";
  if (values.length === 1) return `0,16 100,16`;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = 100 / (values.length - 1);

  return values
    .map((v, i) => {
      const x = i * step;
      const y = 30 - ((v - min) / range) * 28;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
