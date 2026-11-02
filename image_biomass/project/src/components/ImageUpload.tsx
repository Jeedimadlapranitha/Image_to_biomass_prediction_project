import { useRef, useState, useCallback } from 'react';
import { Upload, ImagePlus, AlertCircle } from 'lucide-react';

interface Props {
  onUpload: (file: File, dataUrl: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onUpload, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return 'Please upload an image file (JPG, PNG, WEBP).';
    if (file.size > 20 * 1024 * 1024) return 'Image must be smaller than 20 MB.';
    return null;
  };

  const process = useCallback((file: File) => {
    const msg = validate(file);
    if (msg) { setError(msg); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => onUpload(file, e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onUpload]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) process(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) process(file);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={[
          'relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer select-none',
          'flex flex-col items-center justify-center gap-4 py-16 px-8 text-center',
          dragging
            ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
            : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/40',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        ].join(' ')}
      >
        <div className={[
          'w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-200',
          dragging ? 'bg-emerald-100' : 'bg-white shadow-sm',
        ].join(' ')}>
          {dragging
            ? <Upload className="w-9 h-9 text-emerald-500" />
            : <ImagePlus className="w-9 h-9 text-emerald-600" />
          }
        </div>

        <div>
          <p className="text-base font-semibold text-gray-700">
            {dragging ? 'Drop your pasture image here' : 'Upload a Pasture Image'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop or <span className="text-emerald-600 font-medium">browse files</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WEBP up to 20 MB</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {['Smartphone', 'Drone', 'Field Camera'].map((src) => (
            <span key={src} className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full shadow-sm">
              {src}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
    </div>
  );
}
