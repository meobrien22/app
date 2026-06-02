import { BadgeDollarSign, BookOpen, CheckCircle2 } from 'lucide-react';
import { priorityAccounts } from '../data/portfolioData';
import { calculateAddOnFit, calculateDiscoveryScore, calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import { buildLicenseSnapshot } from '../utils/licensePlanning';
import ScoreBar from './ScoreBar';

export default function ExampleAccounts({ activeAccount, onSelectAccount }) {
  const topAddOns = calculateAddOnFit(activeAccount).slice(0, 5);
  const discovery = calculateDiscoveryScore(activeAccount);
  const opportunity = calculateOpportunityScore(activeAccount);
  const risk = calculateRiskScore(activeAccount);
  const licenseSnapshot = buildLicenseSnapshot(activeAccount, topAddOns);

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Completed Discovery Journeys</h2>
        <p className="mt-2 text-sm text-slate-500">
          Public-company-inspired training examples with synthetic stakeholders, signals, scores, and next steps.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
            {priorityAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => onSelectAccount(account.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  activeAccount.id === account.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{account.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{account.industry}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                    {account.currentLevel}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
                  <span>{account.licenseContext.currentSku}</span>
                  <span>{account.licenseContext.seatCount.toLocaleString()} licenses</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{account.trigger}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Synthetic completed journey
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{activeAccount.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{activeAccount.publicContext}</p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                {activeAccount.targetMotion}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ScoreBar label="Discovery readiness" value={discovery.total} tone="blue" />
              <ScoreBar label="Opportunity score" value={opportunity.total} tone="emerald" />
              <ScoreBar label="Risk score" value={risk.total} tone="orange" />
            </div>
          </div>

          <ExampleLicenseSnapshot account={activeAccount} licenseSnapshot={licenseSnapshot} />

          <div className="grid gap-6 lg:grid-cols-2">
            <DetailPanel title="Discovery Notes" items={[activeAccount.notes, ...activeAccount.selectedPains]} />
            <DetailPanel title="Open Objections" items={activeAccount.objections} />
            <DetailPanel title="Stakeholder Map" items={activeAccount.stakeholders.map((person) => `${person.name} - ${person.role} - ${person.influence}`)} />
            <DetailPanel title="Next Steps" items={activeAccount.nextSteps} icon={CheckCircle2} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Top Add-On Fit</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {topAddOns.map((addOn) => (
                <ScoreBar key={addOn.name} label={addOn.name} value={addOn.score} tone="emerald" detail={addOn.discoveryQuestion} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExampleLicenseSnapshot({ account, licenseSnapshot }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            Renewal/license example
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{licenseSnapshot.currentSku}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {licenseSnapshot.seatCount.toLocaleString()} licenses, renewal window {account.contractContext?.renewalWindow ?? 'TBD'}. Prices are planning cues for discovery, not customer quotes.
          </p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs font-bold text-blue-800">
          {licenseSnapshot.validationStatus}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {licenseSnapshot.skus.slice(0, 4).map((sku) => (
          <div key={sku.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-950">{sku.name}</p>
              <p className="shrink-0 text-xs font-bold text-slate-700">{sku.priceLabel}</p>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500">{sku.type} - {sku.seats.toLocaleString()} seats</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{sku.discoveryUse}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPanel({ title, items, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center font-bold text-slate-900">
        {Icon && <Icon className="mr-2 h-4 w-4 text-emerald-600" />}
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <p key={item} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
