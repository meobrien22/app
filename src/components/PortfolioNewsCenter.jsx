import PortfolioNewsPanel from './PortfolioNewsPanel';

export default function PortfolioNewsCenter({ onOpenAccount }) {
  return (
    <section className="space-y-6">
      <PortfolioNewsPanel onOpenAccount={onOpenAccount} />
    </section>
  );
}

