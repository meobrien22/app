import { sampleAccounts } from './discoveryData';
import { buildLicenseContext } from '../utils/licensePlanning';

const accountBlueprints = [
  ['toast', 'Toast', 'Restaurant technology', 'ME5 security + Copilot', 9, ['AI productivity', 'Security risk', 'Manual reporting'], ['restaurant operations', 'customer service automation', 'secure frontline'], '1 quarter'],
  ['procore', 'Procore', 'Construction technology', 'ME5 + frontline operations', 9, ['Frontline operations', 'Data silos', 'Device management'], ['field productivity', 'project visibility', 'mobile endpoints'], '2 quarters'],
  ['bill', 'BILL', 'Financial operations software', 'ME5 + governance', 8, ['Compliance pressure', 'Manual reporting', 'AI productivity'], ['finance workflow', 'audit readiness', 'approval automation'], '2 quarters'],
  ['blackline', 'BlackLine', 'Financial software', 'Copilot + Fabric readiness', 8, ['Manual reporting', 'Data silos', 'Compliance pressure'], ['close process', 'forecast confidence', 'governed analytics'], '3 quarters'],
  ['smartsheet', 'Smartsheet', 'Work management software', 'Copilot + Teams Premium', 8, ['Hybrid work friction', 'Manual reporting', 'AI productivity'], ['project collaboration', 'meeting follow-up', 'work orchestration'], '6 months'],
  ['asana', 'Asana', 'Work management software', 'Copilot + Viva adoption', 8, ['Change management', 'Hybrid work friction', 'AI productivity'], ['team execution', 'adoption measurement', 'manager enablement'], '3 quarters'],
  ['box', 'Box', 'Content cloud', 'Purview + Copilot readiness', 8, ['Compliance pressure', 'Data silos', 'Security risk'], ['content governance', 'secure AI', 'records management'], '4 quarters'],
  ['dropbox', 'Dropbox', 'Content collaboration', 'ME5 + Copilot readiness', 7, ['Hybrid work friction', 'Security risk', 'AI productivity'], ['secure collaboration', 'content velocity', 'identity controls'], '2 quarters'],
  ['freshworks', 'Freshworks', 'Customer support software', 'Copilot + Power BI', 8, ['AI productivity', 'Manual reporting', 'Data silos'], ['support productivity', 'customer health', 'dashboard gaps'], '1 quarter'],
  ['zendesk', 'Zendesk', 'Customer service software', 'ME5 + AI service motions', 8, ['AI productivity', 'Security risk', 'Data silos'], ['agent productivity', 'secure support', 'customer insight'], '2 quarters'],
  ['datadog', 'Datadog', 'Cloud monitoring software', 'Security + data estate', 8, ['Security risk', 'Data silos', 'Competitive displacement'], ['cloud security', 'incident visibility', 'engineering productivity'], '3 quarters'],
  ['cloudflare', 'Cloudflare', 'Cybersecurity and networking', 'Security + Copilot', 9, ['Security risk', 'Identity complexity', 'AI productivity'], ['threat visibility', 'identity controls', 'AI-assisted operations'], '2 quarters'],
  ['crowdstrike', 'CrowdStrike', 'Cybersecurity software', 'Security co-sell readiness', 7, ['Security risk', 'Competitive displacement', 'Data silos'], ['security operations', 'partner motion', 'executive risk'], '4 quarters'],
  ['elastic', 'Elastic', 'Search and analytics software', 'Fabric + security analytics', 7, ['Data silos', 'Security risk', 'Manual reporting'], ['search analytics', 'security visibility', 'data platform'], '3 quarters'],
  ['docusign', 'DocuSign', 'Agreement workflow software', 'Copilot + governance', 8, ['Manual reporting', 'Compliance pressure', 'AI productivity'], ['agreement workflow', 'contract intelligence', 'governance'], '6 months'],
  ['paylocity', 'Paylocity', 'HR software', 'Viva + Copilot', 8, ['Change management', 'AI productivity', 'Manual reporting'], ['employee experience', 'manager enablement', 'HR reporting'], '2 quarters'],
  ['paycom', 'Paycom', 'HR and payroll software', 'ME5 + Viva', 7, ['Compliance pressure', 'Change management', 'Identity complexity'], ['payroll governance', 'employee adoption', 'identity lifecycle'], '3 quarters'],
  ['zoominfo', 'ZoomInfo', 'Sales intelligence software', 'Copilot + Power BI', 8, ['AI productivity', 'Data silos', 'Manual reporting'], ['seller productivity', 'pipeline intelligence', 'data governance'], '2 quarters'],
  ['braze', 'Braze', 'Customer engagement software', 'Copilot + Purview', 7, ['AI productivity', 'Compliance pressure', 'Data silos'], ['campaign velocity', 'customer insight', 'content governance'], '4 quarters'],
  ['yext', 'Yext', 'Digital experience software', 'Copilot + Fabric', 7, ['Data silos', 'AI productivity', 'Manual reporting'], ['content accuracy', 'search insights', 'analytics trust'], '3 quarters'],
  ['c3ai', 'C3 AI', 'Enterprise AI software', 'AI governance + Fabric', 8, ['AI productivity', 'Compliance pressure', 'Data silos'], ['AI governance', 'data estate', 'executive AI strategy'], '2 quarters'],
  ['upwork', 'Upwork', 'Talent marketplace', 'Copilot + Entra', 8, ['Identity complexity', 'Hybrid work friction', 'AI productivity'], ['external collaboration', 'secure access', 'talent operations'], '1 quarter'],
  ['fiverr', 'Fiverr', 'Talent marketplace', 'ME5 + Copilot readiness', 7, ['Security risk', 'AI productivity', 'Manual reporting'], ['marketplace operations', 'secure collaboration', 'seller productivity'], '3 quarters'],
  ['legalzoom', 'LegalZoom', 'Legal services technology', 'Purview + Copilot', 7, ['Compliance pressure', 'Manual reporting', 'Security risk'], ['records governance', 'customer workflow', 'sensitive data'], '2 quarters'],
  ['etsy', 'Etsy', 'Digital commerce', 'Copilot + Power BI', 8, ['Manual reporting', 'Data silos', 'Frontline operations'], ['seller support', 'marketplace insight', 'support productivity'], '3 quarters'],
  ['warby-parker', 'Warby Parker', 'Retail healthcare', 'Frontline + Copilot', 7, ['Frontline operations', 'Device management', 'Hybrid work friction'], ['store operations', 'field devices', 'customer experience'], '2 quarters'],
  ['sweetgreen', 'Sweetgreen', 'Restaurant retail', 'Frontline + Power Platform', 7, ['Frontline operations', 'Manual reporting', 'Device management'], ['store execution', 'shift reporting', 'workflow automation'], '1 quarter'],
  ['allbirds', 'Allbirds', 'Consumer retail', 'Viva + Teams Premium', 6, ['Change management', 'Hybrid work friction', 'Manual reporting'], ['retail operations', 'sustainability reporting', 'team alignment'], '4 quarters'],
  ['brilliant-earth', 'Brilliant Earth', 'Jewelry retail', 'Security + customer insight', 7, ['Security risk', 'Compliance pressure', 'Manual reporting'], ['secure retail', 'customer insight', 'governance'], '3 quarters'],
  ['duolingo', 'Duolingo', 'Education technology', 'Copilot + Fabric', 8, ['AI productivity', 'Data silos', 'Change management'], ['learning analytics', 'content operations', 'AI experimentation'], '2 quarters'],
];

