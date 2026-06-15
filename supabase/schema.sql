-- ============================================================
-- NL First 100 — Supabase schema
-- Paste the entire file into the Supabase SQL Editor and run.
-- ============================================================

-- ── 1. TABLES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  display_name    TEXT        NOT NULL DEFAULT 'Anonymous',
  role            TEXT        NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  status          TEXT        NOT NULL DEFAULT 'active'  CHECK (status IN ('active', 'banned')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  student_profile JSONB
);

CREATE TABLE IF NOT EXISTS public.questions (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author_id        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name      TEXT        NOT NULL DEFAULT 'Anonymous',
  category         TEXT        NOT NULL DEFAULT 'community' CHECK (category IN ('official', 'community')),
  title            TEXT        NOT NULL,
  body             TEXT,
  status           TEXT        NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'removed')),
  removed_at       TIMESTAMPTZ,
  removed_by       UUID        REFERENCES public.profiles(id),
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  related_task_ids TEXT[]      NOT NULL DEFAULT '{}',
  related_topic_ids TEXT[]     NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.answers (
  id          TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question_id TEXT        NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id   UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT        NOT NULL DEFAULT 'Anonymous',
  body        TEXT        NOT NULL,
  verified    BOOLEAN     NOT NULL DEFAULT FALSE,
  status      TEXT        NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'removed')),
  removed_at  TIMESTAMPTZ,
  removed_by  UUID        REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT        NOT NULL CHECK (target_type IN ('question', 'answer')),
  target_id   TEXT        NOT NULL,
  reporter_id UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason      TEXT,
  status      TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (target_type, target_id, reporter_id)
);

CREATE TABLE IF NOT EXISTS public.feedback (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type      TEXT        NOT NULL CHECK (source_type IN ('general', 'task', 'topic', 'faq')),
  source_id        TEXT,
  was_helpful      BOOLEAN,
  issue_type       TEXT        CHECK (issue_type IN ('confusing', 'outdated', 'missing_information', 'broken_link', 'does_not_apply', 'other')),
  comment          TEXT,
  profile_snapshot JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. HELPER FUNCTION ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 3. AUTO-CREATE PROFILE ON SIGN-UP ───────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 4. CASCADE DISPLAY NAME → AUTHOR NAME ───────────────────

CREATE OR REPLACE FUNCTION public.sync_author_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.display_name IS DISTINCT FROM OLD.display_name THEN
    UPDATE public.questions SET author_name = NEW.display_name WHERE author_id = NEW.id;
    UPDATE public.answers   SET author_name = NEW.display_name WHERE author_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_name_change ON public.profiles;
CREATE TRIGGER on_profile_name_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_author_name();

-- ── 5. ROW LEVEL SECURITY ───────────────────────────────────

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback  ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "profiles_admin_all"   ON public.profiles FOR ALL USING (public.is_admin());

-- questions: anyone reads approved; author reads own; admin reads all
CREATE POLICY "questions_select_approved" ON public.questions FOR SELECT USING (status = 'approved' OR author_id = auth.uid() OR public.is_admin());
CREATE POLICY "questions_insert_auth"     ON public.questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());
CREATE POLICY "questions_update_admin"    ON public.questions FOR UPDATE USING (public.is_admin());

-- answers: same pattern
CREATE POLICY "answers_select_approved"   ON public.answers FOR SELECT USING (status = 'approved' OR author_id = auth.uid() OR public.is_admin());
CREATE POLICY "answers_insert_auth"       ON public.answers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());
CREATE POLICY "answers_update_admin"      ON public.answers FOR UPDATE USING (public.is_admin());

-- reports: authenticated users can insert; only admins read
CREATE POLICY "reports_insert_auth"  ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "reports_select_admin" ON public.reports FOR SELECT USING (public.is_admin());
CREATE POLICY "reports_update_admin" ON public.reports FOR UPDATE USING (public.is_admin());

-- feedback: anyone can insert anonymously; only admins read
CREATE POLICY "feedback_insert_anon"  ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "feedback_select_admin" ON public.feedback FOR SELECT USING (public.is_admin());

-- ── 6. SEED DATA — community questions ──────────────────────
-- author_id is NULL for all seed content (no real user account).

