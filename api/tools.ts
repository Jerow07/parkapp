import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const REDIS_KEY = 'parkapp:tools';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const tools = await redis.get(REDIS_KEY);
      return res.status(200).json(tools || []);
    }

    if (req.method === 'POST') {
      const newTools = req.body;
      await redis.set(REDIS_KEY, newTools);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Redis Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
