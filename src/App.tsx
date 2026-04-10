import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BottomNavBar } from './components/BottomNavBar';
import { Home } from './pages/Home';
import { Clients } from './pages/Clients';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-200 flex justify-center pb-0 md:py-8">
        <div className="w-full max-w-md min-h-screen md:min-h-[850px] bg-slate-50 font-sans pb-24 relative md:rounded-[40px] md:shadow-2xl overflow-hidden md:border-[8px] md:border-slate-800 flex flex-col">
          
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clients />} />
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
