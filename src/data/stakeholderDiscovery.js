export const discoveryLevels = [
  {
    id: 'level1',
    name: '1. Executive Outcome',
    intent: 'Clarify the business outcome this stakeholder personally cares about.',
  },
  {
    id: 'level2',
    name: '2. Current State',
    intent: 'Understand tools, process, ownership, and the current operating rhythm.',
  },
  {
    id: 'level3',
    name: '3. Pain Evidence',
    intent: 'Capture concrete examples, frequency, affected teams, and friction points.',
  },
  {
    id: 'level4',
    name: '4. Impact Translation',
    intent: 'Translate the pain into business, risk, operational, or adoption impact.',
  },
  {
    id: 'level5',
    name: '5. Decision Path',
    intent: 'Identify who must agree, what proof is needed, and what could block progress.',
  },
  {
    id: 'level6',
    name: '6. Microsoft Mapping',
    intent: 'Map keywords to Microsoft motions, add-on fit, and specialist involvement.',
  },
  {
    id: 'level7',
    name: '7. Mutual Action Plan',
    intent: 'Confirm next meeting, deliverables, V-Team owners, and executive summary language.',
  },
];

export const responseModes = [
  { id: 'Yes', label: 'Yes' },
  { id: 'Yes and', label: 'Yes and...' },
  { id: 'Unknown', label: 'It depends' },
  { id: 'No', label: 'No' },
  { id: 'No and', label: 'No and...' },
];

export const genericNeedsWantsLibrary = {
  default: {
    needs: ['Clear ownership', 'Faster decisions', 'Less manual reporting', 'Stronger collaboration rhythm', 'Lower operational risk'],
    wants: ['Executive-ready recap', 'Faster pilot path', 'Cleaner handoffs', 'Better adoption plan', 'Cross-team visibility'],
  },
  Manufacturing: {
    needs: ['Line-of-business process visibility', 'Fewer frontline handoff delays', 'Safer endpoint operations', 'Consistent shift reporting', 'IT/OT collaboration clarity'],
    wants: ['Plant-to-exec dashboards', 'Structured daily operations rhythm', 'Role-based copilots for supervisors', 'Faster incident triage', 'Clear pilot success criteria'],
  },
  Healthcare: {
    needs: ['Compliant information handling', 'Faster care-team coordination', 'Reduced documentation friction', 'Secure access controls', 'Audit-ready collaboration'],
    wants: ['Clinical workflow summaries', 'Safer AI guardrails', 'Better training adoption', 'Cleaner escalation paths', 'Executive risk narrative'],
  },
  Retail: {
    needs: ['Store operations visibility', 'Reliable frontline device management', 'Faster merchandising communication', 'Security posture consistency', 'Cross-channel reporting'],
    wants: ['Daily store briefings', 'Actionable manager summaries', 'Campaign-to-store feedback loop', 'Regional performance views', 'Pilot-ready rollout plan'],
  },
  Software: {
    needs: ['Faster product-team alignment', 'Cleaner feedback loops', 'Reduced meeting overload', 'Secure collaboration at speed', 'Unified reporting context'],
    wants: ['Launch-readiness scorecards', 'AI-assisted summaries', 'Executive roadmap recaps', 'Cross-functional follow-through', 'Adoption checkpoints'],
  },
  'Financial Services': {
    needs: ['Governance and control clarity', 'Reliable forecasting workflows', 'Risk and compliance visibility', 'Secure identity controls', 'Decision auditability'],
    wants: ['Executive finance dashboards', 'Standardized review cadence', 'Stronger evidence trails', 'Policy-aware collaboration', 'Risk-focused pilot sequence'],
  },
};

const questionKeywordLibrary = {
  level1: ['clear ownership', 'priority outcome', 'executive sponsor', 'business priority', 'success criteria', 'faster decisions'],
  level2: ['current workflow', 'manual handoffs', 'tool sprawl', 'process friction', 'operating rhythm', 'ownership gaps'],
  level3: ['pain evidence', 'manual reporting', 'delay', 'rework', 'missed follow-up', 'customer impact'],
  level4: ['business impact', 'risk exposure', 'productivity loss', 'quality impact', 'adoption impact', 'decision confidence'],
  level5: ['decision process', 'procurement path', 'technical validation', 'economic buyer', 'approval criteria', 'blockers'],
  level6: ['solution mapping', 'pilot scope', 'integration fit', 'security fit', 'analytics fit', 'adoption readiness'],
  level7: ['next meeting', 'mutual action plan', 'v-team owner', 'executive summary', 'workshop output', 'follow-through'],
};

