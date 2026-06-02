export const mcemStages = [
  {
    id: 'listen',
    label: 'Stage 1: Listen & Consult',
    title: 'Listen & Consult: customer discovery',
    objective: 'Start at the account level, understand the customer reality, map personas, capture business language, and convert stakeholder answers into a clear Microsoft discovery path.',
    exitCriteria: ['Customer context captured', 'Persona map started', 'Priority pain evidenced', 'Next discovery moment scheduled'],
    aiAssist: 'Generate persona-specific questions, branch follow-ups, objection prompts, and an executive-ready recap from the live discovery signals.',
    isReady: true,
  },
  {
    id: 'inspire',
    label: 'Stage 2: Inspire & Design',
    title: 'Inspire & Design: shape the transformation thesis',
    objective: 'Turn customer language into a business outcome hypothesis, Microsoft solution direction, partner strategy, and executive narrative.',
    exitCriteria: ['Transformation thesis drafted', 'Microsoft motion mapped', 'Partner need identified', 'Executive narrative started'],
    aiAssist: 'Recommend solution motions, partner roles, value hypotheses, and adoption blockers.',
    isReady: false,
  },
  {
    id: 'empower',
    label: 'Stage 3: Empower & Achieve',
    title: 'Empower & Achieve: prove, align, and reach agreement',
    objective: 'Bring the V-Team, partner team, demos, technical validation, business proof, stakeholder agreement, and close/commit motions into one customer-confidence stage.',
    exitCriteria: ['Proof path agreed', 'Demo or workshop completed', 'Decision makers aligned', 'Agreement path confirmed'],
    aiAssist: 'Draft demo paths, proof plans, objection responses, buying-committee guidance, and close-readiness actions by stakeholder.',
    isReady: false,
  },
  {
    id: 'realize',
    label: 'Stage 4: Realize Value',
    title: 'Realize Value: implement, adopt, and validate outcomes',
    objective: 'Track implementation, adoption, customer success scorecard, outcome proof, and early expansion signals.',
    exitCriteria: ['Value scorecard updated', 'Adoption gaps reviewed', 'Customer outcomes validated', 'Next EBR scheduled'],
    aiAssist: 'Turn usage, stakeholder feedback, and business results into value realization updates and EBR storylines.',
    isReady: false,
  },
  {
    id: 'optimize',
    label: 'Stage 5: Manage & Optimize',
    title: 'Manage & Optimize: protect value and find the next cycle',
    objective: 'Keep the customer healthy, monitor business outcomes, optimize adoption, and identify the next Listen & Consult cycle.',
    exitCriteria: ['Health rhythm established', 'Optimization actions assigned', 'Expansion signals reviewed', 'New discovery cycle identified'],
    aiAssist: 'Find optimization themes, expansion triggers, adoption risks, and next-cycle stakeholder questions.',
    isReady: false,
  },
];

export const executiveRoles = ['CEO', 'CFO', 'CIO', 'COO', 'CISO'];

export const industryTrendCatalog = [
  { trend: 'AI adoption', impact: 'High', solution: 'Copilot + governance', signal: 'AI productivity' },
  { trend: 'Labor shortage', impact: 'High', solution: 'Copilot + Power Platform', signal: 'Frontline operations' },
  { trend: 'Security pressure', impact: 'Critical', solution: 'Defender + Sentinel + Entra', signal: 'Security risk' },
  { trend: 'Data fragmentation', impact: 'High', solution: 'Fabric + Power BI', signal: 'Data silos' },
  { trend: 'Process friction', impact: 'High', solution: 'Power Platform + Teams Premium', signal: 'Manual reporting' },
  { trend: 'Compliance pressure', impact: 'Medium', solution: 'Purview + Entra', signal: 'Compliance pressure' },
];

export const partnerEcosystem = [
  { need: 'Security modernization', partner: 'Security specialist partner', motion: 'Defender, Sentinel, Entra' },
  { need: 'Data estate modernization', partner: 'Data and AI partner', motion: 'Fabric, Power BI' },
  { need: 'AI adoption and change', partner: 'Adoption partner', motion: 'Copilot, Viva' },
  { need: 'Workflow automation', partner: 'Business apps partner', motion: 'Power Platform' },
];

