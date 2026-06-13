"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

// Routes in the focused onboarding flow have no bottom navigation, so they
// don't need to reserve space for it.
const immersiveRoutes = ["/", "/onboarding"];

export function PageContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isImmersive = immersiveRoutes.includes(pathname);

  return (
    <main
      className={cn(
        "min-h-[calc(100dvh-73px)] px-5 pt-6",
        isImmersive
          ? "pb-[env(safe-area-inset-bottom)]"
          : "pb-[calc(env(safe-area-inset-bottom)+6.75rem)]",
      )}
    >
      {children}
    </main>
  );
}
