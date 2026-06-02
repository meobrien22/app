import { calculateExecutiveCoverage } from '../data/mcemData';
import {
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
} from './scoring';

export const accountPriorityWeights = [
  {
    key: 'renewalTiming',
    label: 'Renewal timing',
    weight: 35,
    description: 'Biggest weight: near-term renewals and unclear renewal paths move to the top.',
  },
  {
    key: 'triggerStrength',
    label: 'Trigger strength',
    weight: 15,
    description: 'News, business events, executive signals, and urgent customer change.',
  },
  {
    key: 'opportunity',
    label: 'Microsoft fit',
    weight: 18,
    description: 'Strength of Microsoft motion and add-on signals.',
  },
  {
    key: 'discovery',
    label: 'Discovery quality',
    weight: 12,
    description: 'Pain clarity, next step, objections, and process clarity.',
  },
  {
    key: 'executiveAccess',
    label: 'Executive access',
    weight: 8,
    description: 'CEO, CFO, CIO, COO, and CISO coverage.',
  },
  {
    key: 'partnerReadiness',
    label: 'V-Team / partner path',
    weight: 7,
    description: 'Internal coverage and partner-led execution readiness.',
  },
  {
    key: 'riskPressure',
    label: 'Risk pressure',
    weight: 5,
    description: 'Unresolved gaps that should change the next AE action.',
  },
];

export function getAccountPriorityScore(account) {
  const discovery = calculateDiscoveryScore(account).total;
  const opportunity = calculateOpportunityScore(account).total;
  const risk = calculateRiskScore(account).total;
  const executiveAccess = calculateExecutiveCoverage(account).score;
  const renewalUrgency = getRenewalUrgency(account.contractContext?.renewalWindow);
  const triggerUrgency = Math.min(100, (account.triggerScore ?? 0) * 10);
  const partnerReadiness = getPartnerReadiness(account);
  const riskPressure = getRiskPressure(risk);

  const componentScores = {
    renewalTiming: renewalUrgency,
    triggerStrength: triggerUrgency,
    opportunity,
    discovery,
    executiveAccess,
    partnerReadiness,
    riskPressure,
  };

  const components = accountPriorityWeights.map((item) => ({
    ...item,
    score: Math.round(componentScores[item.key] ?? 0),
    contribution: Math.round(((componentScores[item.key] ?? 0) * item.weight) / 100),
  }));
  const total = components.reduce((sum, item) => sum + item.contribution, 0);

  return {
    total,
    category: getPriorityCategory(total, risk, renewalUrgency, triggerUrgency),
    action: getPriorityAction(total, risk, renewalUrgency, triggerUrgency),
    components,
    reasons: getPriorityReasons(account, components),
  };
}

function getRenewalUrgency(renewalWindow = '') {
  const value = renewalWindow.toLowerCase();
  if (value.includes('1 quarter') || value.includes('t-90')) return 96;
  if (value.includes('6 months') || value.includes('2 quarters') || value.includes('t-180')) return 84;
  if (value.includes('3 quarters')) return 70;
  if (value.includes('4 quarters') || value.includes('1 year')) return 58;
  if (value.includes('unknown')) return 72;
  return 62;
}

function getPartnerReadiness(account) {
  const team = account.vTeam ?? [];
  const hasPartner = team.some((role) => role.toLowerCase().includes('partner'));
  const hasSpecialist = team.some((role) => /ssp|specialist|technical|ts|csam/i.test(role));
  const base = Math.min(80, 42 + team.length * 12);
  return Math.min(100, base + (hasPartner ? 18 : 0) + (hasSpecialist ? 8 : 0));
}

function getRiskPressure(risk) {
  if (risk <= 5) return 58;
  if (risk <= 18) return 74;
  if (risk <= 34) return 88;
  return 96;
}

function getPriorityCategory(total, risk, renewalUrgency, triggerUrgency) {
  if (renewalUrgency >= 90) return 'Renewal now';
  if (triggerUrgency >= 90 || total >= 84) return 'Act this week';
  if (risk >= 30) return 'De-risk now';
  if (total >= 76) return 'Build momentum';
  return 'Nurture with intent';
}

function getPriorityAction(total, risk, renewalUrgency, triggerUrgency) {
  if (renewalUrgency >= 90) return 'Treat renewal timing as the forcing function: confirm owner, decision path, blockers, and mutual next step this week.';
  if (triggerUrgency >= 90) return 'Use the trigger to confirm stakeholder owner, urgency, and mutual next step.';
  if (risk >= 30) return 'Clean up the risk path before pushing proof or partner execution.';
  if (total >= 84) return 'Move to a specific customer proof, workshop, or executive recap.';
  if (total >= 76) return 'Strengthen discovery and identify the most valuable next stakeholder conversation.';
  return 'Monitor signals, keep persona learning fresh, and wait for a stronger trigger.';
}

function getPriorityReasons(account, components) {
  const topComponents = [...components].sort((a, b) => b.contribution - a.contribution).slice(0, 2);
  const renewal = account.contractContext?.renewalWindow ?? 'renewal timing TBD';

  return [
    `${topComponents[0].label}: ${topComponents[0].score}/100`,
    `${topComponents[1].label}: ${topComponents[1].score}/100`,
    `Renewal window: ${renewal}`,
  ];
}
