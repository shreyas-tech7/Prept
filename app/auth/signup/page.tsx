import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-[#9492A4]">Loading…</div>}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
