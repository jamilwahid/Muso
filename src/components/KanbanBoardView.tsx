import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { CenterDetailSidePanel } from './CenterDetailSidePanel';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface KanbanBoardViewProps {
  centers: Center[];
  favoritedCenters: Array<{ center: Center; favoriteData: FavoriteCenterData }>;
}

const KANBAN_COLUMNS = [
  {
    id: 'shortlisted' as KanbanStatus,
    title: 'Shortlisted',
    description: 'Centers you want to pursue',
    icon: Heart
  },
  {
    id: 'applied' as KanbanStatus,
    title: 'Applied',
    description: 'Application submitted',
    icon: FileText
  },
  {
    id: 'waitlist' as KanbanStatus,
    title: 'On Waitlist',
    description: 'Waiting for availability',
    icon: Clock
  },
  {
    id: 'approved' as KanbanStatus,
    title: 'Approved',
    description: 'Offer received or accepted',
    icon: CheckCircle2
  }
];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ centers, favoritedCenters }) => {
  const { updateKanbanStatus } = useFavorites();
  const [selectedCenter, setSelectedCenter] = React.useState<{ center: Center; favoriteData: FavoriteCenterData } | null>(null);

  // Debug logging
  console.log('KanbanBoardView - favoritedCenters:', favoritedCenters);

  const handleDrop = (centerId: string, newStatus: KanbanStatus) => {
    console.log('Dropping center:', centerId, 'to status:', newStatus);
    updateKanbanStatus(centerId, newStatus);
  };

  const handleCardClick = (center: Center, favoriteData: FavoriteCenterData) => {
    setSelectedCenter({ center, favoriteData });
  };

  const handleCloseSidePanel = () => {
    setSelectedCenter(null);
  };
  // Group centers by their kanban status
  const centersByStatus = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = favoritedCenters.filter(
      ({ favoriteData }) => favoriteData.kanbanStatus === column.id
    );
    console.log(`Centers in ${column.id}:`, acc[column.id].length);
    return acc;
  }, {} as Record<KanbanStatus, Array<{ center: Center; favoriteData: FavoriteCenterData }>>);

  console.log('Centers by status:', centersByStatus);

  return (
    <div className="w-full">
      {/* Board Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">My Shortlist</h2>
        <p className="text-sm text-slate-600">
          {favoritedCenters.length} center{favoritedCenters.length !== 1 ? 's' : ''} • Drag to update status
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[600px]">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            centers={centersByStatus[column.id] || []}
            onDrop={handleDrop}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Board Footer */}
      <div className="mt-8 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 max-w-md mx-auto">
          <p className="text-sm text-slate-600">
            💡 Drag cards between columns to track your progress
          </p>
        </div>
      </div>

      {/* Side Panel */}
      {selectedCenter && (
        <CenterDetailSidePanel
          center={selectedCenter.center}
          isOpen={!!selectedCenter}
          onClose={handleCloseSidePanel}
        />
      )}
    </div>
  );
}