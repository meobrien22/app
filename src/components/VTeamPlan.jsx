import { Plus, Trash2, UserPlus, UsersRound } from 'lucide-react';
import { getSuggestedTeamMembers } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function VTeamPlan({ account }) {
  const { dynamicTeamMembers, addTeamMember, updateTeamMember, removeTeamMember, stakeholderMeetings, keywordTally } = useDiscoveryStore();
  const uniqueTeamMembers = dedupeTeamMembers(dynamicTeamMembers);
  const suggestions = getSuggestedTeamMembers(account, uniqueTeamMembers, stakeholderMeetings, keywordTally);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Microsoft V-Team Builder</h2>
          <p className="mt-2 text-sm text-slate-500">Add the people needed, define their role, and state what they will do for the customer.</p>
        </div>
        <button
          onClick={() => addTeamMember()}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Add Person
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-5 flex items-center font-bold text-slate-900">
            <UsersRound className="mr-2 h-4 w-4 text-blue-600" />
            Active Team
          </h3>
          <div className="space-y-4">
            {uniqueTeamMembers.map((member) => (
              <div key={member.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 md:grid-cols-[0.8fr_0.8fr_auto]">
                  <input
                    value={member.name}
                    onChange={(event) => updateTeamMember(member.id, { name: event.target.value })}
                    className="rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    placeholder="Person name"
                  />
                  <input
                    value={member.role}
                    onChange={(event) => updateTeamMember(member.id, { role: event.target.value })}
                    className="rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                    placeholder="Role"
                  />
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${member.role}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={member.customerAction}
                  onChange={(event) => updateTeamMember(member.id, { customerAction: event.target.value })}
                  className="mt-3 min-h-20 w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-blue-500"
                  placeholder="What this person will do for the customer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6">
            <h3 className="mb-4 font-bold text-emerald-950">Suggested People to Add</h3>
            <p className="mb-4 text-sm leading-6 text-emerald-900">
              Recommendations are based on discovery answers, repeated customer language, stakeholder coverage, and the strongest Microsoft fit signals.
            </p>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.role}
                  onClick={() => addTeamMember(suggestion)}
                  className="w-full rounded-lg border border-emerald-100 bg-white p-4 text-left transition hover:border-emerald-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="flex items-center font-bold text-slate-900">
                      <Plus className="mr-2 h-4 w-4 text-emerald-600" />
                      {suggestion.role}
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{suggestion.customerAction}</p>
                  <p className="mt-3 rounded-md bg-emerald-50 p-2 text-xs font-semibold leading-5 text-emerald-950">{suggestion.reason}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">When to bring them in</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{suggestion.customerMoment}</p>
                  {suggestion.evidence?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestion.evidence.slice(0, 3).map((item) => (
                        <span key={item} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">Customer Coverage Check</h3>
            <div className="space-y-3">
              {uniqueTeamMembers.map((member) => (
                <p key={`${member.id}-coverage`} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  <span className="font-semibold">{member.name || member.role}:</span> {formatCoverageAction(member)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function dedupeTeamMembers(members = []) {
  const seen = new Set();
  return members.filter((member) => {
    const key = String(member.role ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatCoverageAction(member) {
  const role = member.role ?? '';
  const action = member.customerAction ?? '';
  if (!/support the discovery motion/i.test(action)) return action;
  if (/ae/i.test(role)) return 'Own the customer point of view, confirm the mutual next step, and keep the account narrative inspection-ready.';
  if (/modern work|ssp/i.test(role)) return 'Translate productivity, collaboration, and adoption signals into a customer-ready Microsoft motion.';
  if (/technical/i.test(role)) return 'Define the proof path, demo boundaries, technical blockers, and feasibility questions before the next customer meeting.';
  if (/partner/i.test(role)) return 'Identify whether a partner is needed for delivery capacity, packaged SMB motion, or customer workshop support.';
  return 'Own a specific customer-facing deliverable, not just internal advice.';
}
