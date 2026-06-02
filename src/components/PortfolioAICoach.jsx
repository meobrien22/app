import { useState } from 'react';
import { ArrowRight, Bot, Send, Sparkles } from 'lucide-react';
import { priorityAccounts } from '../data/portfolioData';
import { partnerProfiles, portfolioNewsSignals } from '../data/partnerData';
import { getPortfolioCoach } from '../utils/aiCoach';

export default function PortfolioAICoach({ onOpenAccount }) {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const coach = getPortfolioCoach(priorityAccounts);

  const askPortfolioCoach = (nextPrompt = prompt) => {
    const normalized = String(nextPrompt).toLowerCase();
    setPrompt(nextPrompt);

    if (normalized.includes('partner')) {
      setAnswer(`Partner move: prioritize ${partnerProfiles[0].name} for Copilot/change management and ${partnerProfiles[2].name} for security or endpoint-heavy accounts. Ask each partner for one customer-ready workshop offer and one proof deliverable.`);
      return;
    }

    if (normalized.includes('news') || normalized.includes('trigger')) {
      setAnswer(`News move: use "${portfolioNewsSignals[0].headline}" as the portfolio theme. Open ${portfolioNewsSignals[0].account}, confirm the executive owner, and turn the signal into a stakeholder-specific question.`);
      return;
    }

    if (normalized.includes('risk')) {
      setAnswer(coach.actions[1]);
      return;
    }

    if (normalized.includes('today') || normalized.includes('priority')) {
      setAnswer(`${coach.actions[0]} Then ${coach.actions[1]} Finally ${coach.actions[2]}`);
      return;
    }

    setAnswer(coach.prompt);
  };

  return (
    <section className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-700">
            <Bot className="mr-2 h-4 w-4" />
            All-up AI coach
          </p>
          <h2 className="mt-2 text-2xl font-bold text-blue-950">Portfolio coach for today</h2>
          <p className="mt-2 text-sm leading-6 text-blue-950">{coach.prompt}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {['What should I prioritize today?', 'Which account has risk?', 'What partner move should I make?', 'What news trigger matters?'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => askPortfolioCoach(item)}
                className="rounded-full bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-20 resize-none rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask the portfolio coach about priorities, risks, partners, or account news..."
            />
            <button
              type="button"
              onClick={() => askPortfolioCoach()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              Ask
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Coach answer
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-950">{answer || coach.actions[0]}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {coach.accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => onOpenAccount?.(account.id)}
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-blue-200 hover:bg-blue-50"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-950">{account.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{account.industry}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

