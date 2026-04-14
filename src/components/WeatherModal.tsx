import { X, Droplets, Thermometer } from 'lucide-react';
import { getWeatherIcon } from '../utils/weather';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyData: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  } | null;
}

export const WeatherModal = ({ isOpen, onClose, dailyData }: WeatherModalProps) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric' }).format(date);
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="relative bg-white rounded-t-[40px] p-6 pb-safe-bottom shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        
        {/* Grabber indicator */}
        <div className="w-16 h-2 bg-slate-200 rounded-full mx-auto mb-8 flex-shrink-0" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="mb-6 pr-12 flex-shrink-0">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Pronóstico Semanal
          </h3>
          <p className="text-lg text-slate-500 font-medium tracking-tight">
            Planificá tus trabajos según el tiempo.
          </p>
        </div>

        <div className="overflow-y-auto space-y-3 pb-4">
          {dailyData ? dailyData.time.map((time, index) => {
            const isToday = index === 0;
            return (
              <div 
                key={time} 
                className={`flex items-center justify-between p-4 rounded-[24px] border-2 transition-colors ${
                  isToday 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex-1">
                  <span className={`text-xs font-black uppercase tracking-widest block mb-1 ${isToday ? 'text-green-600' : 'text-slate-400'}`}>
                    {isToday ? 'HOY' : formatDate(time)}
                  </span>
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(dailyData.weathercode[index], 36)}
                    <div>
                      <div className="flex items-center gap-1.5 font-black text-slate-800 text-xl">
                        <Thermometer size={16} className="text-red-500" />
                        {Math.round(dailyData.temperature_2m_max[index])}°
                        <span className="text-slate-400 font-bold ml-1">
                          {Math.round(dailyData.temperature_2m_min[index])}°
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-blue-600 font-black">
                      <Droplets size={16} strokeWidth={3} />
                      <span className="text-lg">{dailyData.precipitation_probability_max[index]}%</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Lluvia</span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-slate-400 italic">Cargando pronóstico...</div>
          )}
        </div>
      </div>
    </div>
  );
};
