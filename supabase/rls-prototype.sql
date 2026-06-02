-- Prototype-only RLS policy for the AE Customer Value Discovery Engine.
--
-- Use this when running the current browser-only prototype with the Supabase
-- anon key and no sign-in flow yet.
--
-- Security note:
-- This allows anyone with the anon key to insert and read rows in accounts.
-- That is acceptable for a local demo or disposable prototype data, but not
-- for production customer data. For production, add Supabase Auth and owner
-- columns, then replace this with authenticated user policies.

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_discovery_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_discovery_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_discovery_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_workshop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vteam_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_keyword_tally ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.running_plan_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_playbook_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_mcem_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_daily_updates ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.accounts TO anon, authenticated;
GRANT SELECT, INSERT ON public.discovery_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON public.stakeholders TO anon, authenticated;
GRANT SELECT, INSERT ON public.discovery_scorecards TO anon, authenticated;
GRANT SELECT, INSERT ON public.contract_contexts TO anon, authenticated;
GRANT SELECT, INSERT ON public.stakeholder_discovery_meetings TO anon, authenticated;
GRANT SELECT, INSERT ON public.stakeholder_discovery_responses TO anon, authenticated;
GRANT SELECT, INSERT ON public.scheduled_discovery_meetings TO anon, authenticated;
GRANT SELECT, INSERT ON public.discovery_workshop_items TO anon, authenticated;
GRANT SELECT, INSERT ON public.vteam_assignments TO anon, authenticated;
GRANT SELECT, INSERT ON public.discovery_keyword_tally TO anon, authenticated;
GRANT SELECT, INSERT ON public.running_plan_snapshots TO anon, authenticated;
GRANT SELECT, INSERT ON public.persona_playbook_snapshots TO anon, authenticated;
GRANT SELECT, INSERT ON public.account_mcem_snapshots TO anon, authenticated;
GRANT SELECT, INSERT ON public.portfolio_daily_updates TO anon, authenticated;

DROP POLICY IF EXISTS "Prototype anon can insert accounts" ON public.accounts;
CREATE POLICY "Prototype anon can insert accounts"
ON public.accounts
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read accounts" ON public.accounts;
CREATE POLICY "Prototype anon can read accounts"
ON public.accounts
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert discovery_sessions" ON public.discovery_sessions;
CREATE POLICY "Prototype anon can insert discovery_sessions"
ON public.discovery_sessions
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read discovery_sessions" ON public.discovery_sessions;
CREATE POLICY "Prototype anon can read discovery_sessions"
ON public.discovery_sessions
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert stakeholders" ON public.stakeholders;
CREATE POLICY "Prototype anon can insert stakeholders"
ON public.stakeholders
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read stakeholders" ON public.stakeholders;
CREATE POLICY "Prototype anon can read stakeholders"
ON public.stakeholders
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert discovery_scorecards" ON public.discovery_scorecards;
CREATE POLICY "Prototype anon can insert discovery_scorecards"
ON public.discovery_scorecards
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read discovery_scorecards" ON public.discovery_scorecards;
CREATE POLICY "Prototype anon can read discovery_scorecards"
ON public.discovery_scorecards
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert contract_contexts" ON public.contract_contexts;
CREATE POLICY "Prototype anon can insert contract_contexts"
ON public.contract_contexts
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read contract_contexts" ON public.contract_contexts;
CREATE POLICY "Prototype anon can read contract_contexts"
ON public.contract_contexts
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert stakeholder_discovery_meetings" ON public.stakeholder_discovery_meetings;
CREATE POLICY "Prototype anon can insert stakeholder_discovery_meetings"
ON public.stakeholder_discovery_meetings
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read stakeholder_discovery_meetings" ON public.stakeholder_discovery_meetings;
CREATE POLICY "Prototype anon can read stakeholder_discovery_meetings"
ON public.stakeholder_discovery_meetings
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert stakeholder_discovery_responses" ON public.stakeholder_discovery_responses;
CREATE POLICY "Prototype anon can insert stakeholder_discovery_responses"
ON public.stakeholder_discovery_responses
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read stakeholder_discovery_responses" ON public.stakeholder_discovery_responses;
CREATE POLICY "Prototype anon can read stakeholder_discovery_responses"
ON public.stakeholder_discovery_responses
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert scheduled_discovery_meetings" ON public.scheduled_discovery_meetings;
CREATE POLICY "Prototype anon can insert scheduled_discovery_meetings"
ON public.scheduled_discovery_meetings
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read scheduled_discovery_meetings" ON public.scheduled_discovery_meetings;
CREATE POLICY "Prototype anon can read scheduled_discovery_meetings"
ON public.scheduled_discovery_meetings
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert discovery_workshop_items" ON public.discovery_workshop_items;
CREATE POLICY "Prototype anon can insert discovery_workshop_items"
ON public.discovery_workshop_items
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read discovery_workshop_items" ON public.discovery_workshop_items;
CREATE POLICY "Prototype anon can read discovery_workshop_items"
ON public.discovery_workshop_items
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert vteam_assignments" ON public.vteam_assignments;
CREATE POLICY "Prototype anon can insert vteam_assignments"
ON public.vteam_assignments
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read vteam_assignments" ON public.vteam_assignments;
CREATE POLICY "Prototype anon can read vteam_assignments"
ON public.vteam_assignments
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert discovery_keyword_tally" ON public.discovery_keyword_tally;
CREATE POLICY "Prototype anon can insert discovery_keyword_tally"
ON public.discovery_keyword_tally
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read discovery_keyword_tally" ON public.discovery_keyword_tally;
CREATE POLICY "Prototype anon can read discovery_keyword_tally"
ON public.discovery_keyword_tally
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert running_plan_snapshots" ON public.running_plan_snapshots;
CREATE POLICY "Prototype anon can insert running_plan_snapshots"
ON public.running_plan_snapshots
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read running_plan_snapshots" ON public.running_plan_snapshots;
CREATE POLICY "Prototype anon can read running_plan_snapshots"
ON public.running_plan_snapshots
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert persona_playbook_snapshots" ON public.persona_playbook_snapshots;
CREATE POLICY "Prototype anon can insert persona_playbook_snapshots"
ON public.persona_playbook_snapshots
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read persona_playbook_snapshots" ON public.persona_playbook_snapshots;
CREATE POLICY "Prototype anon can read persona_playbook_snapshots"
ON public.persona_playbook_snapshots
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert account_mcem_snapshots" ON public.account_mcem_snapshots;
CREATE POLICY "Prototype anon can insert account_mcem_snapshots"
ON public.account_mcem_snapshots
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read account_mcem_snapshots" ON public.account_mcem_snapshots;
CREATE POLICY "Prototype anon can read account_mcem_snapshots"
ON public.account_mcem_snapshots
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Prototype anon can insert portfolio_daily_updates" ON public.portfolio_daily_updates;
CREATE POLICY "Prototype anon can insert portfolio_daily_updates"
ON public.portfolio_daily_updates
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Prototype anon can read portfolio_daily_updates" ON public.portfolio_daily_updates;
CREATE POLICY "Prototype anon can read portfolio_daily_updates"
ON public.portfolio_daily_updates
FOR SELECT
TO anon
USING (true);
