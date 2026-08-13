import { NextRequest, NextResponse } from "next/server";
import { MOCK_USER, VALID_CREDENTIALS } from "@/lib/mock-data";
import { loginSchema } from "@/lib/validations";

/**
 * POST /api/auth
 * Simulates authentication with mocked credentials.
 * Validates input server-side before processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation (defense in depth)
    const parsed = loginSchema.safeParse(body);
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

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      return NextResponse.json(
        {
          success: false,
          error: "Error de conexión. Intenta de nuevo.",
          code: "NETWORK_ERROR",
        },
        { status: 503 }
      );
    }

    const { identifier } = parsed.data;

    // Check against valid mock credentials
    const isValid = VALID_CREDENTIALS.some(
      (cred) => cred.toLowerCase() === identifier.toLowerCase()
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales inválidas. Usa: erik@example.com o 5512345678",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    // Return user session data
    return NextResponse.json({
      success: true,
      data: {
        user: MOCK_USER,
        token: "mock_session_token_" + Date.now(),
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
