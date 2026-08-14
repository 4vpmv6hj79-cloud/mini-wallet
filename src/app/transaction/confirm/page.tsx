"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransactionStore } from "@/store/transaction-store";
import { createTransaction } from "@/services/api";
import { Button, Card, LoadingSpinner } from "@/components/ui";
import { ConfirmationResult } from "@/types";

/**
 * Transaction Confirmation Page
 * 
 * Processes the transaction and shows the result.
 * Handles all possible outcomes: success, network error,
 * insufficient funds, timeout, and unknown error.
 * 
 * Rendering: CSR — Dynamic interaction with retry logic.
 */
export default function ConfirmPage() {
  const router = useRouter();
  const store = useTransactionStore();

  useEffect(() => {
    // If no transaction data, redirect to home
    if (!store.amount || !store.recipientId || store.recipientId === "pending") {
      router.replace("/home");
      return;
    }

    // Only process if we haven't already
    if (store.step !== "processing" && store.step !== "result") {
      processTransaction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processTransaction = async () => {
    store.setStep("processing");

    const result = await createTransaction({
      amount: store.amount,
      recipientId: store.recipientId,
      recipientName: store.recipientName,
      description: store.description || undefined,
    });

    if (result.success) {
      store.setResult(result.data);
    } else {
      // Map API error to ConfirmationResult
      const errorResult: ConfirmationResult = {
        status: "unknown_error",
        message: result.error,
      };
      store.setResult(errorResult);
    }

    store.setStep("result");
  };

  // ============================================
  // Processing state
  // ============================================
  if (store.step === "processing") {
    return (
      <div className="page-container justify-center">
        <div className="content-wrapper text-center">
          <LoadingSpinner
            size="lg"
            message="Procesando tu transacción..."
          />
          <p className="text-xs text-gray-400 mt-4">
            Por favor no cierres esta pantalla
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // Result state
  // ============================================
  if (store.step === "result" && store.result) {
    return (
      <div className="page-container justify-center">
        <div className="content-wrapper">
          <ResultView
            result={store.result}
            amount={store.amount}
            recipientName={store.recipientName}
            onRetry={processTransaction}
            onGoHome={() => {
              store.reset();
              router.push("/home");
            }}
            onViewReceipt={() => {
              router.push("/transaction/receipt");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container justify-center">
      <LoadingSpinner message="Cargando..." />
    </div>
  );
}

// ============================================
// Result View Component
// Renders appropriate UI based on outcome.
// ============================================

interface ResultViewProps {
  result: ConfirmationResult;
  amount: number;
  recipientName: string;
  onRetry: () => void;
  onGoHome: () => void;
  onViewReceipt: () => void;
}

function ResultView({
  result,
  amount,
  recipientName,
  onRetry,
  onGoHome,
  onViewReceipt,
}: ResultViewProps) {
  // Success
  if (result.status === "success") {
    return (
      <Card className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-600"
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¡Transacción exitosa!
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Se enviaron{" "}
          <span className="font-semibold">${amount.toFixed(2)} MXN</span> a{" "}
          <span className="font-semibold">{recipientName}</span>
        </p>
        <div className="space-y-3">
          <Button fullWidth onClick={onViewReceipt}>
            Ver comprobante
          </Button>
          <Button fullWidth variant="secondary" onClick={onGoHome}>
            Volver al inicio
          </Button>
        </div>
      </Card>
    );
  }

  // Error states
  const errorConfig = getErrorConfig(result);

  return (
    <Card className="text-center">
      <div
        className={`w-20 h-20 ${errorConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <svg
          className={`w-10 h-10 ${errorConfig.iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={errorConfig.iconPath}
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {errorConfig.title}
      </h2>
      <p className="text-sm text-gray-600 mb-6">{result.message}</p>
      <div className="space-y-3">
        {errorConfig.canRetry && (
          <Button fullWidth onClick={onRetry}>
            Reintentar
          </Button>
        )}
        <Button
          fullWidth
          variant={errorConfig.canRetry ? "secondary" : "primary"}
          onClick={onGoHome}
        >
          Volver al inicio
        </Button>
      </div>
    </Card>
  );
}

function getErrorConfig(result: ConfirmationResult) {
  switch (result.status) {
    case "network_error":
      return {
        title: "Error de conexión",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        iconPath: "M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12v.01",
        canRetry: true,
      };
    case "insufficient_funds":
      return {
        title: "Fondos insuficientes",
        bgColor: "bg-red-100",
        iconColor: "text-red-600",
        iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        canRetry: false,
      };
    case "timeout":
      return {
        title: "Tiempo de espera agotado",
        bgColor: "bg-yellow-100",
        iconColor: "text-yellow-600",
        iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        canRetry: true,
      };
    default:
      return {
        title: "Error inesperado",
        bgColor: "bg-gray-100",
        iconColor: "text-gray-600",
        iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
        canRetry: true,
      };
  }
}
