import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquareText, Sparkles, UserRoundCog, Users } from 'lucide-react';
import { personaIdFromRole } from '../data/personaData';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import {
  calculateStakeholderDiscoveryProgress,
  getKeywordSolutionMap,
  getNextBestQuestions,
  getStakeholderTranslation,
} from '../utils/scoring';
import PersonaDiscoveryPopout from './PersonaDiscoveryPopout';

export default function AccountListenConsult({ account, onNavigate }) {
  const {
    activeStakeholderKey,
    dynamicTeamMembers,
    keywordTally,
    setActiveStakeholder,
    improvePersonaFromStakeholder,
    stakeholderMeetings,
  } = useDiscoveryStore();
  const firstStakeholder = account.stakeholders?.[0];
  const [selectedKey, setSelectedKey] = useState(activeStakeholderKey || stakeholderKey(firstStakeholder));
  const [personaDiscoveryStakeholder, setPersonaDiscoveryStakeholder] = useState(null);
  const selectedStakeholder = useMemo(
    () => account.stakeholders?.find((stakeholder) => stakeholderKey(stakeholder) === selectedKey) ?? firstStakeholder,
    [account.stakeholders, firstStakeholder, selectedKey],
  );
  const selectedMeeting = stakeholderMeetings?.[stakeholderKey(selectedStakeholder)] ?? {};
  const selectedTranslation = getStakeholderTranslation(selectedMeeting);
  const progress = calculateStakeholderDiscoveryProgress(stakeholderMeetings);
  const questions = getNextBestQuestions(account).slice(0, 3);
  const solutionMap = getKeywordSolutionMap(account, stakeholderMeetings, keywordTally).slice(0, 3);
  const topTeam = (dynamicTeamMembers ?? account.vTeam ?? []).slice(0, 4);

  const selectStakeholder = (stakeholder, openDiscovery = false) => {
    const key = stakeholderKey(stakeholder);
    setSelectedKey(key);
    setActiveStakeholder(key);
    improvePersonaFromStakeholder(stakeholder, account);
    if (openDiscovery) setPersonaDiscoveryStakeholder(stakeholder);
  };

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">MCEM Stage 1</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Listen & Consult</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Pick the stakeholder in the meeting. Their card becomes the discovery workspace, and the popout handles the deeper branching questions.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[420px]">
            <StageStat label="Stakeholders" value={account.stakeholders?.length ?? 0} />
            <StageStat label="Captured" value={`${progress.answeredQuestions}/${progress.totalQuestions}`} />
            <StageStat label="Keywords" value={Object.keys(keywordTally ?? {}).length} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center font-bold text-slate-950">
              <Users className="mr-2 h-4 w-4 text-blue-600" />
              Stakeholder cards
            </h3>
            <button
              type="button"
              onClick={() => selectedStakeholder && selectStakeholder(selectedStakeholder, true)}
              disabled={!selectedStakeholder}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Open selected discovery
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {(account.stakeholders ?? []).map((stakeholder) => {
              const key = stakeholderKey(stakeholder);
              const meeting = stakeholderMeetings?.[key] ?? {};
              const translation = getStakeholderTranslation(meeting);
              const isSelected = key === stakeholderKey(selectedStakeholder);
              const personKeywords = [...translation.keywords, ...translation.needs, ...translation.wants].slice(0, 4);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectStakeholder(stakeholder)}
                  className={`rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{stakeholder.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{stakeholder.role} - {stakeholder.influence}</p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-600">
                      {stakeholder.sentiment}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {getStakeholderPrompt(stakeholder, personKeywords, account)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(personKeywords.length ? personKeywords : [personaLabel(stakeholder.role), account.selectedPains?.[0] ?? 'discovery']).map((item) => (
                      <span key={item} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-blue-700">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-xs font-bold text-slate-500">Click to review</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectStakeholder(stakeholder, true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.stopPropagation();
                          selectStakeholder(stakeholder, true);
                        }
                      }}
                      className="rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                    >
                      Start discovery
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-700">
              <UserRoundCog className="mr-2 h-4 w-4" />
              Selected stakeholder
            </p>
            {selectedStakeholder ? (
              <>
                <h3 className="mt-2 text-2xl font-bold text-blue-950">{selectedStakeholder.name}</h3>
                <p className="mt-1 text-sm font-semibold text-blue-800">{selectedStakeholder.role}</p>
                <p className="mt-4 text-sm leading-6 text-blue-950">
                  Listen for what this person needs to believe before the account can move forward. Keep the live discussion centered on their role, not the product.
                </p>
                <div className="mt-4 grid gap-2">
                  {questions.map((question) => (
                    <div key={question} className="rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-blue-950">
                      {question}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => selectStakeholder(selectedStakeholder, true)}
                  className="mt-4 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Open discovery popout
                </button>
              </>
            ) : (
              <p className="mt-3 text-sm text-blue-950">Select a stakeholder card to start discovery.</p>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
              What updates from this conversation
            </h3>
            <div className="mt-4 space-y-3">
              <UpdateLine title="Executive summary" body={buildSummaryLine(selectedStakeholder, selectedTranslation)} />
              <UpdateLine title="V-Team" body={topTeam.length ? topTeam.join(', ') : 'AE, Modern Work SSP, Technical Specialist, Partner Lead'} />
              <UpdateLine title="Solution signals" body={solutionMap.length ? solutionMap.map((item) => item.keyword).join(', ') : 'Awaiting stakeholder keywords'} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <MessageSquareText className="mr-2 h-4 w-4 text-blue-600" />
              Simple next step
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
              Open the card, ask the guided question, capture their language, then move to the next stakeholder when the answer is good enough.
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.('summary')}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
            >
              Review executive summary
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </section>
        </aside>
      </div>

      {personaDiscoveryStakeholder && (
        <PersonaDiscoveryPopout
          account={account}
          stakeholder={personaDiscoveryStakeholder}
          onClose={() => setPersonaDiscoveryStakeholder(null)}
        />
      )}
    </section>
  );
}

function StageStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase text-slate-500">{label}</p>
    </div>
  );
}

function UpdateLine({ title, body }) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <div>
        <p className="text-xs font-bold uppercase text-slate-500">{title}</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{body}</p>
      </div>
    </div>
  );
}

function getStakeholderPrompt(stakeholder, keywords, account) {
  if (keywords.length) {
    return `Focus on ${keywords[0].toLowerCase()} and ask what proof ${stakeholder.role} needs before supporting the next step.`;
  }
  return `Start with ${personaLabel(stakeholder.role).toLowerCase()} and connect the discussion to ${account.selectedPains?.[0]?.toLowerCase() ?? 'the business priority'}.`;
}

function buildSummaryLine(stakeholder, translation) {
  if (!stakeholder) return 'Select a stakeholder to start building the summary.';
  const signal = translation.keywords?.[0] || translation.needs?.[0] || translation.wants?.[0];
  if (signal) return `${stakeholder.name} is shaping the story around ${signal}.`;
  return `${stakeholder.name} discovery is ready to capture exact customer language.`;
}

function stakeholderKey(stakeholder) {
  return `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function personaLabel(role) {
  const personaId = personaIdFromRole(role);
  const labels = {
    ceo: 'CEO strategic outcome',
    cfo: 'CFO business case',
    cio: 'CIO technical confidence',
    caio: 'CAIO governed AI strategy',
    coo: 'COO operating outcome',
    ciso: 'CISO risk reduction',
    chro: 'CHRO adoption',
    cpo: 'CPO product execution',
    cmo: 'CMO customer insight',
  };
  return labels[personaId] ?? 'stakeholder discovery';
}
