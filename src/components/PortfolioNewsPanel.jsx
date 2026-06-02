import { ArrowRight, Newspaper, Sparkles } from 'lucide-react';
import { partnerProfiles, portfolioNewsSignals } from '../data/partnerData';
import { priorityAccounts } from '../data/portfolioData';

export default function PortfolioNewsPanel({ onOpenAccount, compact = false }) {
  const featuredSignals = compact ? portfolioNewsSignals.slice(0, 3) : portfolioNewsSignals;
  const watchedPartners = partnerProfiles.filter((partner) => partner.status !== 'Active').slice(0, 3);

  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${compact ? '' : 'mx-auto max-w-7xl'}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Account and partner intelligence</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">News signals that should change the next AE action</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            A portfolio-level feed across customer triggers, assigned partners, and future partner opportunities.
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-bold text-blue-700">
          {portfolioNewsSignals.length} priority signals
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-3">
          {featuredSignals.map((signal) => {
            const account = priorityAccounts.find((item) => item.name === signal.account);

            return (
              <article key={signal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
                    <Newspaper className="mr-1 h-3 w-3" />
                    {signal.type}
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-600">
                    Partner: {signal.partner}
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-slate-950">{signal.headline}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{signal.impact}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-bold text-slate-500">{signal.action}</p>
                  {account && (
                    <button
                      type="button"
                      onClick={() => onOpenAccount?.(account.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Open {signal.account}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="flex items-center font-bold text-emerald-950">
              <Sparkles className="mr-2 h-4 w-4" />
              Future partner watch
            </h3>
            <div className="mt-4 space-y-3">
              {watchedPartners.map((partner) => (
                <div key={partner.id} className="rounded-md bg-white/80 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{partner.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{partner.type}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {partner.fit}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-700">{partner.nextMove}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-bold text-slate-950">Partnered account coverage</h3>
            <div className="mt-4 space-y-2">
              {partnerProfiles.slice(0, 4).map((partner) => (
                <div key={partner.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-950">{partner.name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{partner.accounts.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

