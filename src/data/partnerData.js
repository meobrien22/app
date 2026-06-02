export const partnerProfiles = [
  {
    id: 'avanade',
    name: 'Avanade',
    type: 'Global systems integrator',
    specialties: ['Copilot adoption', 'Modern Work', 'AI change management'],
    accounts: ['Toast', 'BILL', 'Smartsheet', 'Paylocity'],
    status: 'Active',
    fit: 92,
    owner: 'Partner Development / Channel Lead',
    profile:
      'Strong fit when the customer needs executive-ready Copilot adoption, workshop facilitation, and change management capacity.',
    nextMove: 'Attach to accounts where Copilot interest is high but adoption ownership is unclear.',
  },
  {
    id: 'crayon',
    name: 'Crayon',
    type: 'Cloud economics and licensing advisory',
    specialties: ['Cloud optimization', 'SMB packaging', 'Partner-led managed services'],
    accounts: ['Procore', 'AppFolio', 'Freshworks'],
    status: 'Active',
    fit: 88,
    owner: 'SMB Channel Lead',
    profile:
      'Useful for packaging Microsoft motions into simple SMB-ready adoption and managed-service offers without turning discovery into a pricing conversation.',
    nextMove: 'Use for accounts that need procurement clarity, partner packaging, or post-sale operating support.',
  },
  {
    id: 'insight',
    name: 'Insight',
    type: 'Solution integrator',
    specialties: ['Security modernization', 'Endpoint management', 'Data estate readiness'],
    accounts: ['Cloudflare', 'Datadog', 'Warby Parker', 'Sweetgreen'],
    status: 'Active',
    fit: 86,
    owner: 'Security SSP + Partner Lead',
    profile:
      'Best when accounts need a technical workshop, endpoint/security assessment, or pragmatic implementation path after discovery.',
    nextMove: 'Attach to security-risk accounts with distributed users, devices, or identity complexity.',
  },
  {
    id: 'slalom',
    name: 'Slalom',
    type: 'Business transformation partner',
    specialties: ['Data strategy', 'Fabric readiness', 'Executive workshops'],
    accounts: ['BlackLine', 'Elastic', 'Duolingo', 'Yext'],
    status: 'Watch',
    fit: 84,
    owner: 'Data and AI Specialist',
    profile:
      'Strong fit for accounts where data silos, analytics trust, and executive alignment are the center of discovery.',
    nextMove: 'Use for data-heavy discovery workshops and executive narrative development.',
  },
  {
    id: 'sada',
    name: 'SADA',
    type: 'Competitive displacement partner',
    specialties: ['Cloud migration', 'Google-to-Microsoft strategy', 'Collaboration modernization'],
    accounts: ['Dropbox', 'Box', 'Fiverr'],
    status: 'Potential',
    fit: 79,
    owner: 'Modern Work SSP',
    profile:
      'Potential partner when the account shows collaboration sprawl, content governance pressure, or competitive displacement signals.',
    nextMove: 'Qualify where Microsoft can simplify collaboration, identity, and governance.',
  },
  {
    id: 'planet-technologies',
    name: 'Planet Technologies',
    type: 'Microsoft-focused services partner',
    specialties: ['Security workshops', 'M365 deployment', 'Governance'],
    accounts: ['LegalZoom', 'Paycom', 'Brilliant Earth'],
    status: 'Potential',
    fit: 81,
    owner: 'Security SSP',
    profile:
      'Good fit for regulated SMB customers that need practical governance, compliance, and identity execution support.',
    nextMove: 'Attach when compliance pressure is high and the customer needs help turning discovery into an action plan.',
  },
];

export const portfolioNewsSignals = [
  {
    id: 'ai-frontier',
    type: 'AI adoption',
    account: 'Smartsheet',
    partner: 'Avanade',
    headline: 'Work management buyers are asking for governed AI workflows, not isolated pilots.',
    impact:
      'Use this as a cross-account discovery theme for COO, CIO, and CHRO conversations where productivity and adoption ownership are unclear.',
    action: 'Open Smartsheet and confirm the Copilot adoption owner.',
  },
  {
    id: 'restaurant-frontline',
    type: 'Frontline operations',
    account: 'Toast',
    partner: 'Insight',
    headline: 'Retail accounts show stronger signals around frontline execution and secure service operations.',
    impact:
      'Ask operations leaders where manual shift, service, and reporting workflows are slowing customer experience.',
    action: 'Open Toast and validate frontline workflow pain.',
  },
  {
    id: 'security-identity',
    type: 'Security pressure',
    account: 'Cloudflare',
    partner: 'Insight',
    headline: 'Security-led conversations are moving from tool coverage to identity, governance, and measurable risk reduction.',
    impact:
      'Use CISO and CIO discovery to connect risk posture, identity controls, and adoption readiness without leading with SKU talk.',
    action: 'Open Cloudflare and map the CISO proof path.',
  },
  {
    id: 'data-trust',
    type: 'Data modernization',
    account: 'BlackLine',
    partner: 'Slalom',
    headline: 'Finance software accounts need trusted reporting and cleaner executive dashboards before AI can scale.',
    impact:
      'Use CFO discovery to clarify reporting friction, governance needs, and how business leaders define confidence.',
    action: 'Open BlackLine and run CFO data-readiness discovery.',
  },
  {
    id: 'partner-packages',
    type: 'Partner opportunity',
    account: 'AppFolio',
    partner: 'Crayon',
    headline: 'SMB channel motions work best when discovery translates into a simple implementation and adoption package.',
    impact:
      'Use this to decide where a partner can reduce implementation risk and accelerate customer confidence.',
    action: 'Open AppFolio and attach partner next steps.',
  },
];

export const topLevelAePages = [
  {
    title: 'Accounts',
    purpose: 'Prioritize where to spend time, open workspaces, and inspect renewal or discovery risk.',
  },
  {
    title: 'V-Team',
    purpose: 'Plan Microsoft internal coverage, specialist asks, demos, workshops, and customer deliverables.',
  },
  {
    title: 'Partners',
    purpose: 'Manage partner profiles, account attach, partner readiness, and future partner opportunities.',
  },
  {
    title: 'News Center',
    purpose: 'Watch account, industry, partner, and trigger signals that should change the next customer ask.',
  },
];