export const internalStakeholderRoster = [
  {
    role: 'Sales Manager',
    operatingFocus: 'Forecast quality, prioritization, inspection rhythm',
    dashboardSignal: 'Needs weekly view of act-now accounts, renewal risk, and executive access gaps',
    cadence: 'Weekly 1:1',
    status: 'Green',
  },
  {
    role: 'Modern Work SSP',
    operatingFocus: 'Copilot, Teams Premium, Viva, M365 expansion',
    dashboardSignal: 'Needs persona-specific Copilot scenarios and adoption blockers',
    cadence: 'Pipeline review',
    status: 'Green',
  },
  {
    role: 'Security SSP',
    operatingFocus: 'Defender, Sentinel, Entra, Purview security motions',
    dashboardSignal: 'Needs security-risk accounts, identity gaps, and CISO discovery asks',
    cadence: 'Biweekly',
    status: 'Green',
  },
  {
    role: 'Technical Specialist',
    operatingFocus: 'Technical proof, demos, architecture, feasibility',
    dashboardSignal: 'Needs demo-ready accounts and proof requirements by stage',
    cadence: 'By opportunity',
    status: 'Green',
  },
  {
    role: 'CSAM / Customer Success',
    operatingFocus: 'Adoption, consumption, health, renewal readiness',
    dashboardSignal: 'Needs adoption gaps, value scorecard status, and renewal milestones',
    cadence: 'Renewal rhythm',
    status: 'Yellow',
  },
  {
    role: 'Partner Development / Channel Lead',
    operatingFocus: 'Partner attach, managed services, packaged SMB motions',
    dashboardSignal: 'Needs partner-led plays and accounts needing implementation capacity',
    cadence: 'Monthly',
    status: 'Green',
  },
];

export const vTeamProductRoster = [
  {
    role: 'Copilot Specialist',
    products: ['Microsoft 365 Copilot', 'Copilot Studio'],
    canDo: ['Run AI productivity demo', 'Shape pilot use cases', 'Map adoption risks'],
    customerMeeting: 'Best for CEO, COO, CMO, CHRO, and functional productivity conversations.',
  },
  {
    role: 'Modern Work SSP',
    products: ['Microsoft 365', 'Teams Premium', 'Viva'],
    canDo: ['Position collaboration outcomes', 'Design adoption plan', 'Support EBR narrative'],
    customerMeeting: 'Best for executive collaboration, frontline, and employee experience discovery.',
  },
  {
    role: 'Security SSP',
    products: ['Defender', 'Sentinel', 'Entra'],
    canDo: ['Lead security workshop', 'Validate risk scenarios', 'Map identity and SecOps gaps'],
    customerMeeting: 'Best for CISO, CIO, risk, and compliance-oriented meetings.',
  },
  {
    role: 'Data and AI Specialist',
    products: ['Fabric', 'Power BI'],
    canDo: ['Demo governed analytics', 'Map reporting friction', 'Define data readiness plan'],
    customerMeeting: 'Best for CFO, COO, CIO, and analytics owner conversations.',
  },
  {
    role: 'Power Platform Specialist',
    products: ['Power Apps', 'Power Automate', 'Power Pages'],
    canDo: ['Identify workflow automation', 'Prototype process fix', 'Support citizen-dev governance'],
    customerMeeting: 'Best for process friction, manual reporting, and small-team execution gaps.',
  },
  {
    role: 'Endpoint / Intune Specialist',
    products: ['Intune', 'Windows 365', 'Frontline device management'],
    canDo: ['Assess device estate', 'Map frontline endpoint needs', 'Support setup plan'],
    customerMeeting: 'Best for frontline, retail, restaurant, healthcare, and distributed workforces.',
  },
  {
    role: 'Compliance / Purview Specialist',
    products: ['Purview', 'Entra governance'],
    canDo: ['Map sensitive data', 'Validate compliance needs', 'Support governance workshop'],
    customerMeeting: 'Best for legal, compliance, financial services, and regulated workflows.',
  },
  {
    role: 'Partner Lead',
    products: ['Partner services', 'Managed services', 'Adoption packages'],
    canDo: ['Find delivery partner', 'Build implementation path', 'Support customer workshop'],
    customerMeeting: 'Best when the customer needs delivery capacity, onboarding, or packaged services.',
  },
];

export function calculateExecutiveCoverage(account) {
  const presentRoles = new Set(
    (account.stakeholders ?? []).map((stakeholder) => normalizeRole(stakeholder.role)),
  );
  const covered = executiveRoles.filter((role) => presentRoles.has(role));

  return {
    score: Math.round((covered.length / executiveRoles.length) * 100),
    roles: executiveRoles.map((role) => ({
      role,
      status: presentRoles.has(role) ? 'Green' : covered.length <= 2 && (role === 'CEO' || role === 'CFO') ? 'Red' : 'Yellow',
    })),
  };
}

