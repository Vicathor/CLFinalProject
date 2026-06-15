"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

type Mode = "signin" | "signup";

type LoginSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function LoginSheet({
  isOpen,
  onClose,
  onSuccess,
}: Readonly<LoginSheetProps>) {
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-close when auth state changes to signed in.
  useEffect(() => {
    if (user && isOpen) {
      onSuccess?.();
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);
    const { error: authError } =
      mode === "signup"
        ? await signUp(email, password)
        : await signIn(email, password);
    setIsLoading(false);

    if (authError) {
      setError(authError);
    }
  }

  function handleClose() {
    setMode("signin");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[430px] rounded-t-2xl bg-white dark:bg-[#18221f] p-6 pb-10 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-[#e7edeb]">
            {mode === "signin" ? "Sign in to post" : "Create an account"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-zinc-400 dark:text-[#7e908c] transition-colors hover:text-zinc-600 dark:hover:text-[#9fb0ad]"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@university.nl"
              autoFocus
              required
              className="h-11 w-full rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#0f1a18] px-3 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
              required
              className="h-11 w-full rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#0f1a18] px-3 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
            />
          </label>

          {mode === "signup" ? (
            <>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
                  Confirm password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 w-full rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#0f1a18] px-3 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
                />
              </label>
            </>
          ) : null}

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="h-11 w-full rounded-md bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] text-sm font-semibold text-white transition-colors hover:bg-teal-800 dark:hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-white/10 disabled:text-zinc-400"
          >
            {isLoading
              ? mode === "signup"
                ? "Creating account…"
                : "Signing in…"
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-[#9fb0ad]">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
