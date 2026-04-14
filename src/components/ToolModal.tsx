import { useState, useEffect } from 'react';
import { X, Wrench, Hammer, Droplets, Scissors, PlusCircle, Check } from 'lucide-react';
import type { Tool } from '../App';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Omit<Tool, 'id'>) => void;
  editingTool?: Tool | null;
}

export const ToolModal = ({ isOpen, onClose, onConfirm, editingTool }: ToolModalProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Maquinaria');
  const [status, setStatus] = useState<'available' | 'in-use' | 'maintenance' | 'unavailable'>('available');

  const CATEGORIES = [
    { id: 'Maquinaria', icon: <Hammer size={18} />, label: 'Maquinaria' },
    { id: 'Riego', icon: <Droplets size={18} />, label: 'Riego' },
    { id: 'Herramientas', icon: <Scissors size={18} />, label: 'Herramientas' },
    { id: 'Otro', icon: <Wrench size={18} />, label: 'Otro' }
  ];

  const STATUSES = [
    { id: 'available', label: 'Disponible', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'in-use', label: 'En uso', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'maintenance', label: 'Mantenimiento / Reparación', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'unavailable', label: 'No disponible', color: 'bg-red-100 text-red-700 border-red-200' }
  ];

  useEffect(() => {
    if (editingTool) {
      setName(editingTool.name);
      setCategory(editingTool.category);
      setStatus(editingTool.status);
    } else {
      setName('');
      setCategory('Maquinaria');
      setStatus('available');
    }
  }, [editingTool, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm({ 
        name: name.trim(), 
        category,
        status
      });
      onClose();
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
            {editingTool ? 'Editar Herramienta' : 'Nueva Herramienta'}
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            {editingTool ? 'Modifica los detalles de tu equipo.' : 'Agrega equipo a tu inventario.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">
              Nombre del Equipo
            </label>
            <input 
              type="text" 
              autoFocus
              placeholder="Ej: Bordeadora de Explosión"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-2xl font-bold text-slate-900 bg-slate-50 border-4 border-slate-200 rounded-[24px] min-h-[64px] px-6 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2 mt-4">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-3 px-4 min-h-[56px] rounded-2xl font-black text-sm transition-colors border-2 ${
                      isSelected 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 pl-2 mt-4">
              Estado Actual
            </label>
            <div className="space-y-2">
              {STATUSES.map((stat) => {
                const isSelected = status === stat.id;
                return (
                  <button
                    key={stat.id}
                    type="button"
                    onClick={() => setStatus(stat.id as any)}
                    className={`w-full flex items-center justify-between px-6 min-h-[56px] rounded-2xl font-black text-sm transition-all border-2 ${
                      isSelected 
                      ? `${stat.color} shadow-sm scale-[1.02]` 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {stat.label}
                    {isSelected && <Check size={20} strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 min-h-[80px] bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white rounded-[28px] text-xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-transform active:scale-95 flex items-center justify-center gap-4"
          >
            {editingTool ? <Check size={32} strokeWidth={3} /> : <PlusCircle size={32} strokeWidth={3} />}
            {editingTool ? 'Guardar Cambios' : 'Registrar Equipo'}
          </button>
        </form>
      </div>
    </div>
  );
};
