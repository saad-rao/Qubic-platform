import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContributionSchema } from "@shared/schema";
import { z } from "zod";
import { xApiService } from "./services/xApiService";
import { qubicRpcService } from "./services/qubicRpcService";
import { supabaseService } from "./services/supabaseService";
import { dataSyncService } from "./services/dataSyncService";

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
  // For demo purposes, consider certain wallet patterns as ambassadors
  // In production, this would query a smart contract or authorized list
  return walletAddress.startsWith('QUBIC1234') || 
         walletAddress.startsWith('QUBIC9876') || 
         walletAddress.includes('AMBASSADOR');
}

// Helper function to verify Qubic signature (simplified for demo)
function verifyQubicSignature(walletAddress: string, publicKey: string, signature: string): boolean {
  // In production, this would use the actual Qubic cryptography library
  // For demo, we'll do basic validation
  return walletAddress.length >= 60 && 
         publicKey.length >= 60 && 
         signature.startsWith('mock_signature_');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start data synchronization service
  await dataSyncService.startSync();
  // Qubic Connect authentication
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

  // Disconnect authentication
  app.post("/api/auth/disconnect", async (req, res) => {
    try {
      res.json({ message: "Disconnected successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to disconnect" 
      });
    }
  });

  // Legacy wallet connect (keeping for backward compatibility)
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress } = connectWalletSchema.parse(req.body);
      
      let user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        // Check if this is a known ambassador wallet
        const isAmbassador = isAmbassadorWallet(walletAddress);
        
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

  // Get tasks for ambassadors
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

  // Submit task completion with X post verification
  app.post("/api/tasks/submit", async (req, res) => {
    try {
      const { walletAddress, taskId, postUrl, description } = req.body;
      
      if (!walletAddress || !taskId || !postUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify task submission
      const verification = await dataSyncService.verifyTaskSubmission(walletAddress, taskId, postUrl);
      
      if (!verification.verified) {
        return res.status(400).json({ message: verification.error });
      }

      // Create contribution record
      const user = await storage.getUserByWallet(walletAddress);
      if (user) {
        await storage.createContribution({
          userId: user.id,
          type: 'twitter',
          url: postUrl,
          description: description || `Task ${taskId} completion`,
          points: 50 // Base points for task completion
        });
      }

      res.json({ 
        message: "Task submitted successfully",
        verified: true,
        metrics: verification.metrics
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to submit task" 
      });
    }
  });

  // Get real-time X API engagement data
  app.get("/api/analytics/engagement", async (req, res) => {
    try {
      const data = await dataSyncService.getRealtimeEngagementData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch engagement data" 
      });
    }
  });

  // Get Qubic network status
  app.get("/api/qubic/status", async (req, res) => {
    try {
      const status = await qubicRpcService.getNetworkStatus();
      const stakingMetrics = await qubicRpcService.getStakingMetrics();
      
      res.json({
        network: status,
        staking: stakingMetrics
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch Qubic status" 
      });
    }
  });

  // Get comprehensive analytics data
  app.get("/api/analytics/comprehensive", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      
      const [
        analyticsData,
        leaderboardData,
        engagementData,
        qubicStatus
      ] = await Promise.all([
        supabaseService.getAnalyticsData(days),
        supabaseService.getLeaderboardData(),
        dataSyncService.getRealtimeEngagementData(),
        qubicRpcService.getNetworkStatus()
      ]);

      res.json({
        analytics: analyticsData,
        leaderboard: leaderboardData,
        engagement: engagementData,
        qubic: qubicStatus
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch comprehensive analytics" 
      });
    }
  });

  // Get ambassador profile with integrated data
  app.get("/api/ambassador/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      const [
        supabaseProfile,
        qubicMetrics,
        recentContributions
      ] = await Promise.all([
        supabaseService.getAmbassadorByWallet(walletAddress),
        qubicRpcService.getAmbassadorMetrics(walletAddress),
        storage.getContributionsByUser(0) // Would use actual user ID
      ]);

      if (!supabaseProfile) {
        return res.status(404).json({ message: "Ambassador not found" });
      }

      res.json({
        profile: supabaseProfile,
        qubicMetrics,
        recentContributions: recentContributions.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch ambassador profile" 
      });
    }
  });

  // Search and verify X posts
  app.post("/api/x/verify-post", async (req, res) => {
    try {
      const { postUrl } = req.body;
      
      if (!postUrl) {
        return res.status(400).json({ message: "Post URL is required" });
      }

      const post = await xApiService.verifyPostByUrl(postUrl);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found or invalid URL" });
      }

      const hasQubicTag = post.text.toLowerCase().includes('#qubic') || 
                         post.text.toLowerCase().includes('#qubicambassador');

      res.json({
        verified: true,
        post: {
          text: post.text,
          metrics: post.public_metrics,
          created_at: post.created_at,
          hasQubicTag
        }
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to verify post" 
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
