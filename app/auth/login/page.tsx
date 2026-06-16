import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-[var(--text-secondary)]">Loading…</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
