import { APP_CONFIG } from '@/core/config/app.config';

export function RenderQRCode({ className = 'w-44 h-44 select-none' }: { className?: string }) {
  const size = APP_CONFIG.scanner.finderSize;
  const pixels: Array<{ r: number; c: number; color: string }> = [];

  const isFinderPattern = (r: number, c: number) => {
    if (r < 7 && c < 7) return true;
    if (r < 7 && c >= size - 7) return true;
    if (r >= size - 7 && c < 7) return true;
    return false;
  };

  let seed = APP_CONFIG.scanner.finderSeed;
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinderPattern(r, c)) continue;
      const rand = pseudoRandom();
      if (rand > 0.45) {
        const isRed = pseudoRandom() > 0.6;
        pixels.push({ r, c, color: isRed ? APP_CONFIG.theme.colors.brandRedDeep : '#1A1C1E' });
      }
    }
  }

  return (
    <svg viewBox="0 0 210 210" className={className}>
      <rect width="210" height="210" fill="white" />
      <g transform="translate(10, 10)"><rect width="70" height="70" fill="#1A1C1E" rx="8" /><rect x="10" y="10" width="50" height="50" fill="white" rx="4" /><rect x="20" y="20" width="30" height="30" fill="#1A1C1E" rx="2" /></g>
      <g transform="translate(130, 10)"><rect width="70" height="70" fill="#1A1C1E" rx="8" /><rect x="10" y="10" width="50" height="50" fill="white" rx="4" /><rect x="20" y="20" width="30" height="30" fill="#1A1C1E" rx="2" /></g>
      <g transform="translate(10, 130)"><rect width="70" height="70" fill="#1A1C1E" rx="8" /><rect x="10" y="10" width="50" height="50" fill="white" rx="4" /><rect x="20" y="20" width="30" height="30" fill="#1A1C1E" rx="2" /></g>
      {pixels.map((p, idx) => <rect key={idx} x={10 + p.c * 9} y={10 + p.r * 9} width="9" height="9" fill={p.color} rx="1" />)}
    </svg>
  );
}
