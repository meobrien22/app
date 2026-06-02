import { ArrowRight, BriefcaseBusiness, CheckCircle2, Target, UsersRound } from 'lucide-react';
import { internalStakeholderRoster, vTeamProductRoster } from '../data/mcemData';
import { priorityAccounts } from '../data/portfolioData';
import { calculateOpportunityScore } from '../utils/scoring';

export default function VTeamDashboard({ onOpenAccount }) {
  const demoReadyAccounts = priorityAccounts.filter((account) => calculateOpportunityScore(account).total >= 82).slice(0, 6);
  const partnerNeeds = priorityAccounts.filter((account) => (account.vTeam ?? []).some((role) => role.toLowerCase().includes('partner'))).slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">V-Team dashboard</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">Microsoft team plan for AE execution</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Know who to pull in, what they represent, which customer meetings they support, and what deliverables they own.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <VTeamMetric label="Specialist roles" value={vTeamProductRoster.length} detail="Ready to attach" />
          <VTeamMetric label="Internal stakeholders" value={internalStakeholderRoster.length} detail="Operating cadence" />
          <VTeamMetric label="Demo-ready accounts" value={demoReadyAccounts.length} detail="Strong signal" tone="emerald" />
          <VTeamMetric label="Partner needs" value={partnerNeeds.length} detail="Delivery capacity" tone="orange" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center font-bold text-slate-950">
            <UsersRound className="mr-2 h-4 w-4 text-blue-600" />
            Product specialists and deliverables
          </h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {vTeamProductRoster.map((member) => (
              <div key={member.role} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <p className="font-bold text-slate-950">{member.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.products.map((product) => (
                        <span key={product} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {member.canDo.map((item) => (
                    <p key={item} className="flex gap-2 text-xs font-semibold leading-5 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {item}
                    </p>
                  ))}
                </div>
                <p className="mt-4 rounded-md bg-white p-3 text-xs font-semibold leading-5 text-slate-600">{member.customerMeeting}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-950">Internal inspection rhythm</h3>
            <div className="mt-4 space-y-3">
              {internalStakeholderRoster.map((stakeholder) => (
                <div key={stakeholder.role} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{stakeholder.role}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{stakeholder.cadence}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {stakeholder.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stakeholder.dashboardSignal}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="font-bold text-blue-950">Accounts needing V-Team action</h3>
            <div className="mt-4 space-y-3">
              {demoReadyAccounts.slice(0, 5).map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onOpenAccount(account.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg bg-white p-3 text-left hover:bg-blue-50"
                >
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{account.name}</span>
                    <span className="mt-1 block text-xs text-slate-500">{account.targetMotion}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function VTeamMetric({ label, value, detail, tone = 'blue' }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <Target className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>
    </div>
  );
}

