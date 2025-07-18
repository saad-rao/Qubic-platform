import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isConnected: boolean;
  isConnecting: boolean;
  isAmbassador: boolean;
}

interface QubicConnectResponse {
  publicKey: string;
  signature: string;
  address: string;
}

export function useQubicAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isConnected: false,
    isConnecting: false,
    isAmbassador: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize Qubic Connect
  const initializeQubicConnect = async () => {
    try {
      // Check if qubic-connect is available
      if (typeof window !== 'undefined' && (window as any).qubicConnect) {
        return (window as any).qubicConnect;
      }
      
      // For development, simulate qubic-connect
      return {
        connect: async (): Promise<QubicConnectResponse> => {
          // Simulate connection delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Generate realistic Qubic address format
          const addresses = [
            'QUBIC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890AB',
            'QUBIC9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FE',
            'QUBICABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890'
          ];
          
          const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
          
          return {
            publicKey: randomAddress,
            signature: 'mock_signature_' + Date.now(),
            address: randomAddress
          };
        },
        disconnect: async () => {
          // Simulate disconnect
          return true;
        }
      };
    } catch (error) {
      console.error('Failed to initialize Qubic Connect:', error);
      throw error;
    }
  };

  // Connect wallet mutation
  const connectMutation = useMutation({
    mutationFn: async (authData: QubicConnectResponse) => {
      const response = await fetch('/api/auth/qubic-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: authData.address,
          publicKey: authData.publicKey,
          signature: authData.signature
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        isConnected: true,
        isConnecting: false,
        isAmbassador: data.user.role === 'ambassador' && data.user.isApproved
      });
      
      // Store auth state in localStorage
      localStorage.setItem('qubic_auth', JSON.stringify(data.user));
      
      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();
      
      toast({
        title: "Connected Successfully",
        description: `Welcome ${data.user.role === 'ambassador' ? 'Ambassador' : 'Visitor'} ${data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      setAuthState(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/disconnect', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Disconnect failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setAuthState({
        user: null,
        isConnected: false,
        isConnecting: false,
        isAmbassador: false
      });
      
      // Clear auth state from localStorage
      localStorage.removeItem('qubic_auth');
      
      // Clear all queries
      queryClient.clear();
      
      toast({
        title: "Disconnected",
        description: "You have been disconnected from your Qubic wallet.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Connect function
  const connect = async () => {
    try {
      setAuthState(prev => ({ ...prev, isConnecting: true }));
      
      const qubicConnect = await initializeQubicConnect();
      const authData = await qubicConnect.connect();
      
      connectMutation.mutate(authData);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  // Disconnect function
  const disconnect = async () => {
    try {
      const qubicConnect = await initializeQubicConnect();
      await qubicConnect.disconnect();
      disconnectMutation.mutate();
    } catch (error) {
      toast({
        title: "Disconnect Error",
        description: error instanceof Error ? error.message : "Failed to disconnect wallet",
        variant: "destructive"
      });
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('qubic_auth');
    if (storedAuth) {
      try {
        const user = JSON.parse(storedAuth);
        setAuthState({
          user,
          isConnected: true,
          isConnecting: false,
          isAmbassador: user.role === 'ambassador' && user.isApproved
        });
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('qubic_auth');
      }
    }
  }, []);

  return {
    ...authState,
    connect,
    disconnect,
    isConnecting: authState.isConnecting || connectMutation.isPending || disconnectMutation.isPending
  };
}