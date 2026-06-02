import { AlertTriangle, CheckCircle2, Compass, Gauge } from 'lucide-react';
import { calculateDiscoveryScore, calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import ScoreBar from './ScoreBar';

const businessDimensions = [
  { label: 'Productivity impact', key: 'productivity', source: 'painClarity', max: 15 },
  { label: 'Security risk clarity', key: 'security', source: 'triggerUrgency', max: 15 },
  { label: 'Operational urgency', key: 'operations', source: 'businessPriorityAlignment', max: 10 },
  { label: 'Adoption readiness', key: 'adoption', source: 'adoptionReadiness', max: 10 },
  { label: 'Executive alignment', key: 'executive', source: 'executiveSponsorClarity', max: 15 },
  { label: 'Competitive displacement', key: 'competitive', source: 'competitiveDisplacementSignal', max: 15 },
];

export default function BusinessValueScoring({ account }) {
  const discovery = calculateDiscoveryScore(account);
  const opportunity = calculateOpportunityScore(account);
  const risk = calculateRiskScore(account);
  const inputs = account.scoreInputs || {};

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Value & Risk Scoring</h2>
        <p className="mt-2 text-sm text-slate-500">
          Evaluate discovery strength, business impact, and risks using discovery evidence only.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={CheckCircle2} label="Discovery readiness" value={discovery.total} tone="blue" />
        <SummaryCard icon={Compass} label="Opportunity score" value={opportunity.total} tone="emerald" />
        <SummaryCard icon={AlertTriangle} label="Risk score" value={risk.total} tone="orange" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 flex items-center font-bold text-slate-900">
            <Gauge className="mr-2 h-4 w-4 text-blue-600" />
            Business Value Dimensions
          </h3>
          <div className="space-y-5">
            {businessDimensions.map((dimension) => (
              <ScoreBar
                key={dimension.key}
                label={dimension.label}
                value={Math.min(dimension.max, inputs[dimension.source] ?? 7)}
                max={dimension.max}
                tone={dimension.key === 'security' || dimension.key === 'competitive' ? 'orange' : 'blue'}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold text-slate-900">Risk Signals</h3>
          <div className="space-y-3">
            {risk.risks.map((riskItem) => (
              <div
                key={riskItem.label}
                className={`rounded-lg border p-4 ${
                  riskItem.weight > 0 ? 'border-orange-100 bg-orange-50 text-orange-950' : 'border-emerald-100 bg-emerald-50 text-emerald-950'
                }`}
              >
                <p className="font-semibold">{riskItem.label}</p>
                {riskItem.weight > 0 && <p className="mt-1 text-xs opacity-80">Risk weight {riskItem.weight}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Executive Discovery Narrative</h3>
        <p className="text-sm leading-7 text-slate-700">{account.executiveNarrative}</p>
      </div>
    </section>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
  }[tone];

  return (
    <div className={`rounded-xl border p-5 ${toneClass}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}
