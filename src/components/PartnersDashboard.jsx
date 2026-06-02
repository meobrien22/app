import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Handshake,
  Mail,
  Plus,
  Route,
  Send,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  UserRoundCheck,
} from 'lucide-react';
import { mcemStages } from '../data/mcemData';
import { partnerProfiles, portfolioNewsSignals } from '../data/partnerData';
import { priorityAccounts } from '../data/portfolioData';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import {
  calculateAddOnFit,
  calculateRiskScore,
  calculateStakeholderDiscoveryProgress,
  getKeywordSolutionMap,
  getKeywordTallyList,
} from '../utils/scoring';

export default function PartnersDashboard({ activeAccount, onOpenAccount }) {
  const [partners, setPartners] = useState(partnerProfiles);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
  const [plannerStatus, setPlannerStatus] = useState({});
  const [engagementState, setEngagementState] = useState({});
  const [draft, setDraft] = useState({
    name: '',
    type: 'Microsoft services partner',
    specialty: 'Copilot adoption',
    account: priorityAccounts[0]?.name ?? '',
  });
  const { keywordTally, stakeholderMeetings, workshopPlan } = useDiscoveryStore();

  const partnerSuggestions = useMemo(
    () => buildPartnerSuggestions({
      account: activeAccount,
      partners,
      keywordTally,
      stakeholderMeetings,
      workshopPlan,
    }),
    [activeAccount, partners, keywordTally, stakeholderMeetings, workshopPlan],
  );
  const selectedSuggestion = partnerSuggestions.find((suggestion) => suggestion.id === selectedSuggestionId) ?? partnerSuggestions[0];
  const selectedEngagement = selectedSuggestion
    ? {
      ...defaultPartnerEngagement(selectedSuggestion),
      ...(engagementState[selectedSuggestion.id] ?? {}),
    }
    : null;
  const accountPartnerBrief = useMemo(
    () => buildAccountPartnerBrief({
      account: activeAccount,
      suggestions: partnerSuggestions,
      keywordTally,
      stakeholderMeetings,
    }),
    [activeAccount, partnerSuggestions, keywordTally, stakeholderMeetings],
  );

  const addPartner = () => {
    if (!draft.name.trim()) return;
    setPartners((items) => [
      {
        id: draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: draft.name.trim(),
        type: draft.type,
        specialties: [draft.specialty],
        accounts: [draft.account],
        status: 'Potential',
        fit: 72,
        owner: 'Partner Development / Channel Lead',
        profile: `${draft.name.trim()} is being evaluated for ${draft.specialty.toLowerCase()} support.`,
        nextMove: `Qualify fit with ${draft.account} and define the customer-facing deliverable.`,
      },
      ...items,
    ]);
    setDraft((current) => ({ ...current, name: '' }));
  };

  const togglePlannerItem = (suggestionId, itemId) => {
    setPlannerStatus((current) => ({
      ...current,
      [suggestionId]: {
        ...(current[suggestionId] ?? {}),
        [itemId]: !current[suggestionId]?.[itemId],
      },
    }));
  };

  const updateEngagement = (suggestionId, patch) => {
    const suggestion = partnerSuggestions.find((item) => item.id === suggestionId);
    setEngagementState((current) => ({
      ...current,
      [suggestionId]: {
        ...(suggestion ? defaultPartnerEngagement(suggestion) : {}),
        ...(current[suggestionId] ?? {}),
        ...patch,
      },
    }));
  };

  const activePartners = partners.filter((partner) => partner.status === 'Active').length;
  const potentialPartners = partners.filter((partner) => partner.status !== 'Active').length;
  const coveredAccounts = new Set(partners.flatMap((partner) => partner.accounts)).size;
  const completedPlannerItems = selectedSuggestion
    ? Object.values(plannerStatus[selectedSuggestion.id] ?? {}).filter(Boolean).length
    : 0;

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Partners dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Partner ecosystem command center</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Suggest partners from MCEM signals, stakeholder responses, keywords, risks, and demo needs. Then plan outreach,
              NDA readiness, partner interest, customer demo, and follow-through.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 lg:w-80">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Active account signal</p>
            <p className="mt-2 text-xl font-bold text-blue-950">{activeAccount?.name ?? 'Portfolio'}</p>
            <p className="mt-1 text-sm leading-6 text-blue-800">{activeAccount?.targetMotion ?? 'Select an account to personalize partner recommendations.'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <PartnerMetric label="Active partners" value={activePartners} detail="Attached now" />
          <PartnerMetric label="Potential partners" value={potentialPartners} detail="Watch list" tone="orange" />
          <PartnerMetric label="Covered accounts" value={coveredAccounts} detail="Partner profile mapped" tone="emerald" />
          <PartnerMetric label="Suggested moves" value={partnerSuggestions.length} detail="From MCEM signals" />
        </div>
      </div>

      <AccountPartnerStrategy brief={accountPartnerBrief} />

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
              Account-aware partner suggestions
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ranked by match to the current account's pains, keywords, solution signals, risk posture, and partner-deliverable need.
            </p>
            <div className="mt-5 space-y-3">
              {partnerSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => setSelectedSuggestionId(suggestion.id)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedSuggestion?.id === suggestion.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{suggestion.partner.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{suggestion.partner.type}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                      Fit {suggestion.fit}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{suggestion.why}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestion.matchedSignals.slice(0, 4).map((signal) => (
                      <span key={signal} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-blue-700">
                        {signal}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <Plus className="mr-2 h-4 w-4 text-blue-600" />
              Add partner
            </h3>
            <div className="mt-5 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Partner name
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., regional managed services partner"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Partner type
                <input
                  value={draft.type}
                  onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Specialty
                <select
                  value={draft.specialty}
                  onChange={(event) => setDraft((current) => ({ ...current, specialty: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['Copilot adoption', 'Security modernization', 'Data estate readiness', 'Endpoint management', 'Power Platform delivery', 'Change management'].map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Account attached
                <select
                  value={draft.account}
                  onChange={(event) => setDraft((current) => ({ ...current, account: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityAccounts.slice(0, 20).map((account) => (
                    <option key={account.id} value={account.name}>{account.name}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={addPartner}
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Add partner profile
              </button>
            </div>
          </section>
        </section>

        <section className="space-y-6">
          {selectedSuggestion && (
            <PartnerPlanner
              suggestion={selectedSuggestion}
              engagement={selectedEngagement}
              completedItems={completedPlannerItems}
              plannerStatus={plannerStatus[selectedSuggestion.id] ?? {}}
              onToggle={(itemId) => togglePlannerItem(selectedSuggestion.id, itemId)}
              onUpdateEngagement={(patch) => updateEngagement(selectedSuggestion.id, patch)}
              onOpenAccount={onOpenAccount}
            />
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center font-bold text-slate-950">
              <Handshake className="mr-2 h-4 w-4 text-blue-600" />
              Partner profiles and account attach
            </h3>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {partners.map((partner) => (
                <article key={partner.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{partner.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{partner.type}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      Fit {partner.fit}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {partner.specialties.map((specialty) => (
                      <span key={specialty} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{partner.profile}</p>
                  <p className="mt-3 rounded-md bg-white p-3 text-xs font-semibold leading-5 text-slate-700">{partner.nextMove}</p>
                  <div className="mt-4 space-y-2">
                    {partner.accounts.map((accountName) => {
                      const account = priorityAccounts.find((item) => item.name === accountName);
                      return (
                        <button
                          key={accountName}
                          type="button"
                          onClick={() => account && onOpenAccount(account.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {accountName}
                          {account && <ArrowRight className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}

function PartnerPlanner({ suggestion, engagement, plannerStatus, completedItems, onToggle, onUpdateEngagement, onOpenAccount }) {
  const account = priorityAccounts.find((item) => item.name === suggestion.accountName);
  const planItems = buildPlannerItems(suggestion);
  const playbook = buildPartnerPlaybook(suggestion);
  const motionOptions = buildMotionOptions(suggestion);
  const readiness = calculatePartnerReadiness({
    completedItems,
    totalItems: planItems.length,
    engagement,
  });
  const fitDrivers = buildFitDrivers(suggestion);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Partner planner</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{suggestion.partner.name} for {suggestion.accountName}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{suggestion.recommendedMotion}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{readiness}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Partner readiness</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${readiness}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="flex items-center font-bold text-blue-950">
              <Route className="mr-2 h-4 w-4" />
              Live partner engagement path
            </h4>
            <p className="mt-2 text-sm leading-6 text-blue-900">
              Move the partner through the real AE sequence before they touch the customer.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">
            {engagement.status}
          </span>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {partnerPathStages.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => onUpdateEngagement({ status: stage })}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-bold transition ${
                engagement.status === stage
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-blue-100 bg-white text-blue-800 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <PlannerSignal icon={UserRoundCheck} label="Partner owner" value={engagement.owner || suggestion.partner.owner} />
        <PlannerSignal icon={CalendarClock} label="Customer motion" value={engagement.motion || suggestion.customerMoment} />
        <PlannerSignal icon={ClipboardList} label="MCEM source" value={suggestion.mcemSource} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="flex items-center font-bold text-slate-950">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-blue-600" />
            Partner motion controls
          </h4>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Partner owner
              <input
                value={engagement.owner}
                onChange={(event) => onUpdateEngagement({ owner: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Target date
              <input
                type="date"
                value={engagement.targetDate}
                onChange={(event) => onUpdateEngagement({ targetDate: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 md:col-span-2">
              Customer motion
              <select
                value={engagement.motion}
                onChange={(event) => onUpdateEngagement({ motion: event.target.value })}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm normal-case tracking-normal text-slate-950 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {motionOptions.map((motion) => (
                  <option key={motion} value={motion}>{motion}</option>
                ))}
              </select>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                checked={engagement.customerReady}
                onChange={(event) => onUpdateEngagement({ customerReady: event.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Customer-ready: partner interest, NDA/sharing boundary, role split, and demo scope are clear.
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="font-bold text-slate-950">Why this partner is being prioritized</h4>
          <div className="mt-4 space-y-3">
            {fitDrivers.map((driver) => (
              <FitDriverBar key={driver.label} {...driver} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <PlaybookSection icon={Target} title="Customer outcome to anchor" items={playbook.outcomes} tone="blue" />
        <PlaybookSection icon={UsersRound} title="Partner role split" items={playbook.roleSplit} tone="slate" />
        <PlaybookSection icon={ShieldCheck} title="Readiness gates" items={playbook.readinessGates} tone="emerald" />
        <PlaybookSection icon={Gauge} title="Success measures" items={playbook.successMeasures} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">AE partner checklist</h4>
          <div className="mt-4 space-y-3">
            {planItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-blue-50">
                <input
                  type="checkbox"
                  checked={Boolean(plannerStatus[item.id])}
                  onChange={() => onToggle(item.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-950">
                    {item.title}
                    {plannerStatus[item.id] && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h4 className="flex items-center font-bold text-blue-950">
              <Mail className="mr-2 h-4 w-4" />
              Partner outreach email
            </h4>
            <textarea
              value={engagement.email}
              onChange={(event) => onUpdateEngagement({ email: event.target.value })}
              className="mt-3 h-52 w-full resize-none rounded-lg border border-blue-100 bg-white p-3 text-xs leading-5 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onUpdateEngagement({ email: buildPartnerEmail(suggestion) })}
                className="rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
              >
                Refresh draft
              </button>
              <button
                type="button"
                onClick={() => onUpdateEngagement({
                  status: 'Partner interest',
                  note: `${engagement.note}\nPartner interest email marked ready for ${suggestion.partner.name}.`.trim(),
                })}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Send className="h-3.5 w-3.5" />
                Mark ready to send
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <h4 className="font-bold text-emerald-950">Customer demo plan</h4>
            <div className="mt-3 space-y-2">
              {suggestion.demoPlan.map((item) => (
                <p key={item} className="rounded-md bg-white/80 p-2 text-xs font-semibold leading-5 text-emerald-950">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="font-bold text-slate-950">AE notes and partner ask</h4>
            <textarea
              value={engagement.note}
              onChange={(event) => onUpdateEngagement({ note: event.target.value })}
              className="mt-3 h-36 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Capture partner interest, NDA notes, demo boundaries, dry-run owner, or customer follow-up..."
            />
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
            <h4 className="font-bold text-orange-950">Risk controls</h4>
            <div className="mt-3 space-y-2">
              {playbook.riskControls.map((item) => (
                <p key={item} className="rounded-md bg-white/80 p-2 text-xs font-semibold leading-5 text-orange-950">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {account && (
            <button
              type="button"
              onClick={() => onOpenAccount(account.id)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Open {account.name}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const partnerPathStages = [
  'Partner fit check',
  'Partner interest',
  'NDA / sharing',
  'Discovery brief',
  'Dry run',
  'Customer demo',
  'Follow-up',
];

function FitDriverBar({ label, value, detail }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-950">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
        <span className="text-sm font-bold text-blue-700">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AccountPartnerStrategy({ brief }) {
  return (
    <section className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Account partner strategy</p>
          <h3 className="mt-2 text-2xl font-bold text-blue-950">{brief.accountName} partner point of view</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-950">{brief.executiveWhy}</p>
        </div>
        <div className="rounded-xl bg-white p-4 lg:w-80">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Best partner motion</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-950">{brief.suggestedMotion}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        <StrategyTile title="Priority signals" items={brief.prioritySignals} />
        <StrategyTile title="Stakeholders to align" items={brief.stakeholders} />
        <StrategyTile title="Partner packet" items={brief.partnerPacket} />
        <StrategyTile title="Next partner moves" items={brief.nextMoves} />
      </div>
    </section>
  );
}

function StrategyTile({ title, items }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-lg bg-slate-50 p-2 text-xs font-semibold leading-5 text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function PlaybookSection({ icon: Icon, title, items, tone = 'blue' }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-950',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-950',
    amber: 'border-amber-100 bg-amber-50 text-amber-950',
    slate: 'border-slate-200 bg-slate-50 text-slate-800',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h4 className="flex items-center font-bold">
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </h4>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-lg bg-white/80 p-2 text-xs font-semibold leading-5 text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function PlannerSignal({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-950">{value}</p>
    </div>
  );
}

function PartnerMetric({ label, value, detail, tone = 'blue' }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <Handshake className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>
    </div>
  );
}

function defaultPartnerEngagement(suggestion) {
  return {
    status: 'Partner fit check',
    owner: suggestion.partner.owner,
    targetDate: '',
    motion: suggestion.customerMoment,
    customerReady: false,
    email: buildPartnerEmail(suggestion),
    note: `Use ${suggestion.partner.name} only if they increase confidence around ${suggestion.matchedSignals[0] ?? suggestion.partner.specialties[0]}.`,
  };
}

function calculatePartnerReadiness({ completedItems, totalItems, engagement }) {
  const checklist = totalItems ? Math.round((completedItems / totalItems) * 55) : 0;
  const owner = engagement?.owner ? 10 : 0;
  const date = engagement?.targetDate ? 10 : 0;
  const motion = engagement?.motion ? 10 : 0;
  const customerReady = engagement?.customerReady ? 15 : 0;
  return Math.min(100, checklist + owner + date + motion + customerReady);
}

function buildMotionOptions(suggestion) {
  return [
    suggestion.customerMoment,
    'Partner interest email and discovery brief',
    'NDA and partner rules-of-engagement check',
    'Internal partner dry run',
    'Customer-facing demo or workshop',
    'Post-demo mutual action plan update',
  ].filter((item, index, items) => item && items.indexOf(item) === index);
}

function buildFitDrivers(suggestion) {
  const attachScore = suggestion.partner.accounts.includes(suggestion.accountName) ? 92 : 68;
  const signalScore = Math.min(96, 56 + suggestion.matchedSignals.length * 8);
  const deliveryScore = Math.min(94, suggestion.partner.fit);
  const demoScore = Math.min(90, 58 + suggestion.demoPlan.length * 8);

  return [
    {
      label: 'Signal match',
      value: signalScore,
      detail: `Matches ${suggestion.matchedSignals.slice(0, 3).join(', ') || 'account discovery signals'}.`,
    },
    {
      label: 'Account attach',
      value: attachScore,
      detail: suggestion.partner.accounts.includes(suggestion.accountName)
        ? 'Already mapped to this account in the partner profile.'
        : 'Potential attach; validate interest before customer mention.',
    },
    {
      label: 'Delivery confidence',
      value: deliveryScore,
      detail: `${suggestion.partner.name} has fit strength for ${suggestion.partner.specialties[0].toLowerCase()}.`,
    },
    {
      label: 'Demo readiness',
      value: demoScore,
      detail: 'Demo plan has a clear opening, proof focus, partner role, and close action.',
    },
  ];
}

function buildAccountPartnerBrief({ account, suggestions, keywordTally, stakeholderMeetings }) {
  const safeAccount = account ?? priorityAccounts[0];
  const topSuggestion = suggestions[0];
  const topKeywords = getKeywordTallyList(keywordTally).slice(0, 4).map((item) => item.keyword);
  const progress = calculateStakeholderDiscoveryProgress(stakeholderMeetings);
  const topAddOns = calculateAddOnFit(safeAccount).slice(0, 3).map((item) => item.name);
  const primaryStage = mcemStages[0]?.label ?? 'Listen & Consult';
  const stakeholderNames = (safeAccount.stakeholders ?? []).slice(0, 4).map((stakeholder) => `${stakeholder.role}: ${stakeholder.name}`);
  const partnerName = topSuggestion?.partner?.name ?? 'Recommended partner';
  const signal = topKeywords[0] ?? safeAccount.selectedPains?.[0] ?? safeAccount.trigger;

  return {
    accountName: safeAccount.name,
    executiveWhy: `${safeAccount.name} needs a partner motion only if it increases customer confidence, accelerates proof, or de-risks execution. Current signals point to ${signal.toLowerCase()}, with ${topAddOns.join(', ') || safeAccount.targetMotion} as the strongest Microsoft fit.`,
    suggestedMotion: topSuggestion
      ? `${partnerName}: ${topSuggestion.customerMoment}`
      : `Use partner discovery during ${primaryStage} before bringing a partner into the customer conversation.`,
    prioritySignals: [
      ...(topKeywords.length ? topKeywords : safeAccount.selectedPains ?? []).slice(0, 3),
      `Trigger score ${safeAccount.triggerScore}/10`,
      `${progress.answeredQuestions}/${progress.totalQuestions} stakeholder answers captured`,
    ].filter(Boolean),
    stakeholders: stakeholderNames.length ? stakeholderNames : ['Economic buyer TBD', 'Technical owner TBD', 'Partner lead TBD'],
    partnerPacket: [
      'One-page customer context and discovery summary',
      'Persona pain, proof scenario, and success criteria',
      'NDA/sharing boundary and customer-safe language',
      'Demo scope: what to show, what not to show, and decision to unblock',
    ],
    nextMoves: [
      `Send partner-fit email to ${partnerName}`,
      'Confirm Partner Lead, AE, SSP, TS, and customer owner role split',
      'Run internal dry run before customer invite',
      'Update mutual action plan after partner touch',
    ],
  };
}

function buildPartnerSuggestions({ account, partners, keywordTally, stakeholderMeetings, workshopPlan }) {
  const safeAccount = account ?? priorityAccounts[0];
  const topAddOns = calculateAddOnFit(safeAccount).slice(0, 5);
  const risks = calculateRiskScore(safeAccount).risks.filter((risk) => risk.weight > 0);
  const keywordSolutions = getKeywordSolutionMap(safeAccount, stakeholderMeetings, keywordTally).slice(0, 5);
  const topKeywords = getKeywordTallyList(keywordTally).slice(0, 5).map((item) => item.keyword);
  const progress = calculateStakeholderDiscoveryProgress(stakeholderMeetings);
  const pendingWorkshop = workshopPlan?.find((item) => item.status !== 'Done');
  const accountSignals = normalizeSignals([
    safeAccount.industry,
    safeAccount.targetMotion,
    safeAccount.trigger,
    ...(safeAccount.selectedPains ?? []),
    ...(safeAccount.keywords ?? []),
    ...topKeywords,
    ...topAddOns.map((addOn) => addOn.name),
    ...topAddOns.flatMap((addOn) => addOn.signalKeywords ?? []),
    ...risks.map((risk) => risk.label),
    ...keywordSolutions.flatMap((item) => [item.keyword, ...item.solutions]),
  ]);

  return partners
    .map((partner) => {
      const partnerSignals = normalizeSignals([partner.name, partner.type, partner.profile, partner.nextMove, ...partner.specialties]);
      const specialtyHits = partner.specialties.filter((specialty) => hasSignalMatch(accountSignals, specialty));
      const directHits = partnerSignals.filter((signal) => accountSignals.some((accountSignal) => signal.includes(accountSignal) || accountSignal.includes(signal)));
      const accountAttached = partner.accounts.includes(safeAccount.name);
      const fit = Math.min(99, Math.max(55, partner.fit + specialtyHits.length * 4 + directHits.length * 2 + (accountAttached ? 8 : 0) + (risks.length ? 3 : 0)));
      const matchedSignals = [
        ...specialtyHits,
        ...topAddOns.slice(0, 2).map((addOn) => addOn.name),
        ...topKeywords.slice(0, 2),
        ...(risks.length ? ['risk cleanup'] : []),
        pendingWorkshop?.title,
      ].filter(Boolean);

      return {
        id: `${partner.id}-${safeAccount.id}`,
        partner,
        accountName: safeAccount.name,
        fit,
        matchedSignals: [...new Set(matchedSignals)].slice(0, 6),
        why: buildPartnerWhy(partner, safeAccount, topAddOns, risks, progress),
        recommendedMotion: buildRecommendedMotion(partner, safeAccount, topAddOns, progress),
        customerMoment: getCustomerMoment(topAddOns, risks, progress),
        mcemSource: pendingWorkshop ? `Workshop: ${pendingWorkshop.title}` : progress.answeredQuestions ? 'Listen & Consult responses' : 'Account and trigger signals',
        demoPlan: buildDemoPlan(partner, safeAccount, topAddOns, keywordSolutions),
      };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 6);
}

function buildPartnerWhy(partner, account, topAddOns, risks, progress) {
  const solution = topAddOns[0]?.name ?? account.targetMotion;
  const riskLanguage = risks.length ? ` and can reduce ${risks[0].label.toLowerCase()}` : '';
  const progressLanguage = progress.answeredQuestions
    ? ` Discovery has ${progress.answeredQuestions}/${progress.totalQuestions} stakeholder responses captured.`
    : ' Discovery is early, so the partner should help create a simple proof motion.';

  return `${partner.name} fits ${account.name} because ${partner.specialties[0].toLowerCase()} maps to ${solution}${riskLanguage}.${progressLanguage}`;
}

function buildRecommendedMotion(partner, account, topAddOns, progress) {
  const solution = topAddOns[0]?.name ?? account.targetMotion;
  if (progress.completionPct < 35) {
    return `Ask ${partner.name} if they are interested in a discovery-support role before involving the customer. Share account context, ask for fit, then decide whether to co-plan a ${solution} workshop.`;
  }
  return `Move ${partner.name} into a customer-ready ${solution} demo or workshop plan for ${account.name}, with roles, boundaries, and success criteria confirmed before the invite goes out.`;
}

function getCustomerMoment(topAddOns, risks, progress) {
  if (risks.some((risk) => /technical|owner|proof|procurement|renewal/i.test(risk.label))) return 'Partner validation call before customer demo';
  if (progress.completionPct < 50) return 'Partner interest email and discovery brief';
  if (topAddOns.some((addOn) => /Defender|Sentinel|Entra|Intune/i.test(addOn.name))) return 'Security or technical assessment workshop';
  if (topAddOns.some((addOn) => /Copilot|Viva|Teams/i.test(addOn.name))) return 'Persona-specific productivity demo';
  if (topAddOns.some((addOn) => /Power BI|Fabric|Power Platform/i.test(addOn.name))) return 'Workflow and data whiteboard';
  return 'Partner-led customer workshop';
}

function buildPlannerItems(suggestion) {
  return [
    {
      id: 'partner-interest',
      title: 'Confirm partner interest',
      detail: `Send a short partner-first email to ${suggestion.partner.name} with account context, signals, and the ask before promising anything to the customer.`,
    },
    {
      id: 'nda-check',
      title: 'Check NDA and sharing boundaries',
      detail: 'Confirm what can be shared, whether an NDA is needed, and which customer details must stay internal until the partner is approved.',
    },
    {
      id: 'discovery-brief',
      title: 'Send discovery brief',
      detail: `Summarize ${suggestion.accountName} pains, stakeholder roles, keywords, trigger, current stage, and desired customer outcome.`,
    },
    {
      id: 'partner-role',
      title: 'Define partner role',
      detail: `Decide whether ${suggestion.partner.name} is leading a demo, supporting a workshop, doing assessment work, or staying behind the scenes.`,
    },
    {
      id: 'internal-alignment',
      title: 'Align Microsoft V-Team',
      detail: 'Confirm AE, SSP, Technical Specialist, Partner Lead, and Customer Success responsibilities before the partner touches the customer.',
    },
    {
      id: 'demo-outline',
      title: 'Build customer demo outline',
      detail: 'Create demo flow, customer personas, proof points, questions to ask, what not to show, and the specific decision the demo should unblock.',
    },
    {
      id: 'dry-run',
      title: 'Run partner dry run',
      detail: 'Review opening talk track, handoffs, demo boundaries, security/compliance constraints, timing, and owner for follow-up notes.',
    },
    {
      id: 'customer-invite',
      title: 'Send customer invite',
      detail: 'Invite the right customer stakeholders, frame the meeting as discovery or proof, and state what the customer will get out of it.',
    },
    {
      id: 'post-demo-map',
      title: 'Update mutual action plan',
      detail: 'After the demo, capture customer reactions, partner deliverables, blockers, and the next MCEM action with owner and date.',
    },
  ];
}

function buildPartnerPlaybook(suggestion) {
  const primarySignal = suggestion.matchedSignals[0] ?? 'the top discovery signal';
  const secondarySignal = suggestion.matchedSignals[1] ?? suggestion.partner.specialties[0];

  return {
    outcomes: [
      `Make ${suggestion.accountName} believe there is a practical path from discovery to execution, not just a Microsoft recommendation.`,
      `Anchor the partner conversation on ${primarySignal} and connect it to ${secondarySignal}.`,
      `Use the partner to increase confidence in timing, adoption, implementation, or proof quality.`,
    ],
    roleSplit: [
      'AE: owns customer narrative, executive access, meeting objective, and mutual next step.',
      'Partner Lead: owns partner fit, NDA/sharing boundaries, and partner rules of engagement.',
      `${suggestion.partner.name}: owns implementation reality, demo/workshop contribution, and customer-ready delivery assumptions.`,
      'SSP/Technical Specialist: owns Microsoft proof quality, technical boundaries, and success criteria.',
    ],
    readinessGates: [
      'Partner interest confirmed before customer mention.',
      'NDA and customer-data sharing boundaries confirmed.',
      'Discovery brief sent with pain, personas, keywords, trigger, and desired outcome.',
      'Demo scope and dry-run complete before customer invite.',
    ],
    successMeasures: [
      'Customer names the stakeholder owner and the decision the partner helped unblock.',
      'Partner leaves with a dated deliverable, not a vague follow-up.',
      'AE updates MCEM stage, V-Team commitments, risks, and mutual action plan after the meeting.',
      'Customer sees partner as execution leverage, not additional complexity.',
    ],
    engagementFlow: [
      'Partner-fit check: validate interest, specialties, and account relevance.',
      'Internal planning: align AE, Partner Lead, SSP, TS, and partner owner.',
      'Dry run: inspect talk track, demo boundaries, handoffs, and security constraints.',
      'Customer touch: position the partner as proof and execution support tied to the customer outcome.',
      'Post-meeting: capture reactions, blockers, owner, date, and next MCEM action.',
    ],
    riskControls: [
      'Do not introduce the partner until the customer pain and meeting purpose are clear.',
      'Do not share sensitive customer detail until NDA and sharing boundaries are confirmed.',
      'Do not let the partner run a broad product tour; keep the demo tied to the persona pain.',
      'Do not leave the meeting without owner, date, and customer-visible next step.',
    ],
  };
}

function buildDemoPlan(partner, account, topAddOns, keywordSolutions) {
  const solution = topAddOns[0]?.name ?? account.targetMotion;
  const keyword = keywordSolutions[0]?.keyword ?? account.selectedPains?.[0] ?? 'top customer pain';

  return [
    `Open with the ${account.name} business issue: ${keyword}.`,
    `Show only the ${solution} moments that answer the stakeholder pain, not a broad product tour.`,
    `Have ${partner.name} own implementation reality: timeline, dependencies, risks, and customer-side requirements.`,
    'End with three decisions: proceed to workshop, identify blockers, and assign owner/date for the next step.',
  ];
}

function buildPartnerEmail(suggestion) {
  return `Subject: Partner fit check for ${suggestion.accountName}

Hi ${suggestion.partner.name} team,

I am working a Microsoft discovery motion with ${suggestion.accountName}. The strongest current signals are ${suggestion.matchedSignals.slice(0, 4).join(', ')}.

Before I bring a partner into the customer conversation, I want to confirm fit and interest. Could you help with:
- Whether this account fits your ${suggestion.partner.specialties.slice(0, 2).join(' / ')} motion
- What customer-ready demo, workshop, or assessment you could support
- Any NDA or sharing requirements before we exchange more account detail
- The partner owner who should join a short planning call

Proposed next step: ${suggestion.customerMoment}.

Thanks.`;
}

function normalizeSignals(values) {
  return values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/[,;/+]/))
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 2);
}

function hasSignalMatch(accountSignals, specialty) {
  const normalized = String(specialty).toLowerCase();
  const aliases = {
    copilot: ['ai productivity', 'copilot', 'adoption', 'change'],
    security: ['security risk', 'identity', 'defender', 'sentinel', 'entra', 'risk'],
    endpoint: ['device management', 'frontline', 'intune', 'endpoint'],
    data: ['data silos', 'manual reporting', 'power bi', 'fabric', 'analytics'],
    governance: ['compliance pressure', 'purview', 'governance', 'audit'],
    platform: ['process friction', 'power platform', 'workflow', 'automation'],
    smb: ['smb', 'channel', 'managed services', 'packaging'],
  };
  const terms = Object.entries(aliases)
    .filter(([key]) => normalized.includes(key))
    .flatMap(([, value]) => value);
  const directTerms = [normalized, ...terms];
  return directTerms.some((term) => accountSignals.some((signal) => signal.includes(term) || term.includes(signal)));
}
