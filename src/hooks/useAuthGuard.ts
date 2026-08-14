"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

/**
 * useAuthGuard Hook
 * 
 * Client-side route protection.
 * Redirects to /login if user is not authenticated.
 * Used in protected pages as an additional guard.
 */
export function useAuthGuard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}
