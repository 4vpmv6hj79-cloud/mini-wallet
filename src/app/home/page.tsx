"use client";

import { useRouter } from "next/navigation";
import { useWalletData } from "@/hooks/useWalletData";
import { Header } from "@/components/layout/header";
import { BalanceCard } from "@/components/layout/balance-card";
import { TransactionList } from "@/components/layout/transaction-list";
import { Button, Card, LoadingSpinner, ErrorState } from "@/components/ui";

/**
 * Home Page
 * 
 * Displays wallet balance, recent transactions, and
 * action button to start a new transaction.
 * 
 * Rendering: CSR — Requires authenticated user context
 * and dynamic data fetching from API. Protected by middleware.
 */
export default function HomePage() {
  const router = useRouter();
  const { state, refetch } = useWalletData();

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <Header />

        {/* Loading state */}
        {state.status === "loading" && (
          <LoadingSpinner message="Cargando tu wallet..." />
        )}

        {/* Error state */}
        {state.status === "error" && (
          <ErrorState message={state.error} onRetry={refetch} />
        )}

        {/* Success state */}
        {state.status === "success" && (
          <>
            <BalanceCard wallet={state.data.wallet} />

            {/* New transaction CTA */}
            <Button
              fullWidth
              size="lg"
              className="mb-6"
              onClick={() => router.push("/transaction/new")}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nueva transacción
            </Button>

            {/* Transactions list */}
            <Card>
              <TransactionList transactions={state.data.transactions} />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
