import { useState } from 'react';
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
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Doña Rosa', address: 'Las Magnolias 123', price: 5000, days: ['L', 'M', 'V'] },
    { id: 2, name: 'Familia Gómez', address: 'Av. Siempreviva 742', price: 8000, days: ['X', 'S'] },
    { id: 3, name: 'Oficinas Centro', address: 'San Martín 1234', price: 45000, days: ['L', 'M', 'X', 'J', 'V'] },
  ]);

  const addClient = (newClient: Omit<Client, 'id'>) => {
    setClients(prev => [...prev, { ...newClient, id: Date.now() }]);
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const updateClientPrice = (id: number, newPrice: number) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, price: newPrice } : c));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-200 flex justify-center pb-0 md:py-8">
        <div className="w-full max-w-md min-h-screen md:min-h-[850px] bg-slate-50 font-sans pb-24 relative md:rounded-[40px] md:shadow-2xl overflow-hidden md:border-[8px] md:border-slate-800 flex flex-col">
          
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home clients={clients} onUpdatePrice={updateClientPrice} />} />
              <Route path="/clientes" element={<Clients clients={clients} onAddClient={addClient} onDeleteClient={deleteClient} />} />
              {/* <Route path="/cuadrilla" element={<Crew />} /> */}
            </Routes>
          </div>

          <BottomNavBar />

        </div>
      </div>
    </Router>
  );
}

export default App;
