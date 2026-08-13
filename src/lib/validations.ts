import { z } from "zod";

// ============================================
// Business Rule Validations
// Centralized validation logic separated from UI
// ============================================

/** Login form validation schema */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Este campo es requerido")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+?52\s?)?\d{2}\s?\d{4}\s?\d{4}$|^\d{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      { message: "Ingresa un email o teléfono válido" }
    ),
});

/** Transaction validation schema */
export const transactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: "El monto debe ser un número" })
    .positive("El monto debe ser mayor a cero")
    .min(1, "El monto mínimo es $1"),
  recipientId: z.string().min(1, "Debes seleccionar un destinatario"),
  recipientName: z.string().min(1, "El nombre del destinatario es requerido"),
  description: z.string().optional(),
});

/** 
 * Business rule: Validates that the transaction amount 
 * does not exceed the available balance.
 * This is separated from schema validation because it 
 * requires runtime context (current balance).
 */
export function validateSufficientBalance(
  amount: number,
  balance: number
): { valid: boolean; error?: string } {
  if (amount > balance) {
    return {
      valid: false,
      error: `Saldo insuficiente. Tu saldo disponible es $${balance.toFixed(2)}`,
    };
  }
  return { valid: true };
}

/**
 * Business rule: Validates minimum transaction amount.
 * Prevents zero or negative amounts.
 */
export function validateMinimumAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  if (amount <= 0) {
    return {
      valid: false,
      error: "El monto debe ser mayor a cero",
    };
  }
  return { valid: true };
}

/**
 * Business rule: Validates recipient is provided.
 */
export function validateRecipient(recipientId: string): {
  valid: boolean;
  error?: string;
} {
  if (!recipientId || recipientId.trim() === "") {
    return {
      valid: false,
      error: "Debes seleccionar un destinatario",
    };
  }
  return { valid: true };
}

/**
 * Runs all transaction business rules and returns 
 * combined validation result.
 */
export function validateTransaction(
  amount: number,
  recipientId: string,
  balance: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const amountResult = validateMinimumAmount(amount);
  if (!amountResult.valid) errors.push(amountResult.error!);

  const balanceResult = validateSufficientBalance(amount, balance);
  if (!balanceResult.valid) errors.push(balanceResult.error!);

  const recipientResult = validateRecipient(recipientId);
  if (!recipientResult.valid) errors.push(recipientResult.error!);

  return { valid: errors.length === 0, errors };
}

export type LoginFormValues = z.infer<typeof loginSchema>;
export type TransactionFormValues = z.infer<typeof transactionSchema>;
