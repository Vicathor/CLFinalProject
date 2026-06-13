import {
  Bike,
  ChevronRight,
  FileText,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import type { Topic } from "@/types/content";

type TopicCardProps = {
  topic: Topic;
};

type TopicVisual = {
  Icon: LucideIcon;
  bg: string;
};

const topicVisuals: Record<string, TopicVisual> = {
  housing: { Icon: Home, bg: "bg-orange-500" },
  visa_residence: { Icon: Plane, bg: "bg-teal-700" },
  documents: { Icon: FileText, bg: "bg-indigo-500" },
  municipality_bsn_digid: { Icon: Landmark, bg: "bg-amber-500" },
  money_banking: { Icon: Wallet, bg: "bg-blue-600" },
  healthcare_gp: { Icon: HeartPulse, bg: "bg-red-500" },
  transport_daily_life: { Icon: Bike, bg: "bg-purple-600" },
};

const fallbackVisual: TopicVisual = { Icon: FileText, bg: "bg-zinc-500" };

export function TopicCard({ topic }: Readonly<TopicCardProps>) {
  const { Icon, bg } = topicVisuals[topic.id] ?? fallbackVisual;

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-teal-700 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 active:bg-teal-50"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-white ${bg}`}
        >
          <Icon className="size-5.5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-6 text-zinc-950">
            {topic.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {topic.relatedTaskIds.length} related tasks
          </p>
        </div>
        <ChevronRight className="mt-0.5 size-5 shrink-0 text-zinc-400 transition-colors group-hover:text-teal-700" />
      </div>
    </Link>
  );
}
