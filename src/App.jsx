import { useMemo, useState } from 'react';
import {
  Bot,
  BriefcaseBusiness,
  FileText,
  Handshake,
  Home,
  Lightbulb,
  Menu,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useDiscoveryStore } from './store/useDiscoveryStore';
import { addOnCatalog, painOptions } from './data/discoveryData';
import { portfolioAccounts, priorityAccounts } from './data/portfolioData';
import {
  buildCustomAccount,
  calculateAddOnFit,
  calculateDiscoveryScore,
  calculateOpportunityScore,
  calculateRiskScore,
  generateExecutiveSummaryLine,
  getDiscoveryGaps,
  getNextBestQuestions,
  mergeAccountWithStore,
} from './utils/scoring';

import AccountSetup from './components/AccountSetup';
import NewsTriggers from './components/NewsTriggers';
import StakeholderMap from './components/StakeholderMap';
import Dashboard from './components/Dashboard';
import DiscoveryTree from './components/DiscoveryTree';
import MicrosoftMapping from './components/MicrosoftMapping';
import AddOnFitScoring from './components/AddOnFitScoring';
import BusinessValueScoring from './components/BusinessValueScoring';
import ExampleAccounts from './components/ExampleAccounts';
import ExecutiveSummary from './components/ExecutiveSummary';
import VTeamPlan from './components/VTeamPlan';
import AICoaching from './components/AICoaching';
import ScoreBar from './components/ScoreBar';
import KeywordTally from './components/KeywordTally';
import StakeholderDiscovery from './components/StakeholderDiscovery';
import MeetingScheduler from './components/MeetingScheduler';
import DiscoveryWorkshop from './components/DiscoveryWorkshop';
import RunningPlan from './components/RunningPlan';
import AccountsDashboard from './components/AccountsDashboard';
import VTeamDashboard from './components/VTeamDashboard';
import PartnersDashboard from './components/PartnersDashboard';
import PortfolioNewsCenter from './components/PortfolioNewsCenter';
import PortfolioAICoach from './components/PortfolioAICoach';
import AccountMcemDashboard from './components/AccountMcemDashboard';
import AccountListenConsult from './components/AccountListenConsult';
import PersonaBuilder from './components/PersonaBuilder';

const portfolioNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'accounts', label: 'Accounts', icon: BriefcaseBusiness },
  { id: 'vteam', label: 'V-Team Dashboard', icon: Target },
  { id: 'partners', label: 'Partners', icon: Handshake },
  { id: 'news', label: 'News Center', icon: Zap },
  { id: 'coaching', label: 'AI Coaching', icon: Bot },
];

const accountNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, group: 'Account workspace' },
  { id: 'listen', label: 'Stage 1: Listen & Consult', icon: Users, group: 'MCEM process' },
  { id: 'inspire', label: 'Stage 2: Inspire & Design', icon: Sparkles, group: 'MCEM process' },
  { id: 'empower', label: 'Stage 3: Empower & Achieve', icon: Target, group: 'MCEM process' },
  { id: 'realize', label: 'Stage 4: Realize Value', icon: Zap, group: 'MCEM process' },
  { id: 'optimize', label: 'Stage 5: Manage & Optimize', icon: ShieldAlert, group: 'MCEM process' },
  { id: 'personas', label: 'Personas', icon: Bot, group: 'Account tools' },
  { id: 'summary', label: 'Executive Summary', icon: FileText, group: 'Account tools' },
  { id: 'vteam', label: 'V-Team Plan', icon: Target, group: 'Account tools' },
  { id: 'partners', label: 'Partners', icon: Handshake, group: 'Account tools' },
];

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);
  const [openAccountTabs, setOpenAccountTabs] = useState([]);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('portfolio');
  const store = useDiscoveryStore();
  const { selectedAccountId, selectSampleAccount, keywordTally, dynamicTeamMembers } = store;
  const isAccountWorkspace = activeWorkspaceTab !== 'portfolio';
  const currentNavItems = isAccountWorkspace ? accountNavItems : portfolioNavItems;

  const startNewCustomer = () => {
    store.setCompanyName('');
    store.setIndustry('Manufacturing');
    store.setMotions('ME3', 'ME5 + Copilot readiness');
    store.setTriggerScore(7);
    setActiveWorkspaceTab('portfolio');
    setActivePage('setup');
  };

  const openAccountWorkspace = (accountId, page = 'dashboard') => {
    const account = portfolioAccounts.find((item) => item.id === accountId);
    if (!account) return;
    setOpenAccountTabs((tabs) => (tabs.includes(accountId) ? tabs : [...tabs, accountId]));
    setActiveWorkspaceTab(accountId);
    selectSampleAccount(accountId);
    setActivePage(page);
    setIsAccountListOpen(false);
  };

  const closeAccountWorkspace = (accountId) => {
    setOpenAccountTabs((tabs) => {
      const nextTabs = tabs.filter((id) => id !== accountId);
      if (activeWorkspaceTab === accountId) {
        const nextActive = nextTabs[0] ?? 'portfolio';
        setActiveWorkspaceTab(nextActive);
        if (nextActive !== 'portfolio') selectSampleAccount(nextActive);
        setActivePage('dashboard');
      }
      return nextTabs;
    });
  };

  const activeAccount = useMemo(() => {
    const baseAccount = portfolioAccounts.find((account) => account.id === selectedAccountId);
    return baseAccount ? mergeAccountWithStore(baseAccount, store) : buildCustomAccount(store);
  }, [selectedAccountId, store]);

  const discovery = calculateDiscoveryScore(activeAccount);
  const opportunity = calculateOpportunityScore(activeAccount);
  const risk = calculateRiskScore(activeAccount);
  const topAddOns = calculateAddOnFit(activeAccount).slice(0, 3);
  const gaps = getDiscoveryGaps(activeAccount);
  const questions = getNextBestQuestions(activeAccount);
  const summaryLine = generateExecutiveSummaryLine(activeAccount, keywordTally, dynamicTeamMembers);
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const accountResults = portfolioAccounts
      .filter((account) => [account.name, account.industry, account.trigger, account.targetMotion, ...account.selectedPains].join(' ').toLowerCase().includes(query))
      .slice(0, 5)
      .map((account) => ({ type: 'Account', label: account.name, detail: account.industry, action: () => {
        openAccountWorkspace(account.id);
        setSearchQuery('');
      } }));

    const addOnResults = addOnCatalog
      .filter((addOn) => [addOn.name, addOn.category, addOn.discoveryQuestion, ...addOn.signalKeywords].join(' ').toLowerCase().includes(query))
      .slice(0, 5)
      .map((addOn) => ({ type: 'Add-on', label: addOn.name, detail: addOn.category, action: () => {
        setActivePage('addons');
        setSearchQuery('');
      } }));

    const painResults = painOptions
      .filter((pain) => pain.toLowerCase().includes(query))
      .slice(0, 4)
      .map((pain) => ({ type: 'Pain', label: pain, detail: 'Discovery signal', action: () => {
        setActivePage('addons');
        setSearchQuery('');
      } }));

    return [...accountResults, ...addOnResults, ...painResults].slice(0, 8);
  }, [searchQuery, selectSampleAccount]);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard account={activeAccount} onNavigate={setActivePage} onSelectAccount={openAccountWorkspace} mode={activeWorkspaceTab === 'portfolio' ? 'portfolio' : 'account'} />;
      case 'accounts':
        return <AccountsDashboard onOpenAccount={openAccountWorkspace} />;
      case 'setup':
        return <AccountSetup />;
      case 'news':
        return isAccountWorkspace ? <NewsTriggers account={activeAccount} /> : <PortfolioNewsCenter onOpenAccount={openAccountWorkspace} />;
      case 'stakeholders':
        return <StakeholderMap account={activeAccount} onNavigate={setActivePage} />;
      case 'stakeholderDiscovery':
        return <StakeholderDiscovery account={activeAccount} />;
      case 'scheduler':
        return <MeetingScheduler account={activeAccount} />;
      case 'workshop':
        return <DiscoveryWorkshop account={activeAccount} />;
      case 'listen':
        return <AccountListenConsult account={activeAccount} onNavigate={setActivePage} />;
      case 'inspire':
        return <AccountMcemDashboard account={activeAccount} initialStageId="inspire" lockedStageId="inspire" onOpenStageOne={() => setActivePage('listen')} onNavigate={setActivePage} />;
      case 'empower':
        return <AccountMcemDashboard account={activeAccount} initialStageId="empower" lockedStageId="empower" onOpenStageOne={() => setActivePage('listen')} onNavigate={setActivePage} />;
      case 'design':
      case 'prove':
      case 'close':
        return <AccountMcemDashboard account={activeAccount} initialStageId="empower" lockedStageId="empower" onOpenStageOne={() => setActivePage('listen')} onNavigate={setActivePage} />;
      case 'realize':
        return <AccountMcemDashboard account={activeAccount} initialStageId="realize" lockedStageId="realize" onOpenStageOne={() => setActivePage('listen')} onNavigate={setActivePage} />;
      case 'optimize':
        return <AccountMcemDashboard account={activeAccount} initialStageId="optimize" lockedStageId="optimize" onOpenStageOne={() => setActivePage('listen')} onNavigate={setActivePage} />;
      case 'personas':
        return <PersonaBuilder account={activeAccount} />;
      case 'tree':
        return <DiscoveryTree account={activeAccount} />;
      case 'mapping':
        return <MicrosoftMapping account={activeAccount} />;
      case 'addons':
        return <AddOnFitScoring account={activeAccount} />;
      case 'scoring':
        return <BusinessValueScoring account={activeAccount} />;
      case 'examples':
        return <ExampleAccounts activeAccount={activeAccount} onSelectAccount={(accountId) => openAccountWorkspace(accountId, 'dashboard')} />;
      case 'summary':
        return <ExecutiveSummary account={activeAccount} />;
      case 'vteam':
        return isAccountWorkspace ? <VTeamPlan account={activeAccount} /> : <VTeamDashboard onOpenAccount={openAccountWorkspace} />;
      case 'partners':
        return <PartnersDashboard activeAccount={activeAccount} onOpenAccount={openAccountWorkspace} />;
      case 'coaching':
        return isAccountWorkspace ? <AICoaching account={activeAccount} /> : <PortfolioAICoach onOpenAccount={openAccountWorkspace} />;
      default:
        return <Dashboard account={activeAccount} onNavigate={setActivePage} onSelectAccount={openAccountWorkspace} mode={activeWorkspaceTab === 'portfolio' ? 'portfolio' : 'account'} />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-950">
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setIsLeftSidebarOpen((value) => !value)}
            className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Toggle workflow navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-blue-700 md:text-xl">AE Discovery Engine</h1>
            <p className="hidden text-xs text-slate-500 sm:block">Customer discovery operating system</p>
          </div>
        </div>

        {isAccountWorkspace ? (
          <div className="hidden items-center gap-5 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm md:flex">
            <span className="font-semibold text-slate-500">
              Account workspace: <span className="text-slate-950">{activeAccount.name}</span>
            </span>
            <span className="font-semibold text-slate-500">
              Trigger: <span className="text-orange-600">{activeAccount.triggerScore}/10</span>
            </span>
          </div>
        ) : (
          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 md:flex">
            Portfolio home
          </div>
        )}

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountListOpen((value) => !value)}
              className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              aria-expanded={isAccountListOpen}
            >
              <BriefcaseBusiness className="h-4 w-4" />
              List of accounts
            </button>
            {isAccountListOpen && (
              <AccountListPopover
                accounts={priorityAccounts}
                activeAccountId={selectedAccountId}
                onOpenAccount={(accountId) => openAccountWorkspace(accountId)}
                onClose={() => setIsAccountListOpen(false)}
              />
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search discovery"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-64 rounded-md bg-slate-100 py-2 pl-9 pr-4 text-sm outline-none ring-blue-500 transition focus:ring-2"
            />
            {searchQuery && (
              <div className="absolute right-0 top-11 z-20 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.label}`}
                      onClick={result.action}
                      className="block w-full border-b border-slate-100 p-3 text-left last:border-b-0 hover:bg-slate-50"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{result.type}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{result.label}</p>
                      <p className="text-xs text-slate-500">{result.detail}</p>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-slate-500">No discovery results found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${isLeftSidebarOpen ? 'w-72' : 'w-20'} flex shrink-0 flex-col border-r border-slate-200 bg-white p-4 transition-all`}
        >
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
            {currentNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const showGroup = isLeftSidebarOpen && item.group && item.group !== currentNavItems[index - 1]?.group;

              return (
                <div key={item.id}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.group}
                    </p>
                  )}
                  <button
                    onClick={() => setActivePage(item.id)}
                    title={!isLeftSidebarOpen ? item.label : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                      isActive
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isLeftSidebarOpen && <span className="truncate text-sm">{item.label}</span>}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={startNewCustomer}
              title={!isLeftSidebarOpen ? 'Add new customer' : undefined}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <Plus className="h-4 w-4 shrink-0" />
              {isLeftSidebarOpen && <span>Add new customer</span>}
            </button>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {isLeftSidebarOpen && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Open account workspaces</p>
            )}
            <div className="space-y-2">
              {openAccountTabs.length ? (
                openAccountTabs.map((accountId) => {
                  const tabAccount = portfolioAccounts.find((account) => account.id === accountId);
                  if (!tabAccount) return null;

                  return (
                    <div
                      key={`side-${accountId}`}
                      className={`flex items-center gap-1 rounded-lg border p-1 ${
                        activeWorkspaceTab === accountId
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openAccountWorkspace(accountId)}
                        title={!isLeftSidebarOpen ? tabAccount.name : undefined}
                        className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-bold text-slate-700 hover:bg-white"
                      >
                        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-blue-600" />
                        {isLeftSidebarOpen && <span className="truncate">{tabAccount.name}</span>}
                      </button>
                      {isLeftSidebarOpen && (
                        <button
                          type="button"
                          onClick={() => closeAccountWorkspace(accountId)}
                          className="rounded-md p-2 text-slate-400 hover:bg-white hover:text-slate-700"
                          aria-label={`Close ${tabAccount.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                isLeftSidebarOpen && (
                  <p className="rounded-lg border border-dashed border-slate-200 p-3 text-xs leading-5 text-slate-500">
                    Open an account from Accounts or the header list and it will appear here.
                  </p>
                )
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="mb-4 flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveWorkspaceTab('portfolio');
                setActivePage('dashboard');
              }}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${
                activeWorkspaceTab === 'portfolio'
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Portfolio
            </button>
            {openAccountTabs.map((accountId) => {
              const tabAccount = portfolioAccounts.find((account) => account.id === accountId);
              if (!tabAccount) return null;

              return (
                <div
                  key={accountId}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1 ${
                    activeWorkspaceTab === accountId
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => openAccountWorkspace(accountId)}
                    className="px-2 py-1 text-xs font-bold"
                  >
                    {tabAccount.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeAccountWorkspace(accountId)}
                    className="rounded p-1 transition hover:bg-white"
                    aria-label={`Close ${tabAccount.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          {isAccountWorkspace && (
            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
              <div className="grid gap-3 text-sm md:grid-cols-4">
                <ContextItem label="Company" value={activeAccount.name} />
                <ContextItem label="Industry" value={activeAccount.industry} />
                <ContextItem label="Motion" value={`${activeAccount.currentLevel} to ${activeAccount.targetMotion}`} />
                <ContextItem label="Trigger" value={`${activeAccount.triggerScore}/10`} accent />
              </div>
            </div>
          )}
          {renderContent()}
        </main>

        <aside className="hidden shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-inner xl:flex xl:w-96 xl:flex-col">
          <h3 className="mb-6 flex items-center font-bold text-slate-800">
            <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
            Discovery Command Center
          </h3>

          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Active Account</p>
            <p className="text-sm font-semibold text-blue-950">{activeAccount.name}</p>
            <p className="mt-1 text-xs leading-5 text-blue-700">{activeAccount.targetMotion}</p>
          </div>

          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">If the meeting ended now</p>
            <p className="text-xs leading-5 text-blue-950">{summaryLine}</p>
          </div>

          <div className="mb-6 space-y-4">
            <ScoreBar label="Discovery readiness" value={discovery.total} tone="blue" />
            <ScoreBar label="Opportunity score" value={opportunity.total} tone="emerald" />
            <ScoreBar label="Risk score" value={risk.total} tone="orange" />
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <KeywordTally account={activeAccount} compact />
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <RunningPlan account={activeAccount} compact />
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 flex items-center text-xs font-bold uppercase text-slate-500">
              <BriefcaseBusiness className="mr-1 h-4 w-4 text-slate-500" />
              Current Contract Context
            </p>
            <InfoRow label="Status" value={activeAccount.contractContext.status} />
            <InfoRow label="Renewal" value={activeAccount.contractContext.renewalWindow} />
            <InfoRow label="Satisfaction" value={activeAccount.contractContext.satisfaction} />
            <InfoRow label="Procurement" value={activeAccount.contractContext.procurement} />
          </div>

          <div className="mb-6">
            <p className="mb-3 flex items-center text-xs font-bold uppercase text-slate-500">
              <Lightbulb className="mr-1 h-4 w-4 text-emerald-600" />
              Top Add-On Fit
            </p>
            <div className="space-y-3">
              {topAddOns.map((addOn) => (
                <ScoreBar key={addOn.name} label={addOn.name} value={addOn.score} tone="emerald" />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 flex items-center text-xs font-bold uppercase text-slate-500">
              <ShieldAlert className="mr-1 h-4 w-4 text-orange-500" />
              Gaps & Risks
            </p>
            <div className="space-y-2">
              {gaps.slice(0, 4).map((gap) => (
                <p key={gap} className="rounded-lg bg-orange-50 p-3 text-xs leading-5 text-orange-950">
                  {gap}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase text-slate-500">Next Best Questions</p>
            <div className="space-y-2">
              {questions.slice(0, 3).map((question) => (
                <p key={question} className="rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700">
                  {question}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContextItem({ label, value, accent = false }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 font-bold ${accent ? 'text-orange-600' : 'text-slate-950'}`}>{value}</p>
    </div>
  );
}

function AccountListPopover({ accounts, activeAccountId, onOpenAccount, onClose }) {
  return (
    <div className="absolute right-0 top-11 z-30 w-[28rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">List of accounts</p>
          <h3 className="mt-1 font-bold text-slate-950">Prioritized portfolio</h3>
          <p className="mt-1 text-xs text-slate-500">Open a customer workspace without leaving your current flow.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto p-2">
        {accounts.map((account, index) => (
          <button
            key={account.id}
            type="button"
            onClick={() => onOpenAccount(account.id)}
            className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg p-3 text-left transition ${
              activeAccountId === account.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
            <span>
              <span className="block text-sm font-bold text-slate-950">{account.name}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{account.industry}</span>
            </span>
            <span className="text-right">
              <span className="block rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                {account.priorityScore ?? account.opportunityScore ?? account.triggerScore * 10}
              </span>
              <span className="mt-1 block text-[10px] font-semibold text-slate-500">
                {account.contractContext?.renewalWindow ?? 'Renewal TBD'}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-b-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}
