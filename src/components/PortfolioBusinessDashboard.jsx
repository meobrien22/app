import { BarChart3, CalendarClock, Handshake, LineChart, Network, RadioTower, Target, Users, Zap } from 'lucide-react';
import { executiveRoles, partnerEcosystem, calculateExecutiveCoverage, getAiReadiness, getRenewalMilestones } from '../data/mcemData';
import { horizontalTrends, priorityAccounts, trendSources, verticalTrends } from '../data/portfolioData';
import { calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import ScoreBar from './ScoreBar';

export default function PortfolioBusinessDashboard({ onOpenAccount }) {
  const portfolio = priorityAccounts.map((account) => {
    const opportunity = calculateOpportunityScore(account).total;
    const risk = calculateRiskScore(account).total;
    const execCoverage = calculateExecutiveCoverage(account);
    const coverage = execCoverage.score;
    const aiReadinessAreas = getAiReadiness(account);
    const aiReadiness = Math.round(aiReadinessAreas.reduce((sum, item) => sum + item.score, 0) / aiReadinessAreas.length);

    return { account, opportunity, risk, coverage, coverageRoles: execCoverage.roles, aiReadiness, aiReadinessAreas };
  });
  const portfolioSize = portfolio.length;
  const verticalCount = new Set(portfolio.map(({ account }) => account.industry)).size;
  const avgCoverage = Math.round(portfolio.reduce((sum, item) => sum + item.coverage, 0) / portfolio.length);
  const avgAi = Math.round(portfolio.reduce((sum, item) => sum + item.aiReadiness, 0) / portfolio.length);
  const atRisk = portfolio.filter((item) => item.risk >= 30).length;
  const actNow = portfolio.filter(({ account }) => account.portfolioCategory === 'Act now').length;
  const renewalWatch = portfolio.filter(({ account }) => ['1 quarter', '6 months', '2 quarters'].includes(account.contractContext?.renewalWindow)).length;
  const highGrowth = portfolio.filter((item) => item.opportunity >= 85).length;
  const executiveGaps = portfolio.filter((item) => item.coverage < 80).length;
  const aiReady = portfolio.filter((item) => item.aiReadiness >= 78).length;
  const partnerLed = portfolio.filter(({ account }) => (account.vTeam ?? []).some((role) => role.toLowerCase().includes('partner'))).length;
  const executiveReady = portfolio.filter((item) => item.coverageRoles.filter((role) => role.status === 'Green').length >= 4).length;
  const roleCoverageCounts = executiveRoles.reduce((counts, role) => ({
    ...counts,
    [role]: portfolio.filter((item) => item.coverageRoles.some((coverageRole) => coverageRole.role === role && coverageRole.status === 'Green')).length,
  }), {});
  const aiLaneAverages = ['Data', 'Security', 'Governance', 'Change'].reduce((averages, area) => ({
    ...averages,
    [area]: Math.round(
      portfolio.reduce((sum, item) => sum + (item.aiReadinessAreas.find((lane) => lane.area === area)?.score ?? 0), 0) / portfolioSize,
    ),
  }), {});
  const aiBlocked = portfolio.filter((item) => item.aiReadiness < 65).length;
  const strongestAiLane = Object.entries(aiLaneAverages).sort((a, b) => b[1] - a[1])[0];
  const weakestAiLane = Object.entries(aiLaneAverages).sort((a, b) => a[1] - b[1])[0];
  const executiveGapWatchlist = portfolio
    .filter((item) => item.coverage < 80)
    .sort((a, b) => (b.risk + (100 - b.coverage)) - (a.risk + (100 - a.coverage)))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Portfolio Tracking Snapshot</p>
            <h3 className="mt-1 text-xl font-bold text-slate-950">Where the business needs attention this week</h3>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {portfolioSize} accounts tracked across {verticalCount} SMB verticals
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <PortfolioMetric icon={Zap} label="This-week focus" value={`${actNow}/${portfolioSize}`} detail="Next touches prioritized" progress={Math.round((actNow / portfolioSize) * 100)} tone="blue" />
          <PortfolioMetric icon={CalendarClock} label="Renewal tracker" value={`${renewalWatch}/${portfolioSize}`} detail="T-180 / T-90 watchlist" progress={Math.round((renewalWatch / portfolioSize) * 100)} tone="orange" />
          <PortfolioMetric icon={LineChart} label="Growth plays" value={`${highGrowth}/${portfolioSize}`} detail="85+ opportunity signal" progress={Math.round((highGrowth / portfolioSize) * 100)} tone="emerald" />
          <PortfolioMetric
            icon={Users}
            label="Exec access map"
            value={`${avgCoverage}%`}
            detail={`${executiveReady} accounts have 4+ leaders mapped`}
            progress={avgCoverage}
            tone="amber"
            highlights={[
              `${roleCoverageCounts.CEO}/${portfolioSize} CEO`,
              `${roleCoverageCounts.CFO}/${portfolioSize} CFO`,
              `${roleCoverageCounts.CIO}/${portfolioSize} CIO`,
              `${executiveGaps} gaps`,
            ]}
          />
          <PortfolioMetric
            icon={Target}
            label="AI adoption path"
            value={`${avgAi}%`}
            detail={`${aiReady} ready now, ${aiBlocked} need readiness work`}
            progress={avgAi}
            tone="blue"
            highlights={[
              `Best: ${strongestAiLane[0]} ${strongestAiLane[1]}%`,
              `Fix: ${weakestAiLane[0]} ${weakestAiLane[1]}%`,
              `Governance ${aiLaneAverages.Governance}%`,
            ]}
          />
          <PortfolioMetric icon={Handshake} label="Partner motion" value={`${partnerLed}/${portfolioSize}`} detail="Channel support attached" progress={Math.round((partnerLed / portfolioSize) * 100)} tone="emerald" />
        </div>
      </div>

      <DashboardCard icon={Users} title="Executive Gap Watchlist">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-600">
              Accounts where missing executive access could slow discovery, renewal alignment, or MCEM progression.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            {executiveGaps} accounts below 80% coverage
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {executiveGapWatchlist.map((item) => {
            const missingRoles = getMissingExecutiveRoles(item.coverageRoles);
            const reasons = getExecutiveGapReasons(item);

            return (
              <div key={item.account.id} className="rounded-lg border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Coverage {item.coverage}%</p>
                    <h4 className="mt-1 font-bold text-slate-950">{item.account.name}</h4>
                    <p className="text-xs text-slate-500">{item.account.industry}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAccount(item.account.id)}
                    className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Open account dashboard
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {missingRoles.map((role) => (
                    <span key={role} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-amber-800">
                      Missing {role}
                    </span>
                  ))}
                </div>

                <div className="mt-3 space-y-1">
                  {reasons.map((reason) => (
                    <p key={reason} className="text-xs font-semibold text-slate-600">{reason}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard icon={BarChart3} title="Top 50 Account Priority Stack">
          <div className="max-h-[620px] overflow-y-auto pr-1">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-2">Rank</th>
                  <th className="py-2 pr-2">Account</th>
                  <th className="py-2 pr-2">Priority</th>
                  <th className="py-2 pr-2">Renewal</th>
                  <th className="py-2 pl-2">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {portfolio.slice(0, 50).map(({ account, opportunity, risk }) => (
                  <tr key={account.id}>
                    <td className="py-3 pr-2 text-xs font-bold text-slate-500">#{account.priorityRank}</td>
                    <td className="py-3 pr-2">
                      <button type="button" onClick={() => onOpenAccount(account.id)} className="font-bold text-slate-950 hover:text-blue-700">
                        {account.name}
                      </button>
                      <p className="text-xs text-slate-500">{account.industry}</p>
                    </td>
                    <td className="py-3 pr-2">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${account.portfolioCategory === 'Act now' ? 'bg-blue-100 text-blue-700' : account.portfolioCategory === 'High growth' ? 'bg-emerald-100 text-emerald-700' : account.portfolioCategory === 'Competitive' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {account.portfolioCategory}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-xs text-slate-600">{account.contractContext.renewalWindow}</td>
                    <td className="py-3 pl-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${risk >= 42 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${opportunity}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard icon={Users} title="Executive Coverage Dashboard">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-3">Account</th>
                  {executiveRoles.map((role) => <th key={role} className="px-2 py-2">{role}</th>)}
                  <th className="py-2 pl-3">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
              {portfolio.slice(0, 10).map(({ account }) => {
                  const coverage = calculateExecutiveCoverage(account);
                  return (
                    <tr key={account.id}>
                      <td className="py-3 pr-3">
                        <button type="button" onClick={() => onOpenAccount(account.id)} className="font-bold text-slate-950 hover:text-blue-700">
                          {account.name}
                        </button>
                      </td>
                      {coverage.roles.map((item) => (
                        <td key={item.role} className="px-2 py-3">
                          <StatusDot status={item.status} />
                        </td>
                      ))}
                      <td className="py-3 pl-3 font-bold text-slate-800">{coverage.score}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard icon={LineChart} title="Priority Score Chart">
          <div className="space-y-4">
            {portfolio.slice(0, 8).map(({ account, opportunity }) => (
              <div key={account.id}>
                <div className="mb-1 flex justify-between text-xs font-bold text-slate-600">
                  <span>{account.name}</span>
                  <span>{opportunity >= 85 ? 'High' : opportunity >= 75 ? 'Medium' : 'Developing'} growth</span>
                </div>
                <ScoreBar label="Opportunity gap signal" value={opportunity} tone="emerald" />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard icon={RadioTower} title="Industry Trend Dashboard">
          <div className="space-y-3">
            {verticalTrends.map((trend) => (
              <div key={trend.trend} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{trend.vertical}</p>
                <p className="mt-1 font-bold text-slate-950">{trend.trend}</p>
                <p className="mt-2 text-sm text-blue-700">{trend.motion}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard icon={CalendarClock} title="Renewal War Room">
          <div className="space-y-3">
            {portfolio.slice(0, 5).map(({ account, risk }) => (
              <button key={account.id} type="button" onClick={() => onOpenAccount(account.id)} className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50">
                <p className="font-bold text-slate-950">{account.name}</p>
                <p className="mt-1 text-xs text-slate-500">Renewal: {account.contractContext.renewalWindow}</p>
                <p className={`mt-2 text-xs font-bold ${risk >= 30 ? 'text-orange-700' : 'text-emerald-700'}`}>
                  Risk {risk >= 30 ? 'watch' : 'managed'}
                </p>
              </button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard icon={LineChart} title="AI Transformation Dashboard">
          <div className="space-y-4">
            {horizontalTrends.map((trend) => (
              <ScoreBar key={trend.category} label={trend.category} value={trend.score} tone={trend.score >= 84 ? 'emerald' : 'blue'} detail={trend.signal} />
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500 shadow-sm">
        Trend basis: {trendSources.join(' | ')}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardCard icon={Handshake} title="Partner Impact Dashboard">
          <div className="grid gap-3 md:grid-cols-2">
            {partnerEcosystem.map((partner) => (
              <div key={partner.need} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-bold text-slate-950">{partner.need}</p>
                <p className="mt-1 text-sm text-slate-600">{partner.partner}</p>
                <p className="mt-2 text-xs font-semibold text-emerald-700">{partner.motion}</p>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard icon={Network} title="EBR and Internal Leadership Tracker">
          <div className="grid gap-3 md:grid-cols-2">
            {portfolio.slice(0, 4).map(({ account }) => {
              const milestones = getRenewalMilestones(account);
              return (
                <div key={account.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-bold text-slate-950">{account.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Next EBR: next quarter</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {milestones.map((item) => (
                      <span key={item.label} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                        {item.label} {item.health}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function DashboardCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center font-bold text-slate-900">
        <Icon className="mr-2 h-4 w-4 text-blue-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function PortfolioMetric({ icon: Icon, label, value, detail, progress, highlights = [], tone = 'blue' }) {
  const toneClass = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
  }[tone];

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="mt-2 text-xs font-semibold opacity-80">{detail}</p>
      {highlights.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {highlights.map((highlight) => (
            <span key={highlight} className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-700">
              {highlight}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
        <div className="h-full rounded-full bg-current" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  );
}

function getMissingExecutiveRoles(coverageRoles) {
  return coverageRoles.filter((role) => role.status !== 'Green').map((role) => role.role);
}

function getExecutiveGapReasons(item) {
  const reasons = [];
  const missingRoles = getMissingExecutiveRoles(item.coverageRoles);
  const renewalWindow = item.account.contractContext?.renewalWindow ?? 'unknown';

  if (missingRoles.length) reasons.push(`Executive map gap: ${missingRoles.join(', ')} not confirmed.`);
  if (['1 quarter', '6 months', '2 quarters'].includes(renewalWindow)) reasons.push(`Renewal timing is close: ${renewalWindow}.`);
  if (item.account.contractContext?.procurement === 'Unknown') reasons.push('Procurement path still unknown.');
  if ((item.account.objections ?? []).length) reasons.push(`Open objection: ${item.account.objections[0]}`);
  if (item.risk >= 30) reasons.push(`Risk score ${item.risk}: needs tighter sponsor and next-step control.`);

  return reasons.slice(0, 4);
}

function StatusDot({ status }) {
  const color = {
    Green: 'bg-emerald-500',
    Yellow: 'bg-amber-400',
    Red: 'bg-red-500',
  }[status];

  return <span className={`inline-block h-3 w-3 rounded-full ${color}`} title={status} />;
}
