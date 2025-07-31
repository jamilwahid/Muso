import React, { useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { Center, FavoriteCenterData, KanbanStatus } from '../types/center';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KanbanColumnProps {
  column: {
    id: KanbanStatus;
    title: string;
    description: string;
    icon: LucideIcon;
  };
  centers: Array<{ center: Center; favoriteData: FavoriteCenterData }>;
  onDrop: (centerId: string, newStatus: KanbanStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, centers, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Debug logging
  console.log(`KanbanColumn ${column.title} - centers:`, centers.length);

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
    console.log('Column drop - centerId:', centerId, 'newStatus:', column.id);
    if (centerId) {
      onDrop(centerId, column.id);
    }
  };

  const Icon = column.icon;

  return (
    <div
      className={`bg-white/60 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
        isDragOver 
          ? 'border-indigo-400 bg-indigo-50/50 shadow-lg' 
          : 'border-slate-200 hover:shadow-md'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-t-2xl">
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
      <div className="p-4 space-y-3 min-h-[500px] bg-gradient-to-b from-slate-50/50 to-white/50 rounded-b-2xl">
        {console.log(`Rendering ${centers.length} centers in ${column.title}`)}
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
}