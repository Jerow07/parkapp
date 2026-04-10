import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BottomNavBar } from './components/BottomNavBar';
import { Home } from './pages/Home';
import { Clients } from './pages/Clients';

export interface Client {
  id: number;
  name: string;
  address: string;
  price: number;
  days: string[];
}

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cargar datos al iniciar
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setClients(data);
        } else {
          // Si está vacío, ponemos los de ejemplo por defecto la primera vez
          const defaultClients = [
            { id: 1, name: 'Doña Rosa', address: 'Las Magnolias 123', price: 5000, days: ['L', 'M', 'V'] },
            { id: 2, name: 'Familia Gómez', address: 'Av. Siempreviva 742', price: 8000, days: ['X', 'S'] },
            { id: 3, name: 'Oficinas Centro', address: 'San Martín 1234', price: 45000, days: ['L', 'M', 'X', 'J', 'V'] },
          ];
          setClients(defaultClients);
          persistClients(defaultClients);
        }
      })
      .catch(err => console.error("Error cargando clientes:", err))
      .finally(() => setIsLoading(false));
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

  const addClient = (newClient: Omit<Client, 'id'>) => {
    const updated = [...clients, { ...newClient, id: Date.now() }];
    setClients(updated);
    persistClients(updated);
  };

  const deleteClient = (id: number) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    persistClients(updated);
  };

  const updateClientPrice = (id: number, newPrice: number) => {
    const updated = clients.map(c => c.id === id ? { ...c, price: newPrice } : c);
    setClients(updated);
    persistClients(updated);
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
              <Route path="/" element={<Home clients={clients} onUpdatePrice={updateClientPrice} />} />
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
