import type { StudentTip } from "@/types/content";

type StudentTipCardProps = {
  tip: StudentTip;
};

export function StudentTipCard({ tip }: Readonly<StudentTipCardProps>) {
  return (
    <article className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/40 p-4">
      <p className="text-sm font-semibold text-amber-950">{tip.title}</p>
      <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-300">{tip.body}</p>
    </article>
  );
}
