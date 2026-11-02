import { Download, RotateCcw, TrendingUp, Leaf, Layers, Wheat, BarChart3 } from 'lucide-react';
import { BiomassAnalysis } from '../lib/supabase';
import HeatmapCanvas from './HeatmapCanvas';

interface Props {
  analysis: BiomassAnalysis;
  onReset: () => void;
}

const PARAMS = [
  {
    key: 'dry_green_vegetation',
    label: 'Dry Green Vegetation',
    sublabel: 'Excluding clover',
    icon: Leaf,
    color: 'emerald',
    max: 3000,
  },
  {
    key: 'dry_dead_material',
    label: 'Dry Dead Material',
    sublabel: 'Senescent biomass',
    icon: Layers,
    color: 'amber',
    max: 1000,
  },
  {
    key: 'dry_clover',
    label: 'Dry Clover Biomass',
    sublabel: 'Legume fraction',
    icon: Wheat,
    color: 'teal',
    max: 600,
  },
  {
    key: 'green_dry_matter',
    label: 'Green Dry Matter (GDM)',
    sublabel: 'Total green fraction',
    icon: TrendingUp,
    color: 'sky',
    max: 3500,
  },
  {
    key: 'total_dry_biomass',
    label: 'Total Dry Biomass',
    sublabel: 'All fractions combined',
    icon: BarChart3,
    color: 'rose',
    max: 5000,
  },
] as const;

const COLOR_MAP: Record<string, { bar: string; bg: string; text: string; border: string }> = {
  emerald: { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  amber:   { bar: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-100' },
  teal:    { bar: 'bg-teal-500',    bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-100' },
  sky:     { bar: 'bg-sky-500',     bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-100' },
  rose:    { bar: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-100' },
};

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm text-center">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value.toFixed(1)}<span className="text-xs font-normal text-gray-500 ml-1">{unit}</span></p>
    </div>
  );
}

export default function BiomassResults({ analysis, onReset }: Props) {
  const seed = analysis.id.charCodeAt(0) * 31 + analysis.id.charCodeAt(1);

  const handleExport = () => {
    const rows = [
      ['Parameter', 'Value (kg/ha)'],
      ['Dry Green Vegetation (excl. clover)', analysis.dry_green_vegetation],
      ['Dry Dead Material', analysis.dry_dead_material],
      ['Dry Clover Biomass', analysis.dry_clover],
      ['Green Dry Matter (GDM)', analysis.green_dry_matter],
      ['Total Dry Biomass', analysis.total_dry_biomass],
      ['Vegetation Coverage (%)', analysis.vegetation_coverage],
      ['Texture Score', analysis.texture_score],
      ['Canopy Density Score', analysis.canopy_density],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `biomass_${analysis.id.slice(0, 8)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Biomass Analysis Results</h2>
          <p className="text-xs text-gray-500 mt-0.5">{analysis.image_name} &middot; {new Date(analysis.created_at).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Vegetation Coverage" value={analysis.vegetation_coverage} unit="%" />
        <StatCard label="Texture Score" value={analysis.texture_score} unit="/100" />
        <StatCard label="Canopy Density" value={analysis.canopy_density} unit="/100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Biomass Parameters</h3>
          {PARAMS.map(({ key, label, sublabel, icon: Icon, color, max }) => {
            const val = analysis[key] as number;
            const pct = Math.min(100, (val / max) * 100);
            const c = COLOR_MAP[color];
            return (
              <div key={key} className={`${c.bg} ${c.border} border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${c.text}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
                      <p className="text-xs text-gray-500">{sublabel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${c.text}`}>{val.toFixed(0)}</span>
                    <span className="text-xs text-gray-500 ml-1">kg/ha</span>
                  </div>
                </div>
                <div className="w-full bg-white/70 rounded-full h-1.5">
                  <div
                    className={`${c.bar} h-1.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">0</span>
                  <span className="text-xs text-gray-400">{max} kg/ha</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Biomass Density Heatmap</h3>
          {analysis.image_data_url && (
            <HeatmapCanvas
              imageSrc={analysis.image_data_url}
              seed={seed}
              vegetationCoverage={analysis.vegetation_coverage}
            />
          )}

          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Composition Breakdown</h4>
            <div className="space-y-2">
              {[
                { label: 'Green Vegetation', value: analysis.dry_green_vegetation, color: 'bg-emerald-500' },
                { label: 'Dead Material', value: analysis.dry_dead_material, color: 'bg-amber-500' },
                { label: 'Clover', value: analysis.dry_clover, color: 'bg-teal-500' },
              ].map(({ label, value, color }) => {
                const pct = (value / analysis.total_dry_biomass) * 100;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                    <span className="text-xs text-gray-600 w-32 shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct.toFixed(1)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Total Dry Biomass</p>
            <p className="text-4xl font-black">{analysis.total_dry_biomass.toFixed(0)}</p>
            <p className="text-sm opacity-70">kg / hectare</p>
            <div className="mt-3 pt-3 border-t border-white/20 text-xs opacity-70">
              Estimated using semantic segmentation + regression model
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
