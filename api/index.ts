import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import { storage } from '../server/storage.js';
import { insertContributionSchema } from '../shared/schema.js';
import { z } from 'zod';

const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectWalletSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required")
});

const qubicConnectSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  publicKey: z.string().min(1, "Public key is required"),
  signature: z.string().min(1, "Signature is required"),
});

const contributionSchema = insertContributionSchema.extend({
  type: z.enum(['twitter', 'github', 'discord', 'medium']),
  url: z.string().url("Invalid URL format"),
  description: z.string().optional()
});

// Helper function to check if wallet is an ambassador
function isAmbassadorWallet(walletAddress: string): boolean {
  return walletAddress.startsWith('QUBIC1234') || 
         walletAddress.startsWith('QUBIC9876') || 
         walletAddress.includes('AMBASSADOR');
}

// Helper function to verify Qubic signature (simplified for demo)
function verifyQubicSignature(walletAddress: string, publicKey: string, signature: string): boolean {
  return walletAddress.length >= 60 && 
         publicKey.length >= 60 && 
         signature.startsWith('mock_signature_');
}

// API Routes
app.post("/api/auth/qubic-connect", async (req, res) => {
  try {
    const { walletAddress, publicKey, signature } = qubicConnectSchema.parse(req.body);
    
    // Verify signature
    if (!verifyQubicSignature(walletAddress, publicKey, signature)) {
      return res.status(401).json({ 
        message: "Invalid signature or authentication failed" 
      });
    }
    
    // Check if this is an ambassador wallet
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
    
    res.json({ 
      user, 
      message: `Connected successfully as ${user.role}`,
      isAmbassador: user.role === 'ambassador' && user.isApproved
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Failed to authenticate with Qubic" 
    });
  }
});

app.post("/api/auth/disconnect", async (req, res) => {
  try {
    res.json({ message: "Disconnected successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to disconnect" 
    });
  }
});

app.post("/api/wallet/connect", async (req, res) => {
  try {
    const { walletAddress } = connectWalletSchema.parse(req.body);
    
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
    
    res.json({ user, message: "Wallet connected successfully" });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Failed to connect wallet" 
    });
  }
});

app.post("/api/wallet/disconnect", async (req, res) => {
  try {
    const { walletAddress } = connectWalletSchema.parse(req.body);
    const user = await storage.getUserByWallet(walletAddress);
    
    if (user) {
      await storage.updateUser(user.id, { isConnected: false });
    }
    
    res.json({ message: "Wallet disconnected successfully" });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Failed to disconnect wallet" 
    });
  }
});

app.post("/api/contributions", async (req, res) => {
  try {
    const data = contributionSchema.parse(req.body);
    
    const existingContribution = await storage.getContributionByUrl(data.url);
    if (existingContribution) {
      return res.status(400).json({ 
        message: "This contribution URL has already been submitted" 
      });
    }

    const points = getContributionPoints(data.type);
    
    const contribution = await storage.createContribution({
      ...data,
      points
    });
    
    res.json({ 
      contribution, 
      message: "Contribution submitted successfully!" 
    });
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : "Failed to submit contribution" 
    });
  }
});

app.get("/api/dashboard/:walletAddress?", async (req, res) => {
  try {
    let userId: number | undefined;
    
    if (req.params.walletAddress) {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      userId = user?.id;
    }
    
    const stats = await storage.getDashboardStats(userId);
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to fetch dashboard stats" 
    });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await storage.getLeaderboard(limit);
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to fetch leaderboard" 
    });
  }
});

app.get("/api/activity/:walletAddress?", async (req, res) => {
  try {
    let userId: number | undefined;
    
    if (req.params.walletAddress) {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      userId = user?.id;
    }
    
    const limit = parseInt(req.query.limit as string) || 10;
    const activities = await storage.getRecentActivity(userId, limit);
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to fetch recent activity" 
    });
  }
});

app.get("/api/tasks/:walletAddress?", async (req, res) => {
  try {
    let userId: number | undefined;
    
    if (req.params.walletAddress) {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      userId = user?.id;
    }
    
    const tasks = await storage.getTasks(userId);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to fetch tasks" 
    });
  }
});

function getContributionPoints(type: string): number {
  const pointsMap = {
    twitter: 1,
    github: 2,
    discord: 1,
    medium: 3
  };
  return pointsMap[type as keyof typeof pointsMap] || 1;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}