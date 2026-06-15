export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: "student" | "admin";
          status: "active" | "banned";
          created_at: string;
          student_profile: Json | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          role?: "student" | "admin";
          status?: "active" | "banned";
          created_at?: string;
          student_profile?: Json | null;
        };
        Update: {
          display_name?: string;
          role?: "student" | "admin";
          status?: "active" | "banned";
          student_profile?: Json | null;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          author_id: string | null;
          author_name: string;
          category: "official" | "community";
          title: string;
          body: string | null;
          status: "approved" | "removed";
          removed_at: string | null;
          removed_by: string | null;
          tags: string[];
          related_task_ids: string[];
          related_topic_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          author_name?: string;
          category?: "official" | "community";
          title: string;
          body?: string | null;
          status?: "approved" | "removed";
          removed_at?: string | null;
          removed_by?: string | null;
          tags?: string[];
          related_task_ids?: string[];
          related_topic_ids?: string[];
          created_at?: string;
        };
        Update: {
          author_name?: string;
          title?: string;
          body?: string | null;
          status?: "approved" | "removed";
          removed_at?: string | null;
          removed_by?: string | null;
          tags?: string[];
        };
        Relationships: [];
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          author_id: string | null;
          author_name: string;
          body: string;
          verified: boolean;
          status: "approved" | "removed";
          removed_at: string | null;
          removed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          author_id?: string | null;
          author_name?: string;
          body: string;
          verified?: boolean;
          status?: "approved" | "removed";
          removed_at?: string | null;
          removed_by?: string | null;
          created_at?: string;
        };
        Update: {
          body?: string;
          verified?: boolean;
          status?: "approved" | "removed";
          removed_at?: string | null;
          removed_by?: string | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          target_type: "question" | "answer";
          target_id: string;
          reporter_id: string | null;
          reason: string | null;
          status: "open" | "resolved";
          created_at: string;
        };
        Insert: {
          id?: string;
          target_type: "question" | "answer";
          target_id: string;
          reporter_id?: string | null;
          reason?: string | null;
          status?: "open" | "resolved";
          created_at?: string;
        };
        Update: {
          status?: "open" | "resolved";
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          id: string;
          source_type: "general" | "task" | "topic" | "faq";
          source_id: string | null;
          was_helpful: boolean | null;
          issue_type: "confusing" | "outdated" | "missing_information" | "broken_link" | "does_not_apply" | "other" | null;
          comment: string | null;
          profile_snapshot: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_type: "general" | "task" | "topic" | "faq";
          source_id?: string | null;
          was_helpful?: boolean | null;
          issue_type?: "confusing" | "outdated" | "missing_information" | "broken_link" | "does_not_apply" | "other" | null;
          comment?: string | null;
          profile_snapshot?: Json | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
