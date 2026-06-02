import { MessageSquareText, Plus } from 'lucide-react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

const stakeholderKey = (stakeholder) => `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function StakeholderMap({ account, onNavigate }) {
  const { setActiveStakeholder, improvePersonaFromStakeholder } = useDiscoveryStore();

  const handleSimulate = (stakeholder) => {
    setActiveStakeholder(stakeholderKey(stakeholder));
    improvePersonaFromStakeholder(stakeholder, account);
    onNavigate?.('stakeholderDiscovery');
  };

  return (
    <section className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stakeholder Map & Simulator</h2>
          <p className="mt-2 text-sm text-slate-500">Track influence, sentiment, and persona-specific discovery guidance.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Stakeholder
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4 font-bold text-slate-600">Name & Role</th>
              <th className="p-4 font-bold text-slate-600">Influence</th>
              <th className="p-4 font-bold text-slate-600">Sentiment</th>
              <th className="p-4 font-bold text-slate-600">Discovery Guidance</th>
              <th className="p-4 font-bold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {account.stakeholders.map((stakeholder) => (
              <tr key={`${stakeholder.name}-${stakeholder.role}`}>
                <td className="p-4">
                  <div className="font-bold text-slate-950">{stakeholder.name}</div>
                  <div className="text-xs text-slate-500">{stakeholder.role}</div>
                </td>
                <td className="p-4">
                  <span className="rounded bg-purple-100 px-2 py-1 text-[10px] font-bold uppercase text-purple-700">
                    {stakeholder.influence}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{stakeholder.sentiment}</td>
                <td className="max-w-xs p-4 italic text-slate-600">
                  {getStakeholderGuidance(stakeholder, account)}
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => handleSimulate(stakeholder)}
                    className="flex items-center gap-2 rounded border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                    Simulate Discovery
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function getStakeholderGuidance(stakeholder, account) {
  if (stakeholder.influence === 'Economic Buyer') {
    return `Clarify decision criteria for ${account.selectedPains[0]?.toLowerCase() || 'the primary pain'}.`;
  }
  if (stakeholder.influence === 'Technical Owner') {
    return 'Validate governance, integration, adoption, and security requirements.';
  }
  if (stakeholder.influence === 'Business Owner') {
    return 'Capture workflow examples, operational friction, and success signals.';
  }
  return 'Confirm influence, concerns, and what a useful next step would look like.';
}
