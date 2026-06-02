import { ArrowRight, BriefcaseBusiness, CalendarClock, Target } from 'lucide-react';
import { priorityAccounts, verticalTrends } from '../data/portfolioData';
import { calculateDiscoveryScore, calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import ScoreBar from './ScoreBar';

export default function AccountsDashboard({ onOpenAccount }) {
  const actNow = priorityAccounts.filter((account) => account.portfolioCategory === 'Act now').length;
  const renewalWatch = priorityAccounts.filter((account) => /1 quarter|2 quarters|6 months/i.test(account.contractContext?.renewalWindow ?? '')).length;
  const strongOpportunity = priorityAccounts.filter((account) => calculateOpportunityScore(account).total >= 85).length;
  const riskWatch = priorityAccounts.filter((account) => calculateRiskScore(account).total >= 30).length;

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Accounts dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Prioritized customer portfolio</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Use this page as the clean list of accounts. Opening one creates a workspace tab and adds it to the side rail.
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{priorityAccounts.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Portfolio accounts</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <AccountSignal icon={Target} label="Act now" value={actNow} detail="This week" />
          <AccountSignal icon={CalendarClock} label="Renewal watch" value={renewalWatch} detail="Near-term path" tone="orange" />
          <AccountSignal icon={BriefcaseBusiness} label="Strong plays" value={strongOpportunity} detail="High opportunity" tone="emerald" />
          <AccountSignal icon={Target} label="Risk cleanup" value={riskWatch} detail="Needs inspection" tone="slate" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.7fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold text-slate-950">Top 50 account priority stack</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[0.3fr_1.2fr_0.75fr_0.7fr_0.7fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Rank</span>
              <span>Account</span>
              <span>Priority</span>
              <span>Renewal</span>
              <span>Score</span>
              <span>Open</span>
            </div>
            <div className="max-h-[680px] overflow-y-auto">
              {priorityAccounts.map((account, index) => {
                const opportunity = calculateOpportunityScore(account).total;
                const risk = calculateRiskScore(account).total;

                return (
                  <div
                    key={account.id}
                    className="grid grid-cols-[0.3fr_1.2fr_0.75fr_0.7fr_0.7fr_auto] items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                  >
                    <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                    <div>
                      <p className="font-bold text-slate-950">{account.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{account.industry}</p>
                    </div>
                    <span className="w-fit rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                      {account.portfolioCategory ?? 'Nurture'}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{account.contractContext?.renewalWindow ?? 'TBD'}</span>
                    <div>
                      <ScoreBar label="Opportunity" value={opportunity} tone={risk >= 30 ? 'orange' : 'emerald'} />
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenAccount(account.id)}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-950">Vertical focus</h3>
            <div className="space-y-3">
              {verticalTrends.map((trend) => (
                <div key={trend.vertical} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{trend.vertical}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{trend.trend}</p>
                  <p className="mt-2 text-xs font-bold text-blue-700">{trend.motion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6">
            <h3 className="font-bold text-emerald-950">AE operating rule</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              Work the highest score accounts first, but inspect renewal timing, executive coverage, and partner attach before deciding the next action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountSignal({ icon: Icon, label, value, detail, tone = 'blue' }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>
    </div>
  );
}

