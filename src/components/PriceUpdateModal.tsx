import { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';

interface PriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPrice: number) => void;
  currentPrice: number;
}

export const PriceUpdateModal = ({ isOpen, onClose, onConfirm, currentPrice }: PriceUpdateModalProps) => {
  const [newPrice, setNewPrice] = useState(currentPrice + 2000); // Sugerencia de aumento

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewPrice(currentPrice + 2000);
    }
  }, [isOpen, currentPrice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="relative bg-white rounded-t-[40px] p-6 pb-safe-bottom shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Grabber indicator */}
        <div className="w-16 h-2 bg-slate-200 rounded-full mx-auto mb-8" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="mb-8 pr-12">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
            Subir Precio
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            Ingresa el nuevo monto a cobrar por mes.
          </p>
        </div>

        <div className="mb-10 text-center relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-400">$</span>
          <input 
            type="number" 
            autoFocus
            value={newPrice || ''}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            className="w-full text-center text-5xl font-black text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[32px] min-h-[100px] focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
        
        <div className="flex gap-4 mb-8">
           <button 
             onClick={() => setNewPrice(currentPrice + 1000)}
             className="flex-1 min-h-[64px] bg-slate-100 rounded-2xl text-lg font-black text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-200"
           >
             +$1,000
           </button>
           <button 
             onClick={() => setNewPrice(currentPrice + 2000)}
             className="flex-1 min-h-[64px] bg-slate-100 rounded-2xl text-lg font-black text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-200"
           >
             +$2,000
           </button>
        </div>

        <button 
          onClick={() => onConfirm(newPrice)}
          className="w-full min-h-[80px] bg-green-600 hover:bg-green-700 text-white rounded-[28px] text-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/30 transition-transform active:scale-95 flex items-center justify-center gap-4"
        >
          <TrendingUp size={32} strokeWidth={3} />
          Confirmar Precio
        </button>
      </div>
    </div>
  );
};
