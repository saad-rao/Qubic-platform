import cron from 'node-cron';
import { xApiService } from './xApiService';
import { qubicRpcService } from './qubicRpcService';
import { supabaseService } from './supabaseService';

export class DataSyncService {
  private isRunning = false;

  async startSync() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Starting real-time data sync service...');

    // Sync every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.syncXMetrics();
    });

    // Sync Qubic data every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      await this.syncQubicMetrics();
    });

    // Daily analytics aggregation at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.aggregateDailyAnalytics();
    });

    // Initial sync
    await this.performInitialSync();
  }

  private async performInitialSync() {
    console.log('Performing initial data sync...');
    await Promise.all([
      this.syncXMetrics(),
      this.syncQubicMetrics(),
      this.updateAmbassadorRankings()
    ]);
  }

  private async syncXMetrics() {
    try {
      console.log('Syncing X API metrics...');
      
      const ambassadors = await supabaseService.getAmbassadors();
      const qubicPosts = await xApiService.searchQubicPosts('#QubicAmbassador', 100);
      
      for (const ambassador of ambassadors) {
        // Get ambassador's posts (in real implementation, would filter by their username)
        const ambassadorPosts = qubicPosts.filter(() => Math.random() > 0.7); // Mock filtering
        const metrics = await xApiService.getEngagementMetrics(ambassadorPosts);
        
        const xMetrics = {
          total_posts: metrics.totalPosts,
          total_impressions: metrics.totalImpressions,
          total_likes: metrics.totalLikes,
          total_retweets: metrics.totalRetweets,
          last_sync: new Date().toISOString()
        };

        await supabaseService.updateAmbassadorMetrics(
          ambassador.wallet_address,
          xMetrics,
          ambassador.qubic_metrics
        );
      }

      console.log(`Synced X metrics for ${ambassadors.length} ambassadors`);
    } catch (error) {
      console.error('Failed to sync X metrics:', error);
    }
  }

  private async syncQubicMetrics() {
    try {
      console.log('Syncing Qubic RPC metrics...');
      
      const ambassadors = await supabaseService.getAmbassadors();
      
      for (const ambassador of ambassadors) {
        const qubicMetrics = await qubicRpcService.getAmbassadorMetrics(ambassador.wallet_address);
        
        const metrics = {
          task_completions: qubicMetrics.taskCompletions,
          on_chain_contributions: qubicMetrics.totalContributions,
          staking_amount: Math.floor(Math.random() * 1000000), // Mock staking data
          last_activity: qubicMetrics.lastActivity
        };

        await supabaseService.updateAmbassadorMetrics(
          ambassador.wallet_address,
          ambassador.x_metrics,
          metrics
        );
      }

      console.log(`Synced Qubic metrics for ${ambassadors.length} ambassadors`);
    } catch (error) {
      console.error('Failed to sync Qubic metrics:', error);
    }
  }

  private async updateAmbassadorRankings() {
    try {
      console.log('Updating ambassador rankings...');
      
      const ambassadors = await supabaseService.getAmbassadors();
      
      // Calculate total score based on X engagement and Qubic contributions
      const rankedAmbassadors = ambassadors.map(amb => ({
        ...amb,
        totalScore: (amb.x_metrics?.total_impressions || 0) * 0.1 + 
                   (amb.qubic_metrics?.task_completions || 0) * 50 +
                   (amb.qubic_metrics?.on_chain_contributions || 0) * 25
      })).sort((a, b) => b.totalScore - a.totalScore);

      // Update rankings
      for (let i = 0; i < rankedAmbassadors.length; i++) {
        const ambassador = rankedAmbassadors[i];
        await supabaseService.upsertAmbassador({
          wallet_address: ambassador.wallet_address,
          ranking: i + 1,
          total_points: Math.floor(ambassador.totalScore)
        });
      }

      console.log('Updated rankings for all ambassadors');
    } catch (error) {
      console.error('Failed to update rankings:', error);
    }
  }

  private async aggregateDailyAnalytics() {
    try {
      console.log('Aggregating daily analytics...');
      
      const ambassadors = await supabaseService.getAmbassadors();
      const qubicPosts = await xApiService.searchQubicPosts('#QubicAmbassador', 500);
      const metrics = await xApiService.getEngagementMetrics(qubicPosts);
      
      const dailyData = {
        date: new Date().toISOString().split('T')[0],
        total_posts: metrics.totalPosts,
        total_impressions: metrics.totalImpressions,
        total_ambassadors: ambassadors.length,
        avg_engagement: metrics.avgEngagement
      };

      // In real implementation, would save to Supabase analytics table
      console.log('Daily analytics:', dailyData);
    } catch (error) {
      console.error('Failed to aggregate daily analytics:', error);
    }
  }

  async verifyTaskSubmission(walletAddress: string, taskId: string, postUrl: string): Promise<{
    verified: boolean;
    metrics?: any;
    error?: string;
  }> {
    try {
      // Verify the post exists and contains required hashtags
      const post = await xApiService.verifyPostByUrl(postUrl);
      
      if (!post) {
        return { verified: false, error: 'Post not found or invalid URL' };
      }

      // Check if post contains required hashtags
      const hasQubicTag = post.text.toLowerCase().includes('#qubic') || 
                         post.text.toLowerCase().includes('#qubicambassador');
      
      if (!hasQubicTag) {
        return { verified: false, error: 'Post must contain #Qubic or #QubicAmbassador hashtag' };
      }

      // Submit to Qubic blockchain
      const txResult = await qubicRpcService.submitTaskCompletion(
        walletAddress,
        taskId,
        postUrl
      );

      if (txResult.transactionHash) {
        return {
          verified: true,
          metrics: {
            impressions: post.public_metrics.impression_count,
            likes: post.public_metrics.like_count,
            retweets: post.public_metrics.retweet_count,
            transactionHash: txResult.transactionHash
          }
        };
      }

      return { verified: false, error: 'Failed to submit to blockchain' };
    } catch (error) {
      return { verified: false, error: error instanceof Error ? error.message : 'Verification failed' };
    }
  }

  async getRealtimeEngagementData(): Promise<{
    totalPosts: number;
    totalImpressions: number;
    trending: any[];
    recentActivity: any[];
  }> {
    const posts = await xApiService.searchQubicPosts('#QubicAmbassador', 100);
    const metrics = await xApiService.getEngagementMetrics(posts);
    
    return {
      totalPosts: metrics.totalPosts,
      totalImpressions: metrics.totalImpressions,
      trending: posts.slice(0, 5).map(post => ({
        text: post.text,
        impressions: post.public_metrics.impression_count,
        engagement: post.public_metrics.like_count + post.public_metrics.retweet_count
      })),
      recentActivity: posts.slice(0, 10).map(post => ({
        text: post.text.substring(0, 100) + '...',
        time: post.created_at,
        metrics: post.public_metrics
      }))
    };
  }

  stopSync() {
    this.isRunning = false;
    console.log('Data sync service stopped');
  }
}

export const dataSyncService = new DataSyncService();