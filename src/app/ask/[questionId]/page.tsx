import { AskThreadDetail } from "@/components/ask/AskThreadDetail";
import { getSeedThreads, getThreadById } from "@/lib/ask";

type AskThreadPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

export function generateStaticParams() {
  return getSeedThreads().map((thread) => ({
    questionId: thread.id,
  }));
}

export default async function AskThreadPage({
  params,
}: Readonly<AskThreadPageProps>) {
  const { questionId } = await params;
  // User-created questions live only in the browser, so the seed lookup may
  // miss; the client component resolves those from local storage.
  const seedThread = getThreadById(questionId) ?? null;

  return <AskThreadDetail questionId={questionId} seedThread={seedThread} />;
}
