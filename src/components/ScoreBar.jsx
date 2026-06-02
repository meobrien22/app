const toneClasses = {
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-600',
  slate: 'bg-slate-500',
};

export default function ScoreBar({ label, value, max = 100, tone = 'blue', detail }) {
  const width = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="shrink-0 font-bold text-slate-950">
          {value}
          {max !== 100 ? `/${max}` : ''}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`${toneClasses[tone] ?? toneClasses.blue} h-full rounded-full`} style={{ width: `${width}%` }} />
      </div>
      {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  );
}
