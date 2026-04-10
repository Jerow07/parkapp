import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const REDIS_KEY = 'parkapp:clients';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const clients = await redis.get(REDIS_KEY);
      return res.status(200).json(clients || []);
    }

    if (req.method === 'POST') {
      const newClients = req.body;
      await redis.set(REDIS_KEY, newClients);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Redis Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
