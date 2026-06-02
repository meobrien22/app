import { GitBranch, HelpCircle, MessageSquareText } from 'lucide-react';
import { generateExecutiveSummaryLine, getNextBestQuestions } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import KeywordTally from './KeywordTally';

const decisionNodes = [
  {
    id: 'painConfirmed',
    label: 'Business pain confirmed?',
    yesAction: 'Tie every recommendation to the named pain.',
    noAction: 'Ask for a concrete workflow example before mapping Microsoft fit.',
    keywords: ['business pain', 'workflow friction', 'priority'],
  },
  {
    id: 'economicBuyerKnown',
    label: 'Economic buyer known?',
    yesAction: 'Ask what decision criteria this person will use.',
    noAction: 'Find the owner of the business outcome.',
    keywords: ['economic buyer', 'decision criteria', 'executive sponsor'],
  },
  {
    id: 'technicalOwnerKnown',
    label: 'Technical owner known?',
    yesAction: 'Confirm architecture, governance, and adoption constraints.',
    noAction: 'Identify who owns feasibility, governance, and rollout risk.',
    keywords: ['technical owner', 'governance', 'adoption'],
  },
  {
    id: 'renewalTimingClear',
    label: 'Renewal timing clear?',
    yesAction: 'Anchor urgency to timeline and process.',
    noAction: 'Ask when the current agreement or tool review creates a decision window.',
    keywords: ['renewal timing', 'decision window', 'process clarity'],
  },
  {
    id: 'nextStepDefined',
    label: 'Next step defined?',
    yesAction: 'Confirm owner, agenda, and success criteria for the next meeting.',
    noAction: 'Book the next meeting around one specific discovery gap.',
    keywords: ['next step', 'meeting agenda', 'success criteria'],
  },
];

export default function DiscoveryTree({ account }) {
  const { discoveryAnswers, setDiscoveryAnswer, keywordTally, dynamicTeamMembers } = useDiscoveryStore();
  const questions = getNextBestQuestions(account);
  const summaryLine = generateExecutiveSummaryLine(account, keywordTally, dynamicTeamMembers);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Live Keyword Decision Tree</h2>
        <p className="mt-2 text-sm text-slate-500">Use yes/no checkpoints to guide the next discovery move and keep keywords counted live.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center font-bold text-slate-900">
              <GitBranch className="mr-2 h-4 w-4 text-blue-600" />
              Decision Path
            </h3>
            <div className="space-y-4">
              {decisionNodes.map((node) => {
                const answer = discoveryAnswers[node.id] ?? 'Unknown';
                const action = answer === 'No' ? node.noAction : node.yesAction;

                return (
                  <div key={node.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="font-semibold text-slate-900">{node.label}</p>
                      <div className="flex rounded-md border border-slate-200 bg-white p-1">
                        {['Yes', 'No'].map((option) => (
                          <button
                            key={option}
                            onClick={() => setDiscoveryAnswer(node.id, option, node.keywords)}
                            className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                              answer === option
                                ? option === 'Yes'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-orange-100 text-orange-700'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{action}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {node.keywords.map((keyword) => (
                        <span key={keyword} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 flex items-center font-bold text-blue-950">
              <MessageSquareText className="mr-2 h-4 w-4" />
              If the Conversation Ended Now
            </h3>
            <p className="text-sm leading-7 text-blue-950">{summaryLine}</p>
          </div>
        </div>

        <div className="space-y-6">
          <KeywordTally account={account} />

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 flex items-center font-bold text-blue-950">
              <HelpCircle className="mr-2 h-4 w-4" />
              Next Discovery Questions
            </h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <p key={question} className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700">
                  {question}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
