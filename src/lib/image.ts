export async function downloadImage(url: string, filename = "ad-image.png") {
  const res = await fetch(url);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export function generatePlaceholderBanner(
  title: string,
  subtitle?: string,
  width = 1200,
  height = 628
): string {
  const bgGrad = `linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(var(--primary)) 100%)`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='hsl(${getVar('--brand')})'/>
        <stop offset='100%' stop-color='hsl(${getVar('--primary')})'/>
      </linearGradient>
      <filter id='noise'>
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch' />
        <feColorMatrix type='saturate' values='0' />
        <feComponentTransfer>
          <feFuncA type='linear' slope='0.06'/>
        </feComponentTransfer>
        <feBlend mode='overlay' />
      </filter>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect width='100%' height='100%' filter='url(#noise)' opacity='0.6'/>
    <g font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu' fill='hsl(${getVar('--brand-foreground')})'>
      <text x='60' y='360' font-size='72' font-weight='800'>${escapeXML(title)}</text>
      ${subtitle ? `<text x='60' y='430' font-size='34' opacity='0.9'>${escapeXML(subtitle)}</text>` : ''}
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getVar(name: string): string {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue(name).trim();
}

function escapeXML(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}
