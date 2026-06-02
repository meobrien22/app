export const personaTemplates = [
  {
    id: 'coo',
    role: 'COO',
    title: 'Operations Executive',
    priorities: ['Operational visibility', 'Process consistency', 'Faster handoffs'],
    commonPains: ['Process friction', 'Manual reporting', 'Frontline execution gaps'],
    messaging: 'Lead with operating rhythm, ownership clarity, and workflow improvement.',
    renewalAngle: 'Anchor renewal messaging on whether the current platform helps operations move faster with less rework.',
    newsAngles: ['Expansion pressure', 'service quality', 'operational efficiency', 'frontline productivity'],
  },
  {
    id: 'cfo',
    role: 'CFO',
    title: 'Finance Executive',
    priorities: ['Decision confidence', 'Governance', 'Forecast reliability'],
    commonPains: ['Business case clarity', 'Manual reconciliation', 'Risk exposure'],
    messaging: 'Lead with measurable business outcomes, governance confidence, and decision criteria.',
    renewalAngle: 'Frame renewal around adoption proof, risk reduction, and clear executive decision criteria.',
    newsAngles: ['Earnings pressure', 'margin discipline', 'forecast confidence', 'governance'],
  },
  {
    id: 'cio',
    role: 'CIO',
    title: 'Technology Executive',
    priorities: ['Platform simplification', 'Security posture', 'Adoption readiness'],
    commonPains: ['Integration friction', 'Identity complexity', 'Support load'],
    messaging: 'Lead with architecture fit, governance, secure adoption, and platform consolidation.',
    renewalAngle: 'Tie renewal to technical proof, stakeholder adoption, and platform simplification.',
    newsAngles: ['Digital transformation', 'security modernization', 'data platform', 'AI readiness'],
  },
  {
    id: 'caio',
    role: 'CAIO',
    title: 'AI Strategy Executive',
    priorities: ['AI use-case portfolio', 'Responsible AI governance', 'Adoption measurement'],
    commonPains: ['AI pilot sprawl', 'Unclear governance', 'Unmeasured productivity impact'],
    messaging: 'Lead with governed AI scale, use-case prioritization, trust, and measurable adoption.',
    renewalAngle: 'Frame renewal around whether Microsoft can help AI move from experiments to governed business impact.',
    newsAngles: ['AI strategy', 'responsible AI', 'agent governance', 'AI adoption measurement'],
  },
  {
    id: 'ceo',
    role: 'CEO',
    title: 'Company Executive',
    priorities: ['Growth', 'Strategic alignment', 'Operating model'],
    commonPains: ['Slow decisions', 'Missed alignment', 'Market differentiation'],
    messaging: 'Lead with the strategic outcome, executive alignment, and what changes in the operating model.',
    renewalAngle: 'Make renewal messaging about strategic momentum and executive-visible outcomes.',
    newsAngles: ['Growth strategy', 'AI transformation', 'market expansion', 'leadership priorities'],
  },
  {
    id: 'ciso',
    role: 'CISO',
    title: 'Security Executive',
    priorities: ['Risk reduction', 'Identity control', 'Incident readiness'],
    commonPains: ['Alert fatigue', 'Endpoint exposure', 'Sensitive data risk'],
    messaging: 'Lead with risk narrative, control maturity, and faster investigation paths.',
    renewalAngle: 'Center renewal around risk visibility, policy confidence, and security operating maturity.',
    newsAngles: ['Security incident trends', 'regulatory pressure', 'identity risk', 'threat detection'],
  },
  {
    id: 'chro',
    role: 'CHRO',
    title: 'People Executive',
    priorities: ['Employee experience', 'Change readiness', 'Manager enablement'],
    commonPains: ['Adoption gaps', 'Training fatigue', 'Engagement signals'],
    messaging: 'Lead with adoption, employee experience, manager enablement, and change communication.',
    renewalAngle: 'Connect renewal to employee adoption, change readiness, and measurable enablement.',
    newsAngles: ['Workforce change', 'employee productivity', 'manager effectiveness', 'skills growth'],
  },
  {
    id: 'cpo',
    role: 'CPO',
    title: 'Product Executive',
    priorities: ['Roadmap confidence', 'Customer feedback loops', 'Launch readiness'],
    commonPains: ['Lost customer learning', 'Cross-functional execution gaps', 'Slow roadmap decisions'],
    messaging: 'Lead with customer learning, launch quality, and product-team follow-through.',
    renewalAngle: 'Connect renewal to better feedback loops, roadmap confidence, and cross-functional execution.',
    newsAngles: ['Product launch', 'customer retention', 'roadmap pressure', 'competitive differentiation'],
  },
  {
    id: 'cmo',
    role: 'CMO',
    title: 'Marketing Executive',
    priorities: ['Customer insight', 'Campaign velocity', 'Content governance'],
    commonPains: ['Content bottlenecks', 'Campaign handoffs', 'Customer signal fragmentation'],
    messaging: 'Lead with content velocity, customer insight, and governed AI-assisted marketing execution.',
    renewalAngle: 'Frame renewal around campaign execution speed, insight quality, and governed collaboration.',
    newsAngles: ['Campaign performance', 'brand governance', 'customer insight', 'content operations'],
  },
];

