# Mini Wallet — Web Challenge Spin

Aplicación web de wallet financiera construida con **Next.js 14 + TypeScript** como parte del challenge técnico de Spin.

Simula un flujo completo: **Login → Home → Nueva Transacción → Confirmación / Comprobante**.

---

## Tiempo invertido

**2 días** de desarrollo.

---

## Cómo levantar el proyecto

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x

### Instalación

```bash
cd mini-wallet
npm install
```

### Desarrollo

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

### Build de producción

```bash
npm run build
npm start
```

---

## Credenciales de prueba

| Tipo     | Valor              |
| -------- | ------------------ |
| Email    | erik@example.com   |
| Teléfono | 5512345678         |

---

## Stack tecnológico

| Herramienta         | Propósito                                         |
| ------------------- | ------------------------------------------------- |
| Next.js 14          | Framework React con App Router y API Routes       |
| TypeScript          | Tipado estático y contratos de dominio            |
| Tailwind CSS        | Estilos utilitarios y diseño responsivo           |
| Zustand             | Estado global ligero con persistencia             |
| Zod                 | Validación de esquemas (cliente y servidor)       |
| react-hook-form     | Manejo de formularios con rendimiento óptimo      |
| @hookform/resolvers | Integración Zod + react-hook-form                 |

---

## Estructura del proyecto

```
src/
├── app/                    # App Router (páginas y API routes)
│   ├── api/                # API Routes (auth, wallet, transactions, contacts)
│   ├── home/               # Pantalla principal
│   ├── login/              # Pantalla de login
│   └── transaction/        # Flujo de transacción
│       ├── new/            # Nueva transacción (monto + contacto + resumen)
│       ├── confirm/        # Procesamiento y resultado
│       └── receipt/        # Comprobante
├── components/
│   ├── ui/                 # Componentes reutilizables (Button, Input, Card, etc.)
│   └── layout/             # Componentes de layout (Header, BalanceCard, TransactionList)
├── hooks/                  # Custom hooks (useLogin, useWalletData, useContacts, useAuthGuard)
├── lib/                    # Utilidades (validaciones, mock data)
├── services/               # Capa de servicios (API client)
├── store/                  # Zustand stores (auth, transaction)
└── types/                  # Tipos e interfaces de dominio
```

---

## Limitaciones conocidas

- **Sin autenticación real**: La sesión se almacena en localStorage. En producción se usarían cookies HttpOnly con JWT.
- **Datos en memoria**: Los contactos agregados se pierden al reiniciar el servidor.
- **Sin base de datos**: Todos los datos son mocks estáticos.
- **Middleware simplificado**: El middleware no puede leer localStorage del servidor; la protección de rutas es client-side.
- **Sin tests**: No se incluyeron tests unitarios ni E2E por alcance de tiempo, pero la arquitectura (hooks separados, validaciones puras) facilita su incorporación.
- **Sin internacionalización**: La app está en español solamente.

---

## Pantallas

1. **Login** — Formulario con validación de email/teléfono, estados de carga y error simulado.
2. **Home** — Saldo disponible, movimientos recientes, estados loading/empty/error.
3. **Nueva Transacción** — Flujo multi-paso: monto → contacto (favoritos o nuevo) → resumen con validaciones.
4. **Confirmación** — Resultado aleatorio (éxito, error de red, fondos insuficientes, timeout, error desconocido) con opción de reintentar.
5. **Comprobante** — Detalle de la transacción exitosa.

---

## Scripts disponibles

| Comando         | Descripción                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Servidor de desarrollo         |
| `npm run build` | Build de producción            |
| `npm start`     | Servidor de producción         |
| `npm run lint`  | Linting con ESLint             |
