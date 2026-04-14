import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BottomNavBar } from './components/BottomNavBar';
import { Home } from './pages/Home';
import { Clients } from './pages/Clients';
import { Cuadrilla } from './pages/Cuadrilla';
import { Tools } from './pages/Tools';
import { Balance } from './pages/Balance';

export interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  price: number;
  days: string[];
  lastPriceUpdate: string; // ISO Date YYYY-MM-DD
  assignedWorkerIds?: number[];
  billingFrequency?: 'mensual' | 'quincenal' | 'diario';
}

export interface Worker {
  id: number;
  name: string;
  days: string[];
  assignedJobs: string;
}

export interface Tool {
  id: number;
  name: string;
  category: string;
  status: 'available' | 'in-use' | 'maintenance' | 'unavailable';
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [extraJobIds, setExtraJobIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // Helper para parsear JSON de forma segura y evitar que el código fuente de la API rompa la app en local
  const safeParseJSON = async (res: Response) => {
    try {
      const text = await res.text();
      // Si el texto empieza con "import" o "export", es código fuente, no JSON
      if (text.trim().startsWith('import') || text.trim().startsWith('export') || text.trim().startsWith('<')) {
        return null;
      }
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  };

  // 1. Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, jobsRes, workersRes, toolsRes] = await Promise.allSettled([
          fetch('/api/clients'),
          fetch('/api/jobs'),
          fetch('/api/workers'),
          fetch('/api/tools')
        ]);

        // --- PROCESAR CLIENTES ---
        let loadedClients = null;
        if (clientsRes.status === 'fulfilled' && clientsRes.value.ok) {
          loadedClients = await safeParseJSON(clientsRes.value);
        }
        
        if (Array.isArray(loadedClients) && loadedClients.length > 0) {
          setClients(loadedClients);
        } else {
          const local = localStorage.getItem('parkapp:clients');
          if (local) {
            setClients(JSON.parse(local));
          } else if (!loadedClients) { // Solo si la API falló y no hay local
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
            const todayStrOnly = new Date().toISOString().split('T')[0];
            setClients([
              { id: 1, name: 'Doña Rosa', address: 'Las Magnolias 123', phone: '11 2233 4455', price: 5000, days: ['L', 'M', 'V'], lastPriceUpdate: threeMonthsAgoStr },
              { id: 2, name: 'Familia Gómez', address: 'Av. Siempreviva 742', phone: '11 3344 5566', price: 8000, days: ['X', 'S'], lastPriceUpdate: todayStrOnly },
              { id: 3, name: 'Oficinas Centro', address: 'San Martín 1234', phone: '11 4455 6677', price: 45000, days: ['L', 'M', 'X', 'J', 'V'], lastPriceUpdate: todayStrOnly },
            ]);
          }
        }

