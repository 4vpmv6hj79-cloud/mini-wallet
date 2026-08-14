"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { login } from "@/services/api";

// ============================================
// useLogin Hook
// Encapsulates login logic: API call, error 
// handling, and session persistence.
// Separates business logic from UI.
// ============================================

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  handleLogin: (identifier: string) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const handleLogin = async (identifier: string) => {
    setIsLoading(true);
    setError(null);

    const result = await login(identifier);

    if (result.success) {
      setSession(result.data.user, result.data.token);
      router.push("/home");
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return { isLoading, error, handleLogin };
}
