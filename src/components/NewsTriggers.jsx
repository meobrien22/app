import { FileText, ScanSearch } from 'lucide-react';
import { buildPersonaUpdate, personaIdFromRole } from '../data/personaData';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { buildTriggerArticles } from '../utils/triggerSignals';

export default function NewsTriggers({ account }) {
  const { companyName, industry, personaLibrary } = useDiscoveryStore();
  const triggerArticles = buildTriggerArticles(account);
  const stakeholderUpdates = (account?.stakeholders ?? []).map((stakeholder) => {
    const persona = personaLibrary[personaIdFromRole(stakeholder.role)] ?? Object.values(personaLibrary)[0];
    return {
      stakeholder,
      persona,
      update: buildPersonaUpdate(account, persona),
    };
  });

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">News & Business Triggers</h2>
          <p className="mt-1 text-sm text-slate-500">
            Convert account signals into discovery questions, motion guidance, and stakeholder hypotheses.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          <ScanSearch className="h-4 w-4" />
          Run AI Scan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-800">Latest News-Style Signals</h3>
          <div className="space-y-4">
            {triggerArticles.map((article) => (
              <div key={article.id} className="rounded-r-lg border-l-4 border-orange-500 bg-orange-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                    {article.type}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {article.updated}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-slate-950">{article.headline}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                <p className="mt-3 rounded-md bg-white/80 p-3 text-sm font-semibold text-orange-950">{article.aeImpact}</p>
                <p className="mt-3 text-sm font-bold text-slate-700">Ask: {article.question}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center font-bold text-blue-950">
            <FileText className="mr-2 h-4 w-4" />
            AI-Drafted Executive Narrative
          </h3>
          <p className="border-l-2 border-blue-300 pl-3 text-sm leading-6 text-slate-700">
            Given {companyName || 'this account'}'s commitment to AI efficiency in {industry.toLowerCase()},
            Microsoft ME7 provides the secure transformation layer required to deploy custom Copilot agents
            safely across critical workflows.
          </p>
          <button className="mt-5 w-full rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 transition hover:bg-blue-50">
            Generate Discovery Narrative
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Persona-Based Customer Updates</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {stakeholderUpdates.map(({ stakeholder, persona, update }) => (
            <div key={`${stakeholder.name}-${stakeholder.role}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{persona.role} angle</p>
              <h4 className="mt-2 font-bold text-slate-950">{stakeholder.name}</h4>
              <p className="text-xs text-slate-500">{stakeholder.role}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{update.news}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{update.renewal}</p>
              <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
                {update.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
