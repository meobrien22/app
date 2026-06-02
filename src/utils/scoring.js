import { addOnCatalog } from '../data/discoveryData';
import { buildStakeholderQuestionSet } from '../data/stakeholderDiscovery';

export const discoveryScoreLabels = {
  accountCompleteness: 'Account completeness',
  stakeholderCoverage: 'Stakeholder coverage',
  painClarity: 'Pain clarity',
  businessPriorityAlignment: 'Business priority alignment',
  triggerUrgency: 'Trigger urgency',
  budgetProcessClarity: 'Process clarity',
  objectionsCaptured: 'Objections captured',
  nextStepClarity: 'Next-step clarity',
};

export const opportunityScoreLabels = {
  microsoftMotionFit: 'Microsoft motion fit',
  addOnSignalStrength: 'Add-on signal strength',
  competitiveDisplacementSignal: 'Competitive displacement signal',
  renewalTiming: 'Renewal timing',
  executiveSponsorClarity: 'Executive sponsor clarity',
  adoptionReadiness: 'Adoption readiness',
  vTeamFit: 'V-Team fit',
};

export const discoveryMax = {
  accountCompleteness: 15,
  stakeholderCoverage: 15,
  painClarity: 15,
  businessPriorityAlignment: 10,
  triggerUrgency: 15,
  budgetProcessClarity: 10,
  objectionsCaptured: 10,
  nextStepClarity: 10,
};

export const opportunityMax = {
  microsoftMotionFit: 20,
  addOnSignalStrength: 15,
  competitiveDisplacementSignal: 15,
  renewalTiming: 15,
  executiveSponsorClarity: 15,
  adoptionReadiness: 10,
  vTeamFit: 10,
};

const defaultInputs = {
  accountCompleteness: 10,
  stakeholderCoverage: 8,
  painClarity: 9,
  businessPriorityAlignment: 7,
  triggerUrgency: 10,
  budgetProcessClarity: 6,
  objectionsCaptured: 5,
  nextStepClarity: 6,
  microsoftMotionFit: 14,
  addOnSignalStrength: 10,
  competitiveDisplacementSignal: 6,
  renewalTiming: 8,
  executiveSponsorClarity: 8,
  adoptionReadiness: 6,
  vTeamFit: 7,
};

export function buildCustomAccount(store) {
  const selectedPains = store.selectedPains?.length ? store.selectedPains : ['AI productivity', 'Manual reporting'];
  const selectedKeywords = getLiveKeywords(store);
  const stakeholders = store.stakeholders?.length
    ? store.stakeholders
    : [
        { name: 'Economic buyer TBD', role: 'CFO or business owner', influence: 'Missing', sentiment: 'Unknown' },
        { name: 'Technical owner TBD', role: 'CIO or IT lead', influence: 'Missing', sentiment: 'Unknown' },
      ];

  return {
    id: 'custom',
    name: store.companyName || 'Unassigned discovery account',
    industry: store.industry,
    segment: 'Active discovery',
    publicContext: 'Live account created in the workspace.',
    currentLevel: store.currentMotion,
    targetMotion: store.targetMotion,
    triggerScore: store.triggerScore,
    trigger: 'Seller-entered discovery signals are being shaped into a Microsoft motion.',
    selectedPains,
    keywords: selectedKeywords,
    stakeholders,
    contractContext: {
      renewalWindow: store.renewalWindow,
      status: store.contractStatus,
      satisfaction: store.satisfactionLevel,
      procurement: store.procurementInvolved,
      businessCase: store.businessCaseNeeded,
      currentTools: store.currentTools,
      adoptionGaps: store.adoptionGaps,
      blockers: store.openBlockers,
    },
    objections: store.openObjections,
    notes: store.discoveryNotes || 'Capture customer phrases, business pains, objections, and next-step signals.',
    nextSteps: ['Confirm economic buyer', 'Clarify priority business pain', 'Book next discovery step'],
    vTeam: store.dynamicTeamMembers?.map((member) => member.role) ?? ['AE', 'Modern Work SSP', 'Technical Specialist'],
    stakeholderMeetings: store.stakeholderMeetings ?? {},
    scheduledMeetings: store.scheduledMeetings ?? [],
    workshopPlan: store.workshopPlan ?? [],
    moneyDecisionMakerKey: store.moneyDecisionMakerKey,
    executiveNarrative: 'Use the discovery workspace to turn customer signals into a clear Microsoft value story.',
    scoreInputs: {
      ...defaultInputs,
      triggerUrgency: Math.min(15, Math.max(4, Math.round(store.triggerScore * 1.5))),
      painClarity: Math.min(15, 6 + selectedPains.length * 2),
      objectionsCaptured: Math.min(10, store.openObjections.length * 3),
      budgetProcessClarity: store.procurementInvolved === 'Known' ? 8 : 5,
      stakeholderCoverage: Math.min(15, 7 + calculateStakeholderDiscoveryProgress(store.stakeholderMeetings).completedMeetings * 2),
      nextStepClarity: (store.scheduledMeetings ?? []).some((meeting) => meeting.status === 'Scheduled') ? 9 : 6,
    },
    addOnSignals: {},
  };
}

export function mergeAccountWithStore(baseAccount, store) {
  if (!baseAccount) return buildCustomAccount(store);

  return {
    ...baseAccount,
    industry: store.industry || baseAccount.industry,
    currentLevel: store.currentMotion || baseAccount.currentLevel,
    targetMotion: store.targetMotion || baseAccount.targetMotion,
    triggerScore: store.triggerScore || baseAccount.triggerScore,
    selectedPains: store.selectedPains?.length ? store.selectedPains : baseAccount.selectedPains,
    keywords: getLiveKeywords(store, baseAccount),
    stakeholders: store.stakeholders?.length ? store.stakeholders : baseAccount.stakeholders,
    contractContext: {
      ...baseAccount.contractContext,
      renewalWindow: store.renewalWindow || baseAccount.contractContext.renewalWindow,
      status: store.contractStatus || baseAccount.contractContext.status,
      satisfaction: store.satisfactionLevel || baseAccount.contractContext.satisfaction,
      procurement: store.procurementInvolved || baseAccount.contractContext.procurement,
      businessCase: store.businessCaseNeeded || baseAccount.contractContext.businessCase,
      currentTools: store.currentTools?.length ? store.currentTools : baseAccount.contractContext.currentTools,
      adoptionGaps: store.adoptionGaps?.length ? store.adoptionGaps : baseAccount.contractContext.adoptionGaps,
      blockers: store.openBlockers?.length ? store.openBlockers : baseAccount.contractContext.blockers,
    },
    objections: store.openObjections?.length ? store.openObjections : baseAccount.objections,
    notes: store.discoveryNotes || baseAccount.notes,
    vTeam: store.dynamicTeamMembers?.length ? store.dynamicTeamMembers.map((member) => member.role) : baseAccount.vTeam,
    stakeholderMeetings: store.stakeholderMeetings ?? {},
    scheduledMeetings: store.scheduledMeetings ?? [],
    workshopPlan: store.workshopPlan ?? [],
    moneyDecisionMakerKey: store.moneyDecisionMakerKey,
    scoreInputs: {
      ...baseAccount.scoreInputs,
      stakeholderCoverage: Math.min(15, (baseAccount.scoreInputs?.stakeholderCoverage ?? 8) + calculateStakeholderDiscoveryProgress(store.stakeholderMeetings).completedMeetings),
      nextStepClarity: (store.scheduledMeetings ?? []).some((meeting) => meeting.status === 'Scheduled')
        ? Math.max(baseAccount.scoreInputs?.nextStepClarity ?? 6, 9)
        : baseAccount.scoreInputs?.nextStepClarity,
    },
  };
}

export function calculateDiscoveryScore(account) {
  const inputs = { ...defaultInputs, ...account.scoreInputs };
  return {
    total: sumScore(inputs, discoveryMax),
    components: Object.keys(discoveryMax).map((key) => ({
      key,
      label: discoveryScoreLabels[key],
      value: inputs[key] ?? 0,
      max: discoveryMax[key],
    })),
  };
}

export function calculateOpportunityScore(account) {
  const inputs = { ...defaultInputs, ...account.scoreInputs };
  return {
    total: sumScore(inputs, opportunityMax),
    components: Object.keys(opportunityMax).map((key) => ({
      key,
      label: opportunityScoreLabels[key],
      value: inputs[key] ?? 0,
      max: opportunityMax[key],
    })),
  };
}

export function calculateRiskScore(account) {
  const risks = getRiskFactors(account);
  const score = Math.min(100, risks.reduce((total, risk) => total + risk.weight, 0));
  return { total: score, risks };
}

export function getRiskFactors(account) {
  const stakeholders = account.stakeholders || [];
  const contract = account.contractContext || {};
  const risks = [];

  if (!stakeholders.some((person) => person.influence === 'Economic Buyer')) {
    risks.push({ label: 'Economic buyer not confirmed', weight: 18 });
  }
  if (!stakeholders.some((person) => person.influence === 'Technical Owner')) {
    risks.push({ label: 'Technical owner not confirmed', weight: 14 });
  }
  if ((account.selectedPains || []).length < 2) {
    risks.push({ label: 'Primary pain is still unclear', weight: 14 });
  }
  if (!contract.renewalWindow || contract.renewalWindow === 'Unknown') {
    risks.push({ label: 'Renewal timing is unknown', weight: 12 });
  }
  if (contract.procurement === 'Unknown') {
    risks.push({ label: 'Procurement path is unknown', weight: 12 });
  }
  if ((account.objections || []).length === 0) {
    risks.push({ label: 'Objections have not been captured', weight: 10 });
  }
  if ((account.nextSteps || []).length === 0) {
    risks.push({ label: 'Next meeting path is not defined', weight: 12 });
  }
  if ((account.triggerScore || 0) < 6) {
    risks.push({ label: 'Trigger urgency is weak', weight: 10 });
  }

  return risks.length ? risks : [{ label: 'No major discovery risks flagged', weight: 0 }];
}

export function calculateAddOnFit(account) {
  const accountKeywords = normalizeList([
    ...(account.keywords || []),
    ...(account.selectedPains || []),
    account.industry,
    account.trigger,
    account.currentLevel,
  ]);

  return addOnCatalog
    .map((addOn) => {
      const seeded = account.addOnSignals?.[addOn.name];
      const keywordHits = addOn.signalKeywords.filter((keyword) => accountKeywords.some((value) => value.includes(keyword)));
      const personaHits = (account.stakeholders || []).filter((person) => addOn.personas.includes(primaryPersona(person.role)));
      const calculated = 42 + keywordHits.length * 11 + personaHits.length * 7 + Math.min(10, account.triggerScore || 0);
      const score = Math.max(35, Math.min(100, seeded ?? calculated));

      return {
        ...addOn,
        score,
        evidence: [
          ...keywordHits.slice(0, 2).map((keyword) => `Signal: ${keyword}`),
          ...personaHits.slice(0, 1).map((person) => `Persona: ${person.role}`),
        ],
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getDiscoveryGaps(account) {
  const riskLabels = getRiskFactors(account).filter((risk) => risk.weight > 0).map((risk) => risk.label);
  const gaps = [...riskLabels];

  if ((account.contractContext?.adoptionGaps || []).length) {
    gaps.push(...account.contractContext.adoptionGaps.slice(0, 2));
  }

  return gaps.slice(0, 5);
}

export function getNextBestQuestions(account) {
  const topAddOns = calculateAddOnFit(account).slice(0, 3);
  const questions = topAddOns.map((addOn) => addOn.discoveryQuestion);

  if (!account.stakeholders?.some((person) => person.influence === 'Economic Buyer')) {
    questions.unshift('Who owns the business outcome if this discovery turns into an executive priority?');
  }

  return questions.slice(0, 4);
}

export function getKeywordTallyList(keywordTally = {}) {
  return Object.entries(keywordTally)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword));
}

export function getSuggestedKeywords(account, keywordTally = {}) {
  const used = new Set(Object.keys(keywordTally).map((keyword) => keyword.toLowerCase()));
  const topAddOns = calculateAddOnFit(account).slice(0, 4);
  const candidates = topAddOns.flatMap((addOn) => addOn.signalKeywords);

  return [...new Set(candidates)]
    .filter((keyword) => !used.has(keyword.toLowerCase()))
    .slice(0, 8);
}

export function getSuggestedTeamMembers(account, currentMembers = [], stakeholderMeetings = {}, keywordTally = {}) {
  const existingRoles = new Set(currentMembers.map((member) => normalizeRoleName(member.role)));
  const discoverySignals = buildDiscoverySignals(account, stakeholderMeetings, keywordTally);
  const suggestions = calculateAddOnFit(account)
    .slice(0, 6)
    .map((addOn) => buildTeamSuggestion(addOn, account, discoverySignals))
    .filter((suggestion, index, list) => list.findIndex((item) => normalizeRoleName(item.role) === normalizeRoleName(suggestion.role)) === index)
    .filter((suggestion) => !existingRoles.has(normalizeRoleName(suggestion.role)));

  const needsExecutiveCoach = !existingRoles.has(normalizeRoleName('Executive Sponsor Coach'));
  const executiveReason = discoverySignals.customerLanguage.length
    ? `Customer language already includes "${discoverySignals.customerLanguage[0]}"; convert it into CFO, COO, CIO, or CISO-ready value language.`
    : 'Discovery is still forming; create executive-ready language before the account moves into proof or commitment.';

  if (needsExecutiveCoach) {
    suggestions.push({
      role: 'Executive Sponsor Coach',
      customerAction: 'Shape the executive narrative, pressure-test the business outcome, and make the next customer meeting decision-ready.',
      reason: executiveReason,
      customerMoment: 'Use before the next executive touch, EBR, stakeholder recap, or buying-committee alignment meeting.',
      evidence: discoverySignals.customerLanguage.slice(0, 3),
      priority: discoverySignals.hasEconomicBuyer ? 'Narrative quality' : 'Economic buyer clarity',
    });
  }

  return suggestions.slice(0, 5);
}

function buildTeamSuggestion(addOn, account, discoverySignals) {
  const role = specialistRoleForAddOn(addOn.name);
  const evidence = [
    ...addOn.evidence,
    ...addOn.signalKeywords.filter((keyword) => discoverySignals.normalizedText.includes(keyword.toLowerCase())).map((keyword) => `Discovery keyword: ${keyword}`),
    ...discoverySignals.customerLanguage.slice(0, 2).map((signal) => `Customer said: ${signal}`),
  ].filter(Boolean);

  return {
    role,
    customerAction: customerActionForAddOn(addOn, account, discoverySignals),
    reason: evidence.length
      ? `Recommended because ${evidence.slice(0, 2).join(' and ').toLowerCase()}.`
      : `Recommended because ${addOn.name} is scoring ${addOn.score} against the account's current pains and stakeholder map.`,
    customerMoment: customerMomentForAddOn(addOn.name),
    evidence: evidence.slice(0, 4),
    priority: `${addOn.name} fit ${addOn.score}`,
  };
}

function buildDiscoverySignals(account, stakeholderMeetings = {}, keywordTally = {}) {
  const responseText = Object.values(stakeholderMeetings).flatMap((meeting) =>
    Object.values(meeting.responses ?? {}).flatMap((response) => [response.need, response.want, response.answer, ...(response.keywords ?? [])]),
  ).filter(Boolean);
  const tallyKeywords = getKeywordTallyList(keywordTally).map((item) => item.keyword);
  const customerLanguage = [...new Set([...responseText, ...(account.selectedPains ?? []), ...(account.keywords ?? []), ...tallyKeywords])]
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 10);

  return {
    customerLanguage,
    normalizedText: customerLanguage.join(' ').toLowerCase(),
    hasEconomicBuyer: (account.stakeholders ?? []).some((person) => person.influence === 'Economic Buyer'),
  };
}

function specialistRoleForAddOn(addOnName) {
  const roleMap = {
    Copilot: 'Copilot Specialist',
    'Teams Premium': 'Modern Work / Teams Premium SSP',
    Defender: 'Security SSP',
    Entra: 'Identity Specialist',
    Intune: 'Endpoint / Intune Specialist',
    Purview: 'Compliance / Purview Specialist',
    'Power BI': 'Data and Analytics Specialist',
    Fabric: 'Fabric Specialist',
    'Power Platform': 'Power Platform Specialist',
    Viva: 'Adoption / Viva Specialist',
    Sentinel: 'Security Operations Specialist',
  };
  return roleMap[addOnName] ?? `${addOnName} Specialist`;
}

function customerActionForAddOn(addOn, account, discoverySignals) {
  const signal = discoverySignals.customerLanguage[0] ?? addOn.signalKeywords[0] ?? addOn.category;
  const actions = {
    Copilot: `Build a persona-specific Copilot proof around "${signal}" and quantify which work should become faster, safer, or easier to scale.`,
    'Teams Premium': `Map the meetings that drive customer decisions, then show how summaries, governance, and follow-through improve the stakeholder rhythm.`,
    Defender: `Validate the current security operations workflow, isolate the highest-risk scenario, and define what proof the CISO needs to support the motion.`,
    Entra: `Pressure-test identity, access, and governance blockers so the CIO/CISO can see the secure path to collaboration.`,
    Intune: `Assess device and frontline management friction, then define the endpoint proof needed before customer rollout.`,
    Purview: `Translate compliance and sensitive-data concerns into governance questions, risk language, and a customer-ready control narrative.`,
    'Power BI': `Turn manual reporting pain into a decision-workflow conversation and identify the executive dashboard that would change behavior.`,
    Fabric: `Run a data-estate whiteboard to connect disconnected sources, forecasting confidence, and the analytics proof the customer needs.`,
    'Power Platform': `Find one manual workflow worth automating and define the owner, trigger, exception path, and success criteria.`,
    Viva: `Build the adoption and change-management plan so managers know what behavior should change after the pilot.`,
    Sentinel: `Map the detection and investigation workflow, then show how the security team can see, triage, and escalate faster.`,
  };

  return actions[addOn.name] ?? `Join the next ${account.name} conversation to convert ${addOn.name} interest into proof requirements and customer-ready next steps.`;
}

function customerMomentForAddOn(addOnName) {
  if (['Defender', 'Entra', 'Sentinel', 'Purview'].includes(addOnName)) return 'Bring into a risk, governance, or technical validation meeting.';
  if (['Power BI', 'Fabric'].includes(addOnName)) return 'Bring into a data, reporting, or executive dashboard whiteboard.';
  if (['Copilot', 'Teams Premium', 'Viva'].includes(addOnName)) return 'Bring into a persona-specific demo or adoption planning session.';
  if (addOnName === 'Power Platform') return 'Bring into a workflow automation workshop.';
  if (addOnName === 'Intune') return 'Bring into a device, endpoint, or frontline operations assessment.';
  return 'Bring into the next proof-planning meeting.';
}

function normalizeRoleName(role = '') {
  return String(role).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function generateExecutiveSummaryLine(account, keywordTally = {}, teamMembers = []) {
  const topKeywords = getKeywordTallyList(keywordTally).slice(0, 4).map((item) => item.keyword);
  const topAddOns = calculateAddOnFit(account).slice(0, 3).map((item) => item.name);
  const teamRoles = teamMembers.length ? teamMembers.map((member) => member.role).slice(0, 3) : (account.vTeam ?? []).slice(0, 3);
  const primaryStakeholder = account.stakeholders?.find((person) => person.influence === 'Economic Buyer')
    ?? account.stakeholders?.find((person) => person.influence === 'Business Owner')
    ?? account.stakeholders?.[0];
  const discovery = calculateDiscoveryScore(account).total;
  const opportunity = calculateOpportunityScore(account).total;
  const risk = calculateRiskScore(account).total;
  const nextStep = account.nextSteps?.[0] ?? 'confirm the next discovery step';

  return `If the conversation ended now: ${account.name} shows ${account.triggerScore >= 8 ? 'strong' : 'developing'} discovery momentum around ${topKeywords.length ? topKeywords.join(', ') : account.selectedPains.join(', ')}. Recommended motion is ${account.targetMotion}, led with ${primaryStakeholder?.role ?? 'the business owner'}, with ${topAddOns.join(', ')} as the strongest Microsoft fit signals and ${teamRoles.join(', ')} engaged for follow-through. Current scores are discovery ${discovery}, opportunity ${opportunity}, risk ${risk}; next step is to ${nextStep.toLowerCase()}.`;
}

export function calculateStakeholderDiscoveryProgress(stakeholderMeetings = {}) {
  const meetings = Object.values(stakeholderMeetings);
  const totalQuestions = meetings.reduce((total, meeting) => total + Object.keys(meeting.responses ?? {}).length, 0);
  const answeredQuestions = meetings.reduce(
    (total, meeting) =>
      total + Object.values(meeting.responses ?? {}).filter((response) => response.yesNo !== 'Unknown' || response.answer || response.need || response.want).length,
    0,
  );
  const completedMeetings = meetings.filter((meeting) => {
    const responses = Object.values(meeting.responses ?? {});
    return responses.length > 0 && responses.every((response) => response.yesNo !== 'Unknown' || response.answer || response.need || response.want);
  }).length;

  return {
    totalMeetings: meetings.length,
    completedMeetings,
    totalQuestions,
    answeredQuestions,
    completionPct: totalQuestions ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
  };
}

export function getStakeholderTranslation(meeting) {
  const responses = Object.values(meeting?.responses ?? {});
  const needs = responses.map((response) => response.need).filter(Boolean);
  const wants = responses.map((response) => response.want).filter(Boolean);
  const keywords = responses.flatMap((response) => response.keywords ?? []);

  return {
    needs: [...new Set(needs)].slice(0, 5),
    wants: [...new Set(wants)].slice(0, 5),
    keywords: [...new Set(keywords)].slice(0, 8),
  };
}

export function getKeywordSolutionMap(account, stakeholderMeetings = {}, keywordTally = {}) {
  const responseKeywords = Object.values(stakeholderMeetings).flatMap((meeting) =>
    Object.values(meeting.responses ?? {}).flatMap((response) => response.keywords ?? []),
  );
  const allKeywords = [...new Set([...Object.keys(keywordTally), ...responseKeywords, ...(account.keywords ?? [])])];

  return allKeywords
    .map((keyword) => {
      const matchingAddOns = calculateAddOnFit({
        ...account,
        keywords: [...(account.keywords ?? []), keyword],
      }).filter((addOn) => addOn.signalKeywords.some((signal) => keyword.toLowerCase().includes(signal) || signal.includes(keyword.toLowerCase())));

      return {
        keyword,
        count: keywordTally[keyword] ?? responseKeywords.filter((item) => item === keyword).length,
        solutions: matchingAddOns.length ? matchingAddOns.slice(0, 3).map((addOn) => addOn.name) : calculateAddOnFit(account).slice(0, 2).map((addOn) => addOn.name),
      };
    })
    .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
    .slice(0, 12);
}

export function getRunningDiscoveryPlan(account, keywordTally = {}, teamMembers = [], stakeholderMeetings = {}, scheduledMeetings = [], workshopPlan = []) {
  const progress = calculateStakeholderDiscoveryProgress(stakeholderMeetings);
  const topKeywords = getKeywordTallyList(keywordTally).slice(0, 3).map((item) => item.keyword);
  const topAddOns = calculateAddOnFit(account).slice(0, 3).map((item) => item.name);
  const openMeetings = Object.values(stakeholderMeetings)
    .filter((meeting) => {
      const responses = Object.values(meeting.responses ?? {});
      return responses.some((response) => response.yesNo === 'Unknown' && !response.answer && !response.need && !response.want);
    })
    .slice(0, 3);
  const nextScheduled = scheduledMeetings.find((meeting) => meeting.status === 'Scheduled');
  const nextWorkshopItem = workshopPlan.find((item) => item.status !== 'Done') ?? workshopPlan[0];

  return [
    {
      title: 'Discovery coverage',
      body: `${progress.answeredQuestions}/${progress.totalQuestions} stakeholder questions captured across ${progress.totalMeetings} stakeholder meetings.`,
    },
    {
      title: 'Keyword to solution focus',
      body: `${topKeywords.length ? topKeywords.join(', ') : 'No repeated keywords yet'} are currently pointing toward ${topAddOns.join(', ')}.`,
    },
    {
      title: 'Next stakeholder move',
      body: openMeetings.length
        ? `Continue seven-level discovery with ${openMeetings.map((meeting) => meeting.stakeholderName).join(', ')}.`
        : 'Stakeholder discovery coverage is complete enough to consolidate the executive narrative.',
    },
    {
      title: 'Next scheduled moment',
      body: nextScheduled
        ? `${nextScheduled.title} with ${nextScheduled.stakeholderName} is scheduled for ${nextScheduled.scheduledFor || 'the selected time'}.`
        : 'Schedule the next stakeholder meeting or discovery workshop.',
    },
    {
      title: 'Workshop output',
      body: nextWorkshopItem
        ? `${nextWorkshopItem.title}: ${nextWorkshopItem.output}`
        : 'Workshop plan is ready to close into a mutual action plan.',
    },
    {
      title: 'V-Team follow-through',
      body: teamMembers.length
        ? `${teamMembers.slice(0, 3).map((member) => member.role).join(', ')} are assigned to customer-facing deliverables.`
        : 'Add V-Team roles for customer-facing deliverables.',
    },
  ];
}

export function getQuestionSetForMeeting(stakeholder) {
  return buildStakeholderQuestionSet(stakeholder);
}

function sumScore(inputs, maxMap) {
  return Object.keys(maxMap).reduce((total, key) => total + Math.min(maxMap[key], inputs[key] ?? 0), 0);
}

function getLiveKeywords(store, baseAccount) {
  const tallyKeywords = Object.keys(store.keywordTally ?? {});
  const selectedKeywords = store.selectedKeywords?.length ? store.selectedKeywords : [];
  const baseKeywords = baseAccount?.keywords ?? [];
  return [...new Set([...selectedKeywords, ...tallyKeywords, ...baseKeywords])];
}

function normalizeList(values) {
  return values.filter(Boolean).map((value) => String(value).toLowerCase());
}

function primaryPersona(role) {
  if (role.includes('CAIO') || role.includes('Chief AI') || role.includes('AI Officer') || role.includes('AI Strategy')) return 'CAIO';
  if (role.includes('Financial') || role.includes('Finance') || role === 'CFO') return 'CFO';
  if (role.includes('Information') || role.includes('IT') || role === 'CIO') return 'CIO';
  if (role.includes('Security') || role === 'CISO') return 'CISO';
  if (role.includes('Operations') || role === 'COO') return 'COO';
  if (role.includes('People') || role.includes('Human') || role === 'CHRO') return 'CHRO';
  if (role.includes('Legal') || role.includes('Compliance') || role.includes('Counsel')) return 'General Counsel';
  if (role.includes('Executive') || role.includes('CEO')) return 'CEO';
  return role;
}
