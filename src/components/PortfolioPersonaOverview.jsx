import { ArrowRight, UserRoundCog } from 'lucide-react';
import { buildPersonaUpdate, getIndustryPersonaSignals } from '../data/personaData';
import { priorityAccounts } from '../data/portfolioData';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function PortfolioPersonaOverview({ onOpenAccount }) {
  const { activePersonaId, personaLibrary, setActivePersona } = useDiscoveryStore();
  const personas = Object.values(personaLibrary);
  const activePersona = personaLibrary[activePersonaId] ?? personas[0];
  const matchingAccounts = priorityAccounts
    .filter((account) =>
      (account.stakeholders ?? []).some((stakeholder) =>
        stakeholder.role.toLowerCase().includes(activePersona.role.toLowerCase()) ||
        activePersona.role.toLowerCase().includes(stakeholder.role.toLowerCase().split(' ')[0] ?? ''),
      ),
    )
    .slice(0, 4);
  const accountForUpdate = matchingAccounts[0] ?? priorityAccounts[0];
  const update = activePersona && accountForUpdate ? buildPersonaUpdate(accountForUpdate, activePersona) : null;
  const industryFocus = [...new Set(priorityAccounts.map((account) => account.industry))]
    .slice(0, 6)
    .map((industry) => ({
      industry,
      signals: getIndustryPersonaSignals(industry, activePersona?.id).slice(0, 3),
      accounts: priorityAccounts.filter((account) => account.industry === industry).slice(0, 2),
    }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
            <UserRoundCog className="mr-2 h-4 w-4" />
            Universal personas
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Start every account with the person, not the product</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This is the all-up persona layer. As stakeholder discovery improves, these personas become sharper across industries and accounts.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {personas.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setActivePersona(persona.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  persona.id === activePersona?.id
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                }`}
              >
                {persona.role}
              </button>
            ))}
          </div>
        </div>

        {activePersona && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{activePersona.title}</p>
            <h3 className="mt-1 text-xl font-bold text-blue-950">{activePersona.role}</h3>
            <p className="mt-2 text-sm leading-6 text-blue-950">{activePersona.messaging}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {activePersona.priorities.slice(0, 3).map((priority) => (
                <div key={priority} className="rounded-lg bg-white p-3">
                  <p className="text-xs font-bold text-blue-700">{priority}</p>
                </div>
              ))}
            </div>
            {update && <p className="mt-4 rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-blue-950">{update.message}</p>}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {matchingAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => onOpenAccount?.(account.id, 'listen')}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span>
              <span className="block text-sm font-bold text-slate-950">{account.name}</span>
              <span className="mt-1 block text-xs text-slate-500">{account.industry}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" />
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry-focused persona plays</p>
            <h3 className="mt-1 font-bold text-slate-950">{activePersona?.role} talk tracks by account type</h3>
          </div>
          <p className="text-xs font-semibold text-slate-500">Use this to choose the right opening before you enter an account.</p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {industryFocus.map((item) => (
            <div key={item.industry} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="font-bold text-slate-950">{item.industry}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(item.signals.length ? item.signals : activePersona?.commonPains?.slice(0, 3) ?? []).map((signal) => (
                  <span key={signal} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                    {signal}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                Ask the {activePersona?.role}: what proof would make this outcome worth prioritizing in the next customer conversation?
              </p>
              <div className="mt-3 space-y-2">
                {item.accounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => onOpenAccount?.(account.id, 'listen')}
                    className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                  >
                    {account.name}
                    <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
