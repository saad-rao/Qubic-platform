export interface DashboardStats {
  totalContributions: number;
  userContributions: number;
  userRank: number;
  totalPoints: number;
  weeklyGrowth: number;
}

export interface ContributionActivity {
  id: string;
  type: 'twitter' | 'github' | 'discord' | 'medium';
  description: string;
  points: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  walletAddress: string;
  username?: string;
  totalPoints: number;
  totalContributions: number;
  rank: number;
}

export interface User {
  id: number;
  walletAddress: string;
  username?: string;
  role: 'visitor' | 'ambassador';
  totalPoints: number;
  totalContributions: number;
  rank: number;
  isConnected: boolean;
  isApproved: boolean;
  createdAt?: Date;
  lastActivity?: Date;
} 