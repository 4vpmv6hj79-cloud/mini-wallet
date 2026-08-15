# Decisiones de Diseño

Documento que explica las decisiones técnicas y arquitectónicas tomadas durante el desarrollo del Mini Wallet.

---

## 1. Arquitectura general

### App Router (Next.js 14)

Elegí el **App Router** sobre Pages Router porque:
- Es la dirección actual de Next.js y permite colocación de archivos por feature.
- Facilita la separación de API routes dentro de la misma estructura.
- Permite layouts anidados para futuras extensiones.

### Client-Side Rendering (CSR)

Todas las páginas son CSR (`"use client"`) porque:
- La app es 100% interactiva y no tiene necesidades de SEO.
- La sesión vive en localStorage (no accesible desde el servidor).
- Los datos son personalizados por usuario, no pre-renderizables.
- En un escenario real con SSR, se usarían cookies HttpOnly para poder hacer pre-rendering del Home con datos del usuario.

---

## 2. Estado global: Zustand

Elegí **Zustand** sobre Context API o Redux porque:
- **Menos boilerplate** que Redux: no necesita providers, actions, reducers.
- **Mejor performance** que Context: no re-renderiza todo el árbol.
- **Persist middleware** integrado para sesión en localStorage.
- **Selectores granulares**: cada componente se suscribe solo a lo que necesita.
- **Escalable**: para millones de usuarios, la app necesita renders mínimos y Zustand lo garantiza.

Se crearon dos stores separados por responsabilidad:
- `auth-store`: Sesión del usuario (persistente).
- `transaction-store`: Estado del flujo de transacción actual (efímero).

---

## 3. Validaciones y reglas de negocio

### Separación de concerns

Las validaciones están en **tres capas**:
1. **Cliente (UI)**: react-hook-form + zod para feedback inmediato.
2. **Lógica de negocio (lib/validations.ts)**: Funciones puras que validan reglas de negocio (monto mínimo, saldo suficiente, destinatario obligatorio). Independientes de la UI.
3. **Servidor (API routes)**: Validación con zod del payload + reglas de negocio. Defensa en profundidad.

### ¿Por qué funciones puras?

Las reglas de negocio (`validateMinimumAmount`, `validateSufficientBalance`, `validateRecipient`) son funciones puras porque:
- Son fácilmente testeables sin montar componentes.
- Son reutilizables en cliente y servidor.
- Permiten composición (`validateTransaction` las orquesta todas).

---

## 4. Capa de servicios

Se creó una capa de abstracción (`services/api.ts`) que:
- Centraliza la lógica de fetch con tipado genérico `ApiResult<T>`.
- Maneja errores de red de forma consistente.
- Facilita el reemplazo futuro por un cliente HTTP real (axios, ky).
- Desacopla los componentes de los detalles de comunicación.

---

## 5. Componentes UI

### Diseño del sistema de componentes

- **Primitivos reutilizables** (Button, Input, Card): Agnósticos al negocio, configurables por props.
- **Componentes de estado** (LoadingSpinner, ErrorState, EmptyState): Manejan los 3 estados async comunes.
- **Composición sobre herencia**: Cada componente es pequeño y composable.

### Tailwind CSS

Elegí Tailwind porque:
- Colocation de estilos con la lógica (no CSS separado).
- Design tokens vía theme (colores primary).
- Responsivo por defecto con clases utilitarias.
- Elimina dead CSS en producción.

---

## 6. Custom Hooks

Separé la lógica de negocio de la UI con hooks:
- `useLogin`: Maneja autenticación y navegación.
- `useWalletData`: Fetching con estados async.
- `useContacts`: Lista de contactos + agregar nuevos.
- `useAuthGuard`: Protección de rutas client-side.

Esto permite:
- Testear la lógica sin renderizar componentes.
- Reutilizar lógica entre páginas.
- Mantener los componentes enfocados en presentación.

---

## 7. Manejo de errores

### Escenarios de confirmación

La pantalla de confirmación maneja 5 escenarios con respuesta aleatoria:
- ✅ Éxito → Comprobante
- 🔴 Error de red → Opción de reintentar
- 💰 Fondos insuficientes → Error descriptivo (sin retry)
- ⏱ Timeout → Opción de reintentar
- ❓ Error desconocido → Fallback genérico con retry

### Simulación en API Routes

Los API routes incluyen:
- Latencia artificial (simula condiciones reales).
- Errores aleatorios (5-10% en fetches, distribución en transacciones).
- Validación server-side (no confiar solo en el cliente).

---

## 8. Edge cases considerados

- Monto 0 o negativo → Bloqueado en cliente y servidor.
- Monto mayor al saldo → Error antes de enviar.
- Sin destinatario → Botón de confirmar deshabilitado.
- Error de red en login → Mensaje con opción de reintentar.
- Lista de contactos vacía → Empty state.
- Sesión perdida → Redirect automático a login.
- Navegación directa a /transaction/confirm sin datos → Redirect a home.

---

## 9. ¿Qué haría diferente con más tiempo?

- **Tests unitarios** con Vitest para validaciones y hooks.
- **Tests E2E** con Playwright para el flujo completo.
- **SSR para Home** con cookies HttpOnly en lugar de localStorage.
- **Optimistic updates** al crear transacciones.
- **Skeleton loaders** en lugar de spinners genéricos.
- **Error boundaries** con React Error Boundary para errores no manejados.
- **Rate limiting** en API routes.
- **Animations** con Framer Motion para transiciones entre pasos.
- **PWA** con service worker para uso offline.
- **Accessibility audit** completo con axe-core.
