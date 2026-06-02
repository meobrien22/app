import { CalendarClock, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

const stakeholderKey = (stakeholder) => `${stakeholder?.name ?? 'stakeholder'}-${stakeholder?.role ?? 'role'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function MeetingScheduler({ account }) {
  const { scheduledMeetings, scheduleMeeting, updateMeetingStatus } = useDiscoveryStore();
  const firstStakeholderKey = stakeholderKey(account.stakeholders[0]);
  const [draft, setDraft] = useState({
    stakeholderKey: firstStakeholderKey,
    title: 'Stakeholder discovery meeting',
    scheduledFor: '',
    objective: 'Complete seven-level discovery and confirm next-best action.',
  });

  const stakeholderOptions = useMemo(
    () => account.stakeholders.map((stakeholder) => ({ key: stakeholderKey(stakeholder), label: `${stakeholder.name} - ${stakeholder.role}`, stakeholder })),
    [account.stakeholders],
  );

  const handleSchedule = () => {
    const selected = stakeholderOptions.find((option) => option.key === draft.stakeholderKey) ?? stakeholderOptions[0];
    scheduleMeeting({
      ...draft,
      stakeholderName: selected.stakeholder.name,
      stakeholderRole: selected.stakeholder.role,
    });
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Meeting Scheduler</h2>
        <p className="mt-2 text-sm text-slate-500">Schedule stakeholder discovery meetings and feed each meeting into scoring and the running plan.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center font-bold text-slate-900">
            <CalendarClock className="mr-2 h-4 w-4 text-blue-600" />
            Schedule a Discovery Meeting
          </h3>
          <div className="space-y-4">
            <Field label="Stakeholder">
              <select
                value={draft.stakeholderKey}
                onChange={(event) => setDraft((value) => ({ ...value, stakeholderKey: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
              >
                {stakeholderOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Meeting Title">
              <input
                value={draft.title}
                onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
              />
            </Field>
            <Field label="Date and Time">
              <input
                type="datetime-local"
                value={draft.scheduledFor}
                onChange={(event) => setDraft((value) => ({ ...value, scheduledFor: event.target.value }))}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
              />
            </Field>
            <Field label="Objective">
              <textarea
                value={draft.objective}
                onChange={(event) => setDraft((value) => ({ ...value, objective: event.target.value }))}
                className="min-h-28 w-full resize-none rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
              />
            </Field>
            <button
              onClick={handleSchedule}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Meeting to Plan
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Scheduled Discovery Meetings</h3>
          <div className="space-y-3">
            {scheduledMeetings.length ? (
              scheduledMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-bold text-slate-950">{meeting.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{meeting.stakeholderName} - {meeting.stakeholderRole}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{meeting.objective}</p>
                    </div>
                    <button
                      onClick={() => updateMeetingStatus(meeting.id, meeting.status === 'Done' ? 'Scheduled' : 'Done')}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${
                        meeting.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {meeting.status}
                    </button>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">{meeting.scheduledFor || 'Time not set'}</p>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No meetings scheduled yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}
