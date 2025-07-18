import React, { useState, useCallback, useContext, createContext } from 'react';
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

interface WalletContextType extends WalletState {
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
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
      queryClient.invalidateQueries({ queryKey: ['/api/VisitorView'] });
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

  const value: WalletContextType = {
    ...walletState,
    connect,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
