import { create } from 'zustand';
import { painOptions } from '../data/discoveryData';
import { portfolioAccounts } from '../data/portfolioData';
import { getIndustryPersonaSignals, personaIdFromRole, personaTemplates } from '../data/personaData';
import { buildBranchQuestion, buildStakeholderQuestionSet, getKeywordFollowups, getRoleProfile } from '../data/stakeholderDiscovery';

const initialAccount = portfolioAccounts[0];

const decisionDefaults = {
  painConfirmed: 'Yes',
  economicBuyerKnown: 'Yes',
  technicalOwnerKnown: 'Yes',
  renewalTimingClear: 'Yes',
  nextStepDefined: 'Yes',
};

const buildKeywordTally = (account) => {
  const tally = {};
  [...(account?.keywords ?? []), ...(account?.selectedPains ?? [])].forEach((keyword) => {
    tally[keyword] = (tally[keyword] ?? 0) + 1;
  });
  return tally;
};

const buildTeamMembers = (account) => {
  const roles = account?.vTeam?.length ? account.vTeam : ['AE', 'Modern Work SSP', 'Technical Specialist'];
  return roles.map((role, index) => ({
    id: `${role.toLowerCase().replaceAll(' ', '-')}-${index}`,
    name: '',
    role,
    customerAction: defaultTeamAction(role),
  }));
};

const stakeholderKey = (stakeholder) => `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const MAX_BRANCH_DEPTH = 5;

const defaultMoneyDecisionMakerKey = (account) => {
  const stakeholder = account?.stakeholders?.find((person) => person.influence === 'Economic Buyer')
    ?? account?.stakeholders?.find((person) => /cfo|finance|procurement/i.test(person.role))
    ?? account?.stakeholders?.[0];
  return stakeholder ? stakeholderKey(stakeholder) : '';
};

const buildStakeholderMeetings = (account) => {
  const meetings = {};
  (account?.stakeholders ?? []).forEach((stakeholder) => {
    const key = stakeholderKey(stakeholder);
    const questionSet = buildStakeholderQuestionSet(stakeholder);
    meetings[key] = {
      stakeholderKey: key,
      stakeholderName: stakeholder.name,
      role: stakeholder.role,
      profile: getRoleProfile(stakeholder.role).label,
      meetingStatus: 'Not scheduled',
      scheduledFor: '',
      objective: `Complete seven-level discovery with ${stakeholder.role}`,
      conversationContext: '',
      responses: Object.fromEntries(
        questionSet.map((question) => [
          question.id,
          {
            answer: '',
            yesNo: 'Unknown',
            need: '',
            want: '',
            keywords: [],
          },
        ]),
      ),
      customQuestions: [],
    };
  });
  return meetings;
};

const buildWorkshopPlan = (account) => [
  {
    id: 'workshop-objectives',
    title: 'Align on executive outcomes',
    owner: 'AE',
    status: 'Planned',
    output: `Confirm why ${account?.targetMotion ?? 'the Microsoft motion'} matters to the customer.`,
  },
  {
    id: 'stakeholder-breakouts',
    title: 'Run stakeholder breakouts',
    owner: 'AE + V-Team',
    status: 'Planned',
    output: 'Complete seven-level discovery for business, technical, and executive stakeholders.',
  },
  {
    id: 'keyword-solution-map',
    title: 'Map keywords to solutions',
    owner: 'Technical Specialist',
    status: 'Planned',
    output: 'Translate repeated keywords into Microsoft fit signals and follow-up questions.',
  },
  {
    id: 'mutual-action-plan',
    title: 'Build mutual action plan',
    owner: 'AE',
    status: 'Planned',
    output: 'Confirm next meeting, deliverables, and executive summary language.',
  },
];

const buildPersonaLibrary = () =>
  Object.fromEntries(
    personaTemplates.map((persona) => [
      persona.id,
      {
        ...persona,
        learnedSignals: [],
        industrySignals: {},
        accountExamples: [],
        updatedAt: new Date().toISOString(),
      },
    ]),
  );

const defaultTeamAction = (role) => {
  const normalizedRole = String(role ?? '').toLowerCase();
  if (normalizedRole.includes('ae')) return 'Own the account point of view, confirm the mutual next step, and keep the customer narrative executive-ready.';
  if (normalizedRole.includes('modern work') || normalizedRole.includes('ssp')) {
    return 'Turn productivity, collaboration, and adoption signals into a customer-ready Microsoft motion with clear proof criteria.';
  }
  if (normalizedRole.includes('technical') || normalizedRole.includes('ts')) {
    return 'Define the proof path, technical validation plan, success criteria, and customer questions required before the next meeting.';
  }
  if (normalizedRole.includes('caio') || normalizedRole.includes('ai strategy') || normalizedRole.includes('responsible ai')) {
    return 'Shape the governed AI use-case portfolio, responsible AI guardrails, adoption scorecard, and executive AI decision narrative.';
  }
  if (normalizedRole.includes('partner')) {
    return 'Identify the right partner motion, confirm delivery capacity, and package the demo or workshop so the customer sees a credible path forward.';
  }
  if (normalizedRole.includes('csam') || normalizedRole.includes('customer success')) {
    return 'Connect discovery to adoption health, renewal confidence, success milestones, and the customer value realization plan.';
  }
  if (normalizedRole.includes('copilot')) return 'Build the persona-specific Copilot proof, align it to the customer workflow, and define adoption guardrails.';
  if (normalizedRole.includes('security') || normalizedRole.includes('defender') || normalizedRole.includes('sentinel')) {
    return 'Translate risk signals into CISO-ready discovery, validation steps, and security proof requirements.';
  }
  if (normalizedRole.includes('identity') || normalizedRole.includes('entra')) return 'Clarify identity, access, governance, and control gaps so the secure collaboration path is clear.';
  if (normalizedRole.includes('data') || normalizedRole.includes('fabric') || normalizedRole.includes('power bi')) {
    return 'Turn reporting friction and disconnected data into an executive decision-workflow and analytics proof plan.';
  }
  if (normalizedRole.includes('endpoint') || normalizedRole.includes('intune')) return 'Validate endpoint, frontline, and device-management friction before the customer commits to a rollout path.';
  if (normalizedRole.includes('adoption') || normalizedRole.includes('viva')) return 'Shape the change-management plan, stakeholder communications, and adoption measures needed for durable customer usage.';
  if (normalizedRole.includes('industry')) return 'Translate account signals into industry language, business outcomes, and the customer-specific transformation narrative.';
  return 'Own a named customer-facing deliverable for the next meeting, including the question set, proof artifact, or executive-ready follow-up.';
};

export const useDiscoveryStore = create((set) => ({
  selectedAccountId: initialAccount?.id ?? null,
  companyName: initialAccount?.name ?? '',
  industry: initialAccount?.industry ?? 'Manufacturing',
  currentMotion: 'ME3',
  targetMotion: initialAccount?.targetMotion ?? 'ME5 + Copilot readiness',
  budgetStatus: 'Unknown',
  triggerScore: initialAccount?.triggerScore ?? 7,
  estimatedUsers: 250,
  selectedPains: initialAccount?.selectedPains ?? painOptions.slice(0, 2),
  selectedKeywords: initialAccount?.keywords ?? ['knowledge work', 'dashboards'],
  stakeholders: initialAccount?.stakeholders ?? [],
  keywordTally: buildKeywordTally(initialAccount),
  discoveryAnswers: decisionDefaults,
  activeStakeholderKey: stakeholderKey(initialAccount?.stakeholders?.[0]),
  stakeholderMeetings: buildStakeholderMeetings(initialAccount),
  scheduledMeetings: [],
  workshopPlan: buildWorkshopPlan(initialAccount),
  dynamicTeamMembers: buildTeamMembers(initialAccount),
  contractStatus: initialAccount?.contractContext?.status ?? 'Discovery before renewal',
  renewalWindow: initialAccount?.contractContext?.renewalWindow ?? 'Unknown',
  satisfactionLevel: initialAccount?.contractContext?.satisfaction ?? 'Unknown',
  procurementInvolved: initialAccount?.contractContext?.procurement ?? 'Unknown',
  businessCaseNeeded: initialAccount?.contractContext?.businessCase ?? 'Unknown',
  currentTools: initialAccount?.contractContext?.currentTools ?? [],
  adoptionGaps: initialAccount?.contractContext?.adoptionGaps ?? [],
  openBlockers: initialAccount?.contractContext?.blockers ?? [],
  openObjections: initialAccount?.objections ?? [],
  nextMeetingStatus: 'Not scheduled',
  discoveryNotes: initialAccount?.notes ?? '',
  personaLibrary: buildPersonaLibrary(),
  activePersonaId: 'coo',
  moneyDecisionMakerKey: defaultMoneyDecisionMakerKey(initialAccount),
  annualQuota: 50000000,
  dailyUpdateNotes: [],

  selectSampleAccount: (accountId) => {
    const account = portfolioAccounts.find((item) => item.id === accountId);
    if (!account) return;

    set({
      selectedAccountId: account.id,
      companyName: account.name,
      industry: account.industry,
      currentMotion: account.currentLevel,
      targetMotion: account.targetMotion,
      triggerScore: account.triggerScore,
      selectedPains: account.selectedPains,
      selectedKeywords: account.keywords,
      stakeholders: account.stakeholders,
      contractStatus: account.contractContext.status,
      renewalWindow: account.contractContext.renewalWindow,
      satisfactionLevel: account.contractContext.satisfaction,
      procurementInvolved: account.contractContext.procurement,
      businessCaseNeeded: account.contractContext.businessCase,
      currentTools: account.contractContext.currentTools,
      adoptionGaps: account.contractContext.adoptionGaps,
      openBlockers: account.contractContext.blockers,
      openObjections: account.objections,
      discoveryNotes: account.notes,
      keywordTally: buildKeywordTally(account),
      discoveryAnswers: decisionDefaults,
      activeStakeholderKey: stakeholderKey(account.stakeholders?.[0]),
      stakeholderMeetings: buildStakeholderMeetings(account),
      scheduledMeetings: [],
      workshopPlan: buildWorkshopPlan(account),
      dynamicTeamMembers: buildTeamMembers(account),
      moneyDecisionMakerKey: defaultMoneyDecisionMakerKey(account),
    });
  },
  setCompanyName: (name) => set({ companyName: name, selectedAccountId: null }),
  setIndustry: (industry) => set({ industry }),
  setMotions: (currentMotion, targetMotion) => set({ currentMotion, targetMotion }),
  setBudgetStatus: (budgetStatus) => set({ budgetStatus }),
  setTriggerScore: (triggerScore) => set({ triggerScore }),
  setEstimatedUsers: (estimatedUsers) => set({ estimatedUsers }),
  setContractContext: (updates) => set((state) => ({ ...updates, selectedAccountId: updates.selectedAccountId ?? state.selectedAccountId })),
  recordKeyword: (keyword) =>
    set((state) => ({
      keywordTally: {
        ...state.keywordTally,
        [keyword]: (state.keywordTally[keyword] ?? 0) + 1,
      },
      selectedKeywords: state.selectedKeywords.includes(keyword) ? state.selectedKeywords : [...state.selectedKeywords, keyword],
    })),
  togglePain: (pain) =>
    set((state) => ({
      selectedPains: state.selectedPains.includes(pain)
        ? state.selectedPains.filter((item) => item !== pain)
        : [...state.selectedPains, pain],
      keywordTally: state.selectedPains.includes(pain)
        ? state.keywordTally
        : { ...state.keywordTally, [pain]: (state.keywordTally[pain] ?? 0) + 1 },
    })),
  toggleKeyword: (keyword) =>
    set((state) => ({
      selectedKeywords: state.selectedKeywords.includes(keyword)
        ? state.selectedKeywords.filter((item) => item !== keyword)
        : [...state.selectedKeywords, keyword],
      keywordTally: state.selectedKeywords.includes(keyword)
        ? state.keywordTally
        : { ...state.keywordTally, [keyword]: (state.keywordTally[keyword] ?? 0) + 1 },
    })),
  setDiscoveryAnswer: (questionId, answer, keywords = []) =>
    set((state) => {
      const keywordTally = { ...state.keywordTally };
      const selectedKeywords = [...state.selectedKeywords];
      keywords.forEach((keyword) => {
        keywordTally[keyword] = (keywordTally[keyword] ?? 0) + 1;
        if (!selectedKeywords.includes(keyword)) selectedKeywords.push(keyword);
      });

      return {
        discoveryAnswers: { ...state.discoveryAnswers, [questionId]: answer },
        keywordTally,
        selectedKeywords,
      };
    }),
  setDiscoveryNotes: (discoveryNotes) => set({ discoveryNotes }),
  setActiveStakeholder: (activeStakeholderKey) => set({ activeStakeholderKey }),
  addStakeholder: (stakeholder = {}) =>
    set((state) => {
      const nextStakeholder = {
        name: stakeholder.name || 'New stakeholder',
        role: stakeholder.role || 'Business Owner',
        influence: stakeholder.influence || 'Champion',
        sentiment: stakeholder.sentiment || 'Neutral',
        notes: stakeholder.notes || '',
      };
      const key = stakeholderKey(nextStakeholder);
      const questionSet = buildStakeholderQuestionSet(nextStakeholder);

      return {
        stakeholders: [...state.stakeholders, nextStakeholder],
        activeStakeholderKey: key,
        stakeholderMeetings: {
          ...state.stakeholderMeetings,
          [key]: state.stakeholderMeetings[key] ?? {
            stakeholderKey: key,
            stakeholderName: nextStakeholder.name,
            role: nextStakeholder.role,
            profile: getRoleProfile(nextStakeholder.role).label,
            meetingStatus: 'Not scheduled',
            scheduledFor: '',
            objective: `Complete seven-level discovery with ${nextStakeholder.role}`,
            conversationContext: '',
            responses: Object.fromEntries(
              questionSet.map((question) => [
                question.id,
                {
                  answer: '',
                  yesNo: 'Unknown',
                  need: '',
                  want: '',
                  keywords: [],
                },
              ]),
            ),
            customQuestions: [],
          },
        },
      };
    }),
  updateStakeholder: (index, updates = {}) =>
    set((state) => {
      const existing = state.stakeholders[index];
      if (!existing) return {};

      const nextStakeholder = { ...existing, ...updates };
      const oldKey = stakeholderKey(existing);
      const nextKey = stakeholderKey(nextStakeholder);
      const stakeholderMeetings = { ...state.stakeholderMeetings };
      const existingMeeting = stakeholderMeetings[oldKey];

      if (existingMeeting) {
        delete stakeholderMeetings[oldKey];
        stakeholderMeetings[nextKey] = {
          ...existingMeeting,
          stakeholderKey: nextKey,
          stakeholderName: nextStakeholder.name,
          role: nextStakeholder.role,
          profile: getRoleProfile(nextStakeholder.role).label,
          objective: existingMeeting.objective || `Complete seven-level discovery with ${nextStakeholder.role}`,
        };
      }

      return {
        stakeholders: state.stakeholders.map((stakeholder, itemIndex) => (itemIndex === index ? nextStakeholder : stakeholder)),
        activeStakeholderKey: state.activeStakeholderKey === oldKey ? nextKey : state.activeStakeholderKey,
        stakeholderMeetings,
      };
    }),
  setActivePersona: (activePersonaId) => set({ activePersonaId }),
  setMoneyDecisionMaker: (moneyDecisionMakerKey) => set({ moneyDecisionMakerKey }),
  addPersona: (persona) =>
    set((state) => {
      const id = String(persona.role || persona.title || `persona-${Date.now()}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        activePersonaId: id,
        personaLibrary: {
          ...state.personaLibrary,
          [id]: {
            id,
            role: persona.role || 'Stakeholder',
            title: persona.title || 'Custom Persona',
            priorities: persona.priorities || [],
            commonPains: persona.commonPains || [],
            messaging: persona.messaging || 'Capture discovery signals and refine this persona over time.',
            renewalAngle: persona.renewalAngle || 'Use renewal timing to clarify urgency, blockers, and decision criteria.',
            newsAngles: persona.newsAngles || [],
            learnedSignals: [],
            industrySignals: {},
            accountExamples: [],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }),
  updatePersona: (personaId, updates) =>
    set((state) => ({
      personaLibrary: {
        ...state.personaLibrary,
        [personaId]: {
          ...state.personaLibrary[personaId],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    })),
  improvePersonaFromStakeholder: (stakeholder, account) =>
    set((state) => {
      const personaId = personaIdFromRole(stakeholder?.role);
      const current = state.personaLibrary[personaId];
      if (!current) return {};
      const industry = account?.industry ?? state.industry ?? 'General';
      const existingIndustrySignals = current.industrySignals?.[industry] ?? [];
      const industrySignals = getIndustryPersonaSignals(industry, personaId);
      const newSignals = [
        stakeholder?.role,
        stakeholder?.influence,
        ...(account?.selectedPains ?? []),
        ...(account?.keywords ?? []),
        ...industrySignals,
      ].filter(Boolean);

      return {
        activePersonaId: personaId,
        personaLibrary: {
          ...state.personaLibrary,
          [personaId]: {
            ...current,
            learnedSignals: [...new Set([...(current.learnedSignals ?? []), ...newSignals])].slice(0, 18),
            industrySignals: {
              ...(current.industrySignals ?? {}),
              [industry]: [...new Set([...existingIndustrySignals, ...newSignals])].slice(0, 14),
            },
            accountExamples: [...new Set([...(current.accountExamples ?? []), account?.name].filter(Boolean))].slice(0, 12),
            commonPains: [...new Set([...(current.commonPains ?? []), ...(account?.selectedPains ?? [])])].slice(0, 10),
            newsAngles: [...new Set([...(current.newsAngles ?? []), account?.industry, account?.trigger].filter(Boolean))].slice(0, 10),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }),
  addDailyUpdateNote: (note) =>
    set((state) => ({
      dailyUpdateNotes: [
        {
          id: `daily-${Date.now()}`,
          createdAt: new Date().toISOString(),
          text: note,
        },
        ...state.dailyUpdateNotes,
      ].slice(0, 12),
    })),
  updateStakeholderResponse: (stakeholderMeetingKey, levelId, updates, keywords = []) =>
    set((state) => {
      const keywordTally = { ...state.keywordTally };
      const selectedKeywords = [...state.selectedKeywords];
      keywords.forEach((keyword) => {
        keywordTally[keyword] = (keywordTally[keyword] ?? 0) + 1;
        if (!selectedKeywords.includes(keyword)) selectedKeywords.push(keyword);
      });

      const currentMeeting = state.stakeholderMeetings[stakeholderMeetingKey];
      if (!currentMeeting) return { keywordTally, selectedKeywords };

      const existingResponse = currentMeeting.responses[levelId] ?? {};
      const nextResponse = {
        ...existingResponse,
        ...updates,
        keywords: [...new Set([...(existingResponse.keywords ?? []), ...keywords])],
      };

      const combinedText = [nextResponse.answer, nextResponse.need, nextResponse.want]
        .filter(Boolean)
        .join(' ');
      const shouldBranch = !nextResponse.branchingPaused && !nextResponse.movedOn;
      const detectedFollowups = shouldBranch ? getKeywordFollowups(combinedText) : [];
      const existingCustom = currentMeeting.customQuestions ?? [];
      const customQuestions = [...existingCustom];

      const parentQuestionText = [
        ...buildStakeholderQuestionSet({ role: currentMeeting.role }),
        ...customQuestions,
      ].find((question) => question.id === levelId)?.question ?? 'Discovery branch';
      const parentKeywords = [
        ...buildStakeholderQuestionSet({ role: currentMeeting.role }),
        ...customQuestions,
      ].find((question) => question.id === levelId)?.keywords ?? [];
      const parentDepth = customQuestions.find((question) => question.id === levelId)?.depth ?? 0;
      const childDepth = Math.min(MAX_BRANCH_DEPTH, parentDepth + 1);

      detectedFollowups.forEach((item) => {
        if (childDepth > MAX_BRANCH_DEPTH) return;
        const id = `followup-${levelId}-${item.keyword.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
        if (!customQuestions.some((question) => question.id === id && question.parentId === levelId)) {
          const branch = buildBranchQuestion({
            seedTerm: item.keyword,
            parentQuestion: parentQuestionText,
            parentKeywords,
            depth: childDepth,
            sourceType: 'keyword',
          });
          if (!branch) return;
          customQuestions.push({
            id,
            ...branch,
            parentId: levelId,
            depth: childDepth,
          });
          keywordTally[item.keyword] = (keywordTally[item.keyword] ?? 0) + 1;
          if (!selectedKeywords.includes(item.keyword)) selectedKeywords.push(item.keyword);
        }
      });

      const nextResponses = {
        ...currentMeeting.responses,
        [levelId]: nextResponse,
      };
      customQuestions.forEach((question) => {
        if (!nextResponses[question.id]) {
          nextResponses[question.id] = {
            answer: '',
            yesNo: 'Unknown',
            need: '',
            want: '',
            keywords: question.keywords ?? [],
          };
        }
      });

      const personaId = personaIdFromRole(currentMeeting.role);
      const currentPersona = state.personaLibrary[personaId];
      const personaUpdates = currentPersona
        ? {
            [personaId]: {
              ...currentPersona,
              learnedSignals: [
                ...new Set([
                  ...(currentPersona.learnedSignals ?? []),
                  currentMeeting.role,
                  state.industry,
                  ...keywords,
                  ...Object.values(updates).filter(Boolean).flatMap((value) => String(value).split(/[,;.]/).map((item) => item.trim()).filter(Boolean)),
                ]),
              ].slice(0, 18),
              industrySignals: {
                ...(currentPersona.industrySignals ?? {}),
                [state.industry]: [
                  ...new Set([
                    ...(currentPersona.industrySignals?.[state.industry] ?? []),
                    ...getIndustryPersonaSignals(state.industry, personaId),
                    ...keywords,
                  ]),
                ].slice(0, 14),
              },
              accountExamples: [...new Set([...(currentPersona.accountExamples ?? []), state.companyName].filter(Boolean))].slice(0, 12),
              updatedAt: new Date().toISOString(),
            },
          }
        : {};

      return {
        keywordTally,
        selectedKeywords,
        personaLibrary: {
          ...state.personaLibrary,
          ...personaUpdates,
        },
        stakeholderMeetings: {
          ...state.stakeholderMeetings,
          [stakeholderMeetingKey]: {
            ...currentMeeting,
            customQuestions,
            responses: nextResponses,
          },
        },
      };
    }),
  updateStakeholderMeetingContext: (stakeholderMeetingKey, updates = {}) =>
    set((state) => {
      const currentMeeting = state.stakeholderMeetings[stakeholderMeetingKey];
      if (!currentMeeting) return {};

      return {
        stakeholderMeetings: {
          ...state.stakeholderMeetings,
          [stakeholderMeetingKey]: {
            ...currentMeeting,
            ...updates,
          },
        },
      };
    }),
  addBranchQuestionFromTerm: (stakeholderMeetingKey, parentId, term, sourceType = 'keyword') =>
    set((state) => {
      const currentMeeting = state.stakeholderMeetings[stakeholderMeetingKey];
      if (!currentMeeting) return {};
      const normalizedTerm = String(term ?? '').trim().toLowerCase();
      if (!normalizedTerm) return {};
      const parentResponse = currentMeeting.responses[parentId] ?? {};
      if (parentResponse.branchingPaused || parentResponse.movedOn) return {};

      const customQuestions = [...(currentMeeting.customQuestions ?? [])];
      const parentDepth = customQuestions.find((question) => question.id === parentId)?.depth ?? 0;
      const childDepth = parentDepth + 1;
      if (childDepth > MAX_BRANCH_DEPTH) return {};

      const parentQuestion = [
        ...buildStakeholderQuestionSet({ role: currentMeeting.role }),
        ...customQuestions,
      ].find((question) => question.id === parentId)?.question ?? 'Discovery branch';
      const parentKeywords = [
        ...buildStakeholderQuestionSet({ role: currentMeeting.role }),
        ...customQuestions,
      ].find((question) => question.id === parentId)?.keywords ?? [];

      const id = `branch-${parentId}-${normalizedTerm.replace(/[^a-z0-9]+/gi, '-')}-${sourceType}`;
      if (customQuestions.some((question) => question.id === id && question.parentId === parentId)) return {};

      const built = buildBranchQuestion({
        seedTerm: normalizedTerm,
        parentQuestion,
        parentKeywords,
        depth: childDepth,
        sourceType,
      });
      if (!built) return {};

      const nextResponses = {
        ...currentMeeting.responses,
        [id]: {
          answer: '',
          yesNo: 'Unknown',
          need: '',
          want: '',
          keywords: [normalizedTerm],
        },
      };

      return {
        keywordTally: {
          ...state.keywordTally,
          [normalizedTerm]: (state.keywordTally[normalizedTerm] ?? 0) + 1,
        },
        selectedKeywords: state.selectedKeywords.includes(normalizedTerm)
          ? state.selectedKeywords
          : [...state.selectedKeywords, normalizedTerm],
        stakeholderMeetings: {
          ...state.stakeholderMeetings,
          [stakeholderMeetingKey]: {
            ...currentMeeting,
            customQuestions: [
              ...customQuestions,
              {
                id,
                ...built,
                parentId,
                depth: childDepth,
                sourceType,
              },
            ],
            responses: nextResponses,
          },
        },
      };
    }),
  scheduleMeeting: (meeting) =>
    set((state) => {
      const id = `meeting-${Date.now()}`;
      const scheduledMeeting = { id, status: 'Scheduled', ...meeting };
      const stakeholderMeeting = state.stakeholderMeetings[meeting.stakeholderKey];

      return {
        scheduledMeetings: [...state.scheduledMeetings, scheduledMeeting],
        stakeholderMeetings: stakeholderMeeting
          ? {
              ...state.stakeholderMeetings,
              [meeting.stakeholderKey]: {
                ...stakeholderMeeting,
                meetingStatus: 'Scheduled',
                scheduledFor: meeting.scheduledFor,
                objective: meeting.objective,
              },
            }
          : state.stakeholderMeetings,
      };
    }),
  updateMeetingStatus: (meetingId, status) =>
    set((state) => ({
      scheduledMeetings: state.scheduledMeetings.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, status } : meeting,
      ),
    })),
  updateWorkshopItem: (itemId, updates) =>
    set((state) => ({
      workshopPlan: state.workshopPlan.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    })),
  addTeamMember: (member = {}) =>
    set((state) => ({
      dynamicTeamMembers: [
        ...state.dynamicTeamMembers,
        {
          id: `team-${Date.now()}`,
          name: member.name ?? '',
          role: member.role ?? 'Specialist',
          customerAction: member.customerAction ?? 'Own a specific customer-facing deliverable for the next conversation and turn discovery signals into a clearer proof path.',
        },
      ],
    })),
  updateTeamMember: (memberId, updates) =>
    set((state) => ({
      dynamicTeamMembers: state.dynamicTeamMembers.map((member) =>
        member.id === memberId ? { ...member, ...updates } : member,
      ),
    })),
  removeTeamMember: (memberId) =>
    set((state) => ({
      dynamicTeamMembers: state.dynamicTeamMembers.filter((member) => member.id !== memberId),
    })),
}));
