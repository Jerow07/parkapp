import { useState, useEffect } from 'react';
import { X, UserPlus, Save, Users as UsersIcon } from 'lucide-react';
import type { Client, Worker } from '../App';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { 
    name: string, 
    basePrice: number, 
    address: string, 
    phone: string, 
    days: string[],
    assignedWorkerIds?: number[],
    billingFrequency: 'mensual' | 'quincenal' | 'diario'
  }) => void;
  client?: Client | null;
  workers: Worker[];
}

export const AddClientModal = ({ isOpen, onClose, onConfirm, client, workers }: AddClientModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([]);
  const [billingFrequency, setBillingFrequency] = useState<'mensual' | 'quincenal' | 'diario'>('mensual');

  useEffect(() => {
    if (client && isOpen) {
      setName(client.name);
      setPrice(client.price.toString());
      setAddress(client.address);
      setPhone(client.phone);
      setSelectedDays(client.days);
      setSelectedWorkerIds(client.assignedWorkerIds || []);
      setBillingFrequency(client.billingFrequency || 'mensual');
    } else if (!client && isOpen) {
      setName('');
      setPrice('');
      setAddress('');
      setPhone('');
      setSelectedDays([]);
      setSelectedWorkerIds([]);
      setBillingFrequency('mensual');
    }
  }, [client, isOpen]);

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

  const toggleWorker = (id: number) => {
    setSelectedWorkerIds(prev => 
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
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
        days: selectedDays,
        assignedWorkerIds: selectedWorkerIds,
        billingFrequency
      });
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
      <div className="relative bg-white rounded-t-[40px] p-6 pb-safe-bottom shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        
        {/* Grabber indicator */}
        <div className="w-16 h-2 bg-slate-200 rounded-full mx-auto mb-8 shrink-0" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 shrink-0"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="mb-6 pr-12 shrink-0">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            {client ? 'Modifica los datos del cliente seleccionado.' : 'Agrega los datos básicos para empezar a cobrarle.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pb-6 pr-1">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
              Nombre o Apellido
            </label>
            <input 
              type="text" 
              placeholder="Ej: Familia Gómez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[20px] min-h-[64px] px-6 focus:outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
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
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
              Asignar Peones
            </label>
            <div className="flex flex-wrap gap-2">
              {workers.length > 0 ? workers.map((worker) => {
                const isSelected = selectedWorkerIds.includes(worker.id);
                return (
                  <button
                    key={worker.id}
                    type="button"
                    onClick={() => toggleWorker(worker.id)}
                    className={`px-4 h-12 rounded-xl font-bold text-sm transition-all border-2 flex items-center gap-2 ${
                      isSelected 
                      ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <UsersIcon size={16} />
                    {worker.name}
                  </button>
                )
              }) : (
                <p className="text-sm font-bold text-slate-400 italic pl-2">No hay peones registrados</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
              Frecuencia de Cobro
            </label>
            <div className="flex gap-2">
              {(['mensual', 'quincenal', 'diario'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setBillingFrequency(freq)}
                  className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all border-2 capitalize ${
                    billingFrequency === freq 
                    ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {freq === 'diario' ? 'Por Día' : freq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
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
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
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
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 capitalize">
              Tarifa {billingFrequency === 'diario' ? 'por día' : billingFrequency} base
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
            className={`w-full mt-2 min-h-[80px] text-white rounded-[28px] text-xl font-black uppercase tracking-widest shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-4 ${
              client 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
            } disabled:bg-slate-300`}
          >
            {client ? <Save size={32} strokeWidth={3} /> : <UserPlus size={32} strokeWidth={3} />}
            {client ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
};
