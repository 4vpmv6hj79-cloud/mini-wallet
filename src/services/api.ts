import {
  ApiResult,
  Contact,
  ConfirmationResult,
  Transaction,
  TransactionRequest,
  User,
  Wallet,
} from "@/types";

// ============================================
// API Service Layer
// Abstracts HTTP calls to API routes.
// All methods return typed ApiResult<T> for 
// consistent error handling across the app.
// ============================================

const BASE_URL = "/api";

/**
 * Generic fetch wrapper with error handling.
 * Centralizes response parsing and network error management.
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Error desconocido",
        code: data.code || "UNKNOWN_ERROR",
      };
    }

    return { success: true, data: data.data as T };
  } catch (error) {
    // Network errors (offline, DNS failure, etc.)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error de conexión. Verifica tu red.",
      code: "NETWORK_ERROR",
    };
  }
}

// ============================================
// Auth Service
// ============================================

interface AuthResponse {
  user: User;
  token: string;
}

export async function login(identifier: string): Promise<ApiResult<AuthResponse>> {
  return fetchApi<AuthResponse>("/auth", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

// ============================================
// Wallet Service
// ============================================

interface WalletResponse {
  wallet: Wallet;
  transactions: Transaction[];
}

export async function getWalletData(): Promise<ApiResult<WalletResponse>> {
  return fetchApi<WalletResponse>("/wallet");
}

// ============================================
// Transactions Service
// ============================================

export async function createTransaction(
  data: TransactionRequest
): Promise<ApiResult<ConfirmationResult>> {
  return fetchApi<ConfirmationResult>("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ============================================
// Contacts Service
// ============================================

export async function getContacts(): Promise<ApiResult<Contact[]>> {
  return fetchApi<Contact[]>("/contacts");
}

export async function addContact(contact: {
  name: string;
  phone: string;
  email?: string;
}): Promise<ApiResult<Contact>> {
  return fetchApi<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}
