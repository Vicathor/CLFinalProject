import { AskThreadDetail } from "@/components/ask/AskThreadDetail";
import { getOfficialThreads } from "@/lib/ask";

type AskThreadPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

// Pre-generate official FAQ pages only; community question pages are dynamic.
export function generateStaticParams() {
  return getOfficialThreads().map((thread) => ({
    questionId: thread.id,
  }));
}

export default async function AskThreadPage({
  params,
}: Readonly<AskThreadPageProps>) {
  const { questionId } = await params;
  const officialThread =
    getOfficialThreads().find((t) => t.id === questionId) ?? null;

  return <AskThreadDetail questionId={questionId} seedThread={officialThread} />;
}
