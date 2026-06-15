"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import type { Profile } from "@/types/database";
import type { StudentProfile } from "@/types/profile";

export type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<{ error: string | null }>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { profile: studentProfile, saveProfile, clearAllLocalData, isHydrated } =
    useAppState();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Always-current ref so async callbacks read the latest studentProfile value.
  const studentProfileRef = useRef<StudentProfile | null>(studentProfile);
  useEffect(() => {
    studentProfileRef.current = studentProfile;
  }, [studentProfile]);

  // Track what we last wrote to Supabase to skip redundant writes.
  const syncedProfileRef = useRef<StudentProfile | null>(null);

  // Prevent loading from Supabase more than once per login session.
  const hasLoadedStudentProfileRef = useRef(false);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
  }

  // Restore the student profile from Supabase, but only when no local profile exists.
  async function loadStudentProfile(userId: string) {
    if (hasLoadedStudentProfileRef.current) return;
    hasLoadedStudentProfileRef.current = true;

    const { data } = await supabase
      .from("profiles")
      .select("student_profile")
      .eq("id", userId)
      .single();

    const remote = (data?.student_profile ?? null) as StudentProfile | null;
    if (remote && !studentProfileRef.current) {
      // Mark as synced before calling saveProfile so the sync effect skips the write.
      syncedProfileRef.current = remote;
      saveProfile(remote);
    }
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: current } }) => {
        setSession(current);
        setUser(current?.user ?? null);
        if (current?.user) {
          fetchProfile(current.user.id);
          loadStudentProfile(current.user.id);
        }
        setIsAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        fetchProfile(next.user.id);
        if (event === "SIGNED_IN") {
          loadStudentProfile(next.user.id);
        }
      } else {
        setProfile(null);
        if (event === "SIGNED_OUT") {
          hasLoadedStudentProfileRef.current = false;
          syncedProfileRef.current = null;
          clearAllLocalData();
          router.push("/");
        }
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync local student profile → Supabase whenever it changes while signed in.
  useEffect(() => {
    if (!isHydrated || !user || !studentProfile) return;
    if (studentProfile === syncedProfileRef.current) return;

    syncedProfileRef.current = studentProfile;
    supabase
      .from("profiles")
      .update({ student_profile: studentProfile })
      .eq("id", user.id)
      .then(() => {});
  }, [studentProfile, user, isHydrated]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateDisplayName = useCallback(
    async (name: string) => {
      if (!user) return { error: "Not logged in." };
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: name.trim() })
        .eq("id", user.id);
      if (!error && profile) {
        setProfile({ ...profile, display_name: name.trim() });
      }
      return { error: error?.message ?? null };
    },
    [user, profile],
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      session,
      isAuthLoading,
      signIn,
      signUp,
      signOut,
      updateDisplayName,
    }),
    [
      user,
      profile,
      session,
      isAuthLoading,
      signIn,
      signUp,
      signOut,
      updateDisplayName,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
