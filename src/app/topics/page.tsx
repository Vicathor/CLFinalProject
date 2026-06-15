import { TopicCard } from "@/components/topics/TopicCard";
import { getAllTopics } from "@/lib/content";

export default function TopicsPage() {
  const topics = getAllTopics();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
          Topics
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
          Practical guides for studying and settling in the Netherlands.
        </p>
      </div>
      <div className="grid gap-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
}
