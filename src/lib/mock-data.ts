import { User, Wallet, Transaction, Contact } from "@/types";

// ============================================
// Mock Data - Simulates database records
// ============================================

export const MOCK_USER: User = {
  id: "usr_001",
  name: "Erik Palomares",
  email: "erik@example.com",
  phone: "+52 55 1234 5678",
};

export const MOCK_WALLET: Wallet = {
  balance: 15750.5,
  currency: "MXN",
  lastUpdated: new Date().toISOString(),
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    type: "sent",
    amount: 500.0,
    currency: "MXN",
    description: "Pago de renta",
    recipient: "Carlos López",
    date: "2024-03-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "txn_002",
    type: "received",
    amount: 12000.0,
    currency: "MXN",
    description: "Nómina quincenal",
    recipient: "Empresa ABC",
    date: "2024-03-14T08:00:00Z",
    status: "completed",
  },
  {
    id: "txn_003",
    type: "sent",
    amount: 250.0,
    currency: "MXN",
    description: "Netflix",
    recipient: "Netflix México",
    date: "2024-03-13T15:45:00Z",
    status: "completed",
  },
  {
    id: "txn_004",
    type: "sent",
    amount: 1200.0,
    currency: "MXN",
    description: "Cena con amigos",
    recipient: "Ana Martínez",
    date: "2024-03-12T21:00:00Z",
    status: "completed",
  },
  {
    id: "txn_005",
    type: "received",
    amount: 800.0,
    currency: "MXN",
    description: "Reembolso",
    recipient: "Pedro Sánchez",
    date: "2024-03-11T14:20:00Z",
    status: "completed",
  },
  {
    id: "txn_006",
    type: "sent",
    amount: 3500.0,
    currency: "MXN",
    description: "Seguro médico",
    recipient: "Seguros XYZ",
    date: "2024-03-10T09:15:00Z",
    status: "pending",
  },
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: "cnt_001",
    name: "Carlos López",
    phone: "+52 55 9876 5432",
    email: "carlos@email.com",
    isFavorite: true,
  },
  {
    id: "cnt_002",
    name: "Ana Martínez",
    phone: "+52 55 1111 2222",
    email: "ana@email.com",
    isFavorite: true,
  },
  {
    id: "cnt_003",
    name: "Pedro Sánchez",
    phone: "+52 55 3333 4444",
    isFavorite: true,
  },
  {
    id: "cnt_004",
    name: "María García",
    phone: "+52 55 5555 6666",
    email: "maria@email.com",
    isFavorite: false,
  },
  {
    id: "cnt_005",
    name: "Jorge Hernández",
    phone: "+52 55 7777 8888",
    isFavorite: false,
  },
];

// Valid credentials for mock login
export const VALID_CREDENTIALS = [
  "erik@example.com",
  "+52 55 1234 5678",
  "5512345678",
];
