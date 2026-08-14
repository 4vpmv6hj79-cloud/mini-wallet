"use client";

import { useRouter } from "next/navigation";
import { useTransactionStore } from "@/store/transaction-store";
import { Button, Card } from "@/components/ui";
import { useEffect } from "react";

/**
 * Transaction Receipt Page
 * 
 * Displays confirmation details after a successful transaction.
 * Shows transaction ID, date, amount, and recipient.
 * 
 * Rendering: CSR — Reads data from transaction store.
 */
export default function ReceiptPage() {
  const router = useRouter();
  const store = useTransactionStore();

  useEffect(() => {
    // If no successful result, redirect to home
    if (!store.result || store.result.status !== "success") {
      router.replace("/home");
    }
  }, [store.result, router]);

  if (!store.result || store.result.status !== "success") {
    return null;
  }

  const { transactionId, date } = store.result;

  const formattedDate = new Date(date).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="page-container justify-center">
      <div className="content-wrapper">
        <Card>
          {/* Receipt header */}
          <div className="text-center mb-6 pb-6 border-b border-dashed border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Comprobante</h1>
            <p className="text-xs text-gray-500">Transacción completada</p>
          </div>

          {/* Receipt details */}
          <div className="space-y-4">
            <ReceiptRow label="ID de transacción" value={transactionId} mono />
            <ReceiptRow label="Fecha" value={formattedDate} />
            <ReceiptRow label="Destinatario" value={store.recipientName} />
            <ReceiptRow
              label="Monto"
              value={`$${store.amount.toFixed(2)} MXN`}
              highlight
            />
            {store.description && (
              <ReceiptRow label="Descripción" value={store.description} />
            )}
            <ReceiptRow label="Estado" value="Completada" status="success" />
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              fullWidth
              onClick={() => {
                store.reset();
                router.push("/home");
              }}
            >
              Volver al inicio
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                store.reset();
                router.push("/transaction/new");
              }}
            >
              Nueva transacción
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// Receipt Row Component (local)
// ============================================

interface ReceiptRowProps {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  status?: "success" | "pending" | "failed";
}

function ReceiptRow({ label, value, mono, highlight, status }: ReceiptRowProps) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={`text-sm text-right max-w-[60%] break-all ${
          mono ? "font-mono text-xs" : ""
        } ${highlight ? "font-bold text-gray-900 text-base" : "font-medium text-gray-900"} ${
          status === "success" ? "text-green-600" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
