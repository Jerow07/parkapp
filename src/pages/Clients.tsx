import { useState } from 'react';
import { Users, Search, UserPlus, Trash2, AlertTriangle, Phone, Pencil } from 'lucide-react';
import { AddClientModal } from '../components/AddClientModal';
import { SuccessOverlay } from '../components/SuccessOverlay';
import type { Client, Worker } from '../App';

interface ClientsProps {
  clients: Client[];
  workers: Worker[];
  onAddClient: (data: Omit<Client, 'id' | 'lastPriceUpdate'>) => void;
  onDeleteClient: (id: number) => void;
  onUpdateClient: (id: number, data: Omit<Client, 'id' | 'lastPriceUpdate'>) => void;
}

export const Clients = ({ clients, workers, onAddClient, onDeleteClient, onUpdateClient }: ClientsProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para edición y borrado
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalConfirm = (data: { 
    name: string, 
    basePrice: number, 
    address: string, 
    phone: string, 
    days: string[],
    assignedWorkerIds?: number[],
    billingFrequency: 'mensual' | 'quincenal' | 'diario'
  }) => {
    const isEditing = !!clientToEdit;
    
    setIsAddModalOpen(false);
    setClientToEdit(null);
    setIsSuccessAnimating(true);
    
    setTimeout(() => {
      const clientData = { 
        name: data.name, 
        address: data.address, 
        phone: data.phone,
        price: data.basePrice,
        days: data.days,
        assignedWorkerIds: data.assignedWorkerIds,
        billingFrequency: data.billingFrequency
      };

      if (isEditing && clientToEdit) {
        onUpdateClient(clientToEdit.id, clientData);
      } else {
        onAddClient(clientData);
      }
      setIsSuccessAnimating(false);
    }, 2000);
  };

  const confirmDelete = (id: number) => {
    onDeleteClient(id);
    setClientToDelete(null);
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
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 border-2 border-slate-200 rounded-[24px] pl-12 pr-6 py-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-400 transition-all"
          />
        </div>
      </header>

      <main className="px-5 pt-6 pb-32">
        <div className="mb-8">
           <button 
             onClick={() => {
               setClientToEdit(null);
               setIsAddModalOpen(true);
             }}
             className="w-full min-h-[80px] bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] text-xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center gap-3"
           >
             <UserPlus size={32} strokeWidth={3} />
             Agregar Cliente
           </button>
        </div>

        <div className="space-y-4">
          {filteredClients.length > 0 ? filteredClients.map(client => (
            <div key={client.id} className="bg-white border-2 border-slate-200 rounded-[24px] p-5 shadow-sm active:bg-slate-50 transition-colors relative group">
              <div className="flex justify-between items-start mb-1">
                <h1 className="text-2xl font-black text-slate-900 pr-24">{client.name}</h1>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setClientToEdit(client);
                      setIsAddModalOpen(true);
                    }}
                    className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100 active:scale-90 transition-all"
                    title="Editar cliente"
                  >
                    <Pencil size={24} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => setClientToDelete(client.id)}
                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl shadow-sm border border-red-100 active:scale-90 transition-all"
                    title="Borrar cliente"
                  >
                    <Trash2 size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <p className="text-lg font-medium text-slate-600 mb-1">{client.address}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {client.assignedWorkerIds && client.assignedWorkerIds.length > 0 ? (
                  client.assignedWorkerIds.map(wid => {
                    const worker = workers.find(w => w.id === wid);
                    if (!worker) return null;
                    return (
                      <span key={wid} className="bg-amber-50 text-amber-700 text-xs font-black px-2 py-1 rounded-lg border border-amber-100 flex items-center gap-1">
                         <Users size={12} />
                         {worker.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs font-bold text-slate-400 italic">Sin peones asignados</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <a 
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl active:bg-slate-200 transition-colors"
                >
                  <Phone size={18} className="text-blue-600" />
                  {client.phone}
                </a>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  {client.days.length > 0 ? client.days.map(d => (
                    <span key={d} className="bg-blue-100 text-blue-700 font-black w-8 h-8 flex items-center justify-center rounded-lg border border-blue-200 text-sm">
                      {d}
                    </span>
                  )) : (
                    <span className="text-sm font-bold text-slate-400 italic">Sin días</span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {client.billingFrequency === 'quincenal' ? 'Quincenal' : 
                     client.billingFrequency === 'diario' ? 'Por día' : 'Mensual'}
                  </span>
                  <span className="bg-green-100 text-green-700 font-black px-3 py-1 rounded-xl text-lg">
                    ${client.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-10 text-center">
              <p className="text-lg font-bold text-slate-400">No se encontraron clientes</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Confirmación de Borrado */}
      {clientToDelete && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setClientToDelete(null)} />
          <div className="relative bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-16 h-2 bg-slate-200 rounded-full mx-auto mb-8" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={48} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">¿Borrar cliente?</h3>
              <p className="text-xl font-medium text-slate-500 mb-10">
                Esta acción no se puede deshacer. Se perderán todos sus datos.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setClientToDelete(null)}
                  className="min-h-[72px] bg-slate-100 text-slate-600 rounded-2xl text-xl font-black uppercase tracking-widest"
                >
                  No, volver
                </button>
                <button 
                  onClick={() => confirmDelete(clientToDelete)}
                  className="min-h-[72px] bg-red-600 text-white rounded-2xl text-xl font-black uppercase tracking-widest shadow-lg shadow-red-600/30"
                >
                  Sí, borrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddClientModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setClientToEdit(null);
        }}
        onConfirm={handleModalConfirm}
        client={clientToEdit}
        workers={workers}
      />

      <SuccessOverlay show={isSuccessAnimating} />
    </>
  );
};
