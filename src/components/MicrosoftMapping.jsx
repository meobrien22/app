import { Map, MoveRight } from 'lucide-react';
import { calculateAddOnFit } from '../utils/scoring';

export default function MicrosoftMapping({ account }) {
  const topAddOns = calculateAddOnFit(account).slice(0, 6);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Microsoft Mapping</h2>
        <p className="mt-2 text-sm text-slate-500">Connect customer discovery signals to Microsoft motions using pains, stakeholders, and trigger evidence.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center font-bold text-slate-900">
          <Map className="mr-2 h-4 w-4 text-blue-600" />
          Discovery Signal to Motion
        </h3>
        <div className="grid gap-4">
          {topAddOns.map((addOn) => (
            <div key={addOn.name} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[0.8fr_auto_1.2fr] md:items-center">
              <div>
                <p className="font-bold text-slate-950">{addOn.name}</p>
                <p className="text-xs text-slate-500">{addOn.category}</p>
              </div>
              <MoveRight className="hidden h-4 w-4 text-slate-400 md:block" />
              <p className="text-sm leading-6 text-slate-700">{addOn.discoveryQuestion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