        // --- PROCESAR TRABAJOS EXTRA ---
        if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
          const jobsData = await safeParseJSON(jobsRes.value);
          if (jobsData && jobsData.date === getTodayKey()) {
            setExtraJobIds(jobsData.ids || []);
          }
        }

        // --- PROCESAR CUADRILLA ---
        let loadedWorkers = null;
        if (workersRes.status === 'fulfilled' && workersRes.value.ok) {
          loadedWorkers = await safeParseJSON(workersRes.value);
        }

        if (Array.isArray(loadedWorkers)) {
          setWorkers(loadedWorkers);
        } else {
          const localWorkers = localStorage.getItem('parkapp:workers');
          if (localWorkers) setWorkers(JSON.parse(localWorkers));
        }

        // --- PROCESAR HERRAMIENTAS ---
        let loadedTools = null;
        if (toolsRes.status === 'fulfilled' && toolsRes.value.ok) {
          loadedTools = await safeParseJSON(toolsRes.value);
        }

        if (Array.isArray(loadedTools)) {
          setTools(loadedTools);
        } else {
          const localTools = localStorage.getItem('parkapp:tools');
          if (localTools) {
            setTools(JSON.parse(localTools));
          } else if (!loadedTools) { // Fallback inicial solo si todo falla
            setTools([
              { id: 1, name: 'Cortadora de césped', category: 'Maquinaria', status: 'available' },
              { id: 2, name: 'Bordeadora', category: 'Maquinaria', status: 'in-use' },
              { id: 3, name: 'Manguera 20m', category: 'Riego', status: 'available' },
              { id: 4, name: 'Tijera de podar', category: 'Herramientas', status: 'available' },
            ]);
          }
        }

      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Funciones de persistencia
  const persistClients = async (newList: Client[]) => {
    localStorage.setItem('parkapp:clients', JSON.stringify(newList));
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) { /* silent fail for local vitest */ }
  };

  const persistExtraJobs = async (ids: number[]) => {
    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: getTodayKey(), ids })
      });
    } catch (e) { /* silent fail */ }
  };

  const persistWorkers = async (newList: Worker[]) => {
    localStorage.setItem('parkapp:workers', JSON.stringify(newList));
    try {
      await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) { /* silent fail */ }
  };

  const persistTools = async (newList: Tool[]) => {
    localStorage.setItem('parkapp:tools', JSON.stringify(newList));
    try {
      await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) { /* silent fail */ }
  };

  const addClient = (newClient: Omit<Client, 'id' | 'lastPriceUpdate'>) => {
    setClients(prev => {
      const updated = [...prev, { 
        ...newClient, 
        id: Date.now(),
        lastPriceUpdate: new Date().toISOString().split('T')[0]
      }];
      persistClients(updated);
      return updated;
    });
  };

  const deleteClient = (id: number) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      persistClients(updated);
      return updated;
    });
    setExtraJobIds(prev => {
      const updated = prev.filter(eid => eid !== id);
      persistExtraJobs(updated);
      return updated;
    });
  };

  const updateClient = (id: number, data: Omit<Client, 'id' | 'lastPriceUpdate'>) => {
    setClients(prev => {
      const updated = prev.map(c => c.id === id ? { 
        ...c, 
        ...data,
        lastPriceUpdate: c.price !== data.price ? new Date().toISOString().split('T')[0] : c.lastPriceUpdate
      } : c);
      persistClients(updated);
      return updated;
    });
  };

  const updateClientPrice = (id: number, newPrice: number) => {
    setClients(prev => {
      const updated = prev.map(c => c.id === id ? { 
        ...c, 
        price: newPrice,
        lastPriceUpdate: new Date().toISOString().split('T')[0]
      } : c);
      persistClients(updated);
      return updated;
    });
  };

  const addExtraJobForToday = (clientId: number) => {
    setExtraJobIds(prev => {
      if (!prev.includes(clientId)) {
        const updated = [...prev, clientId];
        persistExtraJobs(updated);
        return updated;
      }
      return prev;
    });
  };

  const addWorker = (newWorker: Omit<Worker, 'id'>) => {
    setWorkers(prev => {
      const updated = [...prev, { ...newWorker, id: Date.now() }];
      persistWorkers(updated);
      return updated;
    });
  };

  const deleteWorker = (id: number) => {
    setWorkers(prev => {
      const updated = prev.filter(w => w.id !== id);
      persistWorkers(updated);
      return updated;
    });
  };

  const addTool = (newTool: Omit<Tool, 'id'>) => {
    setTools(prev => {
      const updated = [...prev, { ...newTool, id: Date.now() }];
      persistTools(updated);
      return updated;
    });
  };

  const updateTool = (id: number, data: Omit<Tool, 'id'>) => {
    setTools(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...data } : t);
      persistTools(updated);
      return updated;
    });
  };

  const deleteTool = (id: number) => {
    setTools(prev => {
      const updated = prev.filter(t => t.id !== id);
      persistTools(updated);
      return updated;
    });
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
      <div className="h-[100dvh] bg-slate-200 flex justify-center overflow-hidden md:py-8">
        <div className="w-full max-w-md h-full md:h-[850px] bg-slate-50 font-sans relative md:rounded-[40px] md:shadow-2xl overflow-hidden md:border-[8px] md:border-slate-800 flex flex-col">
          
          <div className="flex-1 overflow-y-auto pb-safe-bottom">
            <Routes>
              <Route path="/" element={
                <Home 
                  clients={clients} 
                  workers={workers}
                  extraJobIds={extraJobIds} 
                  onUpdatePrice={updateClientPrice} 
                  onAddExtraJob={addExtraJobForToday}
                />
              } />
              <Route path="/clientes" element={<Clients clients={clients} workers={workers} onAddClient={addClient} onDeleteClient={deleteClient} onUpdateClient={updateClient} />} />
              <Route path="/cuadrilla" element={<Cuadrilla workers={workers} onAddWorker={addWorker} onDeleteWorker={deleteWorker} />} />
              <Route path="/herramientas" element={<Tools tools={tools} onAddTool={addTool} onUpdateTool={updateTool} onDeleteTool={deleteTool} />} />
              <Route path="/balance" element={<Balance clients={clients} />} />
            </Routes>
          </div>

          <BottomNavBar />

        </div>
      </div>
    </Router>
  );
}

export default App;
