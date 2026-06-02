import { ArrowRight, CalendarDays, Newspaper, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { priorityAccounts } from '../data/portfolioData';
import { calculateOpportunityScore, calculateRiskScore } from '../utils/scoring';
import { savePortfolioDailyUpdate } from '../utils/persistence';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function PortfolioPulse({ onOpenAccount }) {
  const [saveStatus, setSaveStatus] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const { annualQuota, dailyUpdateNotes, addDailyUpdateNote } = useDiscoveryStore();
  const strongAccounts = priorityAccounts.filter((account) => calculateOpportunityScore(account).total >= 82);
  const riskAccounts = priorityAccounts
    .map((account) => ({ account, risk: calculateRiskScore(account).total }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3);
  const impliedPipeline = strongAccounts.length * 1150000;
  const quotaCoverage = Math.min(100, Math.round((impliedPipeline / annualQuota) * 100));
  const dailyUpdates = buildDailyUpdates(strongAccounts, riskAccounts);
  const noteText = 'Manual AE note: review persona messaging, renewal timing, and next discovery ask today.';

  const handleSaveDailyNote = async () => {
    try {
      setIsSavingNote(true);
      setSaveStatus('');
      const result = await savePortfolioDailyUpdate({
        annualQuota,
        impliedPipeline,
        quotaCoverage,
        noteText,
        dailyUpdates,
      });
      addDailyUpdateNote(`${noteText} Saved to Supabase update ${result.portfolio_update_id}.`);
      setSaveStatus('Saved daily AE note to Supabase.');
    } catch (error) {
      const rlsHint = error.message.includes('row-level security') || error.message.includes('portfolio_daily_updates')
        ? ' Run supabase/schema.sql and supabase/rls-prototype.sql in Supabase, then try again.'
        : '';
      setSaveStatus(`Save failed: ${error.message}.${rlsHint}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center font-bold text-slate-900">
          <Target className="mr-2 h-4 w-4 text-emerald-600" />
          Quota Command View
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <QuotaTile label="Annual quota" value={currency.format(annualQuota)} />
          <QuotaTile label="Discovery-weighted pipeline" value={currency.format(impliedPipeline)} />
          <QuotaTile label="Coverage signal" value={`${quotaCoverage}%`} />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This is a seller-side quota view. It uses discovery strength, trigger quality, and account readiness to prioritize where to spend time next.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center font-bold text-slate-900">
          <CalendarDays className="mr-2 h-4 w-4 text-blue-600" />
          Daily Account Updates
        </h3>
        <div className="space-y-3">
          {dailyUpdates.map((update) => (
            <div
              key={update.account.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
                <Newspaper className="mr-1 h-3.5 w-3.5" />
                {update.type}
              </p>
              <p className="mt-1 font-bold text-slate-950">{update.account.name}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{update.message}</p>
              <button
                type="button"
                onClick={() => onOpenAccount(update.account.id)}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                Open account
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {dailyUpdateNotes.map((note) => (
            <div key={note.id} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
              {note.text}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSaveDailyNote}
          disabled={isSavingNote}
          className="mt-4 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {isSavingNote ? 'Saving Daily AE Note...' : 'Add Daily AE Note'}
        </button>
        {saveStatus && (
          <p className={`mt-3 rounded-lg border p-3 text-xs leading-5 ${
            saveStatus.startsWith('Saved') ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-orange-100 bg-orange-50 text-orange-900'
          }`}>
            {saveStatus}
          </p>
        )}
      </div>
    </div>
  );
}

function QuotaTile({ label, value }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{label}</p>
      <p className="mt-2 text-xl font-bold text-emerald-950">{value}</p>
    </div>
  );
}

function buildDailyUpdates(strongAccounts, riskAccounts) {
  const strong = strongAccounts.slice(0, 2).map((account) => ({
    type: 'Momentum',
    account,
    message: `${account.industry} discovery has strong opportunity signal. Focus the next touch on ${account.selectedPains[0]?.toLowerCase()} and persona-specific proof.`,
  }));
  const risks = riskAccounts.slice(0, 2).map(({ account }) => ({
    type: 'Risk watch',
    account,
    message: `${account.name} has discovery risk to clean up. Confirm renewal path, stakeholder ownership, and the next meeting outcome.`,
  }));

  return [...strong, ...risks].slice(0, 4);
}
