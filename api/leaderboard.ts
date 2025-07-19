import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await storage.getLeaderboard(limit);
    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch leaderboard" });
  }
} 