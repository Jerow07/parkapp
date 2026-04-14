import { Home, Users, HardHat, Wrench, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNavBar = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      <div className="flex overflow-x-auto items-center w-full h-[88px] pb-safe-bottom px-4 gap-6 no-scrollbar">
        <NavLink 
          to="/"
          end
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-shrink-0 h-full gap-1.5 min-w-[72px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Home size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Inicio</span>
        </NavLink>
        
        <NavLink 
          to="/clientes"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-shrink-0 h-full gap-1.5 min-w-[72px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Users size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Clientes</span>
        </NavLink>
        
        <NavLink 
          to="/cuadrilla"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-shrink-0 h-full gap-1.5 min-w-[72px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <HardHat size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Cuadrilla</span>
        </NavLink>

        <NavLink 
          to="/herramientas"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-shrink-0 h-full gap-1.5 min-w-[72px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Wrench size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Herram.</span>
        </NavLink>

        <NavLink 
          to="/balance"
          className={({ isActive }) => 
            `flex flex-col items-center justify-center flex-shrink-0 h-full gap-1.5 min-w-[72px] transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`
          }
        >
          <Wallet size={32} strokeWidth={2.5} />
          <span className="text-[11px] font-black uppercase tracking-widest leading-none">Balance</span>
        </NavLink>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};
