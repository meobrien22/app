import { buildStakeholderQuestionSet, getRoleProfile } from '../data/stakeholderDiscovery';
import { buildTriggerArticles } from './triggerSignals';
import {
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
  getDiscoveryGaps,
  getKeywordSolutionMap,
  getNextBestQuestions,
} from './scoring';

export const stakeholderKey = (stakeholder) =>
  `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

export function getActiveStakeholderContext(account, store) {
  const activeStakeholder = account.stakeholders?.find((stakeholder) => stakeholderKey(stakeholder) === store.activeStakeholderKey)
    ?? account.stakeholders?.[0];
  const activeKey = stakeholderKey(activeStakeholder);
  const meeting = store.stakeholderMeetings?.[activeKey];
  const profile = getRoleProfile(activeStakeholder?.role);

  return { activeStakeholder, activeKey, meeting, profile };
}

export function getQuestionCoachComment({ account, stakeholder, question, response = {} }) {
  const profile = getRoleProfile(stakeholder?.role);
  const yesNo = response.yesNo ?? 'Unknown';
  const capturedText = [response.answer, response.need, response.want].filter(Boolean).join(' ').toLowerCase();
  const mentionedKeyword = question.keywords?.find((keyword) => capturedText.includes(keyword));
  const hasAnswer = Boolean(response.answer || response.need || response.want || yesNo !== 'Unknown');
  const tone = yesNo.includes('No') ? 'orange' : yesNo.includes('Yes') ? 'emerald' : 'blue';

  const commentByMode = {
    'Yes': `Confirm the evidence behind the yes. Ask for an example, affected team, and success measure before moving on.`,
    'Yes and': `They expanded the answer. Capture the condition after "and" because it may become the proof requirement or next stakeholder ask.`,
    'No': `Do not push the motion yet. Ask what is preventing this, who disagrees, and what would need to change.`,
    'No and': `This is a blocker signal. Slow down, name the risk, and ask what proof would make the concern manageable.`,
    'Unknown': `Use this to clarify ownership. Ask who would know, what artifact exists, and whether this is a business or technical gap.`,
  };

  return {
    tone,
    comment: commentByMode[yesNo] ?? commentByMode.Unknown,
    listenFor: [
      mentionedKeyword ? `Double-click on "${mentionedKeyword}" and branch a follow-up question.` : `Listen for ${question.keywords?.slice(0, 3).join(', ')}.`,
      `Tie the answer back to ${profile.label} priorities: ${profile.focus}`,
      `Connect the language to ${account.targetMotion}, but keep it in customer outcome terms.`,
    ],
    suggestedFollowUp: hasAnswer
      ? buildFollowUpFromResponse(response, question, stakeholder)
      : question.question,
    solutionCue: `${profile.solutions.slice(0, 3).join(', ')} may be relevant if the stakeholder confirms evidence and urgency.`,
  };
}

export function getStakeholderCoachCards(account, stakeholder, meeting, keywordTally = {}) {
  const profile = getRoleProfile(stakeholder?.role);
  const questions = buildStakeholderQuestionSet(stakeholder);
  const responses = meeting?.responses ?? {};
  const unanswered = questions.find((question) => {
    const response = responses[question.id] ?? {};
    return !response.answer && !response.need && !response.want && (response.yesNo ?? 'Unknown') === 'Unknown';
  }) ?? questions[0];
  const translationSignals = getKeywordSolutionMap(account, { [meeting?.stakeholderKey ?? stakeholderKey(stakeholder)]: meeting }, keywordTally).slice(0, 3);

  return [
    {
      title: `Open with ${profile.label} language`,
      body: `Anchor on ${profile.focus} Ask what outcome matters before naming a Microsoft capability.`,
    },
    {
      title: 'Ask next',
      body: unanswered.question,
    },
    {
      title: 'Listen for',
      body: unanswered.keywords.slice(0, 5).join(', '),
    },
    {
      title: 'Translate to AE plan',
      body: translationSignals.length
        ? translationSignals.map((signal) => `${signal.keyword} -> ${signal.solutions.join(', ')}`).join('; ')
        : `Capture needs, wants, and exact stakeholder language before mapping to ${account.targetMotion}.`,
    },
  ];
}

export function getLiveCoachResponse({ prompt, account, stakeholder, meeting, keywordTally = {} }) {
  const normalized = String(prompt ?? '').toLowerCase();
  const profile = getRoleProfile(stakeholder?.role);
  const trigger = buildTriggerArticles(account)[0];
  const questions = getNextBestQuestions(account);
  const gaps = getDiscoveryGaps(account);
  const solutionSignals = getKeywordSolutionMap(account, { [meeting?.stakeholderKey ?? stakeholderKey(stakeholder)]: meeting }, keywordTally).slice(0, 4);

  if (!normalized.trim()) {
    return `For ${stakeholder?.name ?? 'this stakeholder'}, start with: "${questions[0] ?? 'What outcome matters most right now?'}" Then listen for language that proves urgency, ownership, and the next meeting path.`;
  }

  if (normalized.includes('objection') || normalized.includes('concern') || normalized.includes('no ')) {
    return `Treat this as a blocker discovery moment. Acknowledge it, ask what evidence would reduce the concern, and identify who else needs to validate it. Current risk to clean up: ${gaps[0] ?? 'keep the decision path clear'}.`;
  }

  if (normalized.includes('summary') || normalized.includes('recap')) {
    return `Executive recap: ${account.name} is showing ${account.selectedPains.slice(0, 2).join(' and ').toLowerCase()} signals. ${stakeholder?.role ?? 'The stakeholder'} cares about ${profile.focus.toLowerCase()} Next step: confirm the proof owner and map ${account.targetMotion} to the customer outcome.`;
  }

  if (normalized.includes('question') || normalized.includes('ask')) {
    return `Ask this next: "${questions[0] ?? 'Who owns the outcome and what would make this worth prioritizing?'}" If they answer with a condition, branch into "What must be true for that to work?"`;
  }

  if (normalized.includes('news') || normalized.includes('trigger')) {
    return `Use the current trigger as timing, not as a pitch. Signal: ${trigger.headline}. Ask ${stakeholder?.name ?? 'the stakeholder'} how that pressure changes priorities for their team.`;
  }

  if (solutionSignals.length) {
    return `I hear solution signals already: ${solutionSignals.map((signal) => `${signal.keyword} maps to ${signal.solutions.join('/')}`).join('; ')}. Validate pain evidence before moving to recommendations.`;
  }

  return `Coach note: keep this in ${profile.label} language. Clarify the outcome, ask for a recent example, confirm who owns the decision, and capture the exact words they use so the executive summary updates cleanly.`;
}

export function getPortfolioCoach(priorityAccounts) {
  const scored = priorityAccounts.map((account) => ({
    account,
    discovery: calculateDiscoveryScore(account).total,
    opportunity: calculateOpportunityScore(account).total,
    risk: calculateRiskScore(account).total,
  }));
  const topOpportunity = [...scored].sort((a, b) => b.opportunity - a.opportunity)[0];
  const highestRisk = [...scored].sort((a, b) => b.risk - a.risk)[0];
  const weakestDiscovery = [...scored].sort((a, b) => a.discovery - b.discovery)[0];

  return {
    prompt: 'Run today like a portfolio CEO: focus time where opportunity, renewal timing, partner fit, and executive access intersect.',
    actions: [
      `Prioritize ${topOpportunity.account.name}: strongest opportunity signal at ${topOpportunity.opportunity}.`,
      `Inspect ${highestRisk.account.name}: highest risk score at ${highestRisk.risk}; clean up owner, renewal path, or next meeting.`,
      `Coach discovery quality on ${weakestDiscovery.account.name}: readiness is ${weakestDiscovery.discovery}; use stakeholder-specific questions before the next touch.`,
    ],
    accounts: [topOpportunity.account, highestRisk.account, weakestDiscovery.account],
  };
}

function buildFollowUpFromResponse(response, question, stakeholder) {
  const selectedText = response.need || response.want || response.answer || question.keywords?.[0] || 'that';
  const mode = response.yesNo ?? 'Unknown';
  if (mode.includes('No')) return `What is preventing "${selectedText}" from working today, and who would need to be convinced?`;
  if (mode.includes('Yes')) return `Can you give me a recent example of "${selectedText}" and how you would measure improvement?`;
  return `Who is closest to "${selectedText}", and what would they say is the current blocker?`;
}

