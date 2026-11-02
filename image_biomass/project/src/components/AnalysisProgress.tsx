import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { label: 'Preprocessing image', detail: 'Normalizing RGB channels and resolution' },
  { label: 'Semantic segmentation', detail: 'Running U-Net / DeepLabV3+ model' },
  { label: 'Vegetation classification', detail: 'Identifying grass, clover, dead material' },
  { label: 'Feature extraction', detail: 'Texture, color distribution, canopy density' },
  { label: 'Depth estimation', detail: 'MiDaS monocular depth analysis' },
  { label: 'Biomass regression', detail: 'Computing kg/ha predictions' },
  { label: 'Generating heatmap', detail: 'Rendering biomass density visualization' },
];

interface Props {
  imageSrc: string;
  imageName: string;
}

export default function AnalysisProgress({ imageSrc, imageName }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) { clearInterval(interval); return s; }
        return s + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden">
          <img src={imageSrc} alt={imageName} className="w-full h-64 md:h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white text-xs font-medium opacity-80">Analyzing</p>
            <p className="text-white text-sm font-semibold truncate max-w-[200px]">{imageName}</p>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute border-2 border-emerald-400/70 rounded-sm animate-pulse"
              style={{ top: '20%', left: '15%', width: '35%', height: '30%' }}
            />
            <div
              className="absolute border-2 border-teal-400/60 rounded-sm animate-pulse"
              style={{ top: '45%', left: '40%', width: '40%', height: '35%', animationDelay: '0.4s' }}
            />
            <div
              className="absolute border-2 border-sky-400/60 rounded-sm animate-pulse"
              style={{ top: '15%', left: '55%', width: '30%', height: '25%', animationDelay: '0.8s' }}
            />
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">AI Analysis Pipeline</h3>
              <span className="text-xs font-bold text-emerald-600">{pct}%</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <div
                    key={i}
                    className={[
                      'flex items-start gap-3 transition-opacity duration-300',
                      i > step + 1 ? 'opacity-25' : 'opacity-100',
                    ].join(' ')}
                  >
                    <div className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                    <div>
                      <p className={[
                        'text-sm font-medium leading-tight',
                        done ? 'text-gray-500 line-through' : active ? 'text-gray-800' : 'text-gray-400',
                      ].join(' ')}>
                        {s.label}
                      </p>
                      {active && (
                        <p className="text-xs text-teal-600 mt-0.5">{s.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <p className="text-xs text-emerald-700 leading-relaxed">
              Using <strong>PyTorch</strong> semantic segmentation and <strong>MiDaS</strong> depth estimation to predict pasture biomass in kg/ha.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
