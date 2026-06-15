"use client";

import { LogOut, User } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { LoginSheet } from "@/components/ask/LoginSheet";
import { useAuth } from "@/hooks/useAuth";

export function AccountSection() {
  const { user, profile, signOut, updateDisplayName, isAuthLoading } =
    useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthLoading) return null;

  if (!user || !profile) {
    return (
      <>
        <LoginSheet isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
          <div className="flex items-center gap-2">
            <User className="size-4 text-zinc-400 dark:text-[#7e908c]" />
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Account
            </h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-[#9fb0ad]">
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Sign in
            </button>{" "}
            to post questions and answers in Ask.
          </p>
        </section>
      </>
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!displayName.trim()) return;
    setIsSaving(true);
    setSaveError(null);
    const { error } = await updateDisplayName(displayName);
    setIsSaving(false);
    if (error) {
      setSaveError(error);
      return;
    }
    setEditing(false);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f]">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-white/5 px-4 py-3">
        <User className="size-4 text-zinc-400 dark:text-[#7e908c]" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
          Account
        </h3>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-500 dark:text-[#9fb0ad]">
            Email
          </p>
          <p className="text-sm text-zinc-800 dark:text-[#e7edeb]">
            {profile.email}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-500 dark:text-[#9fb0ad]">
            Display name
          </p>
          {editing ? (
            <form onSubmit={handleSave} className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoFocus
                className="h-9 flex-1 rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#0f1a18] px-2 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none transition-colors focus:border-teal-700 dark:focus:border-teal-400"
              />
              <button
                type="submit"
                disabled={isSaving || !displayName.trim()}
                className="h-9 rounded-md bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] px-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setSaveError(null);
                }}
                className="h-9 rounded-md px-3 text-sm font-semibold text-zinc-500 dark:text-[#9fb0ad] transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-800 dark:text-[#e7edeb]">
                {profile.display_name}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDisplayName(profile.display_name);
                  setEditing(true);
                }}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 transition-colors hover:underline"
              >
                Edit
              </button>
            </div>
          )}
          {saveError ? (
            <p className="text-xs text-red-600 dark:text-red-400">{saveError}</p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-white/5">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 p-4 text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-400/5"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </section>
  );
}
