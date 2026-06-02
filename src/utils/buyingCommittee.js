export const buyingRooms = [
  {
    id: 'boardroom',
    label: 'Boardroom',
    owner: 'CEO / executive sponsor',
    description: 'Strategic priority, executive alignment, and final leadership confidence.',
    roles: ['CEO', 'Executive Sponsor', 'Chief Executive'],
  },
  {
    id: 'finance',
    label: 'Finance Room',
    owner: 'CFO / economic buyer',
    description: 'Business case, approval path, risk, governance, and investment confidence.',
    roles: ['CFO', 'Finance', 'Economic Buyer', 'Procurement'],
  },
  {
    id: 'technology',
    label: 'Technology Room',
    owner: 'CIO / CTO',
    description: 'Architecture, integration, adoption readiness, and technical proof.',
    roles: ['CIO', 'CTO', 'CIT', 'Information', 'Technology', 'IT'],
  },
  {
    id: 'smart',
    label: 'Smart Room',
    owner: 'CAIO / AI strategy owner',
    description: 'AI strategy, responsible AI, use-case portfolio, governance, data readiness, and adoption measurement.',
    roles: ['CAIO', 'Chief AI', 'Chief Artificial Intelligence', 'AI Officer', 'AI Strategy', 'Responsible AI', 'AI Transformation'],
  },
  {
    id: 'security',
    label: 'Security Room',
    owner: 'CISO / risk owner',
    description: 'Identity, endpoint, data protection, incident response, and risk posture.',
    roles: ['CISO', 'Security', 'Risk Owner'],
  },
  {
    id: 'operations',
    label: 'Operations Room',
    owner: 'COO / business owner',
    description: 'Workflow friction, execution, frontline operations, and process ownership.',
    roles: ['COO', 'Operations', 'Business Owner', 'VP Store'],
  },
  {
    id: 'people',
    label: 'People Room',
    owner: 'CHRO / adoption owner',
    description: 'Change management, training, adoption, and employee experience.',
    roles: ['CHRO', 'People', 'Human', 'Adoption'],
  },
  {
    id: 'market',
    label: 'Market Room',
    owner: 'CMO / CPO',
    description: 'Customer experience, product feedback, campaign execution, and launch readiness.',
    roles: ['CMO', 'CPO', 'Marketing', 'Product', 'COM', 'COP'],
  },
];

const moneyRoleWeight = [
  ['CFO', 95],
  ['Finance', 90],
  ['Economic Buyer', 92],
  ['CEO', 88],
  ['Chief Executive', 88],
  ['Procurement', 82],
  ['COO', 76],
  ['Operations', 72],
  ['CIO', 66],
  ['CAIO', 72],
  ['Chief AI', 72],
  ['AI Officer', 70],
  ['AI Strategy', 68],
  ['CISO', 60],
  ['CTO', 58],
  ['CHRO', 50],
  ['CMO', 48],
  ['CPO', 48],
];

const influenceWeight = {
  'Economic Buyer': 96,
  'Executive Sponsor': 88,
  Procurement: 82,
  'Business Owner': 74,
  'Technical Owner': 66,
  'Risk Owner': 62,
  Champion: 58,
  Evaluator: 45,
  Blocker: 35,
  Missing: 15,
};

const sentimentWeight = {
  Supportive: 8,
  Neutral: 0,
  Cautious: -5,
  Skeptical: -8,
  Resistant: -16,
  Unknown: -3,
};

const approvalSignals = [
  'approval',
  'approve',
  'business case',
  'finance',
  'procurement',
  'budget',
  'investment',
  'economic buyer',
  'sponsor',
  'decision criteria',
  'renewal',
  'risk',
  'governance',
  'value',
  'responsible ai',
  'ai governance',
  'pilot expansion',
  'use case',
  'adoption measurement',
];

