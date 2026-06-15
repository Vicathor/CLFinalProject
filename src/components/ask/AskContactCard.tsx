import type { AskContact } from "@/types/content";

type AskContactCardProps = {
  contact: AskContact;
};

export function AskContactCard({ contact }: Readonly<AskContactCardProps>) {
  return (
    <article className="rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
        {contact.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
        {contact.description}
      </p>
      <a
        href={contact.contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
      >
        Open contact guidance
      </a>
    </article>
  );
}
