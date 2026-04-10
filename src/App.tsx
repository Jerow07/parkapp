import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Calendar, CloudSun, Sun, Cloud, CloudRain, CloudFog, CloudLightning, Snowflake, Loader2 } from 'lucide-react';
import { BottomNavBar } from './components/BottomNavBar';
import { OutdatedPriceAlert } from './components/OutdatedPriceAlert';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { SuccessOverlay } from './components/SuccessOverlay';
import heroBg from './assets/hero-bg.png';

function App() {
  // Estado para el modal de precios
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [hasOutdatedClient, setHasOutdatedClient] = useState(true);

  // Datos mock para el ejemplo
  const [clientData, setClientData] = useState({
    name: 'Doña Rosa',
    price: 5000,
    months: 6
  });

  const handlePriceUpdate = (newPrice: number) => {
    setIsPriceModalOpen(false);
    setIsSuccessAnimating(true);
    
    // Simular el guardado en base de datos
    setTimeout(() => {
      setClientData(prev => ({ ...prev, price: newPrice, months: 0 }));
      setIsSuccessAnimating(false);
      setHasOutdatedClient(false); // Ocultar tarjeta roja
    }, 2500);
  };

  // --- WIDGET DEL CLIMA ---
  const [weatherData, setWeatherData] = useState<{temp: number | string, code: number | null}>({ temp: '--', code: null });
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await res.json();
          if (data.current_weather) {
            setWeatherData({
              temp: Math.round(data.current_weather.temperature),
              code: data.current_weather.weathercode
            });
          }
        } catch (error) {
          console.error("Error fetching weather:", error);
        } finally {
          setIsLoadingWeather(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        setIsLoadingWeather(false);
      }
    );
  }, []);

  // Mapeador de códigos Open-Meteo a Íconos Lucide
  const renderWeatherIcon = () => {
    if (isLoadingWeather) return <Loader2 size={32} strokeWidth={2.5} className="animate-spin text-green-600" />;
    
    const code = weatherData.code;
    if (code === null) return <CloudSun size={32} strokeWidth={2.5} className="text-green-600 opacity-50" />; // Default / Error fallback

    if (code === 0) return <Sun size={32} strokeWidth={2.5} className="text-orange-500" />;
    if (code >= 1 && code <= 3) return <CloudSun size={32} strokeWidth={2.5} className="text-blue-500" />;
    if (code === 45 || code === 48) return <CloudFog size={32} strokeWidth={2.5} className="text-slate-500" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={32} strokeWidth={2.5} className="text-blue-600" />;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <Snowflake size={32} strokeWidth={2.5} className="text-cyan-500" />;
    if (code >= 95 && code <= 99) return <CloudLightning size={32} strokeWidth={2.5} className="text-amber-500" />;
    
    return <Cloud size={32} strokeWidth={2.5} className="text-slate-500" />;
  };
  // ------------------------

  const today = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
      {/* Cabecera Principal con Imagen */}
      <header className="relative bg-white shadow-sm z-40 border-b border-slate-200 overflow-hidden">
        {/* Capa de Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Decoración de Jardín" 
            className="w-full h-full object-cover opacity-20 object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        {/* Contenido de la Cabecera */}
        <div className="relative z-10 px-6 pt-16 pb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                Hola, Juan
              </h1>
              <p className="text-xl font-bold text-green-700 capitalize flex items-center gap-2">
                <Calendar size={20} strokeWidth={2.5} />
                {today}
              </p>
            </div>
            <div className="flex flex-col items-center bg-white/80 p-2 md:p-3 rounded-2xl shadow-sm border border-slate-200/50 backdrop-blur-md min-w-[70px]">
              {renderWeatherIcon()}
              {!isLoadingWeather && weatherData.temp !== '--' && (
                <span className="text-lg font-black text-slate-800 mt-0.5 tracking-tighter">
                  {weatherData.temp}°
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6">
        
        {/* Sección de Urgencias */}
        {hasOutdatedClient && (
          <OutdatedPriceAlert 
            clientName={clientData.name}
            monthsOutdated={clientData.months}
            currentPrice={clientData.price}
            onUpdateClick={() => setIsPriceModalOpen(true)}
          />
        )}

        {/* Acción Principal */}
        <div className="mt-8 mb-10">
          <button className="w-full min-h-[88px] bg-green-600 hover:bg-green-700 text-white rounded-[32px] text-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 transition-transform active:scale-95 flex items-center justify-center gap-3 border-4 border-green-500/30">
            <Plus size={36} strokeWidth={3} />
            Nuevo Trabajo
          </button>
        </div>

        {/* Tareas del Día */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <CheckSquare size={28} className="text-green-600" />
            Para Hoy (2)
          </h2>
          
          <div className="space-y-4">
             {/* Tarjeta de Cliente Mock */}
             <div className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md relative touch-target active:bg-slate-50 transition-colors">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-black text-slate-900">Familia Gómez</h3>
                 <span className="bg-blue-100 text-blue-700 font-black text-sm px-3 py-1 rounded-lg uppercase tracking-wider">
                   Mantenimiento
                 </span>
               </div>
               <p className="text-lg font-medium text-slate-600 mb-4">
                 Av. Siempreviva 742
               </p>
               <div className="bg-slate-100 rounded-2xl p-4 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-500">A cobrar hoy:</span>
                 <span className="text-2xl font-black text-green-600">$8,000</span>
               </div>
             </div>

             <div className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md relative touch-target active:bg-slate-50 transition-colors">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-black text-slate-900">Oficinas Centro</h3>
                 <span className="bg-orange-100 text-orange-700 font-black text-sm px-3 py-1 rounded-lg uppercase tracking-wider">
                   Corte Grande
                 </span>
               </div>
               <p className="text-lg font-medium text-slate-600 mb-4">
                 San Martín 1234
               </p>
               <div className="bg-slate-100 rounded-2xl p-4 flex justify-between items-center">
                 <span className="text-lg font-bold text-slate-500">Mensual:</span>
                 <span className="text-2xl font-black text-green-600">$45,000</span>
               </div>
             </div>
          </div>
        </section>

      </main>

      <BottomNavBar />

      {/* Modales y Overlays */}
      <PriceUpdateModal 
        isOpen={isPriceModalOpen} 
        onClose={() => setIsPriceModalOpen(false)}
        currentPrice={clientData.price}
        onConfirm={handlePriceUpdate}
      />

      <SuccessOverlay show={isSuccessAnimating} />

    </div>
  );
}

export default App;
