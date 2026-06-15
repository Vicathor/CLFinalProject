import { supabase } from "@/lib/supabase/client";
import type { AskThread } from "@/types/ask";
import type { TaskId, TopicId } from "@/types/content";

export async function fetchCommunityThreads(): Promise<AskThread[]> {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("category", "community")
    .eq("status", "approved")
    .not("author_id", "is", null)
    .order("created_at", { ascending: false });

  if (error || !questions || questions.length === 0) return [];

  const { data: answers } = await supabase
    .from("answers")
    .select("*")
    .in(
      "question_id",
      questions.map((q) => q.id),
    )
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const answersByQuestion = new Map<string, NonNullable<typeof answers>>();
  for (const answer of answers ?? []) {
    const existing = answersByQuestion.get(answer.question_id) ?? [];
    existing.push(answer);
    answersByQuestion.set(answer.question_id, existing);
  }

  return questions.map((q) => ({
    id: q.id,
    category: "community" as const,
    title: q.title,
    body: q.body ?? undefined,
    authorName: q.author_name,
    status: "approved" as const,
    createdAt: q.created_at.slice(0, 10),
    tags: q.tags,
    relatedTaskIds: q.related_task_ids as TaskId[],
    relatedTopicIds: q.related_topic_ids as TopicId[],
    answers: (answersByQuestion.get(q.id) ?? []).map((a) => ({
      id: a.id,
      body: a.body,
      authorName: a.author_name,
      verified: a.verified,
      createdAt: a.created_at.slice(0, 10),
    })),
  }));
}

export async function fetchThreadById(id: string): Promise<AskThread | null> {
  const [questionResult, answersResult] = await Promise.all([
    supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .single(),
    supabase
      .from("answers")
      .select("*")
      .eq("question_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: true }),
  ]);

  if (questionResult.error || !questionResult.data) return null;
  const q = questionResult.data;
  const answers = answersResult.data ?? [];

  return {
    id: q.id,
    category: q.category as "community",
    title: q.title,
    body: q.body ?? undefined,
    authorName: q.author_name,
    status: "approved" as const,
    createdAt: q.created_at.slice(0, 10),
    tags: q.tags,
    relatedTaskIds: q.related_task_ids as TaskId[],
    relatedTopicIds: q.related_topic_ids as TopicId[],
    answers: answers.map((a) => ({
      id: a.id,
      body: a.body,
      authorName: a.author_name,
      verified: a.verified,
      createdAt: a.created_at.slice(0, 10),
    })),
  };
}

export async function postQuestion(input: {
  title: string;
  body?: string;
  authorId: string;
  authorName: string;
}): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      title: input.title.trim(),
      body: input.body?.trim() || null,
      author_id: input.authorId,
      author_name: input.authorName,
      category: "community",
    })
    .select("id")
    .single();

  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function postAnswer(input: {
  questionId: string;
  body: string;
  authorId: string;
  authorName: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("answers").insert({
    question_id: input.questionId,
    body: input.body.trim(),
    author_id: input.authorId,
    author_name: input.authorName,
  });
  return { error: error?.message ?? null };
}

export async function reportContent(input: {
  targetType: "question" | "answer";
  targetId: string;
  reporterId: string;
  reason?: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("reports").insert({
    target_type: input.targetType,
    target_id: input.targetId,
    reporter_id: input.reporterId,
    reason: input.reason ?? null,
  });
  return { error: error?.message ?? null };
}
