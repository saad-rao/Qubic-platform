import { createClient } from '@supabase/supabase-js';

interface SupabaseAmbassador {
  wallet_address: string;
  is_ambassador: boolean;
  username: string;
  tasks: any[];
  contributions: any[];
  ranking: number;
  total_points: number;
  x_metrics: {
    total_posts: number;
    total_impressions: number;
    total_likes: number;
    total_retweets: number;
    last_sync: string;
  };
  qubic_metrics: {
    task_completions: number;
    on_chain_contributions: number;
    staking_amount: number;
    last_activity: string;
  };
  created_at: string;
  updated_at: string;
}

interface AnalyticsData {
  date: string;
  total_posts: number;
  total_impressions: number;
  total_ambassadors: number;
  avg_engagement: number;
}

export class SupabaseService {
  private supabase;
  private isConnected = false;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'mock_url';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock_key';
    
    if (supabaseUrl === 'mock_url' || supabaseKey === 'mock_key') {
      console.log('Using mock Supabase service for development');
      this.isConnected = false;
    } else {
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.isConnected = true;
    }
  }

  private getMockAmbassadors(): SupabaseAmbassador[] {
    return [
      {
        wallet_address: 'QUBIC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB',
        is_ambassador: true,
        username: 'QubiCrypto_Lead',
        tasks: [
          {
            id: 1,
            title: 'Post about Qearn dApp',
            status: 'completed',
            submitted_at: '2025-01-05T10:30:00Z',
            x_url: 'https://twitter.com/user/status/1234567890',
            impressions: 8750
          }
        ],
        contributions: [
          {
            type: 'twitter',
            url: 'https://twitter.com/user/status/1234567890',
            engagement: 8750,
            date: '2025-01-05'
          }
        ],
        ranking: 1,
        total_points: 450,
        x_metrics: {
          total_posts: 25,
          total_impressions: 125000,
          total_likes: 3200,
          total_retweets: 890,
          last_sync: new Date().toISOString()
        },
        qubic_metrics: {
          task_completions: 18,
          on_chain_contributions: 32,
          staking_amount: 1000000,
          last_activity: new Date(Date.now() - 3600000).toISOString()
        },
        created_at: '2024-12-01T00:00:00Z',
        updated_at: new Date().toISOString()
      },
      {
        wallet_address: 'QUBIC9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FE',
        is_ambassador: true,
        username: 'QubicStaker_Pro',
        tasks: [
          {
            id: 2,
            title: 'Host community event',
            status: 'completed',
            submitted_at: '2025-01-04T15:45:00Z',
            proof: 'Event hosted with 50+ attendees',
            engagement: 6420
          }
        ],
        contributions: [
          {
            type: 'event',
            description: 'Community meetup in Discord',
            attendees: 52,
            date: '2025-01-04'
          }
        ],
        ranking: 2,
        total_points: 380,
        x_metrics: {
          total_posts: 18,
          total_impressions: 95000,
          total_likes: 2100,
          total_retweets: 560,
          last_sync: new Date().toISOString()
        },
        qubic_metrics: {
          task_completions: 15,
          on_chain_contributions: 28,
          staking_amount: 750000,
          last_activity: new Date(Date.now() - 7200000).toISOString()
        },
        created_at: '2024-12-01T00:00:00Z',
        updated_at: new Date().toISOString()
      }
    ];
  }

  private getMockAnalytics(): AnalyticsData[] {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        total_posts: 12 + Math.floor(Math.random() * 8),
        total_impressions: 50000 + Math.floor(Math.random() * 30000),
        total_ambassadors: 45 + Math.floor(Math.random() * 10),
        avg_engagement: 150 + Math.floor(Math.random() * 100)
      };
    });
    return last7Days.reverse();
  }

  async getAmbassadors(): Promise<SupabaseAmbassador[]> {
    if (!this.isConnected || !this.supabase) {
      return this.getMockAmbassadors();
    }

    try {
      const { data, error } = await this.supabase
        .from('ambassadors')
        .select('*')
        .eq('is_ambassador', true)
        .order('total_points', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase error:', error);
      return this.getMockAmbassadors();
    }
  }

  async getAmbassadorByWallet(walletAddress: string): Promise<SupabaseAmbassador | null> {
    if (!this.isConnected || !this.supabase) {
      const ambassadors = this.getMockAmbassadors();
      return ambassadors.find(amb => amb.wallet_address === walletAddress) || null;
    }

    try {
      const { data, error } = await this.supabase
        .from('ambassadors')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error:', error);
      return null;
    }
  }

  async upsertAmbassador(ambassador: Partial<SupabaseAmbassador>): Promise<SupabaseAmbassador | null> {
    if (!this.isConnected || !this.supabase) {
      console.log('Mock upsert ambassador:', ambassador.wallet_address);
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('ambassadors')
        .upsert(ambassador)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase error:', error);
      return null;
    }
  }

  async updateAmbassadorMetrics(
    walletAddress: string, 
    xMetrics: any, 
    qubicMetrics: any
  ): Promise<boolean> {
    if (!this.isConnected || !this.supabase) {
      console.log('Mock update metrics for:', walletAddress);
      return true;
    }

    try {
      const { error } = await this.supabase
        .from('ambassadors')
        .update({
          x_metrics: xMetrics,
          qubic_metrics: qubicMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase error:', error);
      return false;
    }
  }

  async getAnalyticsData(days: number = 7): Promise<AnalyticsData[]> {
    if (!this.isConnected || !this.supabase) {
      return this.getMockAnalytics();
    }

    try {
      const { data, error } = await this.supabase
        .from('analytics_daily')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase error:', error);
      return this.getMockAnalytics();
    }
  }

  async getLeaderboardData(): Promise<{
    rank: number;
    wallet_address: string;
    username: string;
    total_points: number;
    total_contributions: number;
    x_impressions: number;
  }[]> {
    if (!this.isConnected || !this.supabase) {
      const ambassadors = this.getMockAmbassadors();
      return ambassadors.map((amb, index) => ({
        rank: index + 1,
        wallet_address: amb.wallet_address,
        username: amb.username,
        total_points: amb.total_points,
        total_contributions: amb.contributions.length,
        x_impressions: amb.x_metrics.total_impressions
      }));
    }

    try {
      const { data, error } = await this.supabase
        .from('ambassadors')
        .select('wallet_address, username, total_points, contributions, x_metrics')
        .eq('is_ambassador', true)
        .order('total_points', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((amb, index) => ({
        rank: index + 1,
        wallet_address: amb.wallet_address,
        username: amb.username,
        total_points: amb.total_points,
        total_contributions: amb.contributions?.length || 0,
        x_impressions: amb.x_metrics?.total_impressions || 0
      }));
    } catch (error) {
      console.error('Supabase error:', error);
      return [];
    }
  }

  async subscribeToChanges(table: string, callback: (payload: any) => void) {
    if (!this.isConnected || !this.supabase) {
      console.log('Mock subscription to', table);
      return null;
    }

    return this.supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  }
}

export const supabaseService = new SupabaseService();