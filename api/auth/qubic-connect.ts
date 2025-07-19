import { storage } from '../../server/storage';
import { z } from 'zod';

const qubicConnectSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  publicKey: z.string().min(1, "Public key is required"),
  signature: z.string().min(1, "Signature is required"),
});

function isAmbassadorWallet(walletAddress: string): boolean {
  return walletAddress.startsWith('QUBIC1234') || 
         walletAddress.startsWith('QUBIC9876') || 
         walletAddress.includes('AMBASSADOR');
}

function verifyQubicSignature(walletAddress: string, publicKey: string, signature: string): boolean {
  return walletAddress.length >= 60 && 
         publicKey.length >= 60 && 
         signature.startsWith('mock_signature_');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    const { walletAddress, publicKey, signature } = qubicConnectSchema.parse(req.body);
    if (!verifyQubicSignature(walletAddress, publicKey, signature)) {
      res.status(401).json({ message: "Invalid signature or authentication failed" });
      return;
    }
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
      user = await storage.updateUser(user.id, { 
        isConnected: true,
        role: isAmbassador ? 'ambassador' : 'visitor',
        isApproved: isAmbassador
      }) || user;
    }
    res.status(200).json({ 
      user, 
      message: `Connected successfully as ${user.role}`,
      isAmbassador: user.role === 'ambassador' && user.isApproved
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Failed to authenticate with Qubic" });
  }
} 