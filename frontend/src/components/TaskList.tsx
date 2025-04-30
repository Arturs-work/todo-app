import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import { Task } from '../types/Task';
import { useSocket } from '../context/SocketContext';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

function SortableTask({ task, onDelete, onToggleComplete, onUpdate }: {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, itemIndex?: number) => void;
  onUpdate: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    transformOrigin: '0 0',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing'
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        e.stopPropagation();
      }}
    >
      <TaskCard
        task={task}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onUpdate={onUpdate}
      />
    </div>
  );
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChange }) => {
  const { socket, isConnected } = useSocket();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      let newIndex;

      // If dropped on another task
      if (tasks.some(task => task.id === over.id)) {
        newIndex = tasks.findIndex(task => task.id === over.id);
      } else {
        // If dropped in empty space, add to the end
        newIndex = tasks.length;
      }

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onTasksChange(newTasks);

      if (socket && isConnected) {
        socket.emit('reorderTasks', newTasks.map(task => String(task.id)));
      }
    }
  };

  const handleDeleteTask = (id: string) => {
    if (socket && isConnected) {
      socket.emit('deleteTask', id);
    } else {
      const updatedTasks = tasks.filter(task => task.id !== id);
      onTasksChange(updatedTasks);
    }
  };

  const handleToggleComplete = (id: string, itemIndex?: number) => {
    if (socket && isConnected) {
      socket.emit('toggleComplete', id, itemIndex);
    } else {
      const updatedTasks = tasks.map(task => {
        if (task.id !== id) return task;
        
        if (task.type === 'checklist' && typeof itemIndex === 'number' && task.completedItems) {
          const newCompletedItems = [...task.completedItems];
          newCompletedItems[itemIndex] = !newCompletedItems[itemIndex];
          return { ...task, completedItems: newCompletedItems };
        }
        
        return task;
      });
      onTasksChange(updatedTasks);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (socket && isConnected) {
      socket.emit('updateTask', updatedTask);
    } else {
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      onTasksChange(updatedTasks);
    }
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Typography 
          variant="h6" 
          color="text.secondary" 
          align="center"
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          No tasks yet. Create one using the + button!
        </Typography>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridAutoFlow: 'dense',
                gap: 2,
                maxWidth: '1400px',
                margin: '0 auto',
                '& > *': {
                  width: '100%',
                  maxWidth: '100%',
                  gridColumn: 'span 1',
                  gridRow: 'span 1',
                  minHeight: '100px'
                }
              }}
            >
              {tasks.map(task => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      )}
    </Container>
  );
};

export default TaskList; 