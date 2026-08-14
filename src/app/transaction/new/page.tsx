"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransactionStore } from "@/store/transaction-store";
import { useContacts } from "@/hooks/useContacts";
import { useWalletData } from "@/hooks/useWalletData";
import { validateTransaction } from "@/lib/validations";
import { Button, Card, Input, LoadingSpinner, ErrorState } from "@/components/ui";
import { Contact } from "@/types";

/**
 * New Transaction Page
 * 
 * Multi-step flow: Amount → Contact → Summary → Confirm.
 * Uses transaction store for flow state and validates
 * business rules before allowing confirmation.
 * 
 * Rendering: CSR — Interactive form with multiple steps.
 */
export default function NewTransactionPage() {
  const router = useRouter();
  const store = useTransactionStore();
  const { state: walletState } = useWalletData();
  const { state: contactsState, addNewContact } = useContacts();

  const [localAmount, setLocalAmount] = useState(
    store.amount > 0 ? store.amount.toString() : ""
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [addingContact, setAddingContact] = useState(false);

  const balance =
    walletState.status === "success" ? walletState.data.wallet.balance : 0;

  // ============================================
  // Step: Amount
  // ============================================
  if (store.step === "form" && !store.recipientId) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <BackButton onClick={() => router.push("/home")} />
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Nueva transacción
          </h1>

          <Card>
            <div className="space-y-4">
              <Input
                label="Monto a enviar"
                type="number"
                placeholder="0.00"
                value={localAmount}
                onChange={(e) => {
                  setLocalAmount(e.target.value);
                  setErrors([]);
                }}
                helperText={
                  walletState.status === "success"
                    ? `Saldo disponible: $${balance.toFixed(2)} MXN`
                    : undefined
                }
                error={errors.find((e) => e.includes("monto") || e.includes("Saldo"))}
              />

              <Input
                label="Descripción (opcional)"
                placeholder="ej. Pago de comida"
                value={store.description}
                onChange={(e) => store.setDescription(e.target.value)}
              />

              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  const amount = parseFloat(localAmount);
                  if (isNaN(amount) || amount <= 0) {
                    setErrors(["El monto debe ser mayor a cero"]);
                    return;
                  }
                  if (amount > balance) {
                    setErrors([
                      `Saldo insuficiente. Tu saldo disponible es $${balance.toFixed(2)}`,
                    ]);
                    return;
                  }
                  store.setAmount(amount);
                  // Move to contact selection by setting a flag
                  store.setRecipient("pending", "");
                }}
              >
                Continuar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================
  // Step: Select Contact
  // ============================================
  if (store.step === "form" && store.recipientId === "pending") {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <BackButton
            onClick={() => {
              store.setRecipient("", "");
            }}
          />
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Selecciona destinatario
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enviar{" "}
            <span className="font-semibold text-gray-900">
              ${store.amount.toFixed(2)} MXN
            </span>
          </p>

          {/* Add new contact */}
          {showAddContact ? (
            <Card className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Nuevo contacto
              </h3>
              <div className="space-y-3">
                <Input
                  label="Nombre"
                  placeholder="Nombre del contacto"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                />
                <Input
                  label="Teléfono"
                  placeholder="5512345678"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddContact(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    isLoading={addingContact}
                    onClick={async () => {
                      if (!newContactName || !newContactPhone) return;
                      setAddingContact(true);
                      const contact = await addNewContact(
                        newContactName,
                        newContactPhone
                      );
                      setAddingContact(false);
                      if (contact) {
                        store.setRecipient(contact.id, contact.name);
                        store.setStep("summary");
                        setShowAddContact(false);
                      }
                    }}
                  >
                    Guardar y seleccionar
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button
              variant="secondary"
              fullWidth
              className="mb-4"
              onClick={() => setShowAddContact(true)}
            >
              + Agregar nuevo contacto
            </Button>
          )}

          {/* Contact list */}
          {contactsState.status === "loading" && (
            <LoadingSpinner size="sm" message="Cargando contactos..." />
          )}

          {contactsState.status === "error" && (
            <ErrorState message={contactsState.error} />
          )}

          {contactsState.status === "success" && (
            <Card padding="none">
              <ul className="divide-y divide-gray-100">
                {contactsState.data.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onSelect={() => {
                      store.setRecipient(contact.id, contact.name);
                      store.setStep("summary");
                    }}
                  />
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // Step: Summary (before confirmation)
  // ============================================
  if (store.step === "summary") {
    // Run full business rule validation
    const validation = validateTransaction(
      store.amount,
      store.recipientId,
      balance
    );

    return (
      <div className="page-container">
        <div className="content-wrapper">
          <BackButton
            onClick={() => {
              store.setRecipient("pending", "");
              store.setStep("form");
            }}
          />
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Confirmar envío
          </h1>

          <Card className="mb-6">
            <div className="space-y-4">
              <SummaryRow label="Destinatario" value={store.recipientName} />
              <SummaryRow
                label="Monto"
                value={`$${store.amount.toFixed(2)} MXN`}
              />
              {store.description && (
                <SummaryRow label="Descripción" value={store.description} />
              )}
              <div className="pt-3 border-t border-gray-100">
                <SummaryRow
                  label="Saldo después"
                  value={`$${(balance - store.amount).toFixed(2)} MXN`}
                />
              </div>
            </div>
          </Card>

          {/* Validation errors */}
          {!validation.valid && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              {validation.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-700">
                  {err}
                </p>
              ))}
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            disabled={!validation.valid}
            onClick={() => {
              router.push("/transaction/confirm");
            }}
          >
            Confirmar transacción
          </Button>

          <Button
            fullWidth
            variant="ghost"
            className="mt-2"
            onClick={() => {
              store.reset();
              router.push("/home");
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  // Fallback: loading wallet data
  if (walletState.status === "loading") {
    return (
      <div className="page-container justify-center">
        <LoadingSpinner message="Cargando..." />
      </div>
    );
  }

  return null;
}

// ============================================
// Helper Components (local to this page)
// ============================================

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Volver
    </button>
  );
}

function ContactItem({
  contact,
  onSelect,
}: {
  contact: Contact;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        onClick={onSelect}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-700">
            {contact.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.phone}</p>
        </div>
        {contact.isFavorite && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Favorito
          </span>
        )}
      </button>
    </li>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
