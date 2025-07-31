import React, { useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { LucideIcon } from 'lucide-react';

interface KanbanColumnProps {
  column: {
    id: KanbanStatus;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
  };
  centers: Array<{ center: Center; favoriteData: FavoriteCenterData }>;
  onDrop: (centerId: string, newStatus: KanbanStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, centers, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const centerId = e.dataTransfer.getData('text/plain');
    if (centerId) {
      onDrop(centerId, column.id);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: {
        header: 'from-pink-500 to-rose-500',
        border: 'border-pink-200',
        bg: 'from-pink-50 to-rose-50',
        dragOver: 'border-pink-400 bg-pink-100/50'
      },
      blue: {
        header: 'from-blue-500 to-indigo-500',
        border: 'border-blue-200',
        bg: 'from-blue-50 to-indigo-50',
        dragOver: 'border-blue-400 bg-blue-100/50'
      },
      green: {
        header: 'from-green-500 to-emerald-500',
        border: 'border-green-200',
        bg: 'from-green-50 to-emerald-50',
        dragOver: 'border-green-400 bg-green-100/50'
      },
      purple: {
        header: 'from-purple-500 to-violet-500',
        border: 'border-purple-200',
        bg: 'from-purple-50 to-violet-50',
        dragOver: 'border-purple-400 bg-purple-100/50'
      },
      emerald: {
        header: 'from-emerald-500 to-teal-500',
        border: 'border-emerald-200',
        bg: 'from-emerald-50 to-teal-50',
        dragOver: 'border-emerald-400 bg-emerald-100/50'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.pink;
  };

  const colors = getColorClasses(column.color);
  const Icon = column.icon;

  return (
    <div
      className={`bg-white/60 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
        isDragOver 
          ? `${colors.dragOver} shadow-lg` 
          : `${colors.border} hover:shadow-md`
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`bg-gradient-to-r ${colors.header} text-white p-4 rounded-t-2xl`}>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-bold text-lg">{column.title}</h3>
          <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
            {centers.length}
          </div>
        </div>
        <p className="text-sm opacity-90">{column.description}</p>
      </div>

      {/* Column Content */}
      <div className={`p-4 space-y-3 min-h-[500px] bg-gradient-to-b ${colors.bg} rounded-b-2xl`}>
        {centers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <Icon className="h-8 w-8 mx-auto opacity-50" />
            </div>
            <p className="text-sm text-slate-500">No centers yet</p>
            <p className="text-xs text-slate-400 mt-1">Drag cards here</p>
          </div>
        ) : (
          centers.map(({ center, favoriteData }) => (
            <KanbanCard
              key={center.center_id}
              center={center}
              favoriteData={favoriteData}
            />
          ))
        )}
      </div>
    </div>
  );
};