const branchKeywordLibrary = {
  'clear ownership': ['decision owner', 'accountability gap', 'approval path', 'executive sponsor', 'success criteria'],
  'less manual reporting': ['manual reporting', 'spreadsheet work', 'dashboard gaps', 'reporting cadence', 'decision delay'],
  'faster decisions': ['decision latency', 'approval speed', 'leadership cadence', 'missing context', 'meeting follow-up'],
  'process friction': ['broken workflow', 'handoff delay', 'process owner', 'automation candidate', 'exception handling'],
  'manual reporting': ['spreadsheet work', 'reporting cadence', 'data refresh', 'metric confidence', 'dashboard gaps'],
  'security risk': ['identity risk', 'endpoint exposure', 'incident response', 'policy gap', 'sensitive data'],
  'data silos': ['system of record', 'data ownership', 'integration gap', 'analytics trust', 'forecast confidence'],
  adoption: ['change readiness', 'training gap', 'manager enablement', 'usage signal', 'communication plan'],
  identity: ['access control', 'privileged access', 'external users', 'identity governance', 'zero trust'],
};

const sourceTypeKeywordLibrary = {
  need: ['required outcome', 'must-have capability', 'owner needed', 'proof needed'],
  want: ['preferred outcome', 'future state', 'experience goal', 'adoption signal'],
  keyword: ['root cause', 'affected team', 'current workaround', 'follow-up owner'],
};

const keywordFollowups = {
  'process friction': 'You mentioned process friction. Where exactly does the workflow break, and who owns fixing that step?',
  'manual reporting': 'You mentioned manual reporting. Which report consumes the most time, and what decisions wait on it?',
  'security risk': 'You mentioned security risk. Which scenario creates the biggest concern for this stakeholder?',
  'data silos': 'You mentioned data silos. Which two systems need to be connected first to unblock decisions?',
  'clear ownership': 'You mentioned clear ownership. Who should own the outcome, and who is currently filling the gap?',
  'less manual reporting': 'You mentioned less manual reporting. Which recurring report should be eliminated, simplified, or automated first?',
  identity: 'You mentioned identity challenges. Which access path is slowing work or raising risk today?',
  adoption: 'You mentioned adoption. Which team is struggling most, and what enablement is missing?',
};

export function getNeedWantLibrary(industry, businessType) {
  const industryPack = genericNeedsWantsLibrary[industry] ?? genericNeedsWantsLibrary.default;
  const typeHints = String(businessType ?? '').toLowerCase();
  const typeNeeds = [];
  const typeWants = [];

  if (typeHints.includes('smb')) {
    typeNeeds.push('Small-team execution simplicity', 'Faster time to value');
    typeWants.push('Lean workshop format', 'Minimal-admin rollout');
  }
  if (typeHints.includes('enterprise')) {
    typeNeeds.push('Cross-org governance model', 'Multi-team decision process');
    typeWants.push('Executive steering cadence', 'Formal stakeholder playbook');
  }

  return {
    needs: [...new Set([...industryPack.needs, ...typeNeeds])].slice(0, 10),
    wants: [...new Set([...industryPack.wants, ...typeWants])].slice(0, 10),
  };
}

export function getKeywordFollowups(text = '') {
  const normalized = String(text).toLowerCase();
  return Object.entries(keywordFollowups)
    .filter(([keyword]) => normalized.includes(keyword))
    .map(([keyword, question]) => ({ keyword, question }));
}

export function buildBranchQuestion({ seedTerm, parentQuestion, parentKeywords = [], depth = 1, sourceType = 'keyword' }) {
  const normalized = String(seedTerm ?? '').trim();
  if (!normalized) return null;
  const clean = normalized.replace(/\s+/g, ' ');
  const keywordKey = clean.toLowerCase();

  const promptBySource = {
    keyword: `You mentioned "${clean}". What specifically is happening, who is affected, and what is the current workaround?`,
    need: `You selected need "${clean}". What must be true for this need to be fully satisfied?`,
    want: `You selected want "${clean}". What outcome would make this want clearly achieved?`,
  };

  return {
    name: `Branch L${depth}`,
    intent: `Branch from: ${parentQuestion}`,
    question: promptBySource[sourceType] ?? promptBySource.keyword,
    keywords: buildBranchKeywords(keywordKey, parentKeywords, sourceType),
    isAutoGenerated: true,
  };
}

