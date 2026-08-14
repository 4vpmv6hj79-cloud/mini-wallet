import { Transaction } from "@/types";
import { EmptyState } from "@/components/ui";

// ============================================
// Transaction List Component
// Renders list of recent transactions with 
// type indicators and amount formatting.
// ============================================

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Sin movimientos"
        message="Aún no tienes movimientos recientes."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">
        Movimientos recientes
      </h3>
      <ul className="divide-y divide-gray-100">
        {transactions.map((txn) => (
          <TransactionItem key={txn.id} transaction={txn} />
        ))}
      </ul>
    </div>
  );
}

// ============================================
// Transaction Item (internal component)
// ============================================

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isSent = transaction.type === "sent";

  const formattedAmount = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: transaction.currency,
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString(
    "es-MX",
    {
      day: "numeric",
      month: "short",
    }
  );

  return (
    <li className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {/* Type indicator */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSent ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <svg
            className={`w-5 h-5 ${isSent ? "text-red-600" : "text-green-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isSent
                  ? "M7 11l5-5m0 0l5 5m-5-5v12"
                  : "M17 13l-5 5m0 0l-5-5m5 5V6"
              }
            />
          </svg>
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {transaction.description}
          </p>
          <p className="text-xs text-gray-500">
            {transaction.recipient} · {formattedDate}
          </p>
        </div>
      </div>

      {/* Amount */}
      <span
        className={`text-sm font-semibold ${
          isSent ? "text-red-600" : "text-green-600"
        }`}
      >
        {isSent ? "-" : "+"}
        {formattedAmount}
      </span>
    </li>
  );
}
