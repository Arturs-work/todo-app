import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../types/Task';
import { useSocket } from '../context/SocketContext';
import SortableTask from './SortableTask';
import AlertMessage from './Alert';

const OFFLINE_MESSAGE = "It looks like you're offline. You can keep editing the notes and we will try to sync them when you're back online.";

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTasksChange,
  onTaskUpdated,
  onTaskDeleted,
}: TaskListProps) => {
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

    if (!over) return;

    const oldIndex = tasks.findIndex((task: Task) => task.id === active.id);
    const newIndex = tasks.some((task: Task) => task.id === over.id)
      ? tasks.findIndex((task: Task) => task.id === over.id)
      : tasks.length;

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    const updatedTasks = newTasks.map((task: Task, index: number) => ({
      ...task,
      order: index,
    }));

    onTasksChange(updatedTasks);

    // Only update tasks that changed position
    updatedTasks.forEach((task: Task) => {
      const originalTask = tasks.find((t: Task) => t.id === task.id);
      if (originalTask?.order !== task.order) {
        onTaskUpdated(task);
      }
    });
  };

  const handleDeleteTask = (id: string) => {
    onTaskDeleted(id);
  };

  const handleToggleComplete = (id: string, itemIndex?: number) => {
    const task = tasks.find((t: Task) => t.id === id);
    if (!task) return;

    let updatedTask: Task;
    if (task.type === 'checklist' && typeof itemIndex === 'number' && task.completedItems) {
      const newCompletedItems = [...task.completedItems];
      newCompletedItems[itemIndex] = !newCompletedItems[itemIndex];
      updatedTask = { ...task, completedItems: newCompletedItems };
    } else {
      updatedTask = { ...task, completed: !task.completed };
    }

    onTaskUpdated(updatedTask);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdated(updatedTask);
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Typography 
        variant="h6" 
        color="text.secondary" 
        align="center"
        sx={{
          mt: 10,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        No tasks yet. Create one using the + button!
      </Typography>
    );
  }

  return (
    <>
      {socket && !isConnected &&
        <AlertMessage
          type="error"
          message={OFFLINE_MESSAGE}
        />}
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
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gridAutoFlow: 'dense',
              gap: {
                xs: 1,
                sm: 2
              },
              maxWidth: '1400px',
              margin: '0 auto',
              padding: {
                xs: 2,
                sm: 2
              },
              '& > *': {
                width: '100%',
                maxWidth: '100%',
                gridColumn: 'span 1',
                gridRow: 'span 1',
                minHeight: {
                  xs: '80px',
                  sm: '100px'
                }
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
    </>
  );
};

export default TaskList; 