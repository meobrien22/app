import ConstructionZoneBanner from './ConstructionZoneBanner';

export default function AccountMcemDashboard({ onOpenStageOne, onNavigate }) {
  return (
    <div className="space-y-4">
      <ConstructionZoneBanner onOpenStageOne={onOpenStageOne} onNavigate={onNavigate} />
    </div>
  );
}
