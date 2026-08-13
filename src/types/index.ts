// ============================================
// Domain Models - Mini Wallet
// ============================================

/** User session information */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/** Wallet balance and metadata */
export interface Wallet {
  balance: number;
  currency: string;
  lastUpdated: string;
}

/** Transaction status */
export type TransactionStatus = "completed" | "pending" | "failed";

/** Transaction type */
export type TransactionType = "sent" | "received";

/** A single transaction record */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  recipient: string;
  date: string;
  status: TransactionStatus;
}

/** Contact for sending money */
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isFavorite: boolean;
}

/** New transaction request payload */
export interface TransactionRequest {
  amount: number;
  recipientId: string;
  recipientName: string;
  description?: string;
}

/** Possible confirmation outcomes (simulated randomly) */
export type ConfirmationResult =
  | { status: "success"; transactionId: string; date: string }
  | { status: "network_error"; message: string }
  | { status: "insufficient_funds"; message: string }
  | { status: "timeout"; message: string }
  | { status: "unknown_error"; message: string };

// ============================================
// API Response wrappers
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================
// Form schemas
// ============================================

export interface LoginFormData {
  identifier: string; // phone or email
}

export interface TransactionFormData {
  amount: number;
  recipientId: string;
  recipientName: string;
  description?: string;
}

// ============================================
// UI State types
// ============================================

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
