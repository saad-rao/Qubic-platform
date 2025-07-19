import { storage } from '../../server/storage';
import { z } from 'zod';

const connectWalletSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required")
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ message: 'Invalid JSON body' });
      return;
    }
  }
  try {
    const { walletAddress } = connectWalletSchema.parse(body);
    const user = await storage.getUserByWallet(walletAddress);
    if (user) {
      await storage.updateUser(user.id, { isConnected: false });
    }
    res.status(200).json({ message: "Wallet disconnected successfully" });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Failed to disconnect wallet" });
  }
} 