import { useState } from 'react';
import { X, Search, CheckCircle2, Plus } from 'lucide-react';
import type { Client } from '../App';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onConfirm: (clientId: number) => void;
  alreadyScheduledIds: number[];
}

export const NewJobModal = ({ isOpen, onClose, clients, onConfirm, alreadyScheduledIds }: NewJobModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative bg-white rounded-t-[40px] shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">
        <div className="w-16 h-2 bg-slate-200 rounded-full mx-auto my-6 shrink-0" />
        
        <div className="px-8 flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Trabajo</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <div className="px-8 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-4 border-slate-200 rounded-[24px] pl-12 pr-6 py-4 text-xl font-bold text-slate-900 focus:outline-none focus:border-green-500 focus:bg-white transition-all placeholder:text-slate-300"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="space-y-3">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => {
                const isAlreadyIn = alreadyScheduledIds.includes(client.id);
                return (
                  <button
                    key={client.id}
                    disabled={isAlreadyIn}
                    onClick={() => {
                      onConfirm(client.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-6 rounded-[28px] border-4 transition-all active:scale-[0.98] ${
                      isAlreadyIn 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : 'bg-white border-slate-100 hover:border-green-200 active:bg-green-50 shadow-sm'
                    }`}
                  >
                    <div className="text-left">
                      <h3 className="text-2xl font-black text-slate-900">{client.name}</h3>
                      <p className="text-lg font-bold text-slate-400">{client.address}</p>
                    </div>
                    {isAlreadyIn ? (
                      <CheckCircle2 size={32} className="text-green-500" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Plus size={24} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-xl font-bold text-slate-300 italic">No se encontró al cliente...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
