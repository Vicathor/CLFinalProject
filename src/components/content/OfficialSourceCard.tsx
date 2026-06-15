import type { OfficialSource } from "@/types/content";

type OfficialSourceCardProps = {
  source: OfficialSource;
};

export function OfficialSourceCard({
  source,
}: Readonly<OfficialSourceCardProps>) {
  return (
    <article className="rounded-lg border border-teal-200 bg-teal-50 dark:bg-teal-950 p-4">
      <p className="text-sm font-semibold text-teal-950">{source.title}</p>
      <p className="mt-1 text-xs font-medium text-teal-800 dark:text-teal-400">
        Last checked {source.lastChecked}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
      >
        Open official source
      </a>
    </article>
  );
}
