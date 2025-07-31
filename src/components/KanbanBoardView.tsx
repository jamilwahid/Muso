import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, Target, Phone, Eye, FileCheck, CheckCircle } from 'lucide-react';

interface KanbanBoardViewProps {
  centers: Center[];
  favoritedCenters: Array<{ center: Center; favoriteData: FavoriteCenterData }>;
}

const KANBAN_COLUMNS = [
  {
    id: 'interested' as KanbanStatus,
    title: 'Interested',
    description: 'Centers that caught your attention',
    icon: Heart,
    color: 'pink'
  },
  {
    id: 'contacted' as KanbanStatus,
    title: 'Contacted',
    description: 'Called or reached out for information',
    icon: Phone,
    color: 'blue'
  },
  {
    id: 'visited' as KanbanStatus,
    title: 'Visited',
    description: 'Toured the facility in person',
    icon: Eye,
    color: 'green'
  },
  {
    id: 'applied' as KanbanStatus,
    title: 'Applied',
    description: 'Submitted application or on waitlist',
    icon: FileCheck,
    color: 'purple'
  },
  {
    id: 'decided' as KanbanStatus,
    title: 'Decided',
    description: 'Made final decision (yes or no)',
    icon: CheckCircle,
    color: 'emerald'
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
      <div className="mb-8 text-center">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-2xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">My Shortlist Board</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Organize your childcare search by dragging centers through your decision process. 
            Track your progress from initial interest to final decision.
          </p>
          <div className="mt-4 text-sm text-pink-600 font-medium">
            {favoritedCenters.length} center{favoritedCenters.length !== 1 ? 's' : ''} in your pipeline
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 min-h-[600px]">
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
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/30 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-slate-800">
              Stay Organized, Stay Confident
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Use this board to visualize your progress and keep track of where each center stands in your decision process. 
              Move centers forward as you gather more information and get closer to your perfect match.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-pink-600 font-medium">
              <span>💡</span>
              <span>Tip: Drag cards between columns to update their status</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};