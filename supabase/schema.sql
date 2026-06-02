-- AE Customer Value Discovery Engine
-- Run this in the Supabase SQL Editor to initialize the backend structure.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    segment VARCHAR(100),
    current_m365_level VARCHAR(50),
    renewal_date DATE,
    estimated_user_count INTEGER,
    microsoft_relationship VARCHAR(100),
    existing_products TEXT[],
    known_addons TEXT[],
    security_vendors TEXT[],
    data_platforms TEXT[],
    contract_status VARCHAR(100),
    satisfaction_level VARCHAR(100),
    quota_attainment_pct NUMERIC DEFAULT 0,
    pipeline_coverage_ratio NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discovery_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(account_id) ON DELETE CASCADE,
    meeting_type VARCHAR(100),
    selected_persona VARCHAR(100),
    current_motion VARCHAR(100),
    trigger_score INTEGER,
    ai_opportunity_score INTEGER,
    ai_risk_score INTEGER,
    status VARCHAR(50) DEFAULT 'in-progress',
    session_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stakeholders (
    stakeholder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    name VARCHAR(255),
    role VARCHAR(100),
    influence_level VARCHAR(50),
    sentiment VARCHAR(50),
    is_economic_buyer BOOLEAN DEFAULT FALSE,
    is_technical_owner BOOLEAN DEFAULT FALSE,
    is_business_owner BOOLEAN DEFAULT FALSE,
    is_champion BOOLEAN DEFAULT FALSE,
    is_blocker BOOLEAN DEFAULT FALSE,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS discovery_scorecards (
    scorecard_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    discovery_readiness_score INTEGER,
    opportunity_score INTEGER,
    risk_score INTEGER,
    addon_fit_scores JSONB,
    score_inputs JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contract_contexts (
    context_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    renewal_window VARCHAR(100),
    contract_status VARCHAR(100),
    satisfaction_level VARCHAR(100),
    procurement_involvement VARCHAR(100),
    business_case_needed VARCHAR(100),
    current_tools TEXT[],
    adoption_gaps TEXT[],
    blockers TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stakeholder_discovery_meetings (
    stakeholder_meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    stakeholder_key VARCHAR(255) NOT NULL,
    stakeholder_name VARCHAR(255),
    stakeholder_role VARCHAR(100),
    profile_label VARCHAR(100),
    meeting_status VARCHAR(50),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    objective TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stakeholder_discovery_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stakeholder_meeting_id UUID REFERENCES stakeholder_discovery_meetings(stakeholder_meeting_id) ON DELETE CASCADE,
    level_id VARCHAR(50) NOT NULL,
    parent_level_id VARCHAR(100),
    branch_depth INTEGER DEFAULT 0,
    question_name VARCHAR(100),
    question_text TEXT,
    question_intent TEXT,
    source_type VARCHAR(50),
    yes_no VARCHAR(20),
    need_text TEXT,
    want_text TEXT,
    answer_text TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS parent_level_id VARCHAR(100);
ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS branch_depth INTEGER DEFAULT 0;
ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS question_name VARCHAR(100);
ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS question_text TEXT;
ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS question_intent TEXT;
ALTER TABLE stakeholder_discovery_responses ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);

CREATE TABLE IF NOT EXISTS scheduled_discovery_meetings (
    scheduled_meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    stakeholder_key VARCHAR(255),
    stakeholder_name VARCHAR(255),
    stakeholder_role VARCHAR(100),
    title VARCHAR(255),
    objective TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discovery_workshop_items (
    workshop_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    item_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    owner VARCHAR(255),
    status VARCHAR(50),
    output TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vteam_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    member_id VARCHAR(100),
    member_name VARCHAR(255),
    role VARCHAR(100),
    customer_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discovery_keyword_tally (
    keyword_tally_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    keyword_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS running_plan_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    summary_line TEXT,
    plan_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS persona_playbook_snapshots (
    persona_snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    persona_id VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    title VARCHAR(255),
    priorities TEXT[],
    common_pains TEXT[],
    messaging TEXT,
    renewal_angle TEXT,
    news_angles TEXT[],
    learned_signals TEXT[],
    industry_signals JSONB,
    account_examples TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE persona_playbook_snapshots ADD COLUMN IF NOT EXISTS industry_signals JSONB;

CREATE TABLE IF NOT EXISTS account_mcem_snapshots (
    mcem_snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES discovery_sessions(session_id) ON DELETE CASCADE,
    stage_scores JSONB,
    executive_coverage JSONB,
    ai_readiness JSONB,
    renewal_milestones JSONB,
    automation_queue JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_daily_updates (
    portfolio_update_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    update_date DATE DEFAULT CURRENT_DATE,
    annual_quota NUMERIC DEFAULT 50000000,
    quota_context JSONB,
    account_updates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_discovery_sessions_account_id ON discovery_sessions(account_id);
CREATE INDEX IF NOT EXISTS idx_stakeholders_session_id ON stakeholders(session_id);
CREATE INDEX IF NOT EXISTS idx_discovery_scorecards_session_id ON discovery_scorecards(session_id);
CREATE INDEX IF NOT EXISTS idx_contract_contexts_session_id ON contract_contexts(session_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_discovery_meetings_session_id ON stakeholder_discovery_meetings(session_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_discovery_responses_meeting_id ON stakeholder_discovery_responses(stakeholder_meeting_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_discovery_meetings_session_id ON scheduled_discovery_meetings(session_id);
CREATE INDEX IF NOT EXISTS idx_discovery_workshop_items_session_id ON discovery_workshop_items(session_id);
CREATE INDEX IF NOT EXISTS idx_vteam_assignments_session_id ON vteam_assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_discovery_keyword_tally_session_id ON discovery_keyword_tally(session_id);
CREATE INDEX IF NOT EXISTS idx_running_plan_snapshots_session_id ON running_plan_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_persona_playbook_snapshots_session_id ON persona_playbook_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_account_mcem_snapshots_session_id ON account_mcem_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_daily_updates_update_date ON portfolio_daily_updates(update_date);

-- RLS is intentionally not opened here.
-- For the current browser-only prototype, run supabase/rls-prototype.sql.
-- For production, use authenticated owner-based policies instead.
