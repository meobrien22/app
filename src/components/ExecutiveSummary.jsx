import { Clock3, FileText, Target, UsersRound } from 'lucide-react';
import {
  calculateAddOnFit,
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
  generateExecutiveSummaryLine,
  getKeywordTallyList,
  getSuggestedTeamMembers,
} from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function ExecutiveSummary({ account }) {
  const { keywordTally, dynamicTeamMembers, stakeholderMeetings } = useDiscoveryStore();
  const discovery = calculateDiscoveryScore(account);
  const opportunity = calculateOpportunityScore(account);
  const risk = calculateRiskScore(account);
  const addOns = calculateAddOnFit(account).slice(0, 3);
  const topKeywords = getKeywordTallyList(keywordTally).slice(0, 6);
  const summaryLine = generateExecutiveSummaryLine(account, keywordTally, dynamicTeamMembers);
  const teamCommitments = buildExecutiveTeamCommitments(account, dynamicTeamMembers, stakeholderMeetings, keywordTally);
  const suggestedAdds = getSuggestedTeamMembers(account, dynamicTeamMembers, stakeholderMeetings, keywordTally).slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Executive Summary Generator</h2>
        <p className="mt-2 text-sm text-slate-500">Always-current summary based on account context, keywords, news, scores, and V-Team coverage.</p>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h3 className="mb-4 flex items-center font-bold text-blue-950">
          <FileText className="mr-2 h-4 w-4" />
          If the Conversation Ended Now
        </h3>
        <p className="text-sm leading-7 text-blue-950">{summaryLine}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center font-bold text-slate-900">
          <FileText className="mr-2 h-4 w-4 text-blue-600" />
          Draft Summary
        </h3>
        <div className="space-y-4 text-sm leading-7 text-slate-700">
          <p>
            {account.name} is showing a {account.triggerScore >= 8 ? 'strong' : 'developing'} discovery signal around{' '}
            {account.selectedPains.join(', ').toLowerCase()}. The current Microsoft motion is {account.currentLevel}, with a likely path toward{' '}
            {account.targetMotion}.
          </p>
          <p>{account.executiveNarrative}</p>
          <p>
            Current scores: discovery readiness {discovery.total}, opportunity {opportunity.total}, and risk {risk.total}. The strongest add-on fit
            signals are {addOns.map((item) => item.name).join(', ')}.
          </p>
          <p>
            Keywords heard most often: {topKeywords.map((item) => `${item.keyword} (${item.count})`).join(', ') || 'none captured yet'}.
          </p>
          <p>
            Recommended next step: {account.nextSteps[0]} Then use stakeholder alignment and objection handling to confirm the executive path.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center font-bold text-slate-900">
          <UsersRound className="mr-2 h-4 w-4 text-blue-600" />
          V-Team Commitments
        </h3>
        <p className="mb-5 text-sm leading-6 text-slate-500">
          This is the customer-facing orchestration plan: who matters, why they matter, when to use them, and what they owe back to the account team.
        </p>
        <div className="grid gap-4">
          {teamCommitments.map((item) => (
            <article key={item.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{item.owner}</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-950">{item.role}</h4>
                </div>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  {item.impactArea}
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white p-3">
                  <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Target className="mr-2 h-3.5 w-3.5 text-blue-600" />
                    Impact
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.impact}</p>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <p className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Clock3 className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                    When to engage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.timing}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Customer value</p>
                <p className="mt-2 text-sm leading-6 text-blue-950">{item.value}</p>
              </div>
              <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Owned deliverable</p>
                <p className="mt-2 text-sm leading-6 text-emerald-950">{item.deliverable}</p>
              </div>
            </article>
          ))}
        </div>

        {suggestedAdds.length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="font-bold text-amber-950">Recommended V-Team Adds From Discovery</h4>
            <div className="mt-3 space-y-3">
              {suggestedAdds.map((suggestion) => (
                <p key={suggestion.role} className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-950">{suggestion.role}:</span> {suggestion.customerAction}{' '}
                  <span className="font-semibold text-amber-800">{suggestion.customerMoment}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function buildExecutiveTeamCommitments(account, teamMembers = [], stakeholderMeetings = {}, keywordTally = {}) {
  const uniqueMembers = dedupeTeamMembers(teamMembers);
  const discoveryContext = buildDiscoveryContext(account, stakeholderMeetings, keywordTally);

  return uniqueMembers.map((member) => {
    const role = member.role || 'Specialist';
    const profile = commitmentForRole(role, account, discoveryContext);
    const customAction = sanitizeCustomerAction(member.customerAction);

    return {
      key: member.id ?? normalizeRole(role),
      owner: member.name || 'Assigned V-Team owner',
      role,
      impactArea: profile.impactArea,
      impact: profile.impact,
      value: customAction ? `${profile.value} Current commitment: ${customAction}` : profile.value,
      timing: profile.timing,
      deliverable: profile.deliverable,
    };
  });
}

function buildDiscoveryContext(account, stakeholderMeetings = {}, keywordTally = {}) {
  const responseText = Object.values(stakeholderMeetings).flatMap((meeting) =>
    Object.values(meeting.responses ?? {}).flatMap((response) => [response.need, response.want, response.answer, ...(response.keywords ?? [])]),
  );
  const tallyKeywords = getKeywordTallyList(keywordTally).map((item) => item.keyword);
  const signals = [...new Set([...responseText, ...tallyKeywords, ...(account.selectedPains ?? []), ...(account.keywords ?? [])])]
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);
  const topSignal = signals[0] || account.selectedPains?.[0] || 'the priority business outcome';
  const topAddOns = calculateAddOnFit(account).slice(0, 3).map((item) => item.name);
  const economicBuyer = account.stakeholders?.find((person) => person.influence === 'Economic Buyer');
  const technicalOwner = account.stakeholders?.find((person) => person.influence === 'Technical Owner');

  return {
    signals,
    topSignal,
    topAddOns,
    economicBuyer,
    technicalOwner,
    nextStep: account.nextSteps?.[0] || 'confirm the next customer step',
  };
}

function commitmentForRole(role, account, context) {
  const normalizedRole = normalizeRole(role);
  const accountName = account.name;
  const signal = context.topSignal.toLowerCase();
  const topSolutions = context.topAddOns.join(', ');
  const economicBuyer = context.economicBuyer?.role || 'economic buyer';
  const technicalOwner = context.technicalOwner?.role || 'technical owner';

  if (normalizedRole.includes('ae')) {
    return {
      impactArea: 'Account control',
      impact: `Keeps the ${accountName} point of view tight, connects each discovery answer to the buying motion, and makes sure the next step is mutual, specific, and inspection-ready.`,
      value: `Gives the customer one clear narrative instead of disconnected product conversations, anchored on ${signal}.`,
      timing: 'Every customer touch, especially before executive recaps, renewal alignment, and stage progression.',
      deliverable: `Updated executive summary, stakeholder map, decision-maker readout, and next-step ask for ${context.nextStep.toLowerCase()}.`,
    };
  }

  if (normalizedRole.includes('modern work') || normalizedRole.includes('ssp')) {
    return {
      impactArea: 'Productivity motion',
      impact: "Turns the customer's productivity, meeting, collaboration, and adoption signals into a credible Microsoft business conversation.",
      value: `Helps ${accountName} see how ${topSolutions || 'Microsoft'} connects to daily work, not just technology preference.`,
      timing: 'Bring in after persona pain is clear and before any Copilot, Teams, or Modern Work demo is positioned.',
      deliverable: 'Persona-specific question set, customer-ready follow-up language, and proof criteria for the Modern Work motion.',
    };
  }

  if (normalizedRole.includes('technical') || normalizedRole.includes('ts')) {
    return {
      impactArea: 'Proof readiness',
      impact: `Converts discovery into a validation path the ${technicalOwner} can trust, including blockers, data needed, assumptions, and technical success criteria.`,
      value: 'Reduces demo theater by making the proof answer the exact risk, workflow, or adoption question the customer raised.',
      timing: 'Bring in once the AE has confirmed pain, stakeholder ownership, and the first proof scenario.',
      deliverable: 'Technical validation plan, demo boundaries, blocker list, and success criteria for the next customer session.',
    };
  }

  if (normalizedRole.includes('partner')) {
    return {
      impactArea: 'Ecosystem scale',
      impact: 'Identifies whether a partner can accelerate the customer outcome, provide implementation capacity, or package the workshop/demo in a way the SMB buyer can act on.',
      value: `Gives ${accountName} confidence that Microsoft has a practical path from discovery to execution.`,
      timing: 'Bring in when the customer needs delivery confidence, industry proof, migration support, or a partner-led demo/workshop.',
      deliverable: 'Partner recommendation, outreach plan, demo role split, NDA/readiness checklist, and customer-facing partner value statement.',
    };
  }

  if (normalizedRole.includes('copilot')) {
    return {
      impactArea: 'AI proof',
      impact: `Builds a persona-specific Copilot scenario around "${context.topSignal}" and defines what must be true for the customer to believe it will change work behavior.`,
      value: 'Moves the AI conversation from interest to a measurable workflow proof with adoption and governance questions included.',
      timing: 'Bring in after at least one stakeholder names the work that is slow, repetitive, or hard to scale.',
      deliverable: 'Copilot scenario map, demo script, adoption guardrails, and stakeholder-specific proof question.',
    };
  }

  if (normalizedRole.includes('power bi') || normalizedRole.includes('fabric') || normalizedRole.includes('data')) {
    return {
      impactArea: 'Decision intelligence',
      impact: 'Connects manual reporting, disconnected data, and forecast confidence signals to an executive decision workflow.',
      value: `Helps ${accountName} understand which decisions would improve if leaders trusted the data and dashboard rhythm.`,
      timing: 'Bring in when the customer mentions reporting delays, dashboard gaps, data silos, forecasting, or operating cadence.',
      deliverable: 'Data-estate whiteboard, decision dashboard outline, reporting pain summary, and analytics proof criteria.',
    };
  }

  if (normalizedRole.includes('security') || normalizedRole.includes('defender') || normalizedRole.includes('sentinel')) {
    return {
      impactArea: 'Risk confidence',
      impact: 'Translates security, alert, endpoint, identity, or incident-response concerns into CISO-ready validation language.',
      value: 'Shows the customer how the Microsoft motion can reduce risk while giving technical leaders a clear proof path.',
      timing: 'Bring in before any security validation, CISO meeting, risk review, or technical objection handling session.',
      deliverable: 'Security discovery agenda, validation scenario, risk narrative, and proof requirements for the CISO or IT owner.',
    };
  }

  if (normalizedRole.includes('identity') || normalizedRole.includes('entra')) {
    return {
      impactArea: 'Access control',
      impact: 'Clarifies identity, access, governance, and control gaps so the customer can see the secure path to collaboration and AI usage.',
      value: `Helps ${accountName} avoid making the AI or productivity motion feel risky to IT and security leaders.`,
      timing: 'Bring in when access, governance, compliance, or secure collaboration becomes part of the decision path.',
      deliverable: 'Identity control map, stakeholder questions, governance blockers, and secure rollout assumptions.',
    };
  }

  if (normalizedRole.includes('adoption') || normalizedRole.includes('viva') || normalizedRole.includes('csam') || normalizedRole.includes('customer success')) {
    return {
      impactArea: 'Adoption confidence',
      impact: 'Connects discovery to behavior change, customer success measures, renewal confidence, and the ongoing value realization plan.',
      value: 'Helps the customer believe the motion will stick after the initial demo or pilot.',
      timing: 'Bring in when the conversation shifts from interest to usage, enablement, change management, or renewal confidence.',
      deliverable: 'Adoption plan, success measures, role-based enablement path, and value realization checkpoints.',
    };
  }

  if (normalizedRole.includes('executive sponsor')) {
    return {
      impactArea: 'Executive alignment',
      impact: `Sharpens the story for the ${economicBuyer}, pressure-tests the business outcome, and makes the narrative ready for a buying committee.`,
      value: 'Turns discovery findings into CFO, COO, CIO, or CISO language that can sponsor a decision.',
      timing: 'Bring in before executive readouts, EBRs, stakeholder recap emails, and stage-exit conversations.',
      deliverable: 'Executive talk track, decision memo, stakeholder alignment risks, and value narrative for the next senior meeting.',
    };
  }

  return {
    impactArea: 'Customer deliverable',
    impact: `Owns a specific customer-facing workstream tied to ${signal}, so the account team is not relying on generic follow-up.`,
    value: `Helps ${accountName} see a clearer path from discovery to proof and decision.`,
    timing: 'Bring in once their expertise is tied to a named stakeholder question, blocker, or proof requirement.',
    deliverable: 'Named customer deliverable, follow-up question set, and clear owner for the next meeting.',
  };
}

function dedupeTeamMembers(members = []) {
  const seen = new Set();
  return members.filter((member) => {
    const key = normalizeRole(member.role);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sanitizeCustomerAction(action = '') {
  if (!action) return '';
  if (/support the discovery motion/i.test(action)) return '';
  if (/where are teams losing time|which operational decisions|help translate discovery findings/i.test(action)) return '';
  return action;
}

function normalizeRole(role = '') {
  return String(role).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
