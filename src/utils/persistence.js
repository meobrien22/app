import { supabase } from '../supabaseClient';
import { buildStakeholderQuestionSet } from '../data/stakeholderDiscovery';
import { calculateExecutiveCoverage, calculateMcemStageScores, getAccountAutomationQueue, getAiReadiness, getRenewalMilestones } from '../data/mcemData';
import {
  calculateAddOnFit,
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
  generateExecutiveSummaryLine,
  getRunningDiscoveryPlan,
} from './scoring';

export async function saveDiscoverySession(account, store) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { accountId } = await ensureAccount(account);
  const sessionId = await createSession(account, accountId);
  await insertStakeholders(account, sessionId);
  await insertScorecard(account, sessionId);
  await insertContractContext(account, sessionId);
  await insertStakeholderMeetings(account, store, sessionId);
  await insertScheduledMeetings(store, sessionId);
  await insertWorkshopItems(store, sessionId);
  await insertTeamAssignments(store, sessionId);
  await insertKeywordTally(store, sessionId);
  await insertRunningPlan(account, store, sessionId);
  await insertPersonaSnapshots(store, sessionId);
  await insertMcemSnapshot(account, sessionId);

  return { accountId, sessionId };
}

export async function savePortfolioDailyUpdate({ annualQuota, impliedPipeline, quotaCoverage, noteText, dailyUpdates }) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const accountUpdates = dailyUpdates.map((update) => ({
    type: update.type,
    account_id: update.account.id,
    account_name: update.account.name,
    industry: update.account.industry,
    renewal_window: update.account.contractContext?.renewalWindow,
    priority_rank: update.account.priorityRank,
    message: update.message,
  }));

  const { data, error } = await supabase
    .from('portfolio_daily_updates')
    .insert([
      {
        annual_quota: annualQuota,
        quota_context: {
          implied_pipeline: impliedPipeline,
          quota_coverage: quotaCoverage,
          note: noteText,
          saved_from: 'AE Discovery Engine',
        },
        account_updates: accountUpdates,
      },
    ])
    .select('portfolio_update_id')
    .single();

  if (error) throw error;
  return data;
}

async function ensureAccount(account) {
  const { data: existing, error: selectError } = await supabase
    .from('accounts')
    .select('account_id')
    .eq('company_name', account.name)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing?.account_id) return { accountId: existing.account_id };

  const { data, error } = await supabase
    .from('accounts')
    .insert([
      {
        company_name: account.name,
        industry: account.industry,
        segment: account.segment,
        current_m365_level: account.currentLevel,
        estimated_user_count: 250,
        contract_status: account.contractContext?.status,
        satisfaction_level: account.contractContext?.satisfaction,
      },
    ])
    .select('account_id')
    .single();

  if (error) throw error;
  return { accountId: data.account_id };
}

async function createSession(account, accountId) {
  const discovery = calculateDiscoveryScore(account).total;
  const opportunity = calculateOpportunityScore(account).total;
  const risk = calculateRiskScore(account).total;

  const { data, error } = await supabase
    .from('discovery_sessions')
    .insert([
      {
        account_id: accountId,
        meeting_type: 'stakeholder-discovery',
        selected_persona: account.stakeholders?.[0]?.role ?? 'Unknown',
        current_motion: account.currentLevel,
        trigger_score: account.triggerScore,
        ai_opportunity_score: opportunity,
        ai_risk_score: risk,
        session_notes: `Discovery ${discovery} | Opportunity ${opportunity} | Risk ${risk}`,
      },
    ])
    .select('session_id')
    .single();

  if (error) throw error;
  return data.session_id;
}

async function insertStakeholders(account, sessionId) {
  if (!account.stakeholders?.length) return;
  const rows = account.stakeholders.map((stakeholder) => ({
    session_id: sessionId,
    name: stakeholder.name,
    role: stakeholder.role,
    influence_level: stakeholder.influence,
    sentiment: stakeholder.sentiment,
    is_economic_buyer: stakeholder.influence === 'Economic Buyer',
    is_technical_owner: stakeholder.influence === 'Technical Owner',
    is_business_owner: stakeholder.influence === 'Business Owner',
    notes: '',
  }));

  const { error } = await supabase.from('stakeholders').insert(rows);
  if (error) throw error;
}

async function insertScorecard(account, sessionId) {
  const discovery = calculateDiscoveryScore(account);
  const opportunity = calculateOpportunityScore(account);
  const risk = calculateRiskScore(account);
  const addOns = calculateAddOnFit(account).slice(0, 8);
  const addonFitScores = Object.fromEntries(addOns.map((item) => [item.name, item.score]));
  const scoreInputs = { ...account.scoreInputs };

  const { error } = await supabase.from('discovery_scorecards').insert([
    {
      session_id: sessionId,
      discovery_readiness_score: discovery.total,
      opportunity_score: opportunity.total,
      risk_score: risk.total,
      addon_fit_scores: addonFitScores,
      score_inputs: scoreInputs,
    },
  ]);

  if (error) throw error;
}

async function insertContractContext(account, sessionId) {
  const context = account.contractContext ?? {};
  const { error } = await supabase.from('contract_contexts').insert([
    {
      session_id: sessionId,
      renewal_window: context.renewalWindow,
      contract_status: context.status,
      satisfaction_level: context.satisfaction,
      procurement_involvement: context.procurement,
      business_case_needed: context.businessCase,
      current_tools: context.currentTools ?? [],
      adoption_gaps: context.adoptionGaps ?? [],
      blockers: context.blockers ?? [],
    },
  ]);

  if (error) throw error;
}

async function insertStakeholderMeetings(account, store, sessionId) {
  const meetingEntries = Object.entries(store.stakeholderMeetings ?? {});
  if (!meetingEntries.length) return;

  for (const [stakeholderMeetingKey, meeting] of meetingEntries) {
    const { data, error } = await supabase
      .from('stakeholder_discovery_meetings')
      .insert([
        {
          session_id: sessionId,
          stakeholder_key: stakeholderMeetingKey,
          stakeholder_name: meeting.stakeholderName,
          stakeholder_role: meeting.role,
          profile_label: meeting.profile,
          meeting_status: meeting.meetingStatus,
          scheduled_for: meeting.scheduledFor || null,
          objective: meeting.objective,
        },
      ])
      .select('stakeholder_meeting_id')
      .single();

    if (error) throw error;

    const questionCatalog = [
      ...buildStakeholderQuestionSet({ role: meeting.role }),
      ...(meeting.customQuestions ?? []),
    ];
    const responses = Object.entries(meeting.responses ?? {}).map(([levelId, response]) => {
      const question = questionCatalog.find((item) => item.id === levelId) ?? {};

      return {
        stakeholder_meeting_id: data.stakeholder_meeting_id,
        level_id: levelId,
        parent_level_id: question.parentId ?? null,
        branch_depth: question.depth ?? 0,
        question_name: question.name,
        question_text: question.question,
        question_intent: question.intent,
        source_type: question.sourceType ?? null,
        yes_no: response.yesNo,
        need_text: response.need,
        want_text: response.want,
        answer_text: response.answer,
        keywords: response.keywords?.length ? response.keywords : question.keywords ?? [],
      };
    });

    if (responses.length) {
      const { error: responseError } = await supabase.from('stakeholder_discovery_responses').insert(responses);
      if (responseError) throw responseError;
    }
  }
}

async function insertScheduledMeetings(store, sessionId) {
  if (!store.scheduledMeetings?.length) return;
  const rows = store.scheduledMeetings.map((meeting) => ({
    session_id: sessionId,
    stakeholder_key: meeting.stakeholderKey,
    stakeholder_name: meeting.stakeholderName,
    stakeholder_role: meeting.stakeholderRole,
    title: meeting.title,
    objective: meeting.objective,
    scheduled_for: meeting.scheduledFor || null,
    status: meeting.status,
  }));

  const { error } = await supabase.from('scheduled_discovery_meetings').insert(rows);
  if (error) throw error;
}

async function insertWorkshopItems(store, sessionId) {
  if (!store.workshopPlan?.length) return;
  const rows = store.workshopPlan.map((item) => ({
    session_id: sessionId,
    item_id: item.id,
    title: item.title,
    owner: item.owner,
    status: item.status,
    output: item.output,
  }));

  const { error } = await supabase.from('discovery_workshop_items').insert(rows);
  if (error) throw error;
}

async function insertTeamAssignments(store, sessionId) {
  if (!store.dynamicTeamMembers?.length) return;
  const rows = store.dynamicTeamMembers.map((member) => ({
    session_id: sessionId,
    member_id: member.id,
    member_name: member.name,
    role: member.role,
    customer_action: member.customerAction,
  }));

  const { error } = await supabase.from('vteam_assignments').insert(rows);
  if (error) throw error;
}

async function insertKeywordTally(store, sessionId) {
  const rows = Object.entries(store.keywordTally ?? {}).map(([keyword, count]) => ({
    session_id: sessionId,
    keyword,
    keyword_count: count,
  }));
  if (!rows.length) return;

  const { error } = await supabase.from('discovery_keyword_tally').insert(rows);
  if (error) throw error;
}

async function insertRunningPlan(account, store, sessionId) {
  const summaryLine = generateExecutiveSummaryLine(account, store.keywordTally, store.dynamicTeamMembers);
  const planItems = getRunningDiscoveryPlan(
    account,
    store.keywordTally,
    store.dynamicTeamMembers,
    store.stakeholderMeetings,
    store.scheduledMeetings,
    store.workshopPlan,
  );

  const { error } = await supabase.from('running_plan_snapshots').insert([
    {
      session_id: sessionId,
      summary_line: summaryLine,
      plan_items: planItems,
    },
  ]);

  if (error) throw error;
}

async function insertPersonaSnapshots(store, sessionId) {
  const personas = Object.values(store.personaLibrary ?? {});
  if (!personas.length) return;

  const rows = personas.map((persona) => ({
    session_id: sessionId,
    persona_id: persona.id,
    role: persona.role,
    title: persona.title,
    priorities: persona.priorities ?? [],
    common_pains: persona.commonPains ?? [],
    messaging: persona.messaging,
    renewal_angle: persona.renewalAngle,
    news_angles: persona.newsAngles ?? [],
    learned_signals: persona.learnedSignals ?? [],
    industry_signals: persona.industrySignals ?? {},
    account_examples: persona.accountExamples ?? [],
  }));

  const { error } = await supabase.from('persona_playbook_snapshots').insert(rows);
  if (error) throw error;
}

async function insertMcemSnapshot(account, sessionId) {
  const { error } = await supabase.from('account_mcem_snapshots').insert([
    {
      session_id: sessionId,
      stage_scores: calculateMcemStageScores(account),
      executive_coverage: calculateExecutiveCoverage(account),
      ai_readiness: getAiReadiness(account),
      renewal_milestones: getRenewalMilestones(account),
      automation_queue: getAccountAutomationQueue(account),
    },
  ]);

  if (error) throw error;
}
