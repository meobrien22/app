export const skuPriceBook = {
  ME3: {
    name: 'Microsoft 365 E3',
    priceLabel: '$36/user/month',
    discoveryUse: 'Current productivity and security baseline',
  },
  ME5: {
    name: 'Microsoft 365 E5',
    priceLabel: '$57/user/month',
    discoveryUse: 'Security, compliance, analytics, and advanced identity baseline',
  },
  Copilot: {
    name: 'Microsoft 365 Copilot',
    priceLabel: '$30/user/month',
    discoveryUse: 'AI productivity proof and adoption planning',
  },
  'Teams Premium': {
    name: 'Teams Premium',
    priceLabel: '$10/user/month',
    discoveryUse: 'Meeting intelligence, governance, and customer-facing collaboration',
  },
  Defender: {
    name: 'Microsoft Defender add-on',
    priceLabel: 'Validate by plan',
    discoveryUse: 'Endpoint and security operations discovery',
  },
  Entra: {
    name: 'Microsoft Entra add-on',
    priceLabel: 'Validate by plan',
    discoveryUse: 'Identity, access, and external collaboration controls',
  },
  Intune: {
    name: 'Microsoft Intune Plan 1',
    priceLabel: '$8/user/month',
    discoveryUse: 'Device and frontline endpoint management',
  },
  Purview: {
    name: 'Microsoft Purview add-on',
    priceLabel: 'Validate by plan',
    discoveryUse: 'Compliance, records, and sensitive data governance',
  },
  'Power BI': {
    name: 'Power BI Pro',
    priceLabel: '$14/user/month',
    discoveryUse: 'Dashboard, reporting, and decision visibility',
  },
  Fabric: {
    name: 'Microsoft Fabric planning SKU',
    priceLabel: 'Capacity based',
    discoveryUse: 'Unified data and analytics readiness',
  },
  'Power Platform': {
    name: 'Power Platform planning SKU',
    priceLabel: 'Validate by plan',
    discoveryUse: 'Workflow automation and low-code proof planning',
  },
  Viva: {
    name: 'Microsoft Viva Suite',
    priceLabel: '$12/user/month',
    discoveryUse: 'Employee experience, adoption, and manager enablement',
  },
  Sentinel: {
    name: 'Microsoft Sentinel planning SKU',
    priceLabel: 'Usage based',
    discoveryUse: 'Security visibility and incident workflow discovery',
  },
};

export function buildLicenseContext(account, index = 0) {
  const currentSkuKey = getCurrentSkuKey(account);
  const defaultContext = {
    currentSku: skuPriceBook[currentSkuKey].name,
    seatCount: estimateSeatCount(account, index),
    priceLabel: skuPriceBook[currentSkuKey].priceLabel,
    validationStatus: index % 5 === 0 ? 'Needs licensing validation' : 'Ready for discovery validation',
  };

  return {
    ...defaultContext,
    ...(account.licenseContext ?? {}),
  };
}

export function buildLicenseSnapshot(account, topAddOns = []) {
  const currentSkuKey = getCurrentSkuKey(account);
  const licenseContext = buildLicenseContext(account, account.priorityRank ?? 0);
  const addOnSkus = topAddOns
    .map((addOn) => skuPriceBook[addOn.name])
    .filter(Boolean)
    .slice(0, 3);

  return {
    currentSku: licenseContext.currentSku,
    seatCount: licenseContext.seatCount,
    priceLabel: licenseContext.priceLabel,
    validationStatus: licenseContext.validationStatus,
    skus: [
      {
        name: licenseContext.currentSku,
        type: 'Current base license',
        seats: licenseContext.seatCount,
        priceLabel: licenseContext.priceLabel,
        discoveryUse: skuPriceBook[currentSkuKey].discoveryUse,
      },
      ...addOnSkus.map((sku) => ({
        name: sku.name,
        type: 'Discovery fit add-on',
        seats: licenseContext.seatCount,
        priceLabel: sku.priceLabel,
        discoveryUse: sku.discoveryUse,
      })),
    ],
  };
}

export function buildRenewalPlan(account, topAddOns = []) {
  const licenseSnapshot = buildLicenseSnapshot(account, topAddOns);
  const decisionOwner = getDecisionOwner(account);
  const technicalOwner = getTechnicalOwner(account);
  const nextStep = account.nextSteps?.[0] ?? 'Confirm renewal path and customer-owned next step';

  return {
    accountId: account.id,
    accountName: account.name,
    industry: account.industry,
    what: `${licenseSnapshot.currentSku} to ${account.targetMotion}`,
    how: nextStep,
    when: account.contractContext?.renewalWindow ?? 'TBD',
    who: decisionOwner ? `${decisionOwner.name}, ${decisionOwner.role}` : 'Decision owner not confirmed',
    technicalOwner: technicalOwner ? `${technicalOwner.name}, ${technicalOwner.role}` : 'Technical owner not confirmed',
    price: licenseSnapshot.priceLabel,
    seats: licenseSnapshot.seatCount,
    procurement: account.contractContext?.procurement ?? 'Unknown',
    status: account.contractContext?.status ?? 'Unknown',
    businessCase: account.contractContext?.businessCase ?? 'Unknown',
    validationStatus: licenseSnapshot.validationStatus,
    topSkus: licenseSnapshot.skus.slice(0, 4),
  };
}

export function estimateSeatCount(account, index = 0) {
  const seed = String(account.id ?? account.name ?? 'account')
    .split('')
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const industryBoost = /restaurant|retail|construction|healthcare/i.test(account.industry ?? '') ? 125 : 0;
  return 150 + ((seed + index * 17) % 18) * 50 + industryBoost;
}

function getCurrentSkuKey(account) {
  const currentLevel = account.currentLevel || account.currentMotion || 'ME3';
  return currentLevel.includes('ME5') || currentLevel.includes('E5') ? 'ME5' : 'ME3';
}

function getDecisionOwner(account) {
  return (account.stakeholders ?? []).find((person) => /economic buyer/i.test(person.influence ?? ''))
    ?? (account.stakeholders ?? []).find((person) => /CFO|CEO/i.test(person.role ?? ''))
    ?? (account.stakeholders ?? [])[0];
}

function getTechnicalOwner(account) {
  return (account.stakeholders ?? []).find((person) => /technical owner/i.test(person.influence ?? ''))
    ?? (account.stakeholders ?? []).find((person) => /CIO|CTO|CISO|CAIO/i.test(person.role ?? ''));
}
