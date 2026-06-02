import { CheckCircle2, ClipboardList, UsersRound } from 'lucide-react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { calculateStakeholderDiscoveryProgress, getKeywordSolutionMap } from '../utils/scoring';
import RunningPlan from './RunningPlan';

export default function DiscoveryWorkshop({ account }) {
  const { workshopPlan, updateWorkshopItem, stakeholderMeetings, keywordTally } = useDiscoveryStore();
  const progress = calculateStakeholderDiscoveryProgress(stakeholderMeetings);
  const solutionMap = getKeywordSolutionMap(account, stakeholderMeetings, keywordTally).slice(0, 8);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Discovery Workshop</h2>
        <p className="mt-2 text-sm text-slate-500">
          Facilitate the end-to-end workshop that turns stakeholder answers into a mutual action plan.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-4 flex items-center font-bold text-blue-950">
              <UsersRound className="mr-2 h-4 w-4" />
              Workshop Readiness
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <ReadinessMetric label="Stakeholder meetings" value={`${progress.completedMeetings}/${progress.totalMeetings}`} />
              <ReadinessMetric label="Questions captured" value={`${progress.answeredQuestions}/${progress.totalQuestions}`} />
              <ReadinessMetric label="Completion" value={`${progress.completionPct}%`} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-900">
              <ClipboardList className="mr-2 h-4 w-4 text-blue-600" />
              Workshop Agenda and Outputs
            </h3>
            <div className="space-y-4">
              {workshopPlan.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <input
                        value={item.title}
                        onChange={(event) => updateWorkshopItem(item.id, { title: event.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2 font-bold text-slate-950 outline-none transition focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={item.output}
                        onChange={(event) => updateWorkshopItem(item.id, { output: event.target.value })}
                        className="mt-3 min-h-20 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-700 outline-none transition focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        value={item.owner}
                        onChange={(event) => updateWorkshopItem(item.id, { owner: event.target.value })}
                        className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                        placeholder="Owner"
                      />
                    </div>
                    <button
                      onClick={() => updateWorkshopItem(item.id, { status: item.status === 'Done' ? 'Planned' : 'Done' })}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${
                        item.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {item.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Keyword to Solution Workshop Board</h3>
            <div className="space-y-3">
              {solutionMap.map((item) => (
                <div key={item.keyword} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-bold text-slate-900">{item.keyword}</p>
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

function ReadinessMetric({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-4">
      <p className="text-2xl font-bold text-blue-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-600">{label}</p>
    </div>
  );
}