const stakeholderSets = {
  default: [
    { name: 'Alex Morgan', role: 'CEO', influence: 'Executive Sponsor', sentiment: 'Supportive' },
    { name: 'Jordan Lee', role: 'CFO', influence: 'Economic Buyer', sentiment: 'Neutral' },
    { name: 'Casey Patel', role: 'CIO', influence: 'Technical Owner', sentiment: 'Supportive' },
    { name: 'Riley Chen', role: 'COO', influence: 'Business Owner', sentiment: 'Supportive' },
    { name: 'Taylor Brooks', role: 'CISO', influence: 'Risk Owner', sentiment: 'Neutral' },
  ],
  retail: [
    { name: 'Alex Morgan', role: 'CEO', influence: 'Executive Sponsor', sentiment: 'Supportive' },
    { name: 'Jordan Lee', role: 'CFO', influence: 'Economic Buyer', sentiment: 'Supportive' },
    { name: 'Riley Chen', role: 'COO', influence: 'Business Owner', sentiment: 'Supportive' },
    { name: 'Casey Patel', role: 'CIO', influence: 'Technical Owner', sentiment: 'Neutral' },
    { name: 'Taylor Brooks', role: 'VP Store Operations', influence: 'Champion', sentiment: 'Supportive' },
  ],
};

