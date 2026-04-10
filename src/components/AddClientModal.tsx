import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string, basePrice: number, address: string, phone: string, days: string[] }) => void;
}

export const AddClientModal = ({ isOpen, onClose, onConfirm }: AddClientModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const WEEKDAYS = [
    { id: 'L', label: 'Lu' },
    { id: 'M', label: 'Ma' },
    { id: 'X', label: 'Mi' },
    { id: 'J', label: 'Ju' },
    { id: 'V', label: 'Vi' },
    { id: 'S', label: 'Sá' }
  ];

  if (!isOpen) return null;

  const toggleDay = (id: string) => {
    setSelectedDays(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && price) {
      onConfirm({ 
        name, 
        basePrice: Number(price), 
        address: address.trim() || 'Sin dirección', 
        phone: phone.trim() || 'Sin teléfono',
        days: selectedDays 
      });
      setName('');
      setPrice('');
      setAddress('');
      setPhone('');
      setSelectedDays([]);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden">
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

        <div className="mb-6 pr-12">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Nuevo Cliente
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            Agrega los datos básicos para empezar a cobrarle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
              Nombre o Apellido
            </label>
            <input 
              type="text" 
              autoFocus
              placeholder="Ej: Familia Gómez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[20px] min-h-[64px] px-6 focus:outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 mt-4">
              Dirección
            </label>
            <input 
              type="text" 
              placeholder="Ej: Las Magnolias 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xl font-bold text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[20px] min-h-[64px] px-6 focus:outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 mt-4">
              ¿Qué días vas?
            </label>
            <div className="flex gap-2 justify-between">
              {WEEKDAYS.map((day) => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`flex-1 min-h-[56px] rounded-2xl font-black text-lg transition-colors border-2 ${
                      isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 mt-4">
              Teléfono
            </label>
            <input 
              type="tel" 
              placeholder="Ej: 11 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xl font-bold text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[20px] min-h-[64px] px-6 focus:outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 mt-4">
              Tarifa Mensual Base
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">$</span>
              <input 
                type="number" 
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-3xl font-black text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[20px] min-h-[64px] pl-14 pr-6 focus:outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-slate-300"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim() || !price}
            className="w-full mt-6 min-h-[80px] bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white rounded-[28px] text-xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center gap-4"
          >
            <UserPlus size={32} strokeWidth={3} />
            Crear Cliente
          </button>
        </form>
      </div>
    </div>
  );
};
