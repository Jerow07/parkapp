import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Calendar, CloudSun, Sun, Cloud, CloudRain, CloudFog, CloudLightning, Snowflake, Loader2, Phone, Bell, BellOff, Download } from 'lucide-react';
import { OutdatedPriceAlert } from '../components/OutdatedPriceAlert';
import { PriceUpdateModal } from '../components/PriceUpdateModal';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { NewJobModal } from '../components/NewJobModal';
import heroBg from '../assets/hero-bg.png';
import type { Client } from '../App';

interface HomeProps {
  clients: Client[];
  extraJobIds: number[];
  onUpdatePrice: (id: number, newPrice: number) => void;
  onAddExtraJob: (clientId: number) => void;
}

const VAPID_PUBLIC_KEY = 'BEpDXiO8wVHx6cm66DzCvIiL96mDYqV0f_2WGEqBTeolr5x10UY0KX6TPRQgI9dh2HqHjOaJfwlgO7WQO6IzUoU';

export const Home = ({ clients, extraJobIds, onUpdatePrice, onAddExtraJob }: HomeProps) => {
  // Estados para modales
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  
  // Cliente seleccionado para actualizar precio
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // --- LÓGICA DE NOTIFICACIONES ---
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Registrar Service Worker y verificar suscripción
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          setIsSubscribed(!!sub);
        });
      });
    }

    // Escuchar el evento de instalación de PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const subscribeUser = async () => {
    try {
      if (!('serviceWorker' in navigator)) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });

      setIsSubscribed(true);
      alert('¡Notificaciones activadas! Te avisaremos a las 6 AM si hay aumentos pendientes.');
    } catch (err) {
      console.error('Error suscribiendo:', err);
      alert('No se pudieron activar las notificaciones. Asegúrate de dar permiso en el navegador.');
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Helper para convertir la llave VAPID
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // --- LÓGICA DE TRABAJOS ---
  const dayMap = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const currentDayCode = dayMap[new Date().getDay()];
  const fixedClients = clients.filter(c => c.days.includes(currentDayCode));
  const extraClients = clients.filter(c => extraJobIds.includes(c.id) && !fixedClients.some(fc => fc.id === c.id));
  const allTodayClients = [...fixedClients, ...extraClients];

  // Detectar clientes con precio desactualizado (> 60 días)
  const outdatedClients = clients.filter(c => {
    const lastUpdate = new Date(c.lastPriceUpdate);
    const diffTime = Math.abs(new Date().getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 60;
  });
  
  const outdatedClient = outdatedClients[0]; // Mostrar el primero en el alert

  const handlePriceUpdate = (newPrice: number) => {
    if (selectedClient) {
      onUpdatePrice(selectedClient.id, newPrice);
    } else if (outdatedClient) {
      onUpdatePrice(outdatedClient.id, newPrice);
    }
    
    setIsPriceModalOpen(false);
    setIsSuccessAnimating(true);
    setTimeout(() => setIsSuccessAnimating(false), 2500);
  };

  const handleAddExtraJob = (id: number) => {
    onAddExtraJob(id);
    setIsSuccessAnimating(true);
    setTimeout(() => setIsSuccessAnimating(false), 2000);
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

  const renderWeatherIcon = () => {
    if (isLoadingWeather) return <Loader2 size={32} strokeWidth={2.5} className="animate-spin text-green-600" />;
    const code = weatherData.code;
    if (code === null) return <CloudSun size={32} strokeWidth={2.5} className="text-green-600 opacity-50" />;
    if (code === 0) return <Sun size={32} strokeWidth={2.5} className="text-orange-500" />;
    if (code >= 1 && code <= 3) return <CloudSun size={32} strokeWidth={2.5} className="text-blue-500" />;
    if (code === 45 || code === 48) return <CloudFog size={32} strokeWidth={2.5} className="text-slate-500" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={32} strokeWidth={2.5} className="text-blue-600" />;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <Snowflake size={32} strokeWidth={2.5} className="text-cyan-500" />;
    if (code >= 95 && code <= 99) return <CloudLightning size={32} strokeWidth={2.5} className="text-amber-500" />;
    return <Cloud size={32} strokeWidth={2.5} className="text-slate-500" />;
  };

  const todayStr = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <>
      <header className="relative bg-white shadow-sm z-40 border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Decoración" className="w-full h-full object-cover opacity-20 object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 px-6 pt-16 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Hola, Juan</h1>
              <p className="text-xl font-bold text-green-700 capitalize flex items-center gap-2">
                <Calendar size={20} strokeWidth={2.5} />
                {todayStr}
              </p>
            </div>
            
            <div className="flex gap-2 items-center">
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="bg-green-100 text-green-700 p-3 rounded-2xl border border-green-200 shadow-sm active:scale-90 transition-transform"
                >
                  <Download size={24} strokeWidth={2.5} />
                </button>
              )}
              
              <button 
                onClick={isSubscribed ? undefined : subscribeUser}
                className={`p-3 rounded-2xl border transition-all active:scale-90 ${
                  isSubscribed 
                    ? 'bg-blue-50 text-blue-500 border-blue-100' 
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                {isSubscribed ? <Bell size={24} strokeWidth={2.5} /> : <BellOff size={24} strokeWidth={2.5} />}
              </button>

              <div className="flex flex-col items-center bg-white/80 p-2 rounded-2xl shadow-sm border border-slate-200/50 backdrop-blur-md min-w-[70px]">
                {renderWeatherIcon()}
                {!isLoadingWeather && weatherData.temp !== '--' && (
                  <span className="text-lg font-black text-slate-800 mt-0.5 tracking-tighter">
                    {weatherData.temp}°
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 pb-20">
        {outdatedClient && (
          <OutdatedPriceAlert 
            clientName={outdatedClient.name}
            monthsOutdated={2} 
            currentPrice={outdatedClient.price}
            onUpdateClick={() => {
              setSelectedClient(outdatedClient);
              setIsPriceModalOpen(true);
            }}
          />
        )}

        <div className="mt-8 mb-10">
          <button 
            onClick={() => setIsNewJobModalOpen(true)}
            className="w-full min-h-[88px] bg-green-600 hover:bg-green-700 text-white rounded-[32px] text-2xl font-black uppercase tracking-widest shadow-xl shadow-green-600/20 transition-transform active:scale-95 flex items-center justify-center gap-3 border-4 border-green-500/30"
          >
            <Plus size={36} strokeWidth={3} />
            Nuevo Trabajo
          </button>
        </div>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <CheckSquare size={28} className="text-green-600" />
            Para Hoy ({allTodayClients.length})
          </h2>
          <div className="space-y-4">
             {allTodayClients.length > 0 ? allTodayClients.map(client => {
               const isExtra = extraJobIds.includes(client.id);
               return (
                <div key={client.id} className="bg-white border-2 border-slate-200 rounded-[28px] p-6 shadow-md relative touch-target active:bg-slate-50 transition-colors overflow-hidden">
                  {isExtra && <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Extra</div>}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-slate-900">{client.name}</h3>
                    <span className="bg-blue-100 text-blue-700 font-black text-sm px-3 py-1 rounded-lg uppercase tracking-wider">Mantenimiento</span>
                  </div>
                  <p className="text-lg font-medium text-slate-600 mb-2">{client.address}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <a href={`tel:${client.phone}`} className="flex items-center gap-2 bg-slate-50 text-slate-600 font-bold px-3 py-1.5 rounded-lg border border-slate-100 active:bg-slate-100 transition-colors">
                      <Phone size={16} className="text-blue-500" />
                      {client.phone}
                    </a>
                  </div>
                  <div className="bg-slate-100 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-500">A cobrar hoy:</span>
                    <span className="text-2xl font-black text-green-600">${client.price.toLocaleString()}</span>
                  </div>
                </div>
               );
             }) : (
               <div className="bg-slate-100 rounded-[28px] p-10 text-center border-2 border-dashed border-slate-300">
                 <p className="text-xl font-bold text-slate-400 italic">No tienes trabajos<br/>agendados para hoy.</p>
               </div>
             )}
          </div>
        </section>
      </main>

      <PriceUpdateModal 
        isOpen={isPriceModalOpen} 
        onClose={() => {
          setIsPriceModalOpen(false);
          setSelectedClient(null);
        }}
        currentPrice={selectedClient?.price || 0}
        onConfirm={handlePriceUpdate}
      />
      <NewJobModal isOpen={isNewJobModalOpen} onClose={() => setIsNewJobModalOpen(false)} clients={clients} onConfirm={handleAddExtraJob} alreadyScheduledIds={allTodayClients.map(c => c.id)} />
      <SuccessOverlay show={isSuccessAnimating} />
    </>
  );
};
