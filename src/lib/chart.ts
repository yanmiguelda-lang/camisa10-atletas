/** Constrói o path SVG (linha + área) de uma série de números, dentro de um viewBox width×height. */
export function buildLineChart(values: number[], width: number, height: number, padding = 8) {
  if (values.length === 0) {
    return { linePath: "", areaPath: "", points: [] as { x: number; y: number }[] };
  }
  if (values.length === 1) {
    const y = height / 2;
    return { linePath: `M0,${y} L${width},${y}`, areaPath: "", points: [{ x: width / 2, y }] };
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const usableHeight = height - padding * 2;

  const points = values.map((v, i) => ({
    x: i * step,
    y: padding + usableHeight - ((v - min) / range) * usableHeight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return { linePath, areaPath, points };
}
