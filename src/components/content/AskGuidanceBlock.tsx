import type { AskContact } from "@/types/content";

type AskGuidanceBlockProps = {
  contacts: readonly AskContact[];
};

export function AskGuidanceBlock({
  contacts,
}: Readonly<AskGuidanceBlockProps>) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
        Who should I ask?
      </h3>
      <div className="grid gap-3">
        {contacts.map((contact) => (
          <article key={contact.id} className="rounded-md bg-zinc-50 dark:bg-white/5 p-3">
            <p className="text-sm font-semibold text-zinc-950 dark:text-[#e7edeb]">
              {contact.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
              {contact.description}
            </p>
            <a
              href={contact.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
            >
              Open contact guidance
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
