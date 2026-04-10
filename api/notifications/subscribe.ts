import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const SUBS_KEY = 'parkapp:subscriptions';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const subscription = req.body;
      
      // Guardar la suscripción en un Set de Redis (como string JSON)
      const subStr = JSON.stringify(subscription);
      await redis.sadd(SUBS_KEY, subStr);
      
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const subscription = req.body;
      const subStr = JSON.stringify(subscription);
      await redis.srem(SUBS_KEY, subStr);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Subscription Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