export function calculateMcemStageScores(account) {
  const coverage = calculateExecutiveCoverage(account).score;
  const painCount = account.selectedPains?.length ?? 0;
  const trigger = account.triggerScore ?? 0;
  const hasRenewal = account.contractContext?.renewalWindow && account.contractContext.renewalWindow !== 'Unknown';
  const hasVTeam = (account.vTeam ?? []).length >= 3;
  const hasNextSteps = (account.nextSteps ?? []).length > 0;

  return {
    listen: clamp(42 + painCount * 9 + Math.round(coverage * 0.2)),
    inspire: clamp(45 + Math.round(coverage * 0.25) + trigger * 2),
    empower: clamp(42 + painCount * 5 + (hasVTeam ? 14 : 0) + (account.objections?.length ? 8 : 0) + (hasRenewal ? 8 : 0)),
    realize: clamp(40 + (account.contractContext?.adoptionGaps?.length ? 8 : 0) + (hasNextSteps ? 12 : 0)),
    optimize: clamp(38 + (hasRenewal ? 12 : 0) + (hasNextSteps ? 12 : 0) + Math.round(coverage * 0.12)),
  };
}

export function getStageRisks(account, stageId) {
  const risks = [];
  const coverage = calculateExecutiveCoverage(account);

  if (coverage.score < 80) risks.push('Executive coverage below target');
  if (!account.contractContext?.renewalWindow || account.contractContext.renewalWindow === 'Unknown') risks.push('Renewal timing unclear');
  if (!(account.nextSteps ?? []).length) risks.push('No mutual next step');
  if (!(account.objections ?? []).length) risks.push('Objections not captured');
  if (stageId === 'empower' && !(account.vTeam ?? []).some((role) => role.toLowerCase().includes('partner'))) risks.push('Partner role not defined');
  if (stageId === 'realize' && !(account.contractContext?.adoptionGaps ?? []).length) risks.push('Value/adoption scorecard incomplete');
  if (stageId === 'optimize' && coverage.score < 90) risks.push('Expansion relationship coverage needs strengthening');

  return risks.slice(0, 4);
}

export function getAiReadiness(account) {
  const keywords = [...(account.keywords ?? []), ...(account.selectedPains ?? [])].join(' ').toLowerCase();

  return [
    { area: 'Data', score: keywords.includes('data') || keywords.includes('report') ? 78 : 62 },
    { area: 'Security', score: keywords.includes('security') || keywords.includes('identity') ? 82 : 66 },
    { area: 'Governance', score: account.contractContext?.businessCase === 'Needed' ? 70 : 58 },
    { area: 'Change', score: keywords.includes('adoption') || keywords.includes('change') ? 64 : 56 },
  ];
}

export function getRenewalMilestones(account) {
  return [
    { label: 'T-365', status: 'Value narrative started', health: account.notes ? 'Green' : 'Yellow' },
    { label: 'T-180', status: 'Executive priorities confirmed', health: calculateExecutiveCoverage(account).score >= 80 ? 'Green' : 'Yellow' },
    { label: 'T-90', status: 'Decision/process path known', health: account.contractContext?.procurement === 'Known' ? 'Green' : 'Red' },
    { label: 'T-30', status: 'Final blockers and MAP locked', health: (account.objections ?? []).length ? 'Yellow' : 'Red' },
  ];
}

export function getAccountAutomationQueue(account) {
  return [
    `Daily news scan for ${account.name}: watch ${account.industry} signals and executive announcements.`,
    `Renewal reminder: update ${account.contractContext?.renewalWindow ?? 'unknown'} renewal path and blocker list.`,
    `Persona refresh: review COO/CFO/CIO/CAIO messaging after each stakeholder response.`,
    `EBR prep: convert discovery notes into value delivered, risks, and next transformation asks.`,
  ];
}

function normalizeRole(role = '') {
  const normalized = role.toLowerCase();
  if (normalized.includes('chief executive') || normalized.includes('ceo')) return 'CEO';
  if (normalized.includes('finance') || normalized.includes('financial') || normalized.includes('cfo')) return 'CFO';
  if (normalized.includes('information') || normalized.includes('cio') || normalized.includes('it ')) return 'CIO';
  if (normalized.includes('operations') || normalized.includes('coo')) return 'COO';
  if (normalized.includes('security') || normalized.includes('ciso')) return 'CISO';
  return role;
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}
