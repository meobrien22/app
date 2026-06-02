import { ClipboardList } from 'lucide-react';
import { getRunningDiscoveryPlan } from '../utils/scoring';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export default function RunningPlan({ account, compact = false }) {
  const { keywordTally, dynamicTeamMembers, stakeholderMeetings, scheduledMeetings, workshopPlan } = useDiscoveryStore();
  const plan = getRunningDiscoveryPlan(account, keywordTally, dynamicTeamMembers, stakeholderMeetings, scheduledMeetings, workshopPlan);

  return (
    <div className={compact ? '' : 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm'}>
      <h3 className="mb-4 flex items-center font-bold text-slate-900">
        <ClipboardList className="mr-2 h-4 w-4 text-blue-600" />
        Running Discovery Plan
      </h3>
      <div className="space-y-3">
        {plan.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