export function scoreBuyingCommittee(account, selectedMoneyDecisionMakerKey) {
  const scoredStakeholders = (account.stakeholders ?? []).map((stakeholder) => {
    const key = stakeholderKey(stakeholder);
    const meeting = account.stakeholderMeetings?.[key];
    return scoreStakeholder(stakeholder, meeting, selectedMoneyDecisionMakerKey === key);
  });

  const rankedForMoney = [...scoredStakeholders].sort((a, b) => b.moneyDecisionScore - a.moneyDecisionScore);
  const selected = scoredStakeholders.find((person) => person.key === selectedMoneyDecisionMakerKey);
  const moneyDecisionMaker = selected ?? rankedForMoney[0];
  const nextBest = rankedForMoney.find((person) => person.key !== moneyDecisionMaker?.key);
  const hasClearMoneyWinner = Boolean(
    moneyDecisionMaker
      && moneyDecisionMaker.moneyDecisionScore >= 78
      && (!nextBest || moneyDecisionMaker.moneyDecisionScore - nextBest.moneyDecisionScore >= 8),
  );

  const rooms = buyingRooms.map((room) => {
    const occupants = scoredStakeholders.filter((person) => person.room.id === room.id);
    const strongest = occupants.length ? [...occupants].sort((a, b) => b.dealImpactScore - a.dealImpactScore)[0] : null;
    return {
      ...room,
      occupants,
      strongest,
      coverage: occupants.length ? 'Mapped' : 'Gap',
    };
  });

  return {
    moneyDecisionMaker,
    hasClearMoneyWinner,
    scoredStakeholders,
    rooms,
    gaps: rooms.filter((room) => room.coverage === 'Gap').map((room) => room.label),
  };
}

export function getStakeholderRoom(stakeholder) {
  const text = `${stakeholder?.role ?? ''} ${stakeholder?.influence ?? ''}`.toLowerCase();
  return buyingRooms.find((room) => room.roles.some((role) => text.includes(role.toLowerCase()))) ?? buyingRooms[0];
}

export function stakeholderKey(stakeholder) {
  return `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function scoreStakeholder(stakeholder, meeting, isSelectedMoneyDecisionMaker) {
  const roleText = `${stakeholder.role ?? ''} ${stakeholder.influence ?? ''}`;
  const roleMoney = findWeightedMatch(roleText, moneyRoleWeight, 42);
  const influence = influenceWeight[stakeholder.influence] ?? 48;
  const sentiment = sentimentWeight[stakeholder.sentiment] ?? 0;
  const discovery = discoverySignalScore(meeting);
  const approval = approvalLanguageScore(meeting);
  const room = getStakeholderRoom(stakeholder);

  const moneyDecisionScore = clamp(
    Math.round(roleMoney * 0.48 + influence * 0.28 + approval * 0.14 + discovery * 0.1 + sentiment + (isSelectedMoneyDecisionMaker ? 8 : 0)),
  );
  const influenceScore = clamp(Math.round(influence * 0.55 + discovery * 0.2 + roleMoney * 0.15 + sentiment + approval * 0.1));
  const dealImpactScore = clamp(Math.round(moneyDecisionScore * 0.48 + influenceScore * 0.34 + discovery * 0.18));

  return {
    key: stakeholderKey(stakeholder),
    stakeholder,
    room,
    moneyDecisionScore,
    influenceScore,
    dealImpactScore,
    approvalSignalScore: approval,
    discoverySignalScore: discovery,
    confidence: scoreLabel(dealImpactScore),
    evidence: buildEvidence(stakeholder, meeting, room, approval, discovery, isSelectedMoneyDecisionMaker),
  };
}

function discoverySignalScore(meeting) {
  const responses = Object.values(meeting?.responses ?? {});
  if (!responses.length) return 35;
  const answered = responses.filter((response) => response.yesNo !== 'Unknown' || response.answer || response.need || response.want).length;
  return clamp(35 + answered * 7);
}

function approvalLanguageScore(meeting) {
  const text = Object.values(meeting?.responses ?? {})
    .flatMap((response) => [response.answer, response.need, response.want, ...(response.keywords ?? [])])
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (!text) return 35;
  const hits = approvalSignals.filter((signal) => text.includes(signal)).length;
  return clamp(35 + hits * 9);
}

function findWeightedMatch(text, entries, fallback) {
  const normalized = String(text).toLowerCase();
  const match = entries.find(([keyword]) => normalized.includes(keyword.toLowerCase()));
  return match?.[1] ?? fallback;
}

function buildEvidence(stakeholder, meeting, room, approval, discovery, isSelectedMoneyDecisionMaker) {
  const evidence = [
    `${stakeholder.role} sits in the ${room.label}.`,
    `${stakeholder.influence} influence with ${stakeholder.sentiment ?? 'unknown'} sentiment.`,
    `Discovery signal ${discovery}/100 from captured responses.`,
  ];
  if (approval >= 60) evidence.push('Approval language has been captured in the meeting notes.');
  if (isSelectedMoneyDecisionMaker) evidence.push('Manually selected as the money decision maker for this account.');
  return evidence;
}

function scoreLabel(score) {
  if (score >= 82) return 'High impact';
  if (score >= 66) return 'Meaningful impact';
  if (score >= 50) return 'Moderate impact';
  return 'Low current signal';
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}
