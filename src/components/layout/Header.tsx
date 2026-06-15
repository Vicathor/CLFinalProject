export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-[#fbfcf8]/95 px-5 py-4 backdrop-blur dark:border-white/5 dark:bg-[#0f1a18]/95">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
            University of Twente
          </p>
        </div>
      </div>
    </header>
  );
}
