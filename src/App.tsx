import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BottomNavBar } from './components/BottomNavBar';
import { Home } from './pages/Home';
import { Clients } from './pages/Clients';

export interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  price: number;
  days: string[];
  lastPriceUpdate: string; // ISO Date YYYY-MM-DD
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [extraJobIds, setExtraJobIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // 1. Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Clientes
        const clientsRes = await fetch('/api/clients');
        const clientsData = await clientsRes.json();
        
        let currentClients = clientsData;
        if (!Array.isArray(clientsData) || clientsData.length === 0) {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
          const todayStrOnly = new Date().toISOString().split('T')[0];

          currentClients = [
            { id: 1, name: 'Doña Rosa', address: 'Las Magnolias 123', phone: '11 2233 4455', price: 5000, days: ['L', 'M', 'V'], lastPriceUpdate: threeMonthsAgoStr },
            { id: 2, name: 'Familia Gómez', address: 'Av. Siempreviva 742', phone: '11 3344 5566', price: 8000, days: ['X', 'S'], lastPriceUpdate: todayStrOnly },
            { id: 3, name: 'Oficinas Centro', address: 'San Martín 1234', phone: '11 4455 6677', price: 45000, days: ['L', 'M', 'X', 'J', 'V'], lastPriceUpdate: todayStrOnly },
          ];
          setClients(currentClients);
          persistClients(currentClients);
        } else {
          setClients(currentClients);
        }

        // Cargar Trabajos Extra de Hoy
        const jobsRes = await fetch('/api/jobs');
        const jobsData = await jobsRes.json();
        if (jobsData.date === getTodayKey()) {
          setExtraJobIds(jobsData.ids || []);
        } else {
          // Si es un día nuevo, empezamos de cero para esa fecha
          setExtraJobIds([]);
        }
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Función para persistir en Redis
  const persistClients = async (newList: Client[]) => {
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (error) {
      console.error("Error persistiendo en Redis:", error);
    }
  };

  const persistExtraJobs = async (ids: number[]) => {
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: getTodayKey(), ids })
      });
    } catch (error) {
      console.error("Error persistiendo labores extra:", error);
    }
  };

  const addClient = (newClient: Omit<Client, 'id' | 'lastPriceUpdate'>) => {
    const updated = [...clients, { 
      ...newClient, 
      id: Date.now(),
      lastPriceUpdate: new Date().toISOString().split('T')[0]
    }];
    setClients(updated);
    persistClients(updated);
  };

  const deleteClient = (id: number) => {
    const updated = clients.filter(c => c.id !== id);
    const updatedExtras = extraJobIds.filter(eid => eid !== id);
    setClients(updated);
    setExtraJobIds(updatedExtras);
    persistClients(updated);
    persistExtraJobs(updatedExtras);
  };

  const updateClientPrice = (id: number, newPrice: number) => {
    const updated = clients.map(c => c.id === id ? { 
      ...c, 
      price: newPrice,
      lastPriceUpdate: new Date().toISOString().split('T')[0]
    } : c);
    setClients(updated);
    persistClients(updated);
  };

  const addExtraJobForToday = (clientId: number) => {
    if (!extraJobIds.includes(clientId)) {
      const updated = [...extraJobIds, clientId];
      setExtraJobIds(updated);
      persistExtraJobs(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-sm">Cargando ParkApp...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-200 flex justify-center pb-0 md:py-8">
        <div className="w-full max-w-md min-h-screen md:min-h-[850px] bg-slate-50 font-sans pb-24 relative md:rounded-[40px] md:shadow-2xl overflow-hidden md:border-[8px] md:border-slate-800 flex flex-col">
          
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={
                <Home 
                  clients={clients} 
                  extraJobIds={extraJobIds} 
                  onUpdatePrice={updateClientPrice} 
                  onAddExtraJob={addExtraJobForToday}
                />
              } />
              <Route path="/clientes" element={<Clients clients={clients} onAddClient={addClient} onDeleteClient={deleteClient} />} />
            </Routes>
          </div>

          <BottomNavBar />

        </div>
      </div>
    </Router>
  );
}

export default App;
