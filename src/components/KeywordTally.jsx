import { Hash, Plus, Sparkles } from 'lucide-react';
import { getKeywordTallyList, getSuggestedKeywords } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function KeywordTally({ account, compact = false }) {
  const { keywordTally, recordKeyword } = useDiscoveryStore();
  const tally = getKeywordTallyList(keywordTally);
  const suggestions = getSuggestedKeywords(account, keywordTally);

  return (
    <div className={compact ? '' : 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm'}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center font-bold text-slate-900">
          <Hash className="mr-2 h-4 w-4 text-blue-600" />
          Keyword Tally
        </h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {tally.reduce((total, item) => total + item.count, 0)} used
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tally.length ? (
          tally.slice(0, compact ? 8 : 16).map((item) => (
            <button
              key={item.keyword}
              onClick={() => recordKeyword(item.keyword)}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              title="Click to count this keyword again"
            >
              {item.keyword} <span className="text-blue-500">x{item.count}</span>
            </button>
          ))
        ) : (
          <p className="text-sm text-slate-500">No keywords captured yet.</p>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 flex items-center text-xs font-bold uppercase text-slate-500">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-emerald-600" />
          Suggested keywords
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((keyword) => (
            <button
              key={keyword}
              onClick={() => recordKeyword(keyword)}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Plus className="h-3 w-3" />
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
