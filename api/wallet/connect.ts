import { storage } from '../../server/storage';
import { z } from 'zod';

const connectWalletSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required")
});

function isAmbassadorWallet(walletAddress: string): boolean {
  return walletAddress.startsWith('QUBIC1234') || 
         walletAddress.startsWith('QUBIC9876') || 
         walletAddress.includes('AMBASSADOR');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  // Vercel may not parse JSON body automatically
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
    const isAmbassador = isAmbassadorWallet(walletAddress);
    let user = await storage.getUserByWallet(walletAddress);
    if (!user) {
      user = await storage.createUser({
        walletAddress,
        username: isAmbassador ? `Ambassador_${walletAddress.slice(-4)}` : `Visitor_${walletAddress.slice(-4)}`,
        role: isAmbassador ? 'ambassador' : 'visitor',
        totalPoints: 0,
        totalContributions: 0,
        rank: 0,
        isConnected: true,
        isApproved: isAmbassador
      });
    } else {
      user = await storage.updateUser(user.id, { isConnected: true }) || user;
    }
    res.status(200).json({ user, message: "Wallet connected successfully" });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Failed to connect wallet" });
  }
} 