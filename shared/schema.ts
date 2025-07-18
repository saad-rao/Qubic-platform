import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  role: text("role").default('visitor'), // 'visitor', 'ambassador'
  totalPoints: integer("total_points").default(0),
  totalContributions: integer("total_contributions").default(0),
  rank: integer("rank").default(0),
  isConnected: boolean("is_connected").default(false),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow()
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'twitter', 'github', 'discord', 'medium'
  url: text("url").notNull().unique(),
  description: text("description"),
  points: integer("points").notNull(),
  status: text("status").default('pending'), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
  validatedAt: timestamp("validated_at")
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActivity: true
});

export const insertContributionSchema = createInsertSchema(contributions).omit({
  id: true,
  createdAt: true,
  validatedAt: true,
  status: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Contribution = typeof contributions.$inferSelect;

// API Response types
export type DashboardStats = {
  totalContributions: number;
  userContributions: number;
  userRank: number;
  totalPoints: number;
  weeklyGrowth: number;
};

export type LeaderboardEntry = {
  rank: number;
  walletAddress: string;
  totalPoints: number;
  totalContributions: number;
  lastActivity: string;
};

export type ContributionActivity = {
  id: number;
  type: string;
  description: string;
  points: number;
  createdAt: string;
  status: string;
};