export const verticalTrends = [
  { vertical: 'SaaS and software', trend: 'AI agents moving from pilots to governed workflows', motion: 'Copilot, Agent 365, Purview, Fabric', priority: 'High' },
  { vertical: 'Retail and restaurants', trend: 'Frontline productivity, secure devices, and store execution', motion: 'Teams Premium, Intune, Power Platform', priority: 'High' },
  { vertical: 'Financial services and fintech', trend: 'Governance, forecast confidence, and audit-ready AI', motion: 'Purview, Fabric, Copilot', priority: 'High' },
  { vertical: 'Healthcare and wellness', trend: 'Secure collaboration, documentation burden, and compliance', motion: 'ME5, Purview, Teams Premium', priority: 'Medium' },
  { vertical: 'Cybersecurity and infrastructure', trend: 'Threat visibility, identity controls, and AI-assisted SecOps', motion: 'Defender, Sentinel, Entra', priority: 'High' },
  { vertical: 'Education and talent', trend: 'Personalized learning, skill growth, and secure external access', motion: 'Copilot, Viva, Entra', priority: 'Medium' },
];

export const horizontalTrends = [
  { category: 'AI readiness', signal: 'Copilot adoption requires data, security, governance, and change readiness', score: 86 },
  { category: 'Security', signal: 'Known gaps and identity exposure remain executive-level risk conversations', score: 84 },
  { category: 'Frontline operations', signal: 'SMB customers need simple, partner-led workflow modernization', score: 78 },
  { category: 'Data and analytics', signal: 'Manual reporting and disconnected data are repeatable discovery entry points', score: 82 },
  { category: 'Partner ecosystem', signal: 'Channels-led packaged motions matter for SMB scale and repeatability', score: 88 },
];

export const trendSources = [
  'Microsoft Work Trend Index: AI agents and Frontier Firms',
  'Microsoft Digital Defense Report: security gaps and cloud threat trends',
  'Microsoft partner SMB guidance: partner-led Copilot, security, and managed services motions',
];

const sampleAccountIds = new Set(sampleAccounts.map((account) => account.id));