INSERT INTO public.questions (id, author_id, author_name, category, title, body, status, tags, related_task_ids, related_topic_ids, created_at) VALUES
('cq_housing_shortstay', NULL, 'anya_k', 'community',
 'Best short-stay options near campus for the first two weeks?',
 'I arrive late August but my room only starts in September. Where did you stay for the gap? Trying to keep it cheap and close to a bus line to campus.',
 'approved',
 ARRAY['housing','short stay','arrival'],
 ARRAY['housing_sos','plan_arrival'],
 ARRAY['housing'],
 '2026-05-28'),

('cq_bsn_appointment_wait', NULL, 'deepa_r', 'community',
 'How long did you wait for a BSN registration appointment?',
 'I registered with the municipality online but the first free slot is three weeks away. Is that normal, and can I open a bank account before I have my BSN?',
 'approved',
 ARRAY['bsn','municipality','registration','banking'],
 ARRAY['municipality_registration','bsn','money_bank_account'],
 ARRAY['municipality_bsn_digid','money_banking'],
 '2026-06-02'),

('cq_bike_secondhand', NULL, 'lucia_m', 'community',
 'Where to buy a reliable second-hand bike without getting scammed?',
 'Saw a lot of cheap bikes online but heard some are stolen or fall apart fast. Where did you get yours and roughly what did you pay?',
 'approved',
 ARRAY['transport','bike','daily life'],
 ARRAY['transport_bike_daily_life'],
 ARRAY['transport_daily_life'],
 '2026-06-05'),

('cq_bank_no_bsn', NULL, 'samuel_o', 'community',
 'Which bank worked for you before getting a BSN?',
 'Non-EU student arriving next week. I need an account fast to pay rent but I will not have a BSN for a while. What worked for you?',
 'approved',
 ARRAY['banking','bsn','money','non eu'],
 ARRAY['money_bank_account','bsn'],
 ARRAY['money_banking'],
 '2026-06-09'),

('cq_gp_english', NULL, 'fatima_z', 'community',
 'How do I register with a GP that speaks English?',
 'Not sure how the GP (huisarts) system works here. Do I need to register before I get sick, and how do I find one taking new patients near campus?',
 'approved',
 ARRAY['healthcare','gp','huisarts','insurance'],
 ARRAY['gp_registration','health_insurance'],
 ARRAY['healthcare_gp'],
 '2026-06-10')

ON CONFLICT (id) DO NOTHING;

-- ── 7. SEED DATA — answers ───────────────────────────────────

INSERT INTO public.answers (id, question_id, author_id, author_name, body, verified, created_at) VALUES
('ca_housing_1', 'cq_housing_shortstay', NULL, 'marco_p',
 'I booked a hostel in Enschede centre for 10 days and took bus 1 to campus. Reasonable if you split a twin room. Book early though, it fills up around intro week.',
 FALSE, '2026-05-29'),
('ca_housing_2', 'cq_housing_shortstay', NULL, 'UT Student Housing',
 'Email the Student Housing office before you arrive. They sometimes hold gap rooms for newly arriving internationals and will tell you what is realistic for your dates.',
 TRUE, '2026-05-30'),

('ca_bsn_1', 'cq_bsn_appointment_wait', NULL, 'tomas_v',
 'Two to three weeks was normal for me in September. Some banks let you open an account first and add the BSN later, so it is worth starting both in parallel.',
 FALSE, '2026-06-03'),

('ca_bike_1', 'cq_bike_secondhand', NULL, 'yuki_s',
 'I used a registered second-hand shop in Enschede. A bit more than online but it came with a few months of warranty and a real lock. Ask for the purchase receipt.',
 FALSE, '2026-06-05'),
('ca_bike_2', 'cq_bike_secondhand', NULL, 'marco_p',
 'Avoid a bike sold without a key for the lock, and never buy one for 20 euro on the street, it is almost certainly stolen and you can be fined.',
 FALSE, '2026-06-06'),
('ca_bike_3', 'cq_bike_secondhand', NULL, 'anya_k',
 'The student association sometimes runs a bike sale at the start of the semester, worth waiting a week for if you can.',
 FALSE, '2026-06-07'),

('ca_gp_1', 'cq_gp_english', NULL, 'tomas_v',
 'Register as soon as you arrive, not when you are ill. Many practices near campus are used to international students and consult in English.',
 FALSE, '2026-06-10'),
('ca_gp_2', 'cq_gp_english', NULL, 'UT Student Services',
 'Student Health Services can point you to practices accepting new patients and explain how the GP acts as your first contact before any specialist. Bring your insurance details when you register.',
 TRUE, '2026-06-11')

ON CONFLICT (id) DO NOTHING;