function buildBranchKeywords(seedTerm, parentKeywords = [], sourceType = 'keyword') {
  const directMatches = branchKeywordLibrary[seedTerm] ?? [];
  return [
    seedTerm,
    ...directMatches,
    ...(sourceTypeKeywordLibrary[sourceType] ?? sourceTypeKeywordLibrary.keyword),
    ...parentKeywords,
  ]
    .map((keyword) => String(keyword).toLowerCase())
    .filter(Boolean)
    .filter((keyword, index, list) => list.indexOf(keyword) === index)
    .slice(0, 10);
}

function getQuestionKeywords(levelId, profile) {
  return [
    ...(questionKeywordLibrary[levelId] ?? []),
    ...(profile.keywords ?? []),
  ]
    .map((keyword) => String(keyword).toLowerCase())
    .filter((keyword, index, list) => list.indexOf(keyword) === index)
    .slice(0, 10);
}

const roleProfiles = {
  CEO: {
    label: 'CEO',
    focus: 'Growth, operating model, AI transformation, strategic risk, and executive alignment.',
    keywords: ['growth', 'AI transformation', 'operating model', 'market differentiation', 'executive alignment'],
    solutions: ['Copilot', 'Fabric', 'Power BI', 'Viva'],
    vTeam: ['Executive Sponsor Coach', 'Copilot Specialist', 'Industry Strategist'],
    questions: {
      level1: 'What strategic outcome would make this initiative worth executive attention this quarter?',
      level2: 'Where does the leadership team lose visibility or alignment today?',
      level3: 'What is one recent example where slow information flow affected a decision?',
      level4: 'How would you describe the impact if this friction continues for another planning cycle?',
      level5: 'Who else must believe this is a company-level priority?',
      level6: 'Which Microsoft motion best connects to the growth or operating-model change you want?',
      level7: 'What executive message should we be able to summarize after the next workshop?',
    },
  },
  CFO: {
    label: 'CFO',
    focus: 'Financial discipline, measurable outcomes, risk exposure, governance, and investment confidence.',
    keywords: ['business case', 'forecasting', 'risk exposure', 'governance', 'decision criteria'],
    solutions: ['Power BI', 'Fabric', 'Purview', 'Copilot'],
    vTeam: ['CFO Value Coach', 'Data Specialist', 'Compliance Specialist'],
    questions: {
      level1: 'What business outcome would justify leadership time and change effort?',
      level2: 'Where are finance teams still reconciling information manually?',
      level3: 'Which reporting or planning process creates the most delay or rework?',
      level4: 'How does that delay affect forecasting, governance, or confidence in decisions?',
      level5: 'What proof would finance need before supporting the next phase?',
      level6: 'Which analytics, governance, or AI productivity signals should we test first?',
      level7: 'What must be in the executive recap for you to sponsor the next step?',
    },
  },
  COO: {
    label: 'COO',
    focus: 'Operations visibility, process friction, frontline execution, quality, and repeatability.',
    keywords: ['operations visibility', 'process friction', 'frontline execution', 'quality', 'handoffs'],
    solutions: ['Power Platform', 'Power BI', 'Teams Premium', 'Intune'],
    vTeam: ['Operations Specialist', 'Power Platform Specialist', 'Endpoint Specialist'],
    questions: {
      level1: 'Which operating outcome is most important to improve right now?',
      level2: 'Where do teams rely on manual handoffs or informal follow-up?',
      level3: 'Can you walk through a recent workflow that broke down or took too long?',
      level4: 'What does that friction do to speed, quality, or customer experience?',
      level5: 'Which teams need to agree on the new operating rhythm?',
      level6: 'Which workflow should we map to Microsoft first: collaboration, automation, analytics, or devices?',
      level7: 'What workshop output would help operations commit to a pilot?',
    },
  },
  CIO: {
    label: 'CIO',
    focus: 'Architecture, integration, adoption readiness, governance, security, and platform simplification.',
    keywords: ['architecture', 'integration', 'adoption readiness', 'governance', 'platform simplification'],
    solutions: ['Entra', 'Intune', 'Defender', 'Copilot', 'Fabric'],
    vTeam: ['Technical Specialist', 'Identity Specialist', 'Adoption Specialist'],
    questions: {
      level1: 'What technology outcome would make this discovery valuable for IT?',
      level2: 'Which platforms, identity paths, or governance processes shape the current state?',
      level3: 'Where do users or IT teams experience the most friction today?',
      level4: 'How does that friction affect adoption, support load, or security posture?',
      level5: 'What technical proof or governance review must happen before broader support?',
      level6: 'Which Microsoft capability should be validated first for feasibility and adoption?',
      level7: 'What technical deliverable should the V-Team bring to the next meeting?',
    },
  },
  CISO: {
    label: 'CISO',
    focus: 'Risk reduction, identity, endpoint posture, incident response, sensitive data, and controls.',
    keywords: ['risk reduction', 'identity', 'endpoint posture', 'incident response', 'sensitive data'],
    solutions: ['Defender', 'Sentinel', 'Entra', 'Purview', 'Intune'],
    vTeam: ['Security Specialist', 'Identity Specialist', 'Compliance Specialist'],
    questions: {
      level1: 'Which risk area most needs executive visibility right now?',
      level2: 'How are identity, endpoint, data, and incident signals managed today?',
      level3: 'Where does the team see alert fatigue, manual investigation, or policy gaps?',
      level4: 'How would you explain the operational impact of that risk to executives?',
      level5: 'What proof would security need before endorsing the next phase?',
      level6: 'Which Microsoft security or governance area should we map first?',
      level7: 'What risk narrative should we bring into the executive summary?',
    },
  },
  CAIO: {
    label: 'CAIO',
    focus: 'AI strategy, responsible AI, productivity use cases, governance, and adoption measurement.',
    keywords: ['AI strategy', 'responsible AI', 'productivity use cases', 'AI governance', 'adoption measurement'],
    solutions: ['Copilot', 'Purview', 'Fabric', 'Viva'],
    vTeam: ['Copilot Specialist', 'Responsible AI Advisor', 'Adoption Specialist'],
    questions: {
      level1: 'What AI outcome should become visible to leaders first?',
      level2: 'Where are teams experimenting with AI today, and what guardrails exist?',
      level3: 'Which AI use case has the clearest pain, owner, and adoption path?',
      level4: 'How should we measure trust, usage, and operational benefit?',
      level5: 'Who approves responsible AI principles and pilot expansion?',
      level6: 'Which Microsoft AI and governance capabilities should be validated together?',
      level7: 'What AI pilot narrative should we leave behind after discovery?',
    },
  },
  COS: {
    label: 'Chief of Staff',
    focus: 'Executive rhythm, cross-functional alignment, decision follow-through, and operating cadence.',
    keywords: ['executive rhythm', 'alignment', 'follow-through', 'operating cadence', 'meeting outcomes'],
    solutions: ['Teams Premium', 'Copilot', 'Viva', 'Power BI'],
    vTeam: ['Executive Sponsor Coach', 'Teams Specialist', 'Adoption Specialist'],
    questions: {
      level1: 'Which leadership rhythm or priority needs cleaner follow-through?',
      level2: 'How are executive decisions captured and tracked today?',
      level3: 'Where do meetings create ambiguity or missed actions?',
      level4: 'What does poor follow-through cost the leadership team in focus or speed?',
      level5: 'Who must agree on a new operating cadence?',
      level6: 'Which meeting, summary, or dashboard motion should we test first?',
      level7: 'What executive-ready summary would help keep the account moving?',
    },
  },
  CTO: {
    label: 'CTO / CIT',
    focus: 'Technical innovation, engineering productivity, platform choices, data, and modernization.',
    keywords: ['technical innovation', 'engineering productivity', 'modernization', 'data platform', 'automation'],
    solutions: ['Fabric', 'Power Platform', 'Copilot', 'Entra'],
    vTeam: ['Technical Specialist', 'Data Specialist', 'Copilot Specialist'],
    questions: {
      level1: 'Which technical outcome would accelerate the product or platform roadmap?',
      level2: 'Where are engineering or technical teams blocked by data, process, or access issues?',
      level3: 'What is a recent example of duplicated effort or slow technical decision-making?',
      level4: 'How does that affect delivery speed, quality, or modernization?',
      level5: 'What technical validation would unlock broader buy-in?',
      level6: 'Which Microsoft data, automation, identity, or AI capability maps best?',
      level7: 'What should the technical team commit to reviewing next?',
    },
  },
  CMO: {
    label: 'CMO / COM',
    focus: 'Customer insight, campaign execution, content velocity, brand governance, and revenue alignment.',
    keywords: ['customer insight', 'campaign execution', 'content velocity', 'brand governance', 'revenue alignment'],
    solutions: ['Copilot', 'Power BI', 'Teams Premium', 'Purview'],
    vTeam: ['Copilot Specialist', 'Data Specialist', 'Adoption Specialist'],
    questions: {
      level1: 'Which customer or campaign outcome would matter most to marketing leadership?',
      level2: 'How are campaign insights, content reviews, and customer signals managed today?',
      level3: 'Where do teams lose time creating, summarizing, or coordinating work?',
      level4: 'How does that affect speed, brand quality, or customer understanding?',
      level5: 'Who needs confidence in governance before scaling AI or analytics?',
      level6: 'Which Microsoft motion best supports content, insight, or collaboration workflows?',
      level7: 'What customer-facing story should the next summary tell?',
    },
  },
  CPO: {
    label: 'CPO / COP',
    focus: 'Product feedback, roadmap decisions, launch readiness, customer learning, and cross-functional execution.',
    keywords: ['product feedback', 'roadmap decisions', 'launch readiness', 'customer learning', 'cross-functional execution'],
    solutions: ['Copilot', 'Teams Premium', 'Fabric', 'Power BI'],
    vTeam: ['Copilot Specialist', 'Data Specialist', 'Teams Specialist'],
    questions: {
      level1: 'Which product or launch outcome needs better discovery support?',
      level2: 'How do product, support, and customer teams share feedback today?',
      level3: 'Where does customer learning get lost or arrive too late?',
      level4: 'How does that affect roadmap confidence or launch quality?',
      level5: 'Who must validate the feedback loop before a pilot?',
      level6: 'Which Microsoft collaboration, data, or AI motion should support this workflow?',
      level7: 'What product-team deliverable should be ready after the workshop?',
    },
  },
  CHRO: {
    label: 'CHRO',
    focus: 'Employee experience, adoption, training, change readiness, and manager enablement.',
    keywords: ['employee experience', 'adoption', 'training', 'change readiness', 'manager enablement'],
    solutions: ['Viva', 'Copilot', 'Teams Premium', 'Power BI'],
    vTeam: ['Adoption Specialist', 'Viva Specialist', 'Copilot Specialist'],
    questions: {
      level1: 'Which employee or manager outcome should discovery improve?',
      level2: 'How are adoption, enablement, and change fatigue measured today?',
      level3: 'Where do teams struggle to adopt new ways of working?',
      level4: 'How does that affect engagement, productivity, or manager effectiveness?',
      level5: 'Who needs to sponsor change management and communications?',
      level6: 'Which Microsoft adoption, employee experience, or AI motion should we test?',
      level7: 'What adoption plan should the V-Team bring into the next session?',
    },
  },
};

