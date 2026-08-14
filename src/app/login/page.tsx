"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validations";
import { useLogin } from "@/hooks/useLogin";
import { Button, Input, Card } from "@/components/ui";

/**
 * Login Page
 * 
 * Renders the login form with phone/email input.
 * Uses react-hook-form + zod for client-side validation,
 * and delegates auth logic to the useLogin hook.
 * 
 * Rendering: CSR — Login is interactive-first with no
 * SEO needs and requires client-side state management.
 */
export default function LoginPage() {
  const { isLoading, error, handleLogin } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    handleLogin(data.identifier);
  };

  return (
    <div className="page-container justify-center">
      <div className="content-wrapper">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mini Wallet</h1>
          <p className="text-gray-500 mt-1">Inicia sesión para continuar</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <Input
                label="Teléfono o email"
                placeholder="ej. 5512345678 o erik@example.com"
                type="text"
                autoComplete="email tel"
                error={errors.identifier?.message}
                {...register("identifier")}
              />

              {/* Server error message */}
              {error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Iniciar sesión
              </Button>
            </div>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-1">
              Credenciales de prueba:
            </p>
            <p className="text-xs text-blue-600">
              Email: erik@example.com
            </p>
            <p className="text-xs text-blue-600">
              Teléfono: 5512345678
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
