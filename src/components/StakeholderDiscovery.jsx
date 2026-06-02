import { Brain, CheckCircle2, CircleDashed, UserRound } from 'lucide-react';
import { useState } from 'react';
import { buildStakeholderQuestionSet, getNeedWantLibrary, getRoleProfile, responseModes } from '../data/stakeholderDiscovery';
import { getKeywordSolutionMap, getStakeholderTranslation } from '../utils/scoring';
import { getQuestionCoachComment } from '../utils/aiCoach';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { saveDiscoverySession } from '../utils/persistence';
import KeywordTally from './KeywordTally';
import RunningPlan from './RunningPlan';

const stakeholderKey = (stakeholder) => `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function StakeholderDiscovery({ account }) {
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const {
    activeStakeholderKey,
    setActiveStakeholder,
    stakeholderMeetings,
    updateStakeholderResponse,
    addBranchQuestionFromTerm,
    keywordTally,
  } = useDiscoveryStore();
  const store = useDiscoveryStore();

  const activeStakeholder = account.stakeholders.find((stakeholder) => stakeholderKey(stakeholder) === activeStakeholderKey)
    ?? account.stakeholders[0];
  const activeKey = stakeholderKey(activeStakeholder);
  const meeting = stakeholderMeetings[activeKey];
  const profile = getRoleProfile(activeStakeholder?.role);
  const questions = buildStakeholderQuestionSet(activeStakeholder);
  const customQuestions = meeting?.customQuestions ?? [];
  const allQuestions = [...questions, ...customQuestions];
  const rootQuestions = allQuestions.filter((question) => !question.parentId);
  const childMap = allQuestions.reduce((map, question) => {
    if (!question.parentId) return map;
    map[question.parentId] = [...(map[question.parentId] ?? []), question];
    return map;
  }, {});
  const needWantLibrary = getNeedWantLibrary(account.industry, account.segment);
  const translation = getStakeholderTranslation(meeting);
  const solutionMap = getKeywordSolutionMap(account, stakeholderMeetings, keywordTally).slice(0, 6);

  const handleSaveSession = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('');
      const { sessionId } = await saveDiscoverySession(account, store);
      setSaveStatus(`Discovery session saved to Supabase. Session ID: ${sessionId}`);
    } catch (error) {
      setSaveStatus(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h2 className="text-2xl font-bold">Stakeholder Discovery Meetings</h2>
        <div className="md:max-w-xl">
          <p className="mt-2 text-sm text-slate-500">
            Each question can branch up to five levels using keywords, needs, and wants selected in the meeting.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveSession}
              disabled={isSaving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSaving ? 'Saving...' : 'Save Discovery Session'}
            </button>
            {saveStatus && <p className="text-xs text-slate-600">{saveStatus}</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-900">
              <UserRound className="mr-2 h-4 w-4 text-blue-600" />
              Stakeholders
            </h3>
            <div className="space-y-3">
              {account.stakeholders.map((stakeholder) => {
                const key = stakeholderKey(stakeholder);
                const stakeholderMeeting = stakeholderMeetings[key];
                const responses = Object.values(stakeholderMeeting?.responses ?? {});
                const answered = responses.filter((response) => response.yesNo !== 'Unknown' || response.answer || response.need || response.want).length;

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setActiveStakeholder(key)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      key === activeKey ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-bold text-slate-950">{stakeholder.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{stakeholder.role}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                      {answered === responses.length ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleDashed className="h-4 w-4 text-orange-500" />}
                      {answered}/{responses.length || 7} levels captured
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <KeywordTally account={account} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{profile.label} profile</p>
            <h3 className="mt-2 text-xl font-bold text-blue-950">{activeStakeholder.name}</h3>
            <p className="mt-2 text-sm leading-6 text-blue-900">{profile.focus}</p>
          </div>

          <div className="space-y-4">
            {rootQuestions.map((question) => (
              <QuestionNode
                key={question.id}
                question={question}
                level={0}
                childMap={childMap}
                meeting={meeting}
                activeKey={activeKey}
                account={account}
                activeStakeholder={activeStakeholder}
                updateStakeholderResponse={updateStakeholderResponse}
                addBranchQuestionFromTerm={addBranchQuestionFromTerm}
                needWantLibrary={needWantLibrary}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-900">
              <Brain className="mr-2 h-4 w-4 text-emerald-600" />
              Needs/Wants Translation
            </h3>
            <TranslationBlock title="Needs" items={translation.needs} />
            <TranslationBlock title="Wants" items={translation.wants} />
            <TranslationBlock title="Keywords" items={translation.keywords} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Keyword to Solution Map</h3>
            <div className="space-y-3">
              {solutionMap.map((item) => (
                <div key={item.keyword} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-900">{item.keyword}</p>
                  <p className="mt-1 text-xs text-slate-500">Used {item.count || 1} time(s)</p>
                  <p className="mt-2 text-sm text-emerald-700">{item.solutions.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <RunningPlan account={account} />
        </div>
      </div>
    </section>
  );
}

function QuestionNode({
  question,
  level,
  childMap,
  meeting,
  activeKey,
  account,
  activeStakeholder,
  updateStakeholderResponse,
  addBranchQuestionFromTerm,
  needWantLibrary,
}) {
  const response = meeting?.responses?.[question.id] ?? {};
  const children = childMap[question.id] ?? [];
  const coach = getQuestionCoachComment({ account, stakeholder: activeStakeholder, question, response });

  const addCoachComment = () => {
    const note = `AI coach comment: ${coach.comment}`;
    updateStakeholderResponse(activeKey, question.id, {
      answer: response.answer ? `${response.answer}\n${note}` : note,
    });
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${level > 0 ? 'ml-4 md:ml-8' : ''}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{question.name}</p>
          <h4 className="mt-2 font-bold text-slate-950">{question.question}</h4>
          <p className="mt-1 text-sm text-slate-500">{question.intent}</p>
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

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">AI coach comment</p>
            <p className="mt-2 text-sm leading-6 text-blue-950">{coach.comment}</p>
            <p className="mt-2 text-xs font-semibold text-blue-700">{coach.suggestedFollowUp}</p>
          </div>
          <button
            type="button"
            onClick={addCoachComment}
            className="shrink-0 rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            Add comment
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <textarea
          value={response.need ?? ''}
          onChange={(event) => updateStakeholderResponse(activeKey, question.id, { need: event.target.value })}
          className="min-h-24 resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
          placeholder="What they need"
        />
        <textarea
          value={response.want ?? ''}
          onChange={(event) => updateStakeholderResponse(activeKey, question.id, { want: event.target.value })}
          className="min-h-24 resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
          placeholder="What they want"
        />
      </div>

      <textarea
        value={response.answer ?? ''}
        onChange={(event) => updateStakeholderResponse(activeKey, question.id, { answer: event.target.value })}
        className="mt-3 min-h-20 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
        placeholder={
          response.yesNo === 'Yes and'
            ? 'Yes and... capture the added condition or expansion'
            : response.yesNo === 'No and'
              ? 'No and... capture the blocker and what must change'
              : 'Meeting notes and exact stakeholder language'
        }
      />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Select Generic Needs</p>
          <div className="flex flex-wrap gap-2">
            {needWantLibrary.needs.map((needOption) => (
              <button
                type="button"
                key={needOption}
                onClick={() => {
                  updateStakeholderResponse(activeKey, question.id, { need: response.need ? `${response.need}; ${needOption}` : needOption });
                  addBranchQuestionFromTerm(activeKey, question.id, needOption, 'need');
                }}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                {needOption}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Select Generic Wants</p>
          <div className="flex flex-wrap gap-2">
            {needWantLibrary.wants.map((wantOption) => (
              <button
                type="button"
                key={wantOption}
                onClick={() => {
                  updateStakeholderResponse(activeKey, question.id, { want: response.want ? `${response.want}; ${wantOption}` : wantOption });
                  addBranchQuestionFromTerm(activeKey, question.id, wantOption, 'want');
                }}
                className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                {wantOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {question.keywords.map((keyword) => (
          <button
            type="button"
            key={keyword}
            onClick={() => {
              updateStakeholderResponse(activeKey, question.id, {}, [keyword]);
              addBranchQuestionFromTerm(activeKey, question.id, keyword, 'keyword');
            }}
            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            {keyword}
          </button>
        ))}
      </div>

      {children.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-blue-100 pl-3">
          {children.map((child) => (
            <QuestionNode
              key={child.id}
              question={child}
              level={level + 1}
              childMap={childMap}
              meeting={meeting}
              activeKey={activeKey}
              account={account}
              activeStakeholder={activeStakeholder}
              updateStakeholderResponse={updateStakeholderResponse}
              addBranchQuestionFromTerm={addBranchQuestionFromTerm}
              needWantLibrary={needWantLibrary}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TranslationBlock({ title, items }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="space-y-2">
        {items.length ? (
          items.map((item) => (
            <p key={item} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {item}
            </p>
          ))
        ) : (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">Capture this during the meeting.</p>
        )}
      </div>
    </div>
  );
}
