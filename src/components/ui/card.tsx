import { HTMLAttributes, ReactNode } from "react";

// ============================================
// Card Component
// Generic container with consistent styling.
// ============================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
