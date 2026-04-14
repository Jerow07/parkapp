import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const REDIS_KEY = 'parkapp:workers';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workers = await redis.get(REDIS_KEY);
      return res.status(200).json(workers || []);
    }

    if (req.method === 'POST') {
      const newWorkers = req.body;
      await redis.set(REDIS_KEY, newWorkers);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Redis Workers Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
