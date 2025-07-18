import axios from 'axios';

interface XPost {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    impression_count: number;
  };
}

interface XUser {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export class XApiService {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor() {
    // In production, this would come from environment variables
    this.bearerToken = process.env.X_BEARER_TOKEN || 'mock_bearer_token';
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    try {
      // For demo purposes, return mock data if no real token
      if (this.bearerToken === 'mock_bearer_token') {
        return this.getMockData(endpoint, params);
      }

      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        },
        params
      });

      return response.data;
    } catch (error) {
      console.error(`X API Error for ${endpoint}:`, error);
      // Return mock data on error for demo continuity
      return this.getMockData(endpoint, params);
    }
  }

  private getMockData(endpoint: string, params: any) {
    if (endpoint.includes('/tweets/search/recent')) {
      return {
        data: [
          {
            id: '1234567890123456789',
            text: 'Excited about the #QubicAmbassador program! The Qearn dApp is revolutionary 🚀 #Qubic',
            author_id: '987654321',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            public_metrics: {
              retweet_count: 45,
              like_count: 189,
              reply_count: 23,
              quote_count: 12,
              impression_count: 8750
            }
          },
          {
            id: '1234567890123456790',
            text: 'Just staked my $QUBIC tokens! The community is growing strong 💪 #QubicAmbassador',
            author_id: '987654322',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            public_metrics: {
              retweet_count: 32,
              like_count: 156,
              reply_count: 18,
              quote_count: 8,
              impression_count: 6420
            }
          }
        ],
        meta: {
          result_count: 2,
          newest_id: '1234567890123456789',
          oldest_id: '1234567890123456790'
        }
      };
    }

    if (endpoint.includes('/users/by/username')) {
      return {
        data: {
          id: '987654321',
          username: 'qubic_ambassador',
          name: 'Qubic Ambassador',
          verified: false,
          public_metrics: {
            followers_count: 2150,
            following_count: 450,
            tweet_count: 890
          }
        }
      };
    }

    return { data: [], meta: { result_count: 0 } };
  }

  async searchQubicPosts(hashtag: string = '#QubicAmbassador', maxResults: number = 100): Promise<XPost[]> {
    const params = {
      query: `${hashtag} -is:retweet`,
      'tweet.fields': 'author_id,created_at,public_metrics',
      'user.fields': 'username,verified,public_metrics',
      max_results: Math.min(maxResults, 100),
      expansions: 'author_id'
    };

    const response = await this.makeRequest('/tweets/search/recent', params);
    return response.data || [];
  }

  async getUserByUsername(username: string): Promise<XUser | null> {
    const response = await this.makeRequest(`/users/by/username/${username}`, {
      'user.fields': 'verified,public_metrics'
    });
    
    return response.data || null;
  }

  async verifyPostByUrl(url: string): Promise<XPost | null> {
    try {
      // Extract tweet ID from URL
      const tweetIdMatch = url.match(/status\/(\d+)/);
      if (!tweetIdMatch) return null;

      const tweetId = tweetIdMatch[1];
      
      const response = await this.makeRequest(`/tweets/${tweetId}`, {
        'tweet.fields': 'author_id,created_at,public_metrics',
        'user.fields': 'username,verified'
      });

      return response.data || null;
    } catch (error) {
      console.error('Failed to verify post:', error);
      return null;
    }
  }

  async getEngagementMetrics(posts: XPost[]) {
    const totalImpressions = posts.reduce((sum, post) => sum + (post.public_metrics?.impression_count || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.public_metrics?.like_count || 0), 0);
    const totalRetweets = posts.reduce((sum, post) => sum + (post.public_metrics?.retweet_count || 0), 0);
    const totalReplies = posts.reduce((sum, post) => sum + (post.public_metrics?.reply_count || 0), 0);

    return {
      totalPosts: posts.length,
      totalImpressions,
      totalLikes,
      totalRetweets,
      totalReplies,
      avgEngagement: posts.length > 0 ? (totalLikes + totalRetweets + totalReplies) / posts.length : 0
    };
  }
}

export const xApiService = new XApiService();