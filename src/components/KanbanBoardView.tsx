import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, Target, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface KanbanBoardViewProps {
  centers: Center[];
  favoritedCenters: Array<{ center: Center; favoriteData: FavoriteCenterData }>;
}

const KANBAN_COLUMNS = [
  {
    id: 'shortlisted' as KanbanStatus,
    title: 'Shortlisted',
    description: 'Centers you want to pursue',
    icon: Heart,
    color: 'pink'
  },
  {
    id: 'applied' as KanbanStatus,
    title: 'Applied',
    description: 'Application submitted',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'waitlist' as KanbanStatus,
    title: 'On Waitlist',
    description: 'Waiting for availability',
    icon: Clock,
    color: 'amber'
  },
  {
    id: 'approved' as KanbanStatus,
    title: 'Approved',
    description: 'Offer received or accepted',
    icon: CheckCircle2,
    color: 'green'
  }
];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ centers, favoritedCenters }) => {
  const { updateKanbanStatus } = useFavorites();

  const handleDrop = (centerId: string, newStatus: KanbanStatus) => {
    updateKanbanStatus(centerId, newStatus);
  };

  // Group centers by their kanban status
  const centersByStatus = KANBAN_COLUMNS.reduce((acc, column) => {
    acc[column.id] = favoritedCenters.filter(
      ({ favoriteData }) => favoriteData.kanbanStatus === column.id
    );
    return acc;
  }, {} as Record<KanbanStatus, Array<{ center: Center; favoriteData: FavoriteCenterData }>>);

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
      <div className="grid grid-cols-4 gap-4 min-h-[600px]">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            centers={centersByStatus[column.id]}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Board Footer */}
      <div className="mt-8 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-lg mx-auto">
          <p className="text-sm text-slate-600">
            💡 Drag cards between columns to track your progress
          </p>
        </div>
      </div>
    </div>
  );
};