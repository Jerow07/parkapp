import { useState } from 'react';
import { Users, Search, UserPlus } from 'lucide-react';
import { AddClientModal } from '../components/AddClientModal';
import { SuccessOverlay } from '../components/SuccessOverlay';

export const Clients = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);

  // Mock data for clients
  const [clients, setClients] = useState([
    { id: 1, name: 'Doña Rosa', address: 'Las Magnolias 123', price: 5000 },
    { id: 2, name: 'Familia Gómez', address: 'Av. Siempreviva 742', price: 8000 },
    { id: 3, name: 'Oficinas Centro', address: 'San Martín 1234', price: 45000 },
  ]);

  const handleAddClient = (data: { name: string, basePrice: number }) => {
    setIsAddModalOpen(false);
    setIsSuccessAnimating(true);
    
    setTimeout(() => {
      setClients(prev => [...prev, { id: Date.now(), name: data.name, address: 'Sin dirección', price: data.basePrice }]);
      setIsSuccessAnimating(false);
    }, 2000);
  };

  return (
    <>
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users size={36} className="text-blue-600" />
            Clientes
          </h1>
          <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-lg text-lg">
            {clients.length}
          </span>
        </div>
        
        {/* Barra de búsqueda mock */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            className="w-full bg-slate-100 border-2 border-slate-200 rounded-[24px] pl-12 pr-6 py-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
          />
        </div>
      </header>

      <main className="px-5 pt-6 pb-32">
        
        {/* Botón Flotante/Fijo en la página de Clientes */}
        <div className="mb-8">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="w-full min-h-[80px] bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] text-xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center gap-3"
           >
             <UserPlus size={32} strokeWidth={3} />
             Agregar Cliente
           </button>
        </div>

        <div className="space-y-4">
          {clients.map(client => (
            <div key={client.id} className="bg-white border-2 border-slate-200 rounded-[24px] p-5 shadow-sm active:bg-slate-50 transition-colors">
              <h3 className="text-2xl font-black text-slate-900 mb-1">{client.name}</h3>
              <p className="text-lg font-medium text-slate-600 mb-3">{client.address}</p>
              
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg">
                  ${client.price.toLocaleString()} / mes
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddClient}
      />

      <SuccessOverlay show={isSuccessAnimating} />
    </>
  );
};
