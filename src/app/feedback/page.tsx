import { FeedbackExportPanel } from "@/components/feedback/FeedbackExportPanel";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";

export default function FeedbackPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Feedback
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Save testing notes locally, then export them for review.
        </p>
      </div>

      <FeedbackForm sourceType="general" title="General feedback" />
      <FeedbackExportPanel />
      <FeedbackList />
    </section>
  );
}
