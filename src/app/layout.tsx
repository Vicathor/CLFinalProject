import type { Metadata } from "next";
import type { Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NL First 100",
  description:
    "Mobile-first onboarding guide for international students in the Netherlands",
  applicationName: "NL First 100",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NL First 100",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
