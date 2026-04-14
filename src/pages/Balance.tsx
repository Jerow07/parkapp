import { TrendingUp, DollarSign, Users, ArrowUpRight } from 'lucide-react';
import type { Client } from '../App';

interface BalanceProps {
  clients: Client[];
}

export const Balance = ({ clients }: BalanceProps) => {
  // Función para calcular la ganancia mensual estimada por cliente
  const calculateMonthlyClientRevenue = (client: Client) => {
    const frequency = client.billingFrequency || 'mensual'; // Default a mensual si no está definido
    const price = client.price || 0;
    
    switch (frequency) {
      case 'mensual':
        return price;
      case 'quincenal':
        return price * 2;
      case 'diario':
        // Aproximación: días por semana * 4 semanas
        const daysPerWeek = client.days?.length || 0;
        return price * (daysPerWeek * 4);
      default:
        return price;
    }
  };

  // Calcular el total mensual sumando todos los clientes
  const totalMonthlyIncome = clients.reduce((sum, client) => {
    return sum + calculateMonthlyClientRevenue(client);
  }, 0);

  // Ordenar clientes por mayor aporte mensual
  const sortedClients = [...clients].sort((a, b) => 
    calculateMonthlyClientRevenue(b) - calculateMonthlyClientRevenue(a)
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-6 pt-16 pb-8 border-b border-slate-200 shadow-sm transition-all">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Mi Balance</h1>
        <p className="text-lg text-slate-500 font-medium">Ganancias mensuales automáticas.</p>
      </header>

      <main className="px-5 pt-6 pb-20">
        {/* Card Principal: Total Ganancias */}
        <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-600/30 mb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 bg-white/10 w-48 h-48 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 bg-blue-400/20 w-64 h-64 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-black text-blue-100 uppercase tracking-widest block">
                Ganancia Mensual Estimada
              </span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter leading-none mb-6">
              ${totalMonthlyIncome.toLocaleString()}
            </h2>
            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <TrendingUp size={18} className="text-green-300" />
              <span className="text-sm font-black text-white">
                {clients.length} Clientes activos
              </span>
            </div>
          </div>
        </div>

        {/* Sección de desgose por cliente */}
        <section>
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Users size={28} className="text-blue-600" />
              Aporte por Cliente
            </h2>
          </div>

          <div className="space-y-4">
            {sortedClients.length > 0 ? sortedClients.map(client => {
              const monthlyValue = calculateMonthlyClientRevenue(client);
              const frequencyLabel = client.billingFrequency || 'mensual';
              
              return (
                <div key={client.id} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md transition-all active:scale-[0.98] group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <DollarSign size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {frequencyLabel}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ${client.price.toLocaleString()} /{frequencyLabel === 'mensual' ? 'mes' : frequencyLabel === 'quincenal' ? 'quinc.' : 'día'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-green-600 mb-0.5">
                         <ArrowUpRight size={14} strokeWidth={3} />
                         <span className="text-lg font-black tracking-tight">
                           ${monthlyValue.toLocaleString()}
                         </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Mes</span>
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="bg-slate-100 rounded-[28px] p-10 text-center border-2 border-dashed border-slate-300">
                <p className="text-xl font-bold text-slate-400 italic">
                  Agrega clientes para ver<br/>tu balance mensual.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
