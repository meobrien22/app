export default function ConstructionZoneBanner({ onOpenStageOne, onNavigate }) {
  const links = [
    { label: 'Account dashboard', page: 'dashboard' },
    { label: 'Personas', page: 'personas' },
    { label: 'V-Team Plan', page: 'vteam' },
    { label: 'Partners', page: 'partners' },
    { label: 'Executive Summary', page: 'summary' },
  ];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">This page is under construction</p>
      <h2 className="mt-2 text-2xl font-bold text-amber-950">This is the start of the scale story.</h2>
      <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-amber-950">
        The live pages show how this app can help an AE scale better discovery, persona coaching, V-Team planning,
        partner execution, and executive summaries across customers. These later MCEM stages will be built next.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {onOpenStageOne && (
          <button
            type="button"
            onClick={onOpenStageOne}
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Open live Stage 1 discovery
          </button>
        )}
        {links.map((link) => (
          <button
            key={link.page}
            type="button"
            onClick={() => onNavigate?.(link.page)}
            className="rounded-md border border-amber-200 bg-white px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