const generatedAccounts = accountBlueprints.map((blueprint, index) => {
  const [id, name, industry, targetMotion, triggerScore, selectedPains, keywords, renewalWindow] = blueprint;
  const accountId = sampleAccountIds.has(id) ? `${id}-portfolio` : id;
  const retailish = /retail|restaurant|healthcare/i.test(industry);
  const genericIndustry = getGenericIndustryLabel(industry);
  const priorityScore = 96 - index;
  const opportunity = Math.max(74, 94 - (index % 14));

  return {
    id: accountId,
    name,
    industry: genericIndustry,
    originalIndustry: industry,
    segment: 'SMB and Channels priority account',
    publicContext: 'Public-company-inspired SMB/Channels account used for AE portfolio planning and discovery demonstration.',
    currentLevel: index % 3 === 0 ? 'ME5' : 'ME3',
    targetMotion,
    priorityScore,
    triggerScore,
    trigger: `${genericIndustry} signal: ${keywords[0]} and ${keywords[1]} are creating a timely Microsoft discovery opening.`,
    selectedPains,
    keywords,
    stakeholders: retailish ? stakeholderSets.retail : stakeholderSets.default,
    contractContext: {
      renewalWindow,
      status: index % 4 === 0 ? 'Competitive review' : 'Discovery before renewal',
      satisfaction: index % 5 === 0 ? 'Mixed' : 'Positive',
      procurement: index % 6 === 0 ? 'Unknown' : 'Known',
      businessCase: index % 3 === 0 ? 'Needed' : 'Likely',
      currentTools: ['Mixed productivity stack', 'point reporting tools', 'security point solutions'],
      adoptionGaps: ['Inconsistent stakeholder adoption', 'Manual executive reporting'],
      blockers: index % 7 === 0 ? ['Need clearer executive owner'] : ['Need tighter success criteria'],
    },
    objections: index % 6 === 0 ? ['Customer wants clearer adoption proof before expanding.'] : ['Need to quantify business impact in executive language.'],
    notes: `${name} has discovery signals around ${selectedPains.join(', ').toLowerCase()} with a strong opportunity to map business priorities to Microsoft outcomes.`,
    nextSteps: ['Confirm executive sponsor', 'Run MCEM discovery workshop', 'Map persona-specific next-best action'],
    vTeam: ['AE', 'Modern Work SSP', 'Technical Specialist', index % 3 === 0 ? 'Partner Lead' : 'CSAM'],
    executiveNarrative: `${name} can use Microsoft to turn ${keywords[0]} into a governed, secure, and measurable transformation motion.`,
    scoreInputs: {
      accountCompleteness: 13,
      stakeholderCoverage: index % 8 === 0 ? 12 : 15,
      painClarity: 13,
      businessPriorityAlignment: 8,
      triggerUrgency: Math.min(15, triggerScore + 5),
      budgetProcessClarity: index % 6 === 0 ? 6 : 8,
      objectionsCaptured: 8,
      nextStepClarity: 8,
      microsoftMotionFit: 17,
      addOnSignalStrength: 12,
      competitiveDisplacementSignal: 9,
      renewalTiming: index % 6 === 0 ? 8 : 12,
      executiveSponsorClarity: index % 8 === 0 ? 10 : 14,
      adoptionReadiness: 8,
      vTeamFit: 9,
    },
    addOnSignals: {
      Copilot: opportunity,
      'Power BI': Math.max(68, opportunity - 5),
      Defender: Math.max(62, opportunity - 8),
      Fabric: Math.max(62, opportunity - 7),
      'Teams Premium': Math.max(58, opportunity - 10),
    },
  };
});

export const portfolioAccounts = [...sampleAccounts, ...generatedAccounts]
  .map((account, index) => ({
    ...account,
    originalIndustry: account.originalIndustry ?? account.industry,
    industry: getGenericIndustryLabel(account.industry),
    licenseContext: buildLicenseContext(account, index),
    priorityScore: account.priorityScore ?? Math.max(65, 94 - index),
    portfolioCategory: getPortfolioCategory(account),
  }))
  .sort((a, b) => b.priorityScore - a.priorityScore)
  .map((account, index) => ({ ...account, priorityRank: index + 1 }));

export const priorityAccounts = portfolioAccounts.slice(0, 50);

function getPortfolioCategory(account) {
  if ((account.contractContext?.renewalWindow ?? '').includes('1 quarter') || account.triggerScore >= 9) return 'Act now';
  if (account.priorityScore >= 86 || account.triggerScore >= 8) return 'High growth';
  if ((account.contractContext?.status ?? '').includes('Competitive')) return 'Competitive';
  return 'Nurture';
}

function getGenericIndustryLabel(industry = '') {
  const value = industry.toLowerCase();

  if (/restaurant|retail|commerce|jewelry|apparel|resale|pharmacy|ordering/.test(value)) return 'Retail';
  if (/consumer packaged|consumer goods|consumer electronics|imaging|content collaboration|content cloud/.test(value)) return 'Consumer Goods';
  if (/manufacturing|materials/.test(value)) return 'Manufacturing';
  if (/financial|finance|agreement workflow|payroll/.test(value)) return 'Financial Services';
  if (/healthcare|wellness/.test(value)) return 'Healthcare';
  if (/construction/.test(value)) return 'Construction';
  if (/cybersecurity|security|endpoint|networking/.test(value)) return 'Cybersecurity';
  if (/education|learning/.test(value)) return 'Education';
  if (/talent marketplace|legal services|hr software/.test(value)) return 'Professional Services';
  if (/property/.test(value)) return 'Real Estate';
  if (/marketing|sales intelligence|customer engagement|customer service|support/.test(value)) return 'Business Services';
  if (/ai software|software|saas|technology|cloud monitoring|analytics|search|work management|digital experience|subscription/.test(value)) return 'Software';

  return industry || 'Other';
}
