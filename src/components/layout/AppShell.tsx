import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#e8edf0] text-zinc-950 dark:bg-[#0a110f] dark:text-[#e7edeb]">
      <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-[#fbfcf8] shadow-[0_0_36px_rgba(24,39,52,0.14)] dark:bg-[#0f1a18]">
        <Header />
        <PageContainer>{children}</PageContainer>
        <BottomNav />
      </div>
    </div>
  );
}
