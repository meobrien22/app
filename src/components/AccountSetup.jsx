import { useState } from 'react';
import { Cloud, Loader2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../supabaseClient';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { painOptions } from '../data/discoveryData';

export default function AccountSetup() {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    companyName,
    setCompanyName,
    industry,
    setIndustry,
    currentMotion,
    targetMotion,
    setMotions,
    estimatedUsers,
    setEstimatedUsers,
    triggerScore,
    setTriggerScore,
    selectedPains,
    togglePain,
    contractStatus,
    renewalWindow,
    satisfactionLevel,
    procurementInvolved,
    businessCaseNeeded,
    setContractContext,
  } = useDiscoveryStore();

  const handleSaveToCloud = async () => {
    if (!companyName.trim()) {
      setStatusMessage('Enter a company name first.');
      return;
    }

    if (!isSupabaseConfigured) {
      setStatusMessage('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsSaving(true);
    setStatusMessage('');

    const { error } = await supabase.from('accounts').insert([
      {
        company_name: companyName.trim(),
        industry,
        current_m365_level: currentMotion,
        estimated_user_count: Number(estimatedUsers),
      },
    ]);

    setIsSaving(false);
    if (error) {
      const rlsHint = error.message.includes('row-level security')
        ? ' Run supabase/rls-prototype.sql in the Supabase SQL Editor for the current browser-only prototype.'
        : '';

      setStatusMessage(`Database error: ${error.message}.${rlsHint}`);
      return;
    }

    setStatusMessage(`${companyName.trim()} context was saved to Supabase.`);
  };

  return (
    <section className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Account Setup</h2>
        <p className="mt-2 text-sm text-slate-500">
          Initialize a customer profile and capture non-financial discovery context.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Company Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="e.g., Contoso Manufacturing"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Industry Vertical</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Public Sector">Public Sector</option>
                <option value="Software">Software</option>
                <option value="Consumer Goods">Consumer Goods</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Estimated Users</label>
              <input
                type="number"
                min="1"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
                value={estimatedUsers}
                onChange={(event) => setEstimatedUsers(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Current Motion</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
                value={currentMotion}
                onChange={(event) => setMotions(event.target.value, targetMotion)}
              >
                <option value="ME3">ME3</option>
                <option value="ME5">ME5</option>
                <option value="ME7">ME7</option>
                <option value="Copilot">Copilot</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Target Motion</label>
              <input
                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
                value={targetMotion}
                onChange={(event) => setMotions(currentMotion, event.target.value)}
                placeholder="e.g., ME5 + Copilot readiness"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase text-slate-500">Trigger Score</label>
            <input
              type="range"
              min="1"
              max="10"
              value={triggerScore}
              onChange={(event) => setTriggerScore(Number(event.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="mt-2 text-right text-sm font-bold text-orange-600">{triggerScore}/10</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 font-bold text-slate-900">Current Contract Context</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <ContextSelect label="Status" value={contractStatus} onChange={(value) => setContractContext({ contractStatus: value })} options={['Discovery before renewal', 'Adoption review', 'Competitive review', 'Early discovery', 'Expansion discovery']} />
              <ContextSelect label="Renewal Window" value={renewalWindow} onChange={(value) => setContractContext({ renewalWindow: value })} options={['Unknown', '1 quarter', '2 quarters', '3 quarters', '4 quarters']} />
              <ContextSelect label="Satisfaction" value={satisfactionLevel} onChange={(value) => setContractContext({ satisfactionLevel: value })} options={['Unknown', 'Positive', 'Mixed', 'Cautious']} />
              <ContextSelect label="Procurement" value={procurementInvolved} onChange={(value) => setContractContext({ procurementInvolved: value })} options={['Unknown', 'Known', 'Not involved yet']} />
              <ContextSelect label="Business Case" value={businessCaseNeeded} onChange={(value) => setContractContext({ businessCaseNeeded: value })} options={['Unknown', 'Needed', 'Likely', 'Not yet']} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 font-bold text-slate-900">Discovery Pains</h3>
            <div className="flex flex-wrap gap-2">
              {painOptions.map((pain) => (
                <button
                  key={pain}
                  onClick={() => togglePain(pain)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedPains.includes(pain)
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pain}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSaveToCloud}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4" />}
          Save Account Context to Supabase
        </button>

        {statusMessage && (
          <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{statusMessage}</p>
        )}
      </div>
    </section>
  );
}

function ContextSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase text-slate-500">{label}</label>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
