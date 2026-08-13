import { create } from "zustand";
import { ConfirmationResult } from "@/types";

// ============================================
// Transaction Store (Zustand)
// Manages the state of the current transaction flow.
// No persistence needed — resets on each new transaction.
// ============================================

interface TransactionState {
  // Transaction form data
  amount: number;
  recipientId: string;
  recipientName: string;
  description: string;

  // Flow state
  step: "form" | "summary" | "processing" | "result";
  result: ConfirmationResult | null;

  // Actions
  setAmount: (amount: number) => void;
  setRecipient: (id: string, name: string) => void;
  setDescription: (description: string) => void;
  setStep: (step: TransactionState["step"]) => void;
  setResult: (result: ConfirmationResult) => void;
  reset: () => void;
}

const initialState = {
  amount: 0,
  recipientId: "",
  recipientName: "",
  description: "",
  step: "form" as const,
  result: null,
};

export const useTransactionStore = create<TransactionState>()((set) => ({
  ...initialState,

  setAmount: (amount) => set({ amount }),

  setRecipient: (id, name) =>
    set({ recipientId: id, recipientName: name }),

  setDescription: (description) => set({ description }),

  setStep: (step) => set({ step }),

  setResult: (result) => set({ result }),

  reset: () => set(initialState),
}));