export const defaultRoleProfile = {
  label: 'Stakeholder',
  focus: 'Business priorities, current workflow, pain evidence, decision path, and next steps.',
  keywords: ['business priority', 'current workflow', 'pain evidence', 'decision path', 'next step'],
  solutions: ['Copilot', 'Power BI', 'Teams Premium'],
  vTeam: ['AE', 'Technical Specialist', 'Adoption Specialist'],
  questions: {
    level1: 'What outcome matters most to you in this discovery?',
    level2: 'How does the current workflow operate today?',
    level3: 'Where does that workflow create friction or risk?',
    level4: 'What happens if that friction is not addressed?',
    level5: 'Who else needs to be involved in the decision?',
    level6: 'Which Microsoft motion seems most relevant based on what we discussed?',
    level7: 'What next step would be useful for you and your team?',
  },
};

export function getRoleProfile(role = '') {
  const normalized = role.toLowerCase();
  if (normalized.includes('chief executive') || normalized === 'ceo') return roleProfiles.CEO;
  if (normalized.includes('financial') || normalized.includes('finance') || normalized === 'cfo') return roleProfiles.CFO;
  if (normalized.includes('operations') || normalized === 'coo') return roleProfiles.COO;
  if (normalized.includes('information') || normalized.includes('it ') || normalized.includes('cio')) return roleProfiles.CIO;
  if (normalized.includes('security') || normalized.includes('ciso')) return roleProfiles.CISO;
  if (normalized.includes('ai') || normalized.includes('cai')) return roleProfiles.CAIO;
  if (normalized.includes('chief of staff') || normalized.includes('cos')) return roleProfiles.COS;
  if (normalized.includes('technology') || normalized.includes('cto') || normalized.includes('cit')) return roleProfiles.CTO;
  if (normalized.includes('marketing') || normalized.includes('cmo') || normalized.includes('com')) return roleProfiles.CMO;
  if (normalized.includes('product') || normalized.includes('cpo') || normalized.includes('cop')) return roleProfiles.CPO;
  if (normalized.includes('people') || normalized.includes('human') || normalized.includes('chro')) return roleProfiles.CHRO;
  return defaultRoleProfile;
}

export function buildStakeholderQuestionSet(stakeholder) {
  const profile = getRoleProfile(stakeholder?.role);
  return discoveryLevels.map((level) => ({
    ...level,
    question: profile.questions[level.id] ?? defaultRoleProfile.questions[level.id],
    keywords: getQuestionKeywords(level.id, profile),
    solutions: profile.solutions,
    vTeam: profile.vTeam,
  }));
}
