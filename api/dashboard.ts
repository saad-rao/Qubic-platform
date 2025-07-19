import { storage } from '../server/storage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    let userId;
    if (req.query.walletAddress) {
      const user = await storage.getUserByWallet(req.query.walletAddress as string);
      userId = user?.id;
    }
    const stats = await storage.getDashboardStats(userId);
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Failed to fetch dashboard stats" });
  }
} 