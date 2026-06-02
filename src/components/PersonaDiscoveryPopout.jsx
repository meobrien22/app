import { useEffect, useMemo, useState } from 'react';
import { Brain, CheckCircle2, CircleDashed, MessageSquareText, Sparkles, UserRoundPlus, X } from 'lucide-react';
import { buildStakeholderQuestionSet, getNeedWantLibrary, getRoleProfile, responseModes } from '../data/stakeholderDiscovery';
import { buildPersonaUpdate, personaIdFromRole } from '../data/personaData';
import { getQuestionCoachComment } from '../utils/aiCoach';
import { getKeywordSolutionMap, getStakeholderTranslation } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function PersonaDiscoveryPopout({ account, stakeholder, onClose }) {
  const [selectedStakeholder, setSelectedStakeholder] = useState(stakeholder);
  const [previewPersonaId, setPreviewPersonaId] = useState(null);
  const {
    addBranchQuestionFromTerm,
    improvePersonaFromStakeholder,
    keywordTally,
    personaLibrary,
    setActivePersona,
    stakeholderMeetings,
    updateStakeholderMeetingContext,
    updateStakeholderResponse,
  } = useDiscoveryStore();

  useEffect(() => {
    setSelectedStakeholder(stakeholder);
    setPreviewPersonaId(personaIdFromRole(stakeholder?.role));
  }, [stakeholder]);

  const personaLinks = useMemo(() => {
    const personas = Object.values(personaLibrary ?? {});
    return personas.map((persona) => {
      const mappedStakeholders = (account.stakeholders ?? []).filter((person) => personaIdFromRole(person.role) === persona.id);
      return {
        persona,
        mappedStakeholders,
      };
    });
  }, [account.stakeholders, personaLibrary]);

  const activeKey = stakeholderKey(selectedStakeholder);
  const meeting = stakeholderMeetings[activeKey];
  const profile = getRoleProfile(selectedStakeholder?.role);
  const activePersonaId = personaIdFromRole(selectedStakeholder?.role);
  const previewPersona = personaLibrary?.[previewPersonaId ?? activePersonaId];
  const previewUpdate = previewPersona ? buildPersonaUpdate(account, previewPersona) : null;
  const baseQuestions = buildStakeholderQuestionSet(selectedStakeholder);
  const customQuestions = meeting?.customQuestions ?? [];
  const allQuestions = [...baseQuestions, ...customQuestions];
  const rootQuestions = allQuestions.filter((question) => !question.parentId);
  const childMap = allQuestions.reduce((map, question) => {
    if (!question.parentId) return map;
    map[question.parentId] = [...(map[question.parentId] ?? []), question];
    return map;
  }, {});
  const orderedQuestions = flattenQuestions(rootQuestions, childMap);
  const answeredQuestions = orderedQuestions.filter((question) => isAnswered(meeting?.responses?.[question.id]));
  const needWantLibrary = getNeedWantLibrary(account.industry, account.segment);
  const translation = getStakeholderTranslation(meeting);
  const solutionMap = getKeywordSolutionMap(account, stakeholderMeetings, keywordTally).slice(0, 5);
  const executiveSummary = buildLiveExecutiveSummary({
    account,
    stakeholder: selectedStakeholder,
    meeting,
    profile,
    orderedQuestions,
    translation,
    solutionMap,
  });

  const switchToPersona = (persona, mappedStakeholder) => {
    setPreviewPersonaId(persona.id);
    setActivePersona(persona.id);
    if (!mappedStakeholder) return;
    setSelectedStakeholder(mappedStakeholder);
    improvePersonaFromStakeholder(mappedStakeholder, account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Persona discovery meeting</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {selectedStakeholder.name} - {profile.label}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{profile.focus}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden xl:grid-cols-[0.72fr_1.28fr_0.9fr]">
          <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-5">
            <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Switch persona lens</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {personaLinks.map(({ persona, mappedStakeholders }) => {
                  const mappedStakeholder = mappedStakeholders[0];
                  const isActive = persona.id === activePersonaId;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => switchToPersona(persona, mappedStakeholder)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                        isActive
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : mappedStakeholder
                            ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                            : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {persona.role}
                    </button>
                  );
                })}
              </div>
              {previewPersona && (
                <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{previewPersona.title}</p>
                  <p className="mt-1 text-sm font-bold text-blue-950">{previewPersona.role} lens</p>
                  <p className="mt-2 text-xs leading-5 text-blue-900">{previewUpdate?.message ?? previewPersona.messaging}</p>
                  {!personaLinks.find((item) => item.persona.id === previewPersona.id)?.mappedStakeholders.length && (
                    <p className="mt-2 rounded-md bg-white p-2 text-xs font-bold text-slate-600">
                      No {previewPersona.role} stakeholder mapped yet. Add that stakeholder to use live questions for this lens.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Live executive summary</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-blue-950">{executiveSummary}</p>
            </div>

            <label className="mt-5 block">
              <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                <MessageSquareText className="mr-2 h-4 w-4 text-blue-600" />
                Said before or between questions
              </span>
              <textarea
                value={meeting?.conversationContext ?? ''}
                onChange={(event) => updateStakeholderMeetingContext(activeKey, { conversationContext: event.target.value })}
                className="mt-2 min-h-32 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Capture exact words, context, side comments, objections, or anything said between questions..."
              />
            </label>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Meeting progress</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <SummaryStat label="Answered" value={`${answeredQuestions.length}/${orderedQuestions.length}`} />
                <SummaryStat label="Branches" value={customQuestions.length} />
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                <Brain className="mr-2 h-4 w-4 text-emerald-600" />
                Translation
              </p>
              <MiniList title="Needs" items={translation.needs} />
              <MiniList title="Wants" items={translation.wants} />
              <MiniList title="Keywords" items={translation.keywords} />
            </div>
          </aside>

          <main className="min-h-0 overflow-y-auto p-5">
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Seven-level persona question path</p>
                  <h3 className="mt-1 font-bold text-slate-950">Yes / no / yes-and / no-and branching discovery</h3>
                </div>
                <p className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">Auto branches up to 5 levels</p>
              </div>
            </div>

            <div className="space-y-4">
              {rootQuestions.map((question) => (
                <PersonaQuestionNode
                  key={question.id}
                  question={question}
                  level={0}
                  childMap={childMap}
                  meeting={meeting}
                  activeKey={activeKey}
                  account={account}
                  stakeholder={selectedStakeholder}
                  needWantLibrary={needWantLibrary}
                  updateStakeholderResponse={updateStakeholderResponse}
                  addBranchQuestionFromTerm={addBranchQuestionFromTerm}
                />
              ))}
            </div>
          </main>

          <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-5">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Sparkles className="mr-2 h-4 w-4" />
                What the AE can say now
              </p>
              <div className="mt-3 space-y-2">
                {buildTalkTracks(selectedStakeholder, answeredQuestions, meeting, solutionMap).map((track) => (
                  <p key={track} className="rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-emerald-950">
                    {track}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Keyword to Microsoft map</p>
              <div className="mt-3 space-y-3">
                {solutionMap.map((item) => {
                  const keywordMove = buildKeywordMove(item, selectedStakeholder, profile, account);
                  return (
                    <div key={item.keyword} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-slate-950">{item.keyword}</p>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">{item.count || 1}x</span>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-5 text-emerald-700">{item.solutions.join(', ')}</p>
                      <div className="mt-3 rounded-md border border-white bg-white p-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bring in</p>
                        <p className="mt-1 text-xs font-bold text-slate-900">{keywordMove.role}</p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Next AE move</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{keywordMove.action}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-blue-100 bg-white p-4">
              <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-700">
                <UserRoundPlus className="mr-2 h-4 w-4" />
                What is next
              </p>
              <div className="mt-3 space-y-3">
                {buildNextActionPlan({
                  account,
                  stakeholder: selectedStakeholder,
                  profile,
                  answeredQuestions,
                  meeting,
                  solutionMap,
                  translation,
                }).map((item) => (
                  <div key={`${item.role}-${item.action}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        {item.role}
                      </span>
                      <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500">{item.solution}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold leading-5 text-slate-950">{item.action}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.deliverable}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PersonaQuestionNode({
  question,
  level,
  childMap,
  meeting,
  activeKey,
  account,
  stakeholder,
  needWantLibrary,
  updateStakeholderResponse,
  addBranchQuestionFromTerm,
}) {
  const response = meeting?.responses?.[question.id] ?? {};
  const children = childMap[question.id] ?? [];
  const coach = getQuestionCoachComment({ account, stakeholder, question, response });
  const isRootQuestion = level === 0;
  const branchingPaused = Boolean(response.branchingPaused);
  const movedOn = Boolean(response.movedOn);

  const addCoachComment = () => {
    const note = `AI coach comment: ${coach.comment}`;
    updateStakeholderResponse(activeKey, question.id, {
      answer: response.answer ? `${response.answer}\n${note}` : note,
    });
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${level > 0 ? 'ml-4 border-blue-100 bg-blue-50/40 md:ml-8' : ''}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{question.name}</p>
          <h4 className="mt-2 text-base font-bold text-slate-950">{question.question}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">{question.intent}</p>
          <QuestionExamples question={question} stakeholder={stakeholder} account={account} />
          {isRootQuestion && (
            <BranchStarterTags
              question={question}
              response={response}
              needWantLibrary={needWantLibrary}
              activeKey={activeKey}
              updateStakeholderResponse={updateStakeholderResponse}
              addBranchQuestionFromTerm={addBranchQuestionFromTerm}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-slate-200 bg-slate-50 p-1">
          {responseModes.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => updateStakeholderResponse(activeKey, question.id, { yesNo: option.id }, question.keywords)}
              className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                response.yesNo === option.id
                  ? option.id === 'Yes' || option.id === 'Yes and'
                    ? 'bg-emerald-100 text-emerald-700'
                    : option.id === 'Unknown'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-orange-100 text-orange-700'
                  : 'text-slate-500 hover:bg-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
        {branchingPaused ? (
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700">
            {movedOn ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <CircleDashed className="h-3.5 w-3.5 text-orange-500" />}
            {movedOn ? 'Moved on from this thread' : 'Branching paused'}
          </span>
        ) : (
          <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600">Branching active</span>
        )}
        <button
          type="button"
          onClick={() => updateStakeholderResponse(activeKey, question.id, { branchingPaused: true, movedOn: false })}
          className="rounded-md border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50"
        >
          Pause branching
        </button>
        <button
          type="button"
          onClick={() => updateStakeholderResponse(activeKey, question.id, { branchingPaused: true, movedOn: true })}
          className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
        >
          Move on
        </button>
        {branchingPaused && (
          <button
            type="button"
            onClick={() => updateStakeholderResponse(activeKey, question.id, { branchingPaused: false, movedOn: false })}
            className="rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            Resume branching
          </button>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Coach comment</p>
            <p className="mt-2 text-sm leading-6 text-blue-950">{coach.comment}</p>
            <p className="mt-2 text-xs font-bold text-blue-700">{coach.suggestedFollowUp}</p>
          </div>
          <button
            type="button"
            onClick={addCoachComment}
            className="shrink-0 rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            Add to notes
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <textarea
          value={response.need ?? ''}
          onChange={(event) => updateStakeholderResponse(activeKey, question.id, { need: event.target.value })}
          className="min-h-20 resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Need: what must be true?"
        />
        <textarea
          value={response.want ?? ''}
          onChange={(event) => updateStakeholderResponse(activeKey, question.id, { want: event.target.value })}
          className="min-h-20 resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Want: what would they prefer?"
        />
      </div>

      <textarea
        value={response.answer ?? ''}
        onChange={(event) => updateStakeholderResponse(activeKey, question.id, { answer: event.target.value })}
        className="mt-3 min-h-24 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Capture exact words, examples, objections, or what they say between this question and the next..."
      />

      {children.length > 0 && !movedOn && (
        <div className="mt-4 space-y-3 border-l-2 border-blue-200 pl-3">
          {children.map((child) => (
            <PersonaQuestionNode
              key={child.id}
              question={child}
              level={level + 1}
              childMap={childMap}
              meeting={meeting}
              activeKey={activeKey}
              account={account}
              stakeholder={stakeholder}
              needWantLibrary={needWantLibrary}
              updateStakeholderResponse={updateStakeholderResponse}
              addBranchQuestionFromTerm={addBranchQuestionFromTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BranchStarterTags({
  question,
  response,
  needWantLibrary,
  activeKey,
  updateStakeholderResponse,
  addBranchQuestionFromTerm,
}) {
  const branchingPaused = Boolean(response.branchingPaused);
  const starterTags = [
    ...(question.keywords ?? []).slice(0, 5).map((label) => ({ label, sourceType: 'keyword', tone: 'blue' })),
    ...needWantLibrary.needs.slice(0, 3).map((label) => ({ label, sourceType: 'need', tone: 'emerald' })),
    ...needWantLibrary.wants.slice(0, 2).map((label) => ({ label, sourceType: 'want', tone: 'violet' })),
  ];

  const pickTag = (tag) => {
    if (branchingPaused) return;
    if (tag.sourceType === 'need') {
      updateStakeholderResponse(activeKey, question.id, { need: response.need ? `${response.need}; ${tag.label}` : tag.label });
    } else if (tag.sourceType === 'want') {
      updateStakeholderResponse(activeKey, question.id, { want: response.want ? `${response.want}; ${tag.label}` : tag.label });
    } else {
      updateStakeholderResponse(activeKey, question.id, {}, [tag.label]);
    }
    addBranchQuestionFromTerm(activeKey, question.id, tag.label, tag.sourceType);
  };

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Branch starter tags</p>
      <div className="flex flex-wrap gap-2">
        {starterTags.map((tag) => (
          <button
            type="button"
            key={`${tag.sourceType}-${tag.label}`}
            onClick={() => pickTag(tag)}
            disabled={branchingPaused}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tagTone(tag.tone)} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {tag.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Use these only when the answer needs another question. Pause branching or move on when the thread is done.
      </p>
    </div>
  );
}

function QuestionExamples({ question, stakeholder, account }) {
  const examples = buildQuestionExamples(question, stakeholder, account);

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Example cues</p>
      <div className="mt-2 space-y-2">
        {examples.map((example) => (
          <p key={example} className="text-xs leading-5 text-slate-600">
            {example}
          </p>
        ))}
      </div>
    </div>
  );
}

function buildQuestionExamples(question, stakeholder, account) {
  if (question.isAutoGenerated) {
    const keyword = question.keywords?.[0] ?? 'that signal';
    return [
      `Example: "When you say ${keyword}, do you mean the work is delayed, the owner is unclear, or the team lacks proof?"`,
      `Good capture: exact team affected, current workaround, and whether this is worth another follow-up.`,
    ];
  }

  const role = stakeholder?.role ?? 'this stakeholder';
  const industry = account?.industry ?? 'this industry';
  const byLevel = {
    level1: [
      `Listen for: "The outcome I care about is faster decisions, clearer ownership, or fewer operational misses."`,
      `A strong answer names the business outcome, why now, and who will care if it improves.`,
    ],
    level2: [
      `Listen for: "Today this happens across Teams, email, spreadsheets, and one system of record."`,
      `A strong answer names the current workflow, tool sprawl, handoffs, and the operating rhythm.`,
    ],
    level3: [
      `Listen for: "Last month this created rework, missed follow-up, or manual reporting before leadership review."`,
      `A strong answer includes a real example, affected team, frequency, and current workaround.`,
    ],
    level4: [
      `Listen for: "The impact is slower decisions, lower confidence, risk exposure, or adoption friction."`,
      `A strong answer translates pain into business language that a ${role} would repeat.`,
    ],
    level5: [
      `Listen for: "Finance, IT, security, operations, and procurement need different proof before agreeing."`,
      `A strong answer clarifies decision owners, blockers, approval criteria, and next-meeting requirements.`,
    ],
    level6: [
      `Listen for: "We should validate collaboration, AI, analytics, security, identity, or adoption first."`,
      `A strong answer tells the AE which Microsoft specialist and proof motion belong in the next step.`,
    ],
    level7: [
      `Listen for: "Bring back a demo, workshop recap, success criteria, and the people who can answer technical questions."`,
      `A strong answer creates a mutual action plan for ${industry} with owner, date, and deliverable.`,
    ],
  };

  return byLevel[question.id] ?? [
    `Listen for the customer phrase, the affected team, and the proof they need before moving forward.`,
    `A strong answer helps the AE decide whether to branch, pause, or move on.`,
  ];
}

function tagTone(tone) {
  return {
    blue: 'border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    violet: 'border-violet-100 bg-violet-50 text-violet-700 hover:bg-violet-100',
  }[tone];
}

function SummaryStat({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}

function MiniList({ title, items }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.slice(0, 6).map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500">Not captured yet</span>
        )}
      </div>
    </div>
  );
}

function buildLiveExecutiveSummary({ account, stakeholder, meeting, profile, orderedQuestions, translation, solutionMap }) {
  const context = meeting?.conversationContext?.trim();
  const answered = orderedQuestions
    .map((question) => {
      const response = meeting?.responses?.[question.id];
      if (!isAnswered(response)) return null;
      const captured = [response.yesNo && response.yesNo !== 'Unknown' ? response.yesNo : '', response.need, response.want, response.answer]
        .filter(Boolean)
        .join(' - ');
      return `${question.name}: ${captured}`;
    })
    .filter(Boolean);
  const firstTwo = answered.slice(0, 2);
  const needs = translation.needs.slice(0, 3).join(', ');
  const wants = translation.wants.slice(0, 3).join(', ');
  const keywords = translation.keywords.slice(0, 4).join(', ');
  const solutions = solutionMap.slice(0, 3).flatMap((item) => item.solutions).filter((item, index, list) => list.indexOf(item) === index).join(', ');

  if (!answered.length && !context) {
    return `${stakeholder.name} is mapped as ${profile.label}. Start by confirming the business outcome, current workflow, and the proof this persona would need to support ${account.targetMotion}.`;
  }

  return [
    `${stakeholder.name} has shared ${firstTwo.length ? firstTwo.join(' ') : 'early discovery context'}.`,
    context ? `Additional context captured: ${context}.` : '',
    needs ? `Needs: ${needs}.` : '',
    wants ? `Wants: ${wants}.` : '',
    keywords ? `Repeated language: ${keywords}.` : '',
    solutions ? `Current Microsoft fit signals: ${solutions}.` : '',
  ].filter(Boolean).join(' ');
}

function buildTalkTracks(stakeholder, answeredQuestions, meeting, solutionMap) {
  const latestQuestion = answeredQuestions[answeredQuestions.length - 1];
  const latestResponse = latestQuestion ? meeting?.responses?.[latestQuestion.id] : null;
  const latestSignal = [latestResponse?.need, latestResponse?.want, latestResponse?.answer].filter(Boolean).join(' ');
  const topSolution = solutionMap[0]?.solutions?.[0] ?? 'the Microsoft motion';

  return [
    latestSignal
      ? `What I heard is: ${latestSignal}. Did I capture that correctly?`
      : `I want to understand what ${stakeholder.role} needs to see before this becomes worth prioritizing.`,
    `Based on this conversation, the next useful path is to validate ${topSolution} against the business outcome, not lead with features.`,
    `If we stopped now, I would summarize this as a ${stakeholder.role} discovery around clearer outcomes, proof needs, and next-step confidence.`,
  ];
}

function buildNextActionPlan({ account, stakeholder, profile, answeredQuestions, meeting, solutionMap, translation }) {
  const topSolutions = solutionMap.flatMap((item) => item.solutions).filter((item, index, list) => list.indexOf(item) === index);
  const signals = [...translation.keywords, ...translation.needs, ...translation.wants].filter(Boolean);
  const lastQuestion = answeredQuestions[answeredQuestions.length - 1];
  const lastResponse = lastQuestion ? meeting?.responses?.[lastQuestion.id] : null;
  const latestLanguage = [lastResponse?.need, lastResponse?.want, lastResponse?.answer].filter(Boolean).join(' ');
  const baseRoles = profile.vTeam?.length ? profile.vTeam : ['Technical Specialist', 'Adoption Specialist'];
  const solutionRoles = topSolutions.slice(0, 3).map((solution) => `${solution} Specialist`);
  const roles = [...new Set([...baseRoles, ...solutionRoles])].slice(0, 4);

  return roles.map((role, index) => {
    const solution = topSolutions[index] ?? topSolutions[0] ?? account.targetMotion ?? 'Microsoft motion';
    return {
      role,
      solution,
      action: getNextAction(role, solution, stakeholder, signals, latestLanguage),
      deliverable: getRoleDeliverable(role, solution, stakeholder, account),
    };
  });
}

function buildKeywordMove(item, stakeholder, profile, account) {
  const solution = item.solutions?.[0] ?? account.targetMotion ?? 'Microsoft motion';
  const role = suggestedRoleForSolution(solution, profile);
  return {
    role,
    action: getNextAction(role, solution, stakeholder, [item.keyword], item.keyword),
  };
}

function suggestedRoleForSolution(solution, profile) {
  if (solution.includes('Copilot')) return 'Copilot Specialist';
  if (solution.includes('Defender') || solution.includes('Sentinel')) return 'Security Specialist';
  if (solution.includes('Entra')) return 'Identity Specialist';
  if (solution.includes('Intune')) return 'Endpoint Specialist';
  if (solution.includes('Power BI') || solution.includes('Fabric')) return 'Data Specialist';
  if (solution.includes('Power Platform')) return 'Power Platform Specialist';
  if (solution.includes('Teams')) return 'Teams Specialist';
  if (solution.includes('Viva')) return 'Adoption Specialist';
  if (solution.includes('Purview')) return 'Compliance Specialist';
  return profile.vTeam?.[0] ?? 'Technical Specialist';
}

function getNextAction(role, solution, stakeholder, signals, latestLanguage) {
  const signal = signals[0] ?? latestLanguage ?? 'the highest-confidence customer signal';
  if (role.includes('Executive')) return `Schedule an executive alignment touch with ${stakeholder.role} language.`;
  if (role.includes('Copilot')) return `Prepare a persona-specific Copilot demo around "${signal}".`;
  if (role.includes('Security') || role.includes('Defender') || role.includes('Sentinel')) return `Book a security validation meeting and map the current risk workflow.`;
  if (role.includes('Identity') || role.includes('Entra')) return `Bring identity into the next call to validate access, governance, and ownership questions.`;
  if (role.includes('Data') || role.includes('Power BI') || role.includes('Fabric')) return `Run a reporting and data-workflow whiteboard before showing analytics.`;
  if (role.includes('Power Platform')) return `Identify one workflow that can become an automation proof.`;
  if (role.includes('Endpoint') || role.includes('Intune')) return `Meet with IT operations to validate device and frontline management friction.`;
  if (role.includes('Adoption') || role.includes('Viva')) return `Build a change and adoption plan for the team that would use ${solution}.`;
  return `Join the next meeting to turn ${solution} fit into a customer-ready proof motion.`;
}

function getRoleDeliverable(role, solution, stakeholder, account) {
  if (role.includes('Executive')) return `Deliverable: one-page executive narrative for ${account.name} tied to ${stakeholder.role} priorities.`;
  if (role.includes('Specialist')) return `Deliverable: targeted demo, validation questions, and proof criteria for ${solution}.`;
  if (role.includes('Industry')) return `Deliverable: industry point of view and discovery workshop framing for ${account.industry}.`;
  return `Deliverable: clear next step, owner, and customer-facing follow-up for ${solution}.`;
}

function flattenQuestions(rootQuestions, childMap) {
  const ordered = [];
  const visit = (question) => {
    ordered.push(question);
    (childMap[question.id] ?? []).forEach(visit);
  };
  rootQuestions.forEach(visit);
  return ordered;
}

function isAnswered(response = {}) {
  return Boolean(response.yesNo && response.yesNo !== 'Unknown') || Boolean(response.answer) || Boolean(response.need) || Boolean(response.want);
}

function stakeholderKey(stakeholder) {
  return `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
