"use client";

import {
  CircleHelp,
  ClipboardCheck,
  Home,
  type LucideIcon,
  PanelsTopLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navIcons: Record<(typeof primaryRoutes)[number]["href"], LucideIcon> = {
  "/dashboard": Home,
  "/checklist": ClipboardCheck,
  "/topics": PanelsTopLeft,
  "/ask": CircleHelp,
  "/settings": Settings,
};

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// Routes that make up the focused startup onboarding flow, where the
// bottom navigation is hidden.
const hiddenNavRoutes = ["/", "/onboarding"];

export function BottomNav() {
  const pathname = usePathname();

  if (hiddenNavRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-zinc-200 dark:border-white/5 bg-white/95 dark:bg-[#0f1a18]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(24,39,52,0.08)] backdrop-blur"
    >
      <ul className="grid grid-cols-5 gap-1">
        {primaryRoutes.map((route) => {
          const Icon = navIcons[route.href];
          const isActive = isActiveRoute(pathname, route.href);

          return (
            <li key={route.href} className="min-w-0">
              <Link
                href={route.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-medium leading-none transition-colors",
                  isActive
                    ? "bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] text-white"
                    : "text-zinc-500 dark:text-[#9fb0ad] hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-[#e7edeb]",
                )}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className="max-w-full truncate">{route.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
