export function svgWatermarkText(text='Studio Nexora', opts?: {
  width?: number, height?: number,
  fontSize?: number,
  color?: string, opacity?: number
}) {
  const W = Math.max(32, opts?.width ?? 1024);
  const H = Math.max(32, opts?.height ?? 600);
  const size = Math.round(opts?.fontSize ?? Math.max(16, Math.min(W,H) * 0.08)); // 8% dimensión corta
  const color = opts?.color ?? '#ffffff';
  const opacity = Math.min(1, Math.max(0, opts?.opacity ?? 0.2)); // default 0.2

  return Buffer.from(
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <style>
    .wm { font: ${size}px sans-serif; fill: ${color}; opacity: ${opacity}; }
  </style>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="wm">${text}</text>
</svg>`
  );
}

