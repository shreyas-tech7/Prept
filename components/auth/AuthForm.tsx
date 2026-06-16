"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mic, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const supabase = createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/dashboard`
                : undefined,
          },
        });
        if (error) throw error;

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setEmailSent(true);
        }
      }
    } catch (err: unknown) {
      const messageText =
        err instanceof Error ? err.message : "Something went wrong.";
      toast({
        variant: "error",
        title: isLogin ? "Couldn't sign in" : "Couldn't sign up",
        description: messageText,
      });
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--card-shadow)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl">Check your email</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          We sent a confirmation link to{" "}
          <span className="text-[var(--text-primary)]">{email}</span>. Click it to
          activate your account, then come back and log in.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-black">
          <Mic className="h-4 w-4" />
        </span>
        <span className="font-display text-2xl">Prept</span>
      </Link>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--card-shadow)]">
        <h1 className="font-display text-3xl">
          {isLogin ? "Welcome back." : "Start practicing today."}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {isLogin
            ? "Log in to continue improving your interview skills."
            : "Create a free account — no credit card required."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">
              Email
            </label>
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--text-secondary)]">
              Password
            </label>
            <Input
              type="password"
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait…
              </>
            ) : isLogin ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-amber-500 hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-500 hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
