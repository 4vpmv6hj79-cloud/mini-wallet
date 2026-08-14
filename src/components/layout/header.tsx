"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui";

// ============================================
// Header Component
// Shows user name and logout button.
// ============================================

export function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-gray-500">Hola,</p>
        <h2 className="text-lg font-bold text-gray-900">
          {user?.name || "Usuario"}
        </h2>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </header>
  );
}
