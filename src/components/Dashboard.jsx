import { useState } from 'react';
import { BadgeDollarSign, BookOpenText, ClipboardCheck, Home, KeyRound, Landmark, RadioTower, ShieldAlert, Sparkles, Target, Users, X } from 'lucide-react';
import { calculateExecutiveCoverage } from '../data/mcemData';
import { priorityAccounts } from '../data/portfolioData';
import { buildPersonaUpdate, personaIdFromRole } from '../data/personaData';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import {
  calculateAddOnFit,
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
  getDiscoveryGaps,
  getNextBestQuestions,
} from '../utils/scoring';
import { buildTriggerArticles, getTriggerTypes } from '../utils/triggerSignals';
import { scoreBuyingCommittee } from '../utils/buyingCommittee';
import { buildLicenseSnapshot, buildRenewalPlan } from '../utils/licensePlanning';
import MainPortfolioOverview from './MainPortfolioOverview';
import PersonaBuilder from './PersonaBuilder';
import ScoreBar from './ScoreBar';

export default function Dashboard({ account, onNavigate, onSelectAccount, mode = 'account' }) {
  const [scoreDetail, setScoreDetail] = useState(null);
  const [triggerDetailOpen, setTriggerDetailOpen] = useState(false);
  const {
    addStakeholder,
    updateStakeholder,
    setActiveStakeholder,
    improvePersonaFromStakeholder,
    moneyDecisionMakerKey,
    personaLibrary,
    setMoneyDecisionMaker,
  } = useDiscoveryStore();
  const discovery = calculateDiscoveryScore(account);
  const opportunity = calculateOpportunityScore(account);
  const risk = calculateRiskScore(account);
  const executiveCoverage = calculateExecutiveCoverage(account);
  const topAddOns = calculateAddOnFit(account).slice(0, 4);
  const triggerArticles = buildTriggerArticles(account);
  const triggerTypes = getTriggerTypes(account);
  const gaps = getDiscoveryGaps(account);
  const questions = getNextBestQuestions(account);
  const buyingCommittee = scoreBuyingCommittee(account, moneyDecisionMakerKey);
  const licenseSnapshot = buildLicenseSnapshot(account, topAddOns);
  const renewalPlan = buildRenewalPlan(account, topAddOns);
  const companyBrief = buildCompanyBrief(account, renewalPlan, topAddOns);
  const completed = priorityAccounts.length;
  const strongAccounts = priorityAccounts.filter((item) => calculateOpportunityScore(item).total >= 85).length;
  const isPortfolio = mode === 'portfolio';

  if (isPortfolio) {
    return (
      <section className="mx-auto max-w-7xl space-y-6">
        <MainPortfolioOverview
          onOpenAccount={onSelectAccount}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Discovery operating dashboard</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">{account.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{account.publicContext}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={ClipboardCheck}
              label="Discovery readiness"
              value={discovery.total}
              tone="blue"
              detail={`${discovery.components.filter((item) => item.value >= Math.ceil(item.max * 0.8)).length}/${discovery.components.length} discovery lanes strong`}
              onClick={() => setScoreDetail('discovery')}
            />
            <MetricCard
              icon={Target}
              label="Opportunity score"
              value={opportunity.total}
              tone="emerald"
              detail={`${opportunity.components.filter((item) => item.value >= Math.ceil(item.max * 0.8)).length}/${opportunity.components.length} growth signals strong`}
              onClick={() => setScoreDetail('opportunity')}
            />
            <MetricCard
              icon={ShieldAlert}
              label="Risk score"
              value={risk.total}
              tone="orange"
              detail={risk.total === 0 ? 'No major risks flagged' : `${risk.risks.filter((item) => item.weight > 0).length} active risk factors`}
              onClick={() => setScoreDetail('risk')}
            />
            <MetricCard
              icon={Users}
              label="Stakeholders mapped"
              value={account.stakeholders.length}
              tone="purple"
              detail={`${executiveCoverage.score}% exec coverage, ${executiveCoverage.roles.filter((role) => role.status !== 'Green').length} gaps`}
              onClick={() => setScoreDetail('stakeholders')}
            />
          </div>

          <CompanyBriefCard companyBrief={companyBrief} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h3 className="flex items-center font-bold text-slate-900">
              <RadioTower className="mr-2 h-4 w-4 text-orange-500" />
              Active Trigger
            </h3>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
              {triggerArticles[0].updated}
            </span>
          </div>
          <div className="mt-4">
            <ScoreBar label="Trigger strength" value={account.triggerScore * 10} tone="orange" />
            <p className="mt-4 text-sm leading-6 text-slate-600">{account.trigger}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {triggerTypes.slice(0, 3).map((type) => (
                <span key={type} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                  {type}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTriggerDetailOpen(true)}
              className="mt-4 rounded-md border border-orange-200 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50"
            >
              View trigger details
            </button>
          </div>
        </div>
      </div>

      <RenewalLicenseTile account={account} licenseSnapshot={licenseSnapshot} renewalPlan={renewalPlan} />

      <BuyingCommitteeDashboard
        account={account}
        buyingCommittee={buyingCommittee}
        onSelectMoneyDecisionMaker={setMoneyDecisionMaker}
        onNavigate={onNavigate}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold text-slate-900">Discovery Scorecard</h3>
          <div className="space-y-4">
            {discovery.components.slice(0, 5).map((component) => (
              <ScoreBar key={component.key} label={component.label} value={component.value} max={component.max} tone="blue" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold text-slate-900">Top Add-On Fit</h3>
          <div className="space-y-4">
            {topAddOns.map((addOn) => (
              <ScoreBar key={addOn.name} label={addOn.name} value={addOn.score} tone="emerald" detail={addOn.category} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center font-bold text-slate-900">
            <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
            Next Best Actions
          </h3>
          <div className="space-y-3">
            {questions.map((question) => (
              <div key={question} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {question}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PersonaBuilder account={account} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Discovery Gaps</h3>
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div key={gap} className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm text-orange-950">
                {gap}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Completed Discovery Journeys</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {completed} seeded examples
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {priorityAccounts.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectAccount(item.id);
                  onNavigate('examples');
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">{item.industry}</p>
                <div className="mt-3 rounded-md border border-blue-100 bg-white p-2 text-xs font-semibold text-slate-700">
                  <p>{item.licenseContext.currentSku}</p>
                  <p className="mt-1 text-slate-500">
                    {item.licenseContext.seatCount.toLocaleString()} licenses - {item.licenseContext.priceLabel} - Renewal {item.contractContext?.renewalWindow ?? 'TBD'}
                  </p>
                </div>
                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  Opportunity score {calculateOpportunityScore(item).total}
                </p>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {strongAccounts} examples have strong opportunity scores and complete stakeholder paths.
          </p>
        </div>
      </div>

      {scoreDetail && (
        <ScoreDetailModal
          type={scoreDetail}
          account={account}
          score={scoreDetail === 'discovery' ? discovery : scoreDetail === 'opportunity' ? opportunity : risk}
          executiveCoverage={executiveCoverage}
          gaps={gaps}
          questions={questions}
          topAddOns={topAddOns}
          personaLibrary={personaLibrary}
          onAddStakeholder={addStakeholder}
          onUpdateStakeholder={updateStakeholder}
          onStartStakeholderDiscovery={(stakeholder) => {
            setActiveStakeholder(stakeholderKey(stakeholder));
            improvePersonaFromStakeholder(stakeholder, account);
            setScoreDetail(null);
            onNavigate('stakeholderDiscovery');
          }}
          onClose={() => setScoreDetail(null)}
        />
      )}

      {triggerDetailOpen && (
        <TriggerDetailModal
          account={account}
          articles={triggerArticles}
          triggerTypes={triggerTypes}
          questions={questions}
          onClose={() => setTriggerDetailOpen(false)}
          onOpenNews={() => {
            setTriggerDetailOpen(false);
            onNavigate('news');
          }}
        />
      )}
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, tone, detail, onClick }) {
  const toneClass = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  }[tone];
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-xl border p-4 text-left ${toneClass} ${onClick ? 'transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500' : ''}`}
    >
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      {detail && <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>}
      {onClick && <p className="mt-3 text-xs font-bold text-blue-700">View details</p>}
    </Component>
  );
}

function buildCompanyBrief(account, renewalPlan, topAddOns) {
  const stakeholders = account.stakeholders ?? [];
  const executiveRoles = stakeholders.map((person) => person.role).slice(0, 4).join(', ') || 'Stakeholders not mapped yet';
  const painSummary = (account.selectedPains ?? []).slice(0, 3).join(', ') || 'Pain discovery still needed';
  const toolSummary = (account.contractContext?.currentTools ?? []).slice(0, 3).join(', ') || 'Current tools not confirmed';
  const addOnSummary = topAddOns.map((addOn) => addOn.name).slice(0, 3).join(', ') || 'Add-on fit not scored yet';
  const originalIndustry = account.originalIndustry && account.originalIndustry !== account.industry
    ? `${account.industry} (${account.originalIndustry})`
    : account.industry;

  return [
    {
      label: 'Who they are',
      value: `${account.name} is a ${originalIndustry} account in this SMB/Channels portfolio view.`,
    },
    {
      label: 'Why it matters',
      value: account.publicContext ?? 'Public-company-inspired training account for discovery planning.',
    },
    {
      label: 'Discovery history',
      value: account.notes ?? 'No discovery notes captured yet.',
    },
    {
      label: 'Likely buyer concerns',
      value: painSummary,
    },
    {
      label: 'Current environment',
      value: toolSummary,
    },
    {
      label: 'People to know',
      value: executiveRoles,
    },
    {
      label: 'Renewal context',
      value: `${renewalPlan.when} renewal window, ${renewalPlan.seats.toLocaleString()} seats, ${renewalPlan.who} as current decision owner signal.`,
    },
    {
      label: 'Microsoft angle',
      value: `${account.currentLevel} to ${account.targetMotion}; strongest fit signals: ${addOnSummary}.`,
    },
  ];
}

function CompanyBriefCard({ companyBrief }) {
  return (
    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
      <h3 className="flex items-center font-bold text-blue-950">
        <BookOpenText className="mr-2 h-4 w-4 text-blue-600" />
        Company brief
      </h3>
      <p className="mt-1 text-xs font-semibold text-blue-700">
        Quick context to read before the AE starts discovery.
      </p>
      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-2">
        {companyBrief.map((item) => (
          <div key={item.label} className="rounded-lg bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenewalLicenseTile({ account, licenseSnapshot, renewalPlan }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            Renewal and license snapshot
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{account.name} renewal planning view</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Planning prices show demo list-price cues where a per-user SKU applies. Capacity, usage, and plan-dependent SKUs are
            flagged for validation with licensing before any customer-facing quote.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
          <LicenseMiniStat label="Renewal" value={account.contractContext?.renewalWindow ?? 'TBD'} />
          <LicenseMiniStat label="Current license" value={licenseSnapshot.currentSku} />
          <LicenseMiniStat label="Licenses" value={licenseSnapshot.seatCount.toLocaleString()} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Renewal control plan</p>
            <h4 className="mt-1 text-lg font-bold text-blue-950">Know the renewal before the renewal meeting</h4>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-800">
            {renewalPlan.validationStatus}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <RenewalPlanDetail label="What" value={renewalPlan.what} />
          <RenewalPlanDetail label="When" value={renewalPlan.when} />
          <RenewalPlanDetail label="Who" value={renewalPlan.who} />
          <RenewalPlanDetail label="How" value={renewalPlan.how} />
          <RenewalPlanDetail label="Seats" value={renewalPlan.seats.toLocaleString()} />
          <RenewalPlanDetail label="Price cue" value={renewalPlan.price} />
          <RenewalPlanDetail label="Procurement" value={renewalPlan.procurement} />
          <RenewalPlanDetail label="Business case" value={renewalPlan.businessCase} />
          <RenewalPlanDetail label="Technical owner" value={renewalPlan.technicalOwner} />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-2 pr-3">SKU</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Seats</th>
              <th className="px-3 py-2">Planning price / SKU</th>
              <th className="py-2 pl-3">Discovery use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {licenseSnapshot.skus.map((sku) => (
              <tr key={sku.name}>
                <td className="py-3 pr-3 font-bold text-slate-950">{sku.name}</td>
                <td className="px-3 py-3 text-slate-600">{sku.type}</td>
                <td className="px-3 py-3 font-semibold text-slate-800">{sku.seats.toLocaleString()}</td>
                <td className="px-3 py-3 font-bold text-slate-950">{sku.priceLabel}</td>
                <td className="py-3 pl-3 text-slate-600">{sku.discoveryUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RenewalPlanDetail({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{value}</p>
    </div>
  );
}

function LicenseMiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">{label}</p>
      <p className="mt-1 text-sm font-bold text-blue-950">{value}</p>
    </div>
  );
}

function BuyingCommitteeDashboard({ account, buyingCommittee, onSelectMoneyDecisionMaker, onNavigate }) {
  const moneyMaker = buyingCommittee.moneyDecisionMaker;
  const rankedStakeholders = [...buyingCommittee.scoredStakeholders].sort((a, b) => b.dealImpactScore - a.dealImpactScore);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Buying house and approval map</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">Who can help this deal get approved?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Scores combine role, influence, sentiment, and discovery language to show who can approve the investment, who shapes influence, and which rooms still need coverage.
          </p>
        </div>
        <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4 lg:w-80">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Money decision maker
            <select
              value={moneyMaker?.key ?? ''}
              onChange={(event) => onSelectMoneyDecisionMaker(event.target.value)}
              className="mt-2 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {buyingCommittee.scoredStakeholders.map((person) => (
                <option key={person.key} value={person.key}>
                  {person.stakeholder.name} - {person.stakeholder.role}
                </option>
              ))}
            </select>
          </label>
          {moneyMaker && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <MiniScore label="Money" value={moneyMaker.moneyDecisionScore} />
              <MiniScore label="Influence" value={moneyMaker.influenceScore} />
              <MiniScore label="Impact" value={moneyMaker.dealImpactScore} />
            </div>
          )}
          <p className={`mt-3 rounded-md px-3 py-2 text-xs font-bold ${buyingCommittee.hasClearMoneyWinner ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
            {buyingCommittee.hasClearMoneyWinner
              ? `Clear winner: ${moneyMaker?.stakeholder.name} looks like the approval owner.`
              : 'No clear winner yet: validate decision criteria and approval path.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Home className="h-4 w-4 text-blue-600" />
            <h4 className="font-bold text-slate-950">Rooms of the house</h4>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {buyingCommittee.rooms.map((room) => (
              <div
                key={room.id}
                className={`rounded-lg border p-3 ${
                  room.coverage === 'Mapped'
                    ? 'border-emerald-100 bg-emerald-50'
                    : 'border-orange-100 bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-slate-950">{room.label}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{room.owner}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${room.coverage === 'Mapped' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {room.coverage}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{room.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.occupants.length ? (
                    room.occupants.map((person) => (
                      <button
                        key={person.key}
                        type="button"
                        onClick={() => onSelectMoneyDecisionMaker(person.key)}
                        className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        {person.stakeholder.name} {person.dealImpactScore}
                      </button>
                    ))
                  ) : (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-orange-700">Add stakeholder</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-blue-600" />
            <h4 className="font-bold text-slate-950">Approval impact scores</h4>
          </div>
          <div className="space-y-3">
            {rankedStakeholders.slice(0, 5).map((person) => (
              <div key={person.key} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{person.stakeholder.name}</p>
                    <p className="text-xs text-slate-500">{person.stakeholder.role} - {person.room.label}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">{person.dealImpactScore}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <MiniScore label="Money" value={person.moneyDecisionScore} />
                  <MiniScore label="Influence" value={person.influenceScore} />
                  <MiniScore label="Signals" value={person.discoverySignalScore} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-600">{person.confidence}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('stakeholders')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            <KeyRound className="h-4 w-4" />
            Update stakeholder map
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniScore({ label, value }) {
  return (
    <div className="rounded-md bg-white p-2 text-center">
      <p className="text-base font-bold text-slate-950">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}

function ScoreDetailModal({
  type,
  account,
  score,
  executiveCoverage,
  gaps,
  questions,
  topAddOns,
  personaLibrary,
  onAddStakeholder,
  onUpdateStakeholder,
  onStartStakeholderDiscovery,
  onClose,
}) {
  const isOpportunity = type === 'opportunity';
  const isRisk = type === 'risk';
  const isStakeholders = type === 'stakeholders';

  if (isStakeholders) {
    const missingRoles = executiveCoverage.roles.filter((role) => role.status !== 'Green').map((role) => role.role);
    const economicBuyer = account.stakeholders?.find((person) => person.influence === 'Economic Buyer');
    const technicalOwner = account.stakeholders?.find((person) => person.influence === 'Technical Owner');
    const personaFor = (stakeholder) => personaLibrary?.[personaIdFromRole(stakeholder.role)] ?? Object.values(personaLibrary ?? {})[0];
    const nextRelationshipMoves = [
      economicBuyer ? `Pressure-test business case language with ${economicBuyer.name}.` : 'Identify the economic buyer and confirm how value will be judged.',
      technicalOwner ? `Confirm technical proof needs with ${technicalOwner.name}.` : 'Identify the technical owner and required proof path.',
      missingRoles.length ? `Close missing executive lanes: ${missingRoles.join(', ')}.` : 'Keep executive relationships warm with a regular EBR rhythm.',
      `Align stakeholder asks to ${account.targetMotion}.`,
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Stakeholder map detail</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">{account.name}: {account.stakeholders.length} stakeholders mapped</h3>
              <p className="mt-2 text-sm text-slate-600">
                This view shows whether the account has the right executive, business, and technical voices mapped for discovery and MCEM progression.
              </p>
            </div>
            <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Coverage quality</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <InsightPill label="Executive coverage" value={`${executiveCoverage.score}%`} />
                  <InsightPill label="Economic buyer" value={economicBuyer ? economicBuyer.name : 'Missing'} />
                  <InsightPill label="Technical owner" value={technicalOwner ? technicalOwner.name : 'Missing'} />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="font-bold text-slate-950">Mapped stakeholders</h4>
                  <button
                    type="button"
                    onClick={() => onAddStakeholder?.({
                      name: 'New stakeholder',
                      role: 'COO',
                      influence: 'Business Owner',
                      sentiment: 'Neutral',
                    })}
                    className="rounded-md bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700"
                  >
                    Add stakeholder
                  </button>
                </div>
                <div className="mt-4 grid gap-3">
                  {(account.stakeholders ?? []).map((person, index) => {
                    const persona = personaFor(person);
                    const personaUpdate = persona ? buildPersonaUpdate(account, persona) : null;

                    return (
                    <div key={`${person.name}-${person.role}`} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Name
                          <input
                            type="text"
                            value={person.name}
                            onChange={(event) => onUpdateStakeholder?.(index, { name: event.target.value })}
                            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </label>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Role
                          <select
                            value={person.role}
                            onChange={(event) => onUpdateStakeholder?.(index, { role: event.target.value })}
                            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {['CEO', 'CFO', 'CIO', 'CAIO', 'COO', 'CISO', 'CTO', 'CHRO', 'CMO', 'CPO', 'Business Owner', 'Procurement Lead'].map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Influence
                          <select
                            value={person.influence}
                            onChange={(event) => onUpdateStakeholder?.(index, { influence: event.target.value })}
                            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {['Executive Sponsor', 'Economic Buyer', 'Technical Owner', 'Business Owner', 'Champion', 'Evaluator', 'Procurement', 'Blocker', 'Missing'].map((influence) => (
                              <option key={influence} value={influence}>{influence}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Sentiment
                          <select
                            value={person.sentiment}
                            onChange={(event) => onUpdateStakeholder?.(index, { sentiment: event.target.value })}
                            className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {['Supportive', 'Neutral', 'Skeptical', 'Resistant', 'Unknown'].map((sentiment) => (
                              <option key={sentiment} value={sentiment}>{sentiment}</option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="mt-3 rounded-md border border-purple-100 bg-white p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                          {persona?.role ?? person.role} quick read
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {persona?.messaging ?? 'Capture what this stakeholder cares about and convert it into the next discovery question.'}
                        </p>
                        {personaUpdate && (
                          <p className="mt-2 text-xs leading-5 text-slate-500">{personaUpdate.message}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onStartStakeholderDiscovery?.(person)}
                            className="rounded-md border border-blue-600 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                          >
                            Start discovery
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStakeholder?.(index, { sentiment: 'Supportive' })}
                            className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                          >
                            Mark supportive
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                <h4 className="font-bold text-orange-950">Executive lanes to close</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(missingRoles.length ? missingRoles : ['All required executive lanes covered']).map((role) => (
                    <span key={role} className="rounded-full bg-white/80 px-3 py-2 text-xs font-bold text-orange-950">
                      {missingRoles.length ? `Missing ${role}` : role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-bold text-blue-950">Relationship next moves</h4>
                <div className="mt-3 space-y-2">
                  {nextRelationshipMoves.map((move) => (
                    <p key={move} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-blue-950">{move}</p>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Back to account dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isRisk) {
    const activeRisks = score.risks.filter((riskItem) => riskItem.weight > 0);
    const riskPosture = score.total === 0 ? 'Clean' : score.total < 30 ? 'Managed' : 'Needs attention';
    const monitorItems = [
      `Keep executive sponsor current for ${account.targetMotion}.`,
      `Reconfirm renewal window: ${account.contractContext?.renewalWindow ?? 'unknown'}.`,
      `Track procurement path: ${account.contractContext?.procurement ?? 'unknown'}.`,
      ...(questions ?? []).slice(0, 2),
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Risk score detail</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">{account.name}: {score.total}/100 risk</h3>
              <p className="mt-2 text-sm text-slate-600">
                Lower is better. This view shows whether missing buyers, weak urgency, unclear process, objections, or next-step gaps could slow the account.
              </p>
            </div>
            <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Current risk posture</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <InsightPill label="Posture" value={riskPosture} />
                  <InsightPill label="Active risks" value={`${activeRisks.length}`} />
                  <InsightPill label="Risk direction" value={score.total === 0 ? 'Protect momentum' : 'Reduce before next stage'} />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="font-bold text-slate-950">Risk factors</h4>
                <div className="mt-4 space-y-3">
                  {score.risks.map((riskItem) => (
                    <div key={riskItem.label} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">{riskItem.label}</p>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${riskItem.weight > 0 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {riskItem.weight > 0 ? `+${riskItem.weight}` : 'Clear'}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(riskItem.weight, 20) * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <h4 className="font-bold text-emerald-950">What is clean right now</h4>
                <div className="mt-3 space-y-2">
                  {(activeRisks.length ? ['Some account risk remains active. Use the controls below to reduce it.'] : [
                    'Economic buyer and technical path are currently covered.',
                    'Priority pains, objections, and next steps are captured enough for this stage.',
                    'Trigger urgency is strong enough to support continued discovery.',
                  ]).map((item) => (
                    <p key={item} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-emerald-950">{item}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-bold text-blue-950">Controls to keep risk low</h4>
                <div className="mt-3 space-y-2">
                  {monitorItems.slice(0, 4).map((item) => (
                    <p key={item} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-blue-950">{item}</p>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Back to account dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const strongest = [...score.components].sort((a, b) => (b.value / b.max) - (a.value / a.max))[0];
  const weakest = [...score.components].sort((a, b) => (a.value / a.max) - (b.value / b.max))[0];
  const strongCount = score.components.filter((item) => item.value >= Math.ceil(item.max * 0.8)).length;
  const evidenceItems = isOpportunity
    ? topAddOns.slice(0, 4).map((addOn) => `${addOn.name}: ${addOn.score} fit signal`)
    : gaps.slice(0, 4);
  const actionItems = isOpportunity
    ? [
        `Validate ${topAddOns[0]?.name ?? 'top Microsoft motion'} with the strongest business owner.`,
        `Confirm whether ${account.targetMotion} maps to a renewal, expansion, or proof motion.`,
        ...(account.nextSteps ?? []).slice(0, 2),
      ]
    : questions.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {isOpportunity ? 'Opportunity score detail' : 'Discovery readiness detail'}
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">{account.name}: {score.total}/100</h3>
            <p className="mt-2 text-sm text-slate-600">
              {isOpportunity
                ? 'This score shows whether the account has a strong Microsoft motion, clear sponsor path, timely trigger, and enough V-Team fit to pursue.'
                : 'This score shows whether the account has enough customer context to move from discovery into a confident MCEM plan.'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">What is driving the score</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <InsightPill label="Strongest lane" value={`${strongest.label}: ${strongest.value}/${strongest.max}`} />
                <InsightPill label="Needs attention" value={`${weakest.label}: ${weakest.value}/${weakest.max}`} />
                <InsightPill label="Strong lanes" value={`${strongCount}/${score.components.length}`} />
                <InsightPill label="Primary motion" value={account.targetMotion} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="font-bold text-slate-950">Score breakdown</h4>
              <div className="mt-4 space-y-3">
                {score.components.map((component) => (
                  <div key={component.key}>
                    <div className="mb-1 flex justify-between text-xs font-bold text-slate-600">
                      <span>{component.label}</span>
                      <span>{component.value}/{component.max}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${component.value >= component.max * 0.8 ? 'bg-emerald-500' : component.value >= component.max * 0.55 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.round((component.value / component.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <h4 className="font-bold text-orange-950">
                {isOpportunity ? 'Evidence to validate' : 'What to clean up next'}
              </h4>
              <div className="mt-3 space-y-2">
                {evidenceItems.map((item) => (
                  <p key={item} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-orange-950">{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <h4 className="font-bold text-emerald-950">
                {isOpportunity ? 'Best next moves' : 'Helpful next questions'}
              </h4>
              <div className="mt-3 space-y-2">
                {actionItems.slice(0, 4).map((item) => (
                  <p key={item} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-emerald-950">{item}</p>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Back to account dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightPill({ label, value }) {
  return (
    <div className="rounded-md bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

function stakeholderKey(stakeholder) {
  return `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function TriggerDetailModal({ account, articles, triggerTypes, questions, onClose, onOpenNews }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Trigger intelligence detail</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">{account.name}: trigger strength {account.triggerScore * 10}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Use these news-style signals to decide which persona to engage, which business question to ask, and why the timing matters now.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Signal types to watch</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {triggerTypes.map((type) => (
                  <span key={type} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-orange-800">{type}</span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {articles.map((article) => (
                <div key={article.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">{article.type}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{article.updated}</span>
                  </div>
                  <h4 className="mt-2 font-bold text-slate-950">{article.headline}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                  <p className="mt-3 rounded-md bg-white p-3 text-sm font-semibold text-slate-700">{article.aeImpact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <h4 className="font-bold text-blue-950">Questions this trigger should create</h4>
              <div className="mt-3 space-y-2">
                {[...articles.map((article) => article.question), ...questions].slice(0, 5).map((question) => (
                  <p key={question} className="rounded-md bg-white/80 p-2 text-sm font-semibold text-blue-950">{question}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <h4 className="font-bold text-emerald-950">AE action</h4>
              <div className="mt-3 space-y-2">
                <p className="rounded-md bg-white/80 p-2 text-sm font-semibold text-emerald-950">
                  Anchor the next conversation on why this trigger matters now, not on a product pitch.
                </p>
                <p className="rounded-md bg-white/80 p-2 text-sm font-semibold text-emerald-950">
                  Tie the signal to {account.targetMotion} and validate the business owner who feels the pain.
                </p>
                <p className="rounded-md bg-white/80 p-2 text-sm font-semibold text-emerald-950">
                  Save the strongest question into the stakeholder discovery plan.
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={onOpenNews}
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Open News & Triggers
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Back to account dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
