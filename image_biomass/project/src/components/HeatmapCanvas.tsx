import { useEffect, useRef } from 'react';

interface Props {
  imageSrc: string;
  seed: number;
  vegetationCoverage: number;
}

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function HeatmapCanvas({ imageSrc, seed, vegetationCoverage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rand = seededRand(seed);
    const W = canvas.width;
    const H = canvas.height;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, W, H);

      const heatData = ctx.createImageData(W, H);
      const density = vegetationCoverage / 100;

      const blobs: { x: number; y: number; r: number; intensity: number }[] = [];
      const count = Math.floor(8 + density * 20);
      for (let i = 0; i < count; i++) {
        blobs.push({
          x: rand() * W,
          y: rand() * H,
          r: 30 + rand() * 80,
          intensity: 0.3 + rand() * 0.7 * density,
        });
      }

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          let total = 0;
          for (const b of blobs) {
            const dx = px - b.x;
            const dy = py - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.r) {
              total += b.intensity * (1 - dist / b.r);
            }
          }
          total = Math.min(1, total);

          let r = 0, g = 0, b2 = 0;
          if (total < 0.33) {
            const t = total / 0.33;
            r = Math.round(59 + t * (16 - 59));
            g = Math.round(130 + t * (185 - 130));
            b2 = Math.round(246 + t * (129 - 246));
          } else if (total < 0.66) {
            const t = (total - 0.33) / 0.33;
            r = Math.round(16 + t * (34 - 16));
            g = Math.round(185 + t * (197 - 185));
            b2 = Math.round(129 + t * (94 - 129));
          } else {
            const t = (total - 0.66) / 0.34;
            r = Math.round(34 + t * (220 - 34));
            g = Math.round(197 + t * (38 - 197));
            b2 = Math.round(94 + t * (38 - 94));
          }

          const alpha = Math.round(total * 180);
          const idx = (py * W + px) * 4;
          heatData.data[idx] = r;
          heatData.data[idx + 1] = g;
          heatData.data[idx + 2] = b2;
          heatData.data[idx + 3] = alpha;
        }
      }

      ctx.putImageData(heatData, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc, seed, vegetationCoverage]);

  return (
    <div className="relative rounded-xl overflow-hidden">
      <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto block" />
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          {[
            { color: 'bg-sky-400', label: 'Low' },
            { color: 'bg-emerald-400', label: 'Med' },
            { color: 'bg-red-400', label: 'High' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-white text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
