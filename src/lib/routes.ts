export type AppRoute = {
  href: string;
  label: string;
};

export const primaryRoutes = [
  {
    href: "/dashboard",
    label: "Home",
  },
  {
    href: "/checklist",
    label: "Checklist",
  },
  {
    href: "/topics",
    label: "Topics",
  },
  {
    href: "/ask",
    label: "Ask",
  },
  {
    href: "/settings",
    label: "Settings",
  },
] as const satisfies AppRoute[];
