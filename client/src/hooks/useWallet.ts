import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { generateMockWalletAddress } from '@/lib/utils';
import type { User } from '@shared/schema';

interface WalletState {
  user: User | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    user: null,
    isConnected: false,
    isConnecting: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest('POST', '/api/wallet/connect', { walletAddress });
      return response.json();
    },
    onSuccess: (data) => {
      setWalletState({
        user: data.user,
        isConnected: true,
        isConnecting: false
      });
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Qubic wallet!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error: Error) => {
      setWalletState(prev => ({ ...prev, isConnecting: false }));
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest('POST', '/api/wallet/disconnect', { walletAddress });
      return response.json();
    },
    onSuccess: () => {
      setWalletState({
        user: null,
        isConnected: false,
        isConnecting: false
      });
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from your wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Disconnect Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const connect = useCallback(() => {
    if (walletState.isConnecting) return;

    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    // Simulate QubicJ wallet connection
    // In a real implementation, this would integrate with the actual QubicJ library
    toast({
      title: "Connecting...",
      description: "Please approve the connection in your Qubic wallet.",
    });

    setTimeout(() => {
      const mockWalletAddress = generateMockWalletAddress();
      connectMutation.mutate(mockWalletAddress);
    }, 1500);
  }, [walletState.isConnecting, connectMutation, toast]);

  const disconnect = useCallback(() => {
    if (!walletState.user) return;
    disconnectMutation.mutate(walletState.user.walletAddress);
  }, [walletState.user, disconnectMutation]);

  return {
    user: walletState.user,
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting,
    connect,
    disconnect
  };
}