export const industryPersonaDefaults = {
  Retail: {
    coo: ['Store and frontline execution', 'customer service handoffs', 'operational consistency'],
    cfo: ['Margin visibility', 'labor productivity', 'renewal business case clarity'],
    cio: ['Secure frontline access', 'device governance', 'distributed support visibility'],
    caio: ['Frontline AI adoption', 'customer-service AI guardrails', 'AI workflow governance'],
  },
  'Consumer Goods': {
    coo: ['Supply chain visibility', 'quality follow-through', 'commercial execution'],
    cfo: ['Demand planning confidence', 'margin reporting', 'forecast consistency'],
    cio: ['Data platform simplification', 'secure collaboration', 'analytics trust'],
    caio: ['AI demand signals', 'governed product insights', 'responsible AI adoption'],
  },
  Manufacturing: {
    coo: ['Plant productivity', 'maintenance visibility', 'quality issue resolution'],
    cfo: ['Working capital visibility', 'operational variance', 'forecast confidence'],
    cio: ['OT/IT governance', 'secure devices', 'data estate modernization'],
    caio: ['Digital twin readiness', 'shop-floor AI governance', 'predictive operations'],
  },
  Software: {
    coo: ['Customer operations visibility', 'support workflow speed', 'cross-functional execution'],
    cfo: ['Retention signals', 'forecast confidence', 'operating leverage'],
    cio: ['SaaS governance', 'secure collaboration', 'data platform readiness'],
    caio: ['AI product operations', 'governed Copilot adoption', 'AI use-case portfolio'],
  },
  'Financial Services': {
    coo: ['Workflow control', 'approval speed', 'operational risk visibility'],
    cfo: ['Audit readiness', 'forecast confidence', 'governed reporting'],
    cio: ['Identity controls', 'compliance architecture', 'secure data access'],
    caio: ['Responsible AI governance', 'AI controls', 'risk-aware automation'],
  },
  Healthcare: {
    coo: ['Care-team coordination', 'documentation burden', 'service consistency'],
    cfo: ['Cost-to-serve visibility', 'compliance confidence', 'capacity planning'],
    cio: ['Secure collaboration', 'identity governance', 'data protection'],
    caio: ['AI documentation support', 'privacy-aware AI adoption', 'clinical workflow guardrails'],
  },
  Construction: {
    coo: ['Field productivity', 'project visibility', 'manual handoff reduction'],
    cfo: ['Project margin visibility', 'forecast confidence', 'change-order reporting'],
    cio: ['Mobile endpoint management', 'field access security', 'data integration'],
    caio: ['AI project controls', 'field workflow automation', 'construction data governance'],
  },
  Cybersecurity: {
    coo: ['Incident response operating model', 'customer trust', 'team execution'],
    cfo: ['Risk exposure clarity', 'security investment narrative', 'renewal confidence'],
    cio: ['Threat visibility', 'identity controls', 'security platform simplification'],
    caio: ['AI-assisted security operations', 'AI risk controls', 'secure automation'],
  },
  Education: {
    coo: ['Learning operations', 'content workflow', 'student support visibility'],
    cfo: ['Program performance', 'resource planning', 'growth reporting'],
    cio: ['Secure learning access', 'data governance', 'platform simplification'],
    caio: ['Personalized learning AI', 'responsible AI policy', 'AI adoption measurement'],
  },
  'Professional Services': {
    coo: ['Client delivery consistency', 'knowledge reuse', 'project handoff quality'],
    cfo: ['Utilization visibility', 'margin confidence', 'renewal business case'],
    cio: ['External collaboration security', 'identity lifecycle', 'knowledge governance'],
    caio: ['Service delivery AI', 'expertise scaling', 'responsible AI controls'],
  },
  'Real Estate': {
    coo: ['Portfolio workflow visibility', 'resident issue routing', 'property-team handoffs'],
    cfo: ['Portfolio reporting confidence', 'forecast consistency', 'margin visibility'],
    cio: ['SaaS integration governance', 'secure property-team access', 'support load reduction'],
    caio: ['Property operations copilots', 'resident-service AI guardrails', 'AI workflow governance'],
  },
  'Business Services': {
    coo: ['Customer operations visibility', 'service workflow speed', 'ownership clarity'],
    cfo: ['Customer retention signals', 'account health reporting', 'forecast confidence'],
    cio: ['Secure collaboration', 'data integration', 'platform governance'],
    caio: ['AI customer support guardrails', 'workflow automation', 'insight generation'],
  },
  'Property technology': {
    coo: ['Portfolio workflow visibility', 'resident issue routing', 'property-team handoffs'],
    cfo: ['Portfolio reporting confidence', 'forecast consistency', 'margin visibility'],
    cio: ['SaaS integration governance', 'secure property-team access', 'support load reduction'],
    caio: ['Property operations copilots', 'resident-service AI guardrails', 'AI workflow governance'],
  },
  'Restaurant technology': {
    coo: ['Support workflow speed', 'restaurant customer health', 'operational escalation paths'],
    cfo: ['Customer retention signals', 'account health reporting', 'forecast confidence'],
    cio: ['Distributed support security', 'endpoint posture', 'platform data visibility'],
    caio: ['Frontline AI adoption', 'service automation governance', 'AI customer support guardrails'],
  },
  'Marketing technology': {
    cmo: ['Campaign execution velocity', 'content governance', 'customer insight quality'],
    cio: ['AI governance', 'secure collaboration', 'data integration'],
    chro: ['Adoption readiness', 'change communication', 'manager enablement'],
    caio: ['AI content governance', 'campaign AI guardrails', 'customer insight automation'],
  },
  default: {
    ceo: ['Strategic alignment', 'growth execution', 'operating model clarity'],
    coo: ['Process friction', 'ownership clarity', 'operational visibility'],
    cfo: ['Business case clarity', 'decision confidence', 'governance'],
    cio: ['Platform simplification', 'security posture', 'adoption readiness'],
    caio: ['AI use-case portfolio', 'responsible AI governance', 'adoption measurement'],
    cpo: ['Roadmap confidence', 'customer feedback loops', 'launch readiness'],
    ciso: ['Risk visibility', 'identity control', 'incident readiness'],
    chro: ['Employee experience', 'change readiness', 'training adoption'],
  },
};

