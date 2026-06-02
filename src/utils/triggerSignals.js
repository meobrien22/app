const eventTypeRules = [
  { type: 'Merger / acquisition', terms: ['merger', 'acquisition', 'm&a', 'integration', 'consolidation'] },
  { type: 'Product release', terms: ['product', 'launch', 'release', 'roadmap', 'platform'] },
  { type: 'Large layoffs / workforce change', terms: ['layoff', 'labor', 'workforce', 'headcount', 'hiring'] },
  { type: 'Security incident / risk', terms: ['security', 'identity', 'threat', 'risk', 'breach'] },
  { type: 'Earnings / guidance', terms: ['earnings', 'margin', 'forecast', 'growth', 'profit'] },
  { type: 'Regulatory / compliance', terms: ['compliance', 'regulatory', 'governance', 'audit'] },
  { type: 'Leadership priority', terms: ['leadership', 'ceo', 'executive', 'strategy', 'priority'] },
  { type: 'Partner / channel motion', terms: ['partner', 'channel', 'ecosystem', 'co-sell'] },
];

export function buildTriggerArticles(account) {
  const safeAccount = account ?? {
    name: 'Active account',
    industry: 'SMB portfolio',
    targetMotion: 'Microsoft discovery motion',
    selectedPains: ['business priority'],
    keywords: ['operating signal'],
    trigger: 'New account signal captured for discovery follow-up.',
    contractContext: {},
  };
  const keywords = [...(safeAccount.keywords ?? []), ...(safeAccount.selectedPains ?? []), safeAccount.trigger, safeAccount.industry]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());
  const primaryType = findTriggerType(keywords);
  const topPain = safeAccount.selectedPains?.[0] ?? 'business priority';
  const topKeyword = safeAccount.keywords?.[0] ?? topPain;
  const renewalWindow = safeAccount.contractContext?.renewalWindow ?? 'unknown';

  return [
    {
      id: 'primary-trigger',
      type: primaryType,
      updated: formatUpdated(0),
      headline: `${safeAccount.name} signal: ${topKeyword} is creating a discovery opening`,
      summary: safeAccount.trigger,
      aeImpact: `Use this to connect ${topPain.toLowerCase()} to ${safeAccount.targetMotion}.`,
      question: `What changed recently that made ${topPain.toLowerCase()} important now?`,
    },
    {
      id: 'renewal-process',
      type: 'Renewal / procurement',
      updated: formatUpdated(1),
      headline: `${safeAccount.name} renewal path needs business-owner validation`,
      summary: `Renewal window is ${renewalWindow}; procurement is ${safeAccount.contractContext?.procurement ?? 'unknown'}.`,
      aeImpact: 'Use this to confirm the decision path before discovery turns into a stalled proof.',
      question: 'Who needs to agree that this business problem is worth solving before renewal planning starts?',
    },
    {
      id: 'persona-priority',
      type: 'Leadership priority',
      updated: formatUpdated(2),
      headline: `${safeAccount.industry} leaders are prioritizing execution clarity`,
      summary: `${safeAccount.name} discovery notes point to ${safeAccount.selectedPains?.slice(0, 2).join(' and ').toLowerCase() || 'operating friction'}.`,
      aeImpact: 'Use this to tailor the next meeting by persona instead of leading with products.',
      question: 'Which executive metric would prove this issue is worth acting on this quarter?',
    },
    {
      id: 'competitive-watch',
      type: pickSecondaryType(keywords),
      updated: formatUpdated(3),
      headline: `${safeAccount.name} has a Microsoft mapping angle to validate`,
      summary: `Top fit signals currently point toward ${safeAccount.targetMotion} with add-on discovery still to confirm.`,
      aeImpact: 'Use this to pressure-test whether Microsoft is a business outcome motion, not a generic platform conversation.',
      question: 'What current tool, workflow, or vendor creates the most friction for the team today?',
    },
  ];
}

export function getTriggerTypes(account) {
  return [...new Set(buildTriggerArticles(account).map((article) => article.type))].slice(0, 4);
}

function findTriggerType(keywords) {
  const match = eventTypeRules.find((rule) => rule.terms.some((term) => keywords.some((keyword) => keyword.includes(term))));
  return match?.type ?? 'Industry operating signal';
}

function pickSecondaryType(keywords) {
  const matched = eventTypeRules.filter((rule) => rule.terms.some((term) => keywords.some((keyword) => keyword.includes(term))));
  return matched[1]?.type ?? 'Competitive / market signal';
}

function formatUpdated(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `Updated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
