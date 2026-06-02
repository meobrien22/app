import { Filter, Lightbulb } from 'lucide-react';
import { painOptions } from '../data/discoveryData';
import { calculateAddOnFit } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import ScoreBar from './ScoreBar';

const keywordOptions = [
  'ai productivity',
  'dashboards',
  'endpoint risk',
  'identity',
  'meeting intelligence',
  'manual process',
  'data governance',
  'frontline devices',
  'adoption',
  'security operations',
];

export default function AddOnFitScoring({ account }) {
  const { selectedPains, selectedKeywords, togglePain, toggleKeyword } = useDiscoveryStore();
  const addOns = calculateAddOnFit(account);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add-On Fit & Discovery Scoring</h2>
          <p className="mt-2 text-sm text-slate-500">
            Score Microsoft add-on relevance from pains, personas, triggers, current tools, and keywords.
          </p>
        </div>
        <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          Top fit: {addOns[0].name} {addOns[0].score}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-bold text-slate-900">
              <Filter className="mr-2 h-4 w-4 text-blue-600" />
              Discovery Pains
            </h3>
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

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Keywords Heard</h3>
            <div className="flex flex-wrap gap-2">
              {keywordOptions.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedKeywords.includes(keyword)
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold text-slate-900">Add-On Fit Ranking</h3>
          <div className="grid gap-5 md:grid-cols-2">
            {addOns.map((addOn) => (
              <div key={addOn.name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <ScoreBar label={addOn.name} value={addOn.score} tone={addOn.score >= 80 ? 'emerald' : 'blue'} detail={addOn.category} />
                <div className="mt-4 rounded-md bg-white p-3">
                  <p className="flex items-center text-xs font-bold uppercase text-slate-500">
                    <Lightbulb className="mr-1 h-3.5 w-3.5 text-orange-500" />
                    Discovery prompt
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{addOn.discoveryQuestion}</p>
                  {addOn.evidence.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">{addOn.evidence.join(' | ')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
