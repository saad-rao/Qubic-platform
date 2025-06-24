import { users, contributions, type User, type InsertUser, type Contribution, type InsertContribution, type DashboardStats, type LeaderboardEntry, type ContributionActivity } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Contribution operations
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContributionsByUser(userId: number): Promise<Contribution[]>;
  getContributionByUrl(url: string): Promise<Contribution | undefined>;
  getAllContributions(): Promise<Contribution[]>;
  
  // Analytics operations
  getDashboardStats(userId?: number): Promise<DashboardStats>;
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getRecentActivity(userId?: number, limit?: number): Promise<ContributionActivity[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contributions: Map<number, Contribution>;
  private currentUserId: number;
  private currentContributionId: number;

  constructor() {
    this.users = new Map();
    this.contributions = new Map();
    this.currentUserId = 1;
    this.currentContributionId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some sample users for leaderboard
    const sampleUsers = [
      { walletAddress: '0x1234567890abcdef1234567890abcdef12345678', username: 'Ambassador1', totalPoints: 156, totalContributions: 89, rank: 1 },
      { walletAddress: '0x9876543210fedcba9876543210fedcba98765432', username: 'Ambassador2', totalPoints: 142, totalContributions: 78, rank: 2 },
      { walletAddress: '0x5555777799991111333355557777999911113333', username: 'Ambassador3', totalPoints: 98, totalContributions: 52, rank: 3 },
    ];

    sampleUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        walletAddress: userData.walletAddress,
        username: userData.username,
        totalPoints: userData.totalPoints,
        totalContributions: userData.totalContributions,
        rank: userData.rank,
        isConnected: false,
        createdAt: new Date(),
        lastActivity: new Date()
      };
      this.users.set(user.id, user);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, lastActivity: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.currentContributionId++;
    const contribution: Contribution = {
      ...insertContribution,
      id,
      status: 'approved', // Auto-approve for MVP
      createdAt: new Date(),
      validatedAt: new Date()
    };
    
    this.contributions.set(id, contribution);
    
    // Update user stats
    const user = this.users.get(contribution.userId);
    if (user) {
      const updatedUser = {
        ...user,
        totalPoints: (user.totalPoints || 0) + contribution.points,
        totalContributions: (user.totalContributions || 0) + 1,
        lastActivity: new Date()
      };
      this.users.set(user.id, updatedUser);
      this.updateRankings();
    }
    
    return contribution;
  }

  private updateRankings() {
    const sortedUsers = Array.from(this.users.values())
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    
    sortedUsers.forEach((user, index) => {
      const updatedUser = { ...user, rank: index + 1 };
      this.users.set(user.id, updatedUser);
    });
  }

  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values())
      .filter(contribution => contribution.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getContributionByUrl(url: string): Promise<Contribution | undefined> {
    return Array.from(this.contributions.values()).find(
      contribution => contribution.url === url
    );
  }

  async getAllContributions(): Promise<Contribution[]> {
    return Array.from(this.contributions.values());
  }

  async getDashboardStats(userId?: number): Promise<DashboardStats> {
    const allContributions = Array.from(this.contributions.values());
    const totalContributions = allContributions.length;
    
    let userContributions = 0;
    let userRank = 0;
    let totalPoints = 0;
    
    if (userId) {
      const user = this.users.get(userId);
      if (user) {
        userContributions = user.totalContributions || 0;
        userRank = user.rank || 0;
        totalPoints = user.totalPoints || 0;
      }
    }
    
    return {
      totalContributions: totalContributions + 1247, // Add base number for realistic stats
      userContributions,
      userRank,
      totalPoints,
      weeklyGrowth: 12
    };
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, limit)
      .map(user => ({
        rank: user.rank || 0,
        walletAddress: user.walletAddress,
        totalPoints: user.totalPoints || 0,
        totalContributions: user.totalContributions || 0,
        lastActivity: user.lastActivity.toISOString()
      }));
  }

  async getRecentActivity(userId?: number, limit: number = 10): Promise<ContributionActivity[]> {
    let contributions = Array.from(this.contributions.values());
    
    if (userId) {
      contributions = contributions.filter(c => c.userId === userId);
    }
    
    return contributions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(contribution => ({
        id: contribution.id,
        type: contribution.type,
        description: this.getActivityDescription(contribution),
        points: contribution.points,
        createdAt: contribution.createdAt.toISOString(),
        status: contribution.status || 'approved'
      }));
  }

  private getActivityDescription(contribution: Contribution): string {
    const typeMap = {
      twitter: 'Posted about Qubic on Twitter',
      github: 'Committed to Qubic repository',
      discord: 'Active discussion in Discord',
      medium: 'Published article on Medium'
    };
    return typeMap[contribution.type as keyof typeof typeMap] || 'Made a contribution';
  }
}

export const storage = new MemStorage();
