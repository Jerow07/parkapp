import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const JOBS_KEY = 'parkapp:extra_jobs';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const data = await redis.get(JOBS_KEY);
      return res.status(200).json(data || { date: '', ids: [] });
    }

    if (req.method === 'POST') {
      const data = req.body; // Expects { date: 'YYYY-MM-DD', ids: [] }
      await redis.set(JOBS_KEY, data);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Redis Jobs Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
