import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContributionSchema } from "@shared/schema";
import { z } from "zod";

const connectWalletSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required")
});

const contributionSchema = insertContributionSchema.extend({
  type: z.enum(['twitter', 'github', 'discord', 'medium']),
  url: z.string().url("Invalid URL format"),
  description: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect wallet
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress } = connectWalletSchema.parse(req.body);
      
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        user = await storage.createUser({
          walletAddress,
          username: `Ambassador_${walletAddress.slice(-4)}`,
          totalPoints: 0,
          totalContributions: 0,
          rank: 0,
          isConnected: true
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

  // Disconnect wallet
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

  // Submit contribution
  app.post("/api/contributions", async (req, res) => {
    try {
      const data = contributionSchema.parse(req.body);
      
      // Check for duplicate URL
      const existingContribution = await storage.getContributionByUrl(data.url);
      if (existingContribution) {
        return res.status(400).json({ 
          message: "This contribution URL has already been submitted" 
        });
      }

      // Validate URL format based on type
      const isValidUrl = validateContributionUrl(data.type, data.url);
      if (!isValidUrl) {
        return res.status(400).json({ 
          message: `Invalid ${data.type} URL format` 
        });
      }

      // Calculate points based on contribution type
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

  // Get user contributions
  app.get("/api/contributions/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const contributions = await storage.getContributionsByUser(user.id);
      res.json({ contributions });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch contributions" 
      });
    }
  });

  // Get dashboard stats
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

  // Get leaderboard
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

  // Get recent activity
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

  const httpServer = createServer(app);
  return httpServer;
}

function validateContributionUrl(type: string, url: string): boolean {
  const patterns = {
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
    github: /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\/(commit|pull)\/[\w\-\.]+/,
    discord: /^https?:\/\/(www\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
    medium: /^https?:\/\/(www\.)?medium\.com\/@?[\w\-\.]+\/[\w\-\.]+-[\w\-\.]+/
  };
  
  const pattern = patterns[type as keyof typeof patterns];
  return pattern ? pattern.test(url) : false;
}

function getContributionPoints(type: string): number {
  const pointsMap = {
    twitter: 1,
    github: 2,
    discord: 1,
    medium: 3
  };
  
  return pointsMap[type as keyof typeof pointsMap] || 1;
}
