import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { Task } from '../types/Task';

interface SortableTaskProps {
    task: Task;
    onDelete: (id: string) => void;
    onToggleComplete: (id: string, itemIndex?: number) => void;
    onUpdate: (task: Task) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({
    task,
    onDelete,
    onToggleComplete,
    onUpdate
}: SortableTaskProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: 'none',
      transformOrigin: '0 0',
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1 : 0,
      cursor: 'pointer',
      '&:active': {
        cursor: 'grabbing',
      },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    };
  
    const handleClick = (e: React.MouseEvent) => {
      if (e.defaultPrevented) return;
      e.stopPropagation();
    };
  
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        <TaskCard
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
        />
      </div>
    );
  };

  export default SortableTask; 