import { useState } from 'react';
import { UserPlus, HardHat, Trash2, Briefcase } from 'lucide-react';
import { AddWorkerModal } from '../components/AddWorkerModal';
import { SuccessOverlay } from '../components/SuccessOverlay';
import type { Worker } from '../App';

interface CuadrillaProps {
  workers: Worker[];
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onDeleteWorker: (id: number) => void;
}

export const Cuadrilla = ({ workers, onAddWorker, onDeleteWorker }: CuadrillaProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);

  const handleAddWorker = (data: Omit<Worker, 'id'>) => {
    onAddWorker(data);
    setIsAddModalOpen(false);
    setIsSuccessAnimating(true);
    setTimeout(() => setIsSuccessAnimating(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 pt-16 pb-8 border-b border-slate-200 shadow-sm transition-all">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Mi Cuadrilla</h1>
        <p className="text-lg text-slate-500 font-medium">Gestiona a tus peones y sus tareas.</p>
      </header>

      <main className="px-5 pt-6 pb-20">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full min-h-[88px] bg-blue-600 hover:bg-blue-700 text-white rounded-[32px] text-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-transform active:scale-95 flex items-center justify-center gap-3 border-4 border-blue-500/30 mb-8"
        >
          <UserPlus size={36} strokeWidth={3} />
          Agregar Peón
        </button>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <HardHat size={28} className="text-blue-600" />
            Peones Activos ({workers.length})
          </h2>

          <div className="space-y-4">
            {workers.length > 0 ? workers.map(worker => (
              <div key={worker.id} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{worker.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(dayCode => {
                        const isWorking = worker.days.includes(dayCode);
                        return (
                          <span 
                            key={dayCode}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black ${
                              isWorking 
                              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                              : 'bg-slate-50 text-slate-300 border border-slate-100'
                            }`}
                          >
                            {dayCode}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${worker.name} de la cuadrilla?`)) {
                        onDeleteWorker(worker.id);
                      }
                    }}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <Trash2 size={24} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Briefcase size={20} className="text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Tareas Asignadas</span>
                      <p className="text-slate-700 font-bold leading-tight">{worker.assignedJobs}</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-slate-100 rounded-[28px] p-10 text-center border-2 border-dashed border-slate-300">
                <p className="text-xl font-bold text-slate-400 italic">No tienes peones<br/>agregados todavía.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <AddWorkerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onConfirm={handleAddWorker} 
      />
      
      <SuccessOverlay show={isSuccessAnimating} />
    </>
  );
};