export function personaIdFromRole(role = '') {
  const normalized = role.toLowerCase();
  if (
    /\bcaio\b/.test(normalized)
    || normalized.includes('chief ai')
    || normalized.includes('chief artificial intelligence')
    || normalized.includes('ai officer')
    || normalized.includes('ai strategy')
    || normalized.includes('responsible ai')
  ) return 'caio';
  if (normalized.includes('operations') || normalized.includes('coo')) return 'coo';
  if (normalized.includes('finance') || normalized.includes('financial') || normalized.includes('cfo')) return 'cfo';
  if (normalized.includes('information') || normalized.includes('cio') || normalized.includes('it ')) return 'cio';
  if (normalized.includes('security') || normalized.includes('ciso')) return 'ciso';
  if (normalized.includes('people') || normalized.includes('human') || normalized.includes('chro')) return 'chro';
  if (normalized.includes('product') || normalized.includes('cpo')) return 'cpo';
  if (normalized.includes('marketing') || normalized.includes('cmo')) return 'cmo';
  if (normalized.includes('executive') || normalized.includes('ceo')) return 'ceo';
  return 'coo';
}

export function getIndustryPersonaSignals(industry, personaId) {
  const industryDefaults = industryPersonaDefaults[industry] ?? industryPersonaDefaults.default;
  return industryDefaults[personaId] ?? industryPersonaDefaults.default[personaId] ?? [];
}

export function buildPersonaUpdate(account, persona) {
  const trigger = account.trigger || 'New discovery signal captured';
  const renewal = account.contractContext?.renewalWindow || 'Unknown';
  const pain = account.selectedPains?.[0] || persona.commonPains[0];

  return {
    headline: `${persona.role} message for ${account.name}`,
    news: `Watch for ${persona.newsAngles.slice(0, 2).join(' and ')} signals. Current trigger: ${trigger}`,
    renewal: `Renewal window: ${renewal}. ${persona.renewalAngle}`,
    message: `${persona.messaging} Start with ${pain.toLowerCase()} and ask for the proof this persona needs to support the next step.`,
  };
}
