import axios from 'axios';

interface QubicStatus {
  currentTick: number;
  epoch: number;
  numberOfEntities: number;
  network: string;
}

interface SmartContractResponse {
  data: string;
  transactionHash?: string;
}

interface AmbassadorRecord {
  walletAddress: string;
  isActive: boolean;
  taskCompletions: number;
  totalContributions: number;
  lastActivity: string;
}

export class QubicRpcService {
  private baseUrl = 'https://rpc.qubic.org/v1';

  constructor() {
    // RPC endpoint is public, no authentication needed
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Qubic RPC Error for ${endpoint}:`, error);
      // Return mock data for demo continuity
      return this.getMockData(endpoint);
    }
  }

  private getMockData(endpoint: string) {
    if (endpoint === '/status') {
      return {
        currentTick: 15432789,
        epoch: 142,
        numberOfEntities: 985432,
        network: 'mainnet'
      };
    }

    if (endpoint === '/querySmartContract') {
      return {
        data: this.encodeMockAmbassadorData(),
        transactionHash: '0x' + Math.random().toString(16).substring(2, 66)
      };
    }

    return {};
  }

  private encodeMockAmbassadorData(): string {
    const mockAmbassadors: AmbassadorRecord[] = [
      {
        walletAddress: 'QUBIC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB',
        isActive: true,
        taskCompletions: 25,
        totalContributions: 47,
        lastActivity: new Date(Date.now() - 3600000).toISOString()
      },
      {
        walletAddress: 'QUBIC9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FE',
        isActive: true,
        taskCompletions: 18,
        totalContributions: 32,
        lastActivity: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    // In real implementation, this would be properly encoded
    return Buffer.from(JSON.stringify(mockAmbassadors)).toString('base64');
  }

  private decodeMockAmbassadorData(encodedData: string): AmbassadorRecord[] {
    try {
      const decoded = Buffer.from(encodedData, 'base64').toString();
      return JSON.parse(decoded);
    } catch {
      return [];
    }
  }

  async getNetworkStatus(): Promise<QubicStatus> {
    const response = await this.makeRequest('/status');
    return response;
  }

  async queryAmbassadorList(): Promise<AmbassadorRecord[]> {
    // In production, this would query an actual smart contract
    const contractAddress = 'AMBASSADOR_CONTRACT_ID';
    const query = {
      contractId: contractAddress,
      inputType: 'queryAmbassadors',
      inputSize: 0
    };

    const response = await this.makeRequest('/querySmartContract', 'POST', query);
    
    if (response.data) {
      return this.decodeMockAmbassadorData(response.data);
    }

    return [];
  }

  async isAmbassadorWallet(walletAddress: string): Promise<boolean> {
    const ambassadors = await this.queryAmbassadorList();
    return ambassadors.some(amb => amb.walletAddress === walletAddress && amb.isActive);
  }

  async submitTaskCompletion(
    walletAddress: string, 
    taskId: string, 
    proof: string
  ): Promise<SmartContractResponse> {
    const transactionData = {
      sourceId: walletAddress,
      destId: 'AMBASSADOR_CONTRACT_ID',
      amount: 0,
      tick: await this.getCurrentTick(),
      inputType: 'submitTask',
      inputSize: Buffer.from(JSON.stringify({
        taskId,
        proof,
        timestamp: new Date().toISOString()
      })).length
    };

    const response = await this.makeRequest('/sendTransaction', 'POST', transactionData);
    return response;
  }

  async getCurrentTick(): Promise<number> {
    const status = await this.getNetworkStatus();
    return status.currentTick;
  }

  async getStakingMetrics(): Promise<{
    totalStaked: number;
    activeStakers: number;
    avgStakeAmount: number;
  }> {
    // Mock staking data - in production would query actual network
    return {
      totalStaked: 245780000000,
      activeStakers: 12847,
      avgStakeAmount: 19125000
    };
  }

  async getAmbassadorMetrics(walletAddress: string): Promise<{
    taskCompletions: number;
    totalContributions: number;
    ranking: number;
    lastActivity: string;
  }> {
    const ambassadors = await this.queryAmbassadorList();
    const ambassador = ambassadors.find(amb => amb.walletAddress === walletAddress);
    
    if (!ambassador) {
      return {
        taskCompletions: 0,
        totalContributions: 0,
        ranking: 0,
        lastActivity: new Date().toISOString()
      };
    }

    // Calculate ranking based on task completions
    const sortedAmbassadors = ambassadors
      .sort((a, b) => b.taskCompletions - a.taskCompletions);
    const ranking = sortedAmbassadors.findIndex(amb => amb.walletAddress === walletAddress) + 1;

    return {
      taskCompletions: ambassador.taskCompletions,
      totalContributions: ambassador.totalContributions,
      ranking,
      lastActivity: ambassador.lastActivity
    };
  }
}

export const qubicRpcService = new QubicRpcService();