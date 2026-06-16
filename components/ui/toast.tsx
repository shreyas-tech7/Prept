"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
  id: number;
  title?: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (t: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ title, description, variant = "default" }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const Icon =
    toast.variant === "success"
      ? CheckCircle2
      : toast.variant === "error"
      ? AlertTriangle
      : Info;

  const accent =
    toast.variant === "success"
      ? "text-emerald-500"
      : toast.variant === "error"
      ? "text-red-500"
      : "text-amber-500";

  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-xl animate-fade-up">
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent)} />
      <div className="flex-1">
        {toast.title && (
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return { toast: () => {} };
  }
  return ctx;
}
