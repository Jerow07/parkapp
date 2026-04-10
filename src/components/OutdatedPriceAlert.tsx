import { AlertCircle } from 'lucide-react';

interface OutdatedPriceAlertProps {
  clientName: string;
  monthsOutdated: number;
  currentPrice: number;
  onUpdateClick: () => void;
}

export const OutdatedPriceAlert = ({ clientName, monthsOutdated, currentPrice, onUpdateClick }: OutdatedPriceAlertProps) => {
  return (
    <div className="bg-white border-4 border-red-500 rounded-3xl p-6 shadow-xl relative overflow-hidden mt-6 mb-8">
      <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-red-100 p-3 rounded-2xl flex-shrink-0">
          <AlertCircle className="text-red-600" size={40} strokeWidth={2.5} />
        </div>
        
        <div className="pt-1">
          <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight mb-2">
            ¡Atención con {clientName}!
          </h2>
          <p className="text-lg font-medium text-slate-700 leading-snug">
            Hace <strong className="font-black text-red-600">{monthsOutdated} meses</strong> que le cobras <strong className="font-black">${currentPrice.toLocaleString()}</strong>.
          </p>
        </div>
      </div>
      
      <button 
        onClick={onUpdateClick}
        className="w-full min-h-[72px] bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xl font-black uppercase tracking-widest shadow-lg shadow-red-500/30 transition-transform active:scale-95 flex items-center justify-center gap-3"
      >
        Actualizar Precio
      </button>
    </div>
  );
};
