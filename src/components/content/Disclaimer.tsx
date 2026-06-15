type DisclaimerProps = {
  children: React.ReactNode;
};

export function Disclaimer({ children }: Readonly<DisclaimerProps>) {
  return (
    <aside className="rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 p-4 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
      {children}
    </aside>
  );
}
