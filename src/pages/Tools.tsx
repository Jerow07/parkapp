import { useState } from 'react';
import { Wrench, Plus, Trash2, Hammer, Droplets, Scissors, AlertCircle } from 'lucide-react';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { ToolModal } from '../components/ToolModal';
import type { Tool } from '../App';

interface ToolsProps {
  tools: Tool[];
  onAddTool: (tool: Omit<Tool, 'id'>) => void;
  onUpdateTool: (id: number, tool: Omit<Tool, 'id'>) => void;
  onDeleteTool: (id: number) => void;
}

export const Tools = ({ tools, onAddTool, onUpdateTool, onDeleteTool }: ToolsProps) => {
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const handleAddTool = () => {
    setEditingTool(null);
    setIsModalOpen(true);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleConfirm = (data: Omit<Tool, 'id'>) => {
    if (editingTool) {
      onUpdateTool(editingTool.id, data);
    } else {
      onAddTool(data);
    }
    setIsSuccessAnimating(true);
    setTimeout(() => setIsSuccessAnimating(false), 2000);
  };

  const handleDeleteTool = (id: number, name: string) => {
    if (confirm(`¿Eliminar la herramienta "${name}" del inventario?`)) {
      onDeleteTool(id);
    }
  };

  const getStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-use': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'unavailable': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusLabel = (status: Tool['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'in-use': return 'En uso';
      case 'maintenance': return 'Reparación / Mantenimiento';
      case 'unavailable': return 'No disponible';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Maquinaria': return <Hammer size={24} />;
      case 'Riego': return <Droplets size={24} />;
      case 'Herramientas': return <Scissors size={24} />;
      default: return <Wrench size={24} />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 pt-16 pb-8 border-b border-slate-200 shadow-sm transition-all">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Herramientas</h1>
        <p className="text-lg text-slate-500 font-medium">Controla tu equipo y maquinaria.</p>
      </header>

      <main className="px-5 pt-6 pb-20 overflow-y-auto">
        <button 
          onClick={handleAddTool}
          className="w-full min-h-[88px] bg-blue-600 hover:bg-blue-700 text-white rounded-[32px] text-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-transform active:scale-95 flex items-center justify-center gap-3 border-4 border-blue-500/30 mb-8"
        >
          <Plus size={36} strokeWidth={3} />
          Nueva Herramienta
        </button>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Wrench size={28} className="text-blue-600" />
              Inventario ({tools.length})
            </h2>
          </div>

          <div className="space-y-4">
            {tools.length > 0 ? tools.map(tool => (
              <div key={tool.id} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                {tool.status === 'maintenance' && (
                  <div className="absolute top-0 right-0 p-4 animate-pulse">
                    <AlertCircle size={24} className="text-amber-500" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      {getCategoryIcon(tool.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                      <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mt-0.5">{tool.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteTool(tool.id, tool.name)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                    <Trash2 size={24} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusColor(tool.status)}`}>
                    {getStatusLabel(tool.status)}
                  </span>
                  
                  <button 
                    onClick={() => handleEditTool(tool)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-slate-100 rounded-[28px] p-10 text-center border-2 border-dashed border-slate-300">
                <p className="text-xl font-bold text-slate-400 italic">No tienes herramientas<br/>registradas todavía.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <ToolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirm}
        editingTool={editingTool}
      />

      <SuccessOverlay show={isSuccessAnimating} />
    </>
  );
};
