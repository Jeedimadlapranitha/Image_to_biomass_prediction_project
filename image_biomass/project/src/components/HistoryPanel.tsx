import { Clock, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { BiomassAnalysis, supabase } from '../lib/supabase';

interface Props {
  history: BiomassAnalysis[];
  currentId: string | null;
  onSelect: (analysis: BiomassAnalysis) => void;
  onRefresh: () => void;
}

export default function HistoryPanel({ history, currentId, onSelect, onRefresh }: Props) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase.from('biomass_analyses').delete().eq('id', id);
    onRefresh();
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">Recent Analyses</h3>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {history.length}
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => item.status === 'complete' && onSelect(item)}
            disabled={item.status !== 'complete'}
            className={[
              'w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors group',
              currentId === item.id
                ? 'bg-emerald-50 border-l-2 border-emerald-500'
                : 'hover:bg-gray-50 border-l-2 border-transparent',
              item.status !== 'complete' ? 'opacity-60 cursor-default' : 'cursor-pointer',
            ].join(' ')}
          >
            {item.image_data_url ? (
              <img
                src={item.image_data_url}
                alt={item.image_name}
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.image_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.status === 'processing' ? (
                  <span className="flex items-center gap-1 text-xs text-teal-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                  </span>
                ) : item.status === 'complete' ? (
                  <span className="text-xs text-gray-500">
                    {item.total_dry_biomass.toFixed(0)} kg/ha &middot; {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-xs text-red-500">Error</span>
                )}
              </div>
            </div>

            {item.status === 'complete' && (
              <>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
