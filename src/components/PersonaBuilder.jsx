import { ClipboardList, MessageSquareText, Newspaper, Plus, RefreshCw, Tags, UserRoundCog } from 'lucide-react';
import { useMemo, useState } from 'react';
import { buildPersonaUpdate, personaIdFromRole } from '../data/personaData';
import { buildStakeholderQuestionSet } from '../data/stakeholderDiscovery';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function PersonaBuilder({ account }) {
  const [newRole, setNewRole] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const {
    personaLibrary,
    activePersonaId,
    setActivePersona,
    addPersona,
    improvePersonaFromStakeholder,
    keywordTally,
    stakeholderMeetings,
  } = useDiscoveryStore();

  const personas = Object.values(personaLibrary);
  const activePersona = personaLibrary[activePersonaId] ?? personas[0];
  const personaUpdate = useMemo(() => buildPersonaUpdate(account, activePersona), [account, activePersona]);
  const industrySignals = activePersona.industrySignals?.[account.industry] ?? [];
  const matchingStakeholders = account.stakeholders.filter((stakeholder) =>
    personaIdFromRole(stakeholder.role) === activePersona.id,
  );
  const discoveryMemory = useMemo(
    () => buildPersonaDiscoveryMemory(account, activePersona, stakeholderMeetings, keywordTally),
    [account, activePersona, stakeholderMeetings, keywordTally],
  );

  const handleAddPersona = () => {
    if (!newRole.trim() && !newTitle.trim()) return;
    addPersona({
      role: newRole.trim() || newTitle.trim(),
      title: newTitle.trim() || `${newRole.trim()} Persona`,
      priorities: ['Customer outcome clarity'],
      commonPains: ['Unclear discovery signals'],
      newsAngles: [account.industry],
    });
    setNewRole('');
    setNewTitle('');
  };

  const handleImprove = () => {
    const stakeholder = matchingStakeholders[0] ?? account.stakeholders[0];
    improvePersonaFromStakeholder(stakeholder, account);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="flex items-center font-bold text-slate-900">
            <UserRoundCog className="mr-2 h-4 w-4 text-blue-600" />
            Persona Builder
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Build reusable stakeholder personas that learn from discovery across accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleImprove}
          className="flex items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Learn From Account
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {personas.map((persona) => (
          <button
            type="button"
            key={persona.id}
            onClick={() => setActivePersona(persona.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              persona.id === activePersona.id
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
            }`}
          >
            {persona.role}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{activePersona.title}</p>
          <h4 className="mt-2 text-xl font-bold text-slate-950">{activePersona.role}</h4>
          <p className="mt-3 text-sm leading-6 text-slate-700">{activePersona.messaging}</p>

          <TagGroup title="Priorities" items={activePersona.priorities} tone="blue" />
          <TagGroup title="Learned Signals" items={activePersona.learnedSignals?.slice(0, 8) ?? []} tone="emerald" empty="No learned signals yet." />
          <TagGroup title={`${account.industry} Signals`} items={industrySignals} tone="amber" empty="No industry-specific signals yet." />
          <TagGroup title="Accounts Learned From" items={activePersona.accountExamples ?? []} tone="slate" empty="No account examples yet." />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
            <h4 className="flex items-center font-bold text-orange-950">
              <Newspaper className="mr-2 h-4 w-4" />
              Persona-Centered Customer Updates
            </h4>
            <p className="mt-3 text-sm leading-6 text-orange-950">{personaUpdate.news}</p>
            <p className="mt-3 text-sm leading-6 text-orange-950">{personaUpdate.renewal}</p>
            <p className="mt-3 text-sm leading-6 text-orange-950">{personaUpdate.message}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Add Persona</p>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Role, e.g. CRO"
              />
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Persona title"
              />
              <button
                type="button"
                onClick={handleAddPersona}
                className="flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Account persona discovery memory</p>
            <h4 className="mt-1 text-xl font-bold text-blue-950">
              {activePersona.role} findings for {account.name}
            </h4>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-950">
              Every note, keyword, need, want, and answered question below is pulled from matching stakeholder discovery in this account.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Stakeholders" value={discoveryMemory.stakeholders.length} />
            <MiniStat label="Answers" value={discoveryMemory.answers.length} />
            <MiniStat label="Keywords" value={discoveryMemory.keywordCounts.length} />
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <InfoPanel icon={UserRoundCog} title="Matching stakeholders">
              {discoveryMemory.stakeholders.length ? (
                <div className="space-y-2">
                  {discoveryMemory.stakeholders.map((stakeholder) => (
                    <div key={stakeholder.key} className="rounded-lg bg-white p-3">
                      <p className="font-bold text-slate-950">{stakeholder.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {stakeholder.role} - {stakeholder.influence} - {stakeholder.sentiment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>No stakeholders in this account currently map to this persona.</EmptyText>
              )}
            </InfoPanel>

            <InfoPanel icon={Tags} title="Persona keywords captured">
              <TagCountGroup items={discoveryMemory.keywordCounts} empty="No persona-specific keywords captured yet." />
            </InfoPanel>

            <InfoPanel icon={Tags} title="Account signals to test with this persona">
              <TagCountGroup items={discoveryMemory.accountSignals} empty="No account-level signals captured yet." />
            </InfoPanel>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <InfoPanel icon={ClipboardList} title="Needs captured">
                <TagGroup title="" items={discoveryMemory.needs} tone="emerald" empty="No needs captured yet." compact />
              </InfoPanel>
              <InfoPanel icon={ClipboardList} title="Wants captured">
                <TagGroup title="" items={discoveryMemory.wants} tone="amber" empty="No wants captured yet." compact />
              </InfoPanel>
            </div>
          </div>

          <div className="space-y-4">
            <InfoPanel icon={MessageSquareText} title="Discovery notes and context">
              {discoveryMemory.notes.length ? (
                <div className="space-y-3">
                  {discoveryMemory.notes.map((note) => (
                    <div key={`${note.source}-${note.text}`} className="rounded-lg bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{note.source}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>No notes captured for this persona yet. Open the persona discovery popout and add what they said before, during, or between questions.</EmptyText>
              )}
            </InfoPanel>

            <InfoPanel icon={ClipboardList} title="Question evidence">
              {discoveryMemory.answers.length ? (
                <div className="space-y-3">
                  {discoveryMemory.answers.map((item) => (
                    <div key={`${item.stakeholderKey}-${item.questionId}`} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{item.stakeholderName}</p>
                          <p className="mt-1 text-sm font-bold leading-6 text-slate-950">{item.question}</p>
                        </div>
                        <span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {item.yesNo}
                        </span>
                      </div>
                      {item.answer && <p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p>}
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {item.need && (
                          <p className="rounded-md bg-emerald-50 p-2 text-xs font-semibold leading-5 text-emerald-800">
                            Need: {item.need}
                          </p>
                        )}
                        {item.want && (
                          <p className="rounded-md bg-amber-50 p-2 text-xs font-semibold leading-5 text-amber-800">
                            Want: {item.want}
                          </p>
                        )}
                      </div>
                      {item.keywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.keywords.map((keyword) => (
                            <span key={keyword} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>No answered discovery questions are attached to this persona yet.</EmptyText>
              )}
            </InfoPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagGroup({ title, items, tone, empty, compact = false }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-800',
    slate: 'border-slate-200 bg-white text-slate-600',
  }[tone];

  return (
    <div className={compact ? '' : 'mt-4'}>
      {title && <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>}
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span key={item} className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500">{empty}</span>
        )}
      </div>
    </div>
  );
}

function buildPersonaDiscoveryMemory(account, persona, stakeholderMeetings = {}, keywordTally = {}) {
  const matchingStakeholders = (account.stakeholders ?? [])
    .filter((stakeholder) => personaIdFromRole(stakeholder.role) === persona.id)
    .map((stakeholder) => ({
      ...stakeholder,
      key: stakeholderKey(stakeholder),
    }));
  const keywordMap = new Map();
  const accountSignalMap = new Map();
  const needs = [];
  const wants = [];
  const notes = [];
  const answers = [];

  [...(account.selectedPains ?? []), ...(account.keywords ?? []), ...Object.keys(keywordTally ?? {})]
    .filter(Boolean)
    .forEach((keyword) => {
      accountSignalMap.set(keyword, Math.max(accountSignalMap.get(keyword) ?? 0, keywordTally[keyword] ?? 1));
    });

  matchingStakeholders.forEach((stakeholder) => {
    const meeting = stakeholderMeetings[stakeholder.key];
    const questionMap = buildQuestionMap(stakeholder, meeting);

    if (stakeholder.notes) {
      notes.push({ source: `${stakeholder.name} stakeholder note`, text: stakeholder.notes });
    }
    if (meeting?.conversationContext) {
      notes.push({ source: `${stakeholder.name} conversation context`, text: meeting.conversationContext });
    }

    Object.entries(meeting?.responses ?? {}).forEach(([questionId, response]) => {
      const keywords = [...new Set(response.keywords ?? [])].filter(Boolean);
      keywords.forEach((keyword) => keywordMap.set(keyword, (keywordMap.get(keyword) ?? 0) + 1));
      if (response.need) needs.push(response.need);
      if (response.want) wants.push(response.want);

      if (!isFoundResponse(response)) return;

      answers.push({
        stakeholderKey: stakeholder.key,
        stakeholderName: stakeholder.name,
        questionId,
        question: questionMap[questionId]?.question ?? questionMap[questionId]?.name ?? 'Discovery question',
        yesNo: response.yesNo || 'Unknown',
        answer: response.answer,
        need: response.need,
        want: response.want,
        keywords,
      });
    });
  });

  return {
    stakeholders: matchingStakeholders,
    notes,
    answers,
    needs: [...new Set(needs)].filter(Boolean),
    wants: [...new Set(wants)].filter(Boolean),
    keywordCounts: [...keywordMap.entries()]
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword)),
    accountSignals: [...accountSignalMap.entries()]
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
      .slice(0, 12),
  };
}

function buildQuestionMap(stakeholder, meeting) {
  return [...buildStakeholderQuestionSet(stakeholder), ...(meeting?.customQuestions ?? [])].reduce((map, question) => {
    map[question.id] = question;
    return map;
  }, {});
}

function isFoundResponse(response = {}) {
  return Boolean(
    response.answer ||
    response.need ||
    response.want ||
    (response.keywords ?? []).length ||
    (response.yesNo && response.yesNo !== 'Unknown'),
  );
}

function stakeholderKey(stakeholder) {
  return `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function InfoPanel({ icon: Icon, title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 flex items-center text-xs font-bold uppercase tracking-wider text-slate-500">
        <Icon className="mr-2 h-4 w-4 text-blue-600" />
        {title}
      </p>
      {children}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2">
      <p className="text-lg font-bold text-blue-950">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{label}</p>
    </div>
  );
}

function TagCountGroup({ items, empty }) {
  if (!items.length) return <EmptyText>{empty}</EmptyText>;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.keyword} className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-bold text-blue-700">
          {item.keyword} ({item.count})
        </span>
      ))}
    </div>
  );
}

function EmptyText({ children }) {
  return <p className="text-xs leading-5 text-slate-500">{children}</p>;
}
