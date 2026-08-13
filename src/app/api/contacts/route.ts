import { NextRequest, NextResponse } from "next/server";
import { MOCK_CONTACTS } from "@/lib/mock-data";
import { Contact } from "@/types";

// In-memory store for added contacts (resets on server restart)
let contacts: Contact[] = [...MOCK_CONTACTS];

/**
 * GET /api/contacts
 * Returns list of contacts, with favorites first.
 */
export async function GET() {
  try {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Sort: favorites first
    const sorted = [...contacts].sort(
      (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
    );

    return NextResponse.json({
      success: true,
      data: sorted,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener contactos",
        code: "FETCH_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contacts
 * Adds a new contact to the list (mocked persistence).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Nombre y teléfono son requeridos",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const newContact: Contact = {
      id: `cnt_${Date.now()}`,
      name: body.name,
      phone: body.phone,
      email: body.email || undefined,
      isFavorite: false,
    };

    contacts = [...contacts, newContact];

    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: newContact,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear contacto",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
