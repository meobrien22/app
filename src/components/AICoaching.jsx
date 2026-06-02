import { useMemo, useState } from 'react';
import { Bot, MessageSquare, MessageSquareWarning, Send, Sparkles, UserRound } from 'lucide-react';
import { buildStakeholderQuestionSet } from '../data/stakeholderDiscovery';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import {
  getActiveStakeholderContext,
  getLiveCoachResponse,
  getQuestionCoachComment,
  getStakeholderCoachCards,
  stakeholderKey,
} from '../utils/aiCoach';
import { getDiscoveryGaps, getNextBestQuestions } from '../utils/scoring';

export default function AICoaching({ account }) {
  const [coachPrompt, setCoachPrompt] = useState('');
  const [coachResponse, setCoachResponse] = useState('');
  const store = useDiscoveryStore();
  const {
    activeStakeholderKey,
    setActiveStakeholder,
    stakeholderMeetings,
    keywordTally,
    updateStakeholderResponse,
  } = store;
  const { activeStakeholder, activeKey, meeting, profile } = getActiveStakeholderContext(account, store);
  const questions = getNextBestQuestions(account);
  const gaps = getDiscoveryGaps(account);
  const stakeholderQuestions = buildStakeholderQuestionSet(activeStakeholder);
  const coachCards = getStakeholderCoachCards(account, activeStakeholder, meeting, keywordTally);
  const questionComments = stakeholderQuestions.slice(0, 5).map((question) => ({
    question,
    response: meeting?.responses?.[question.id] ?? {},
    coach: getQuestionCoachComment({
      account,
      stakeholder: activeStakeholder,
      question,
      response: meeting?.responses?.[question.id] ?? {},
    }),
  }));

  const quickPrompts = useMemo(() => [
    'What should I ask next?',
    'Turn this into an executive recap',
    'Help me handle an objection',
    'How should I use the latest trigger?',
  ], []);

  const askCoach = (prompt = coachPrompt) => {
    const nextResponse = getLiveCoachResponse({
      prompt,
      account,
      stakeholder: activeStakeholder,
      meeting,
      keywordTally,
    });
    setCoachPrompt(prompt);
    setCoachResponse(nextResponse);
  };

  const addCoachCommentToQuestion = (question, comment) => {
    const current = meeting?.responses?.[question.id] ?? {};
    const note = `AI coach comment: ${comment}`;
    updateStakeholderResponse(activeKey, question.id, {
      answer: current.answer ? `${current.answer}\n${note}` : note,
    });
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">AI coaching assistant</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{account.name} coaching room</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Personalized coaching based on the active account, selected stakeholder, discovery responses, keywords, risks, and next-best questions.
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Currently coaching</p>
            <p className="mt-1 font-bold text-blue-950">{activeStakeholder?.name ?? 'No stakeholder selected'}</p>
            <p className="mt-1 text-xs text-blue-700">{activeStakeholder?.role ?? 'Select a stakeholder'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-950">
              <UserRound className="mr-2 h-4 w-4 text-blue-600" />
              Stakeholder in the moment
            </h3>
            <div className="space-y-3">
              {account.stakeholders.map((stakeholder) => {
                const key = stakeholderKey(stakeholder);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveStakeholder(key)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      key === activeStakeholderKey ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-200'
                    }`}
                  >
                    <p className="font-bold text-slate-950">{stakeholder.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{stakeholder.role} - {stakeholder.influence}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 flex items-center font-bold text-blue-950">
              <Bot className="mr-2 h-4 w-4" />
              Persona coach
            </h3>
            <p className="text-sm leading-6 text-blue-950">{profile.focus}</p>
            <div className="mt-4 space-y-3">
              {coachCards.map((card) => (
                <div key={card.title} className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />
              Ask the coach during the call
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askCoach(prompt)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <textarea
                value={coachPrompt}
                onChange={(event) => setCoachPrompt(event.target.value)}
                className="min-h-24 resize-none rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type what the stakeholder just said, an objection, or ask what to do next..."
              />
              <button
                type="button"
                onClick={() => askCoach()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                Coach me
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Coach response</p>
              <p className="mt-2 text-sm leading-6 text-blue-950">
                {coachResponse || getLiveCoachResponse({ prompt: '', account, stakeholder: activeStakeholder, meeting, keywordTally })}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-950">
              <Sparkles className="mr-2 h-4 w-4 text-emerald-600" />
              AI comments on stakeholder questions
            </h3>
            <div className="space-y-3">
              {questionComments.map(({ question, coach }) => (
                <div key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{question.name}</p>
                  <p className="mt-1 font-bold text-slate-950">{question.question}</p>
                  <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-slate-700">{coach.comment}</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                    <p className="text-xs font-semibold text-slate-500">{coach.suggestedFollowUp}</p>
                    <button
                      type="button"
                      onClick={() => addCoachCommentToQuestion(question, coach.comment)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Add comment to question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <CoachPanel title="Ask Next" icon={Bot} tone="blue" items={questions} />
            <CoachPanel title="Handle Carefully" icon={MessageSquareWarning} tone="orange" items={[...account.objections, ...gaps].slice(0, 5)} />
          </section>
        </div>
      </div>
    </section>
  );
}

function CoachPanel({ title, icon: Icon, tone, items }) {
  const toneClass = tone === 'orange'
    ? 'border-orange-100 bg-orange-50 text-orange-950'
    : 'border-blue-100 bg-blue-50 text-blue-950';

  return (
    <div className={`rounded-xl border p-6 ${toneClass}`}>
      <h3 className="mb-4 flex items-center font-bold">
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <p key={item} className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

