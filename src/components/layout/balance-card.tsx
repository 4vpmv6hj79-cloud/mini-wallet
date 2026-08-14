import { Wallet } from "@/types";
import { Card } from "@/components/ui";

// ============================================
// Balance Card Component
// Displays wallet balance with currency formatting.
// ============================================

interface BalanceCardProps {
  wallet: Wallet;
}

export function BalanceCard({ wallet }: BalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: wallet.currency,
  }).format(wallet.balance);

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none mb-6">
      <p className="text-sm text-primary-100 mb-1">Saldo disponible</p>
      <p className="text-3xl font-bold">{formattedBalance}</p>
      <p className="text-xs text-primary-200 mt-2">
        Última actualización:{" "}
        {new Date(wallet.lastUpdated).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </Card>
  );
}
