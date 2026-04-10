import { Home, Users, HardHat } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNavBar = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      <div className="flex justify-around items-center w-full h-[88px] pb-safe-bottom">
        <NavLink 
          to="/"
          end
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-1 h-full gap-1.5 min-h-[64px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Home size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Inicio</span>
        </NavLink>
        
        <NavLink 
          to="/clientes"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-1 h-full gap-1.5 min-h-[64px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Users size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Clientes</span>
        </NavLink>
        
        <NavLink 
          to="/cuadrilla"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-1 h-full gap-1.5 min-h-[64px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <HardHat size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Cuadrilla</span>
        </NavLink>
      </div>
    </nav>
  );
};
