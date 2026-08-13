import { NextResponse } from "next/server";
import { MOCK_WALLET, MOCK_TRANSACTIONS } from "@/lib/mock-data";

/**
 * GET /api/wallet
 * Returns wallet balance and recent transactions.
 * Simulates async data fetching with artificial delay.
 */
export async function GET() {
  try {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random error (5% chance)
    if (Math.random() < 0.05) {
      return NextResponse.json(
        {
          success: false,
          error: "No se pudo obtener la información de la wallet",
          code: "FETCH_ERROR",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        wallet: MOCK_WALLET,
        transactions: MOCK_TRANSACTIONS,
      },
    });
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
