import { useMemo, useState } from 'react';
import { ArrowRight, Bot, CalendarClock, Info, ListChecks, Send, Target, Users, X } from 'lucide-react';
import { priorityAccounts } from '../data/portfolioData';
import { accountPriorityWeights, getAccountPriorityScore } from '../utils/accountPrioritization';
import { calculateAddOnFit, calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import { buildRenewalPlan } from '../utils/licensePlanning';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function MainPortfolioOverview({ onOpenAccount }) {
  const { annualQuota } = useDiscoveryStore();
  const [coachPrompt, setCoachPrompt] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [renewalPopoutOpen, setRenewalPopoutOpen] = useState(false);
  const [reminders, setReminders] = useState([
    'Prep Toast COO discovery before renewal call.',
    'Send partner note for AppFolio workflow proof.',
  ]);

  const prioritized = useMemo(
    () => priorityAccounts
      .map((account) => ({ account, priority: getAccountPriorityScore(account) }))
      .sort((a, b) => b.priority.total - a.priority.total),
    [],
  );
  const topAccounts = prioritized.slice(0, 6);
  const renewalAccounts = useMemo(
    () => priorityAccounts
      .map((account) => ({
        account,
        priority: getAccountPriorityScore(account),
        renewalPlan: buildRenewalPlan(account, calculateAddOnFit(account).slice(0, 3)),
        renewalUrgency: getRenewalUrgency(account.contractContext?.renewalWindow),
      }))
      .filter(({ renewalUrgency }) => renewalUrgency < 99)
      .sort((a, b) => a.renewalUrgency - b.renewalUrgency || b.priority.total - a.priority.total)
      .slice(0, 10),
    [],
  );
  const actNow = prioritized.filter(({ priority }) => /renewal|act|de-risk/i.test(priority.category)).length;
  const renewalWatch = priorityAccounts.filter((account) => /1 quarter|2 quarters|6 months/i.test(account.contractContext?.renewalWindow ?? '')).length;
  const strongOpportunities = priorityAccounts.filter((account) => calculateOpportunityScore(account).total >= 85).length;
  const riskWatch = priorityAccounts.filter((account) => calculateRiskScore(account).total >= 30).length;
  const impliedPipeline = strongOpportunities * 1150000;
  const quotaCoverage = Math.min(100, Math.round((impliedPipeline / annualQuota) * 100));

  const askCoach = (prompt = coachPrompt) => {
    const text = prompt || 'What should I do first today?';
    const normalized = text.toLowerCase();
    setCoachPrompt(text);

    if (normalized.includes('reminder') || normalized.includes('follow')) {
      setCoachAnswer('Reminder created: confirm stakeholder owner, renewal path, and one customer-ready next step before end of day.');
      setReminders((items) => ['Confirm stakeholder owner, renewal path, and next step today.', ...items].slice(0, 4));
      return;
    }

    if (normalized.includes('quota') || normalized.includes('coverage')) {
      setCoachAnswer(`Quota view: ${currency.format(annualQuota)} annual target, ${quotaCoverage}% discovery-weighted coverage. Spend the morning on renewal-timed accounts and accounts with strong executive signal.`);
      return;
    }

    if (normalized.includes('risk')) {
      setCoachAnswer(`Risk move: open ${topAccounts[0]?.account.name}, validate the money decision maker, and remove the biggest blocker before moving to proof.`);
      return;
    }

    setCoachAnswer(`Start with ${topAccounts[0]?.account.name}: ${topAccounts[0]?.priority.action}`);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Morning AE dashboard</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">What needs my attention today?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              A simple operating view for quota, priority accounts, reminders, and a quick AI assistant before opening an account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenAccount(topAccounts[0]?.account.id)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Open top account
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MorningMetric icon={Target} label="Annual quota" value={currency.format(annualQuota)} detail={`${quotaCoverage}% discovery coverage`} tone="emerald" />
          <MorningMetric icon={ListChecks} label="Act-now accounts" value={actNow} detail="Prioritized for this week" />
          <MorningMetric
            icon={CalendarClock}
            label="Renewal watch"
            value={renewalWatch}
            detail="Click for top 10"
            tone="orange"
            onClick={() => setRenewalPopoutOpen(true)}
          />
          <MorningMetric icon={Users} label="Strong opportunities" value={strongOpportunities} detail={`${riskWatch} risk watch`} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-950">Priority stack</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">Hover an account to see why it is ranked there.</p>
            </div>
            <div className="group relative">
              <button type="button" className="rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Priority scoring model">
                <Info className="h-4 w-4" />
              </button>
              <PriorityTooltip />
            </div>
          </div>

          <div className="space-y-2">
            {topAccounts.map(({ account, priority }, index) => (
              <button
                key={account.id}
                type="button"
                onClick={() => onOpenAccount(account.id)}
                className="group relative grid w-full gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50 md:grid-cols-[auto_1fr_auto]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-700">
                  #{index + 1}
                </span>
                <span>
                  <span className="block font-bold text-slate-950">{account.name}</span>
                  <span className="mt-1 block text-xs font-semibold text-slate-500">{priority.category} - {account.contractContext?.renewalWindow}</span>
                </span>
                <span className="flex items-center gap-2 text-sm font-bold text-blue-700">
                  {priority.total}/100
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span className="pointer-events-none absolute left-12 top-full z-20 mt-2 hidden w-[min(460px,calc(100vw-3rem))] rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-lg group-hover:block">
                  <strong className="text-slate-950">{priority.action}</strong>
                  <span className="mt-2 block">{priority.reasons.join(' | ')}</span>
                  <span className="mt-2 block text-blue-700">Click to open the account workspace.</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-700">
            <Bot className="mr-2 h-4 w-4" />
            AI AE assistant
          </p>
          <h3 className="mt-2 text-xl font-bold text-blue-950">Ask, plan, or create a reminder</h3>
          <div className="mt-4 grid gap-3">
            <textarea
              value={coachPrompt}
              onChange={(event) => setCoachPrompt(event.target.value)}
              className="min-h-24 resize-none rounded-lg border border-blue-200 bg-white p-3 text-sm leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask: What should I prioritize today? Create a reminder. Check quota coverage..."
            />
            <div className="flex flex-wrap gap-2">
              {['What should I do first today?', 'Check quota coverage', 'Create renewal reminder', 'Which account has risk?'].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askCoach(prompt)}
                  className="rounded-full bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => askCoach()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Ask assistant
            </button>
          </div>
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Assistant answer</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
              {coachAnswer || 'Start with the highest renewal-timed account, confirm the decision owner, and turn the next meeting into a clean discovery outcome.'}
            </p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-950">Today&apos;s reminders</h3>
          <div className="mt-4 space-y-2">
            {reminders.map((reminder) => (
              <div key={reminder} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700">
                {reminder}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-950">Operating dashboard</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <OperatingTile label="Renewals" value={`${renewalWatch} watch`} detail="Work ahead of the clock" onClick={() => setRenewalPopoutOpen(true)} />
            <OperatingTile label="Discovery" value={`${actNow} active`} detail="Clear next customer action" />
            <OperatingTile label="Coverage" value={`${strongOpportunities} strong`} detail="Needs V-Team orchestration" />
          </div>
        </section>
      </div>

      {renewalPopoutOpen && (
        <RenewalWatchPopout
          renewalAccounts={renewalAccounts}
          onClose={() => setRenewalPopoutOpen(false)}
          onOpenAccount={(accountId) => {
            setRenewalPopoutOpen(false);
            onOpenAccount(accountId);
          }}
        />
      )}
    </div>
  );
}

function MorningMetric({ icon: Icon, label, value, detail, tone = 'blue', onClick }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
  }[tone];
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-lg border p-4 text-left ${toneClass} ${onClick ? 'transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400' : ''}`}
    >
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase">{label}</p>
      <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>
    </Component>
  );
}

function OperatingTile({ label, value, detail, onClick }) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`rounded-lg border border-slate-200 bg-slate-50 p-4 text-left ${onClick ? 'transition hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400' : ''}`}
    >
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-600">{detail}</p>
    </Component>
  );
}

function RenewalWatchPopout({ renewalAccounts, onClose, onOpenAccount }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4">
      <section className="mt-8 w-full max-w-6xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-slate-200 bg-white p-5">
          <div>
            <p className="flex items-center text-xs font-bold uppercase tracking-wider text-orange-600">
              <CalendarClock className="mr-2 h-4 w-4" />
              Renewal command popout
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Top 10 renewal accounts to control now</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Each account shows what is renewing, how to move it forward, when it matters, who owns the decision, current price cue, and license count.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            aria-label="Close renewal popout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          {renewalAccounts.map(({ account, priority, renewalPlan }, index) => (
            <article key={account.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">#{index + 1} renewal priority</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{account.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{account.industry}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAccount(account.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Open account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <RenewalDetail label="What" value={renewalPlan.what} />
                <RenewalDetail label="When" value={renewalPlan.when} />
                <RenewalDetail label="Who" value={renewalPlan.who} />
                <RenewalDetail label="How" value={renewalPlan.how} />
                <RenewalDetail label="Price cue" value={renewalPlan.price} />
                <RenewalDetail label="Seats" value={renewalPlan.seats.toLocaleString()} />
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                <div className="rounded-lg border border-white bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Procurement path</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{renewalPlan.procurement}</p>
                  <p className="mt-1 text-xs text-slate-600">Business case: {renewalPlan.businessCase}</p>
                </div>
                <div className="rounded-lg border border-white bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical owner</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{renewalPlan.technicalOwner}</p>
                  <p className="mt-1 text-xs text-slate-600">{renewalPlan.validationStatus}</p>
                </div>
                <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Priority</p>
                  <p className="mt-1 text-xl font-bold text-orange-950">{priority.total}/100</p>
                  <p className="mt-1 text-xs font-semibold text-orange-800">{priority.category}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RenewalDetail({ label, value }) {
  return (
    <div className="rounded-lg border border-white bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-slate-900">{value}</p>
    </div>
  );
}

function getRenewalUrgency(renewalWindow = '') {
  const value = renewalWindow.toLowerCase();
  if (value.includes('1 quarter') || value.includes('3 months')) return 1;
  if (value.includes('4 months')) return 2;
  if (value.includes('5 months')) return 3;
  if (value.includes('6 months') || value.includes('2 quarters')) return 4;
  if (value.includes('3 quarters') || value.includes('9 months')) return 5;
  if (value.includes('4 quarters')) return 6;
  return 99;
}

function PriorityTooltip() {
  return (
    <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 hidden w-80 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 shadow-lg group-hover:block">
      <p className="font-bold text-slate-950">Priority model</p>
      <div className="mt-2 space-y-1">
        {accountPriorityWeights.map((item) => (
          <p key={item.key}>
            <span className="font-bold text-blue-700">{item.weight}%</span> {item.label}
          </p>
        ))}
      </div>
    </div>
  );
}
