import { Leaf, Phone, Globe, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none ml-1">
                <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Data</span>
                <span className="text-xs font-bold text-sky-600 tracking-widest uppercase">Vidwan</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 mx-2" />
            <div>
              <h1 className="text-sm font-semibold text-gray-800 leading-tight">
                Image-to-Biomass Prediction
              </h1>
              <p className="text-xs text-gray-500">Computer Vision & Deep Learning</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>+91-7016910523</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>www.datavidwan.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shop-15, 3rd Floor, 4D Square Mall, Motera, Ahmedabad-380005</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
    </header>
  );
}
