import { Redis } from '@upstash/redis';
import webpush from 'web-push';

const redis = Redis.fromEnv();
const CLIENTS_KEY = 'parkapp:clients';
const SUBS_KEY = 'parkapp:subscriptions';

// Configurar VAPID (Esto debería estar en variables de entorno)
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BEpDXiO8wVHx6cm66DzCvIiL96mDYqV0f_2WGEqBTeolr5x10UY0KX6TPRQgI9dh2HqHjOaJfwlgO7WQO6IzUoU';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'O3h_vuTFTkCqN1gam1GY1MGCCVyFS5823r71EagH3mo';

webpush.setVapidDetails(
  'mailto:example@yourdomain.com',
  vapidPublicKey,
  vapidPrivateKey
);

export default async function handler(req: any, res: any) {
  // Opcional: Proteger con una API KEY para que solo Vercel pueda llamarlo
  // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) { ... }

  try {
    // 1. Obtener Clientes
    const clients: any[] = (await redis.get(CLIENTS_KEY)) || [];
    
    // 2. Filtrar los que tienen más de 2 meses (60 días)
    const today = new Date();
    const outdatedClients = clients.filter(c => {
      if (!c.lastPriceUpdate) return true;
      const lastUpdate = new Date(c.lastPriceUpdate);
      const diffTime = Math.abs(today.getTime() - lastUpdate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 60;
    });

    if (outdatedClients.length === 0) {
      return res.status(200).json({ message: 'No outdated prices found.' });
    }

    // 3. Obtener Suscripciones
    const subscriptions: string[] = await redis.smembers(SUBS_KEY);
    
    // 4. Enviar Notificación
    const payload = JSON.stringify({
      title: 'ParkApp: Aumentos Pendientes',
      body: `Tienes ${outdatedClients.length} clientes con precios de hace más de 2 meses. ¡Es hora de actualizar!`,
      icon: '/icon-192x192.png'
    });

    const sendPromises = subscriptions.map(subStr => {
      const subscription = JSON.parse(subStr);
      return webpush.sendNotification(subscription, payload).catch(err => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Remover suscripción expirada
          return redis.srem(SUBS_KEY, subStr);
        }
        throw err;
      });
    });

    await Promise.all(sendPromises);

    return res.status(200).json({ 
      success: true, 
      sentTo: subscriptions.length, 
      outdatedCount: outdatedClients.length 
    });
  } catch (error: any) {
    console.error('Cron Notification Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
