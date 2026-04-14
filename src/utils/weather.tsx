import { Sun, CloudSun, Cloud, CloudRain, CloudFog, CloudLightning, Snowflake } from 'lucide-react';

export const getWeatherIcon = (code: number | null, size = 32, strokeWidth = 2.5) => {
  if (code === null) return <CloudSun size={size} strokeWidth={strokeWidth} className="text-green-600 opacity-50" />;
  if (code === 0) return <Sun size={size} strokeWidth={strokeWidth} className="text-orange-500" />;
  if (code >= 1 && code <= 3) return <CloudSun size={size} strokeWidth={strokeWidth} className="text-blue-500" />;
  if (code === 45 || code === 48) return <CloudFog size={size} strokeWidth={strokeWidth} className="text-slate-500" />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} strokeWidth={strokeWidth} className="text-blue-600" />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <Snowflake size={size} strokeWidth={strokeWidth} className="text-cyan-500" />;
  if (code >= 95 && code <= 99) return <CloudLightning size={size} strokeWidth={strokeWidth} className="text-amber-500" />;
  return <Cloud size={size} strokeWidth={strokeWidth} className="text-slate-500" />;
};

export const getWeatherDescription = (code: number | null) => {
  if (code === null) return '--';
  if (code === 0) return 'Despejado';
  if (code >= 1 && code <= 3) return 'Parcialmente Nublado';
  if (code === 45 || code === 48) return 'Niebla';
  if (code >= 51 && code <= 67) return 'Llovizna/Lluvia';
  if (code >= 71 && code <= 77) return 'Nieve';
  if (code >= 80 && code <= 82) return 'Chaparrones';
  if (code === 85 || code === 86) return 'Nevadas';
  if (code >= 95 && code <= 99) return 'Tormenta';
  return 'Nublado';
};
