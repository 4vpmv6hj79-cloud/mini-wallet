"use client";

import { useState, useEffect, useCallback } from "react";
import { getWalletData } from "@/services/api";
import { Wallet, Transaction, AsyncState } from "@/types";

// ============================================
// useWalletData Hook
// Fetches wallet balance and transactions.
// Encapsulates loading, error, and retry logic.
// ============================================

interface WalletData {
  wallet: Wallet;
  transactions: Transaction[];
}

interface UseWalletDataReturn {
  state: AsyncState<WalletData>;
  refetch: () => void;
}

export function useWalletData(): UseWalletDataReturn {
  const [state, setState] = useState<AsyncState<WalletData>>({
    status: "idle",
  });

  const fetchData = useCallback(async () => {
    setState({ status: "loading" });

    const result = await getWalletData();

    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", error: result.error });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { state, refetch: fetchData };
}
