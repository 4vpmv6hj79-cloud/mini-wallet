"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { LoadingSpinner } from "@/components/ui";

/**
 * Root page - redirects based on auth state.
 * Authenticated users go to /home, others to /login.
 */
export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="page-container justify-center">
      <LoadingSpinner message="Cargando..." />
    </div>
  );
}
