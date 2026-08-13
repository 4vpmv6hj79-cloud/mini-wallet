import { NextRequest, NextResponse } from "next/server";
import { transactionSchema } from "@/lib/validations";
import { validateSufficientBalance } from "@/lib/validations";
import { MOCK_WALLET } from "@/lib/mock-data";
import { ConfirmationResult } from "@/types";

/**
 * POST /api/transactions
 * Processes a new transaction with random outcome simulation.
 * Validates business rules server-side before processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side schema validation
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0].message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { amount } = parsed.data;

    // Business rule: validate sufficient balance (server-side)
    const balanceCheck = validateSufficientBalance(amount, MOCK_WALLET.balance);
    if (!balanceCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: balanceCheck.error,
          code: "INSUFFICIENT_FUNDS",
        },
        { status: 422 }
      );
    }

    // Simulate network latency (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Generate random outcome
    const result = generateRandomOutcome(parsed.data.recipientName);

    if (result.status === "success") {
      return NextResponse.json({ success: true, data: result });
    }

    // Map error status to HTTP codes
    const statusMap: Record<string, number> = {
      network_error: 503,
      insufficient_funds: 422,
      timeout: 504,
      unknown_error: 500,
    };

    return NextResponse.json(
      { success: false, error: result.message, code: result.status },
      { status: statusMap[result.status] || 500 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * Generates a random transaction outcome to simulate
 * real-world scenarios (success, network error, timeout, etc.)
 */
function generateRandomOutcome(recipientName: string): ConfirmationResult {
  const random = Math.random();

  // 60% success
  if (random < 0.6) {
    return {
      status: "success",
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
    };
  }

  // 15% network error
  if (random < 0.75) {
    return {
      status: "network_error",
      message: "Error de conexión. Verifica tu red e intenta de nuevo.",
    };
  }

  // 10% insufficient funds
  if (random < 0.85) {
    return {
      status: "insufficient_funds",
      message: `No se pudo completar la transferencia a ${recipientName}. Fondos insuficientes.`,
    };
  }

  // 10% timeout
  if (random < 0.95) {
    return {
      status: "timeout",
      message: "La operación tardó demasiado. Intenta de nuevo en unos momentos.",
    };
  }

  // 5% unknown error
  return {
    status: "unknown_error",
    message: "Ocurrió un error inesperado. Contacta a soporte si el problema persiste.",
  };
}
