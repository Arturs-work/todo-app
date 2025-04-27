import React from 'react';
import { Container, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChange }) => {
  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    onTasksChange(updatedTasks);
  };

  const handleToggleComplete = (id: string, itemIndex?: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id !== id) return task;
      
      if (task.type === 'checklist' && task.completedItems) {
        const newCompletedItems = [...task.completedItems];
        newCompletedItems[itemIndex] = !newCompletedItems[itemIndex];
        return { ...task, completedItems: newCompletedItems };
      }
      
      return task;
    });

    onTasksChange(updatedTasks);
  };

  return (
    <Container maxWidth="md" sx={{
        mt: 4,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))',
        gap: 2 }}>
      {tasks.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          No tasks yet. Create one using the + button!
        </Typography>
      ) : (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        ))
      )}
    </Container>
  );
};

export default TaskList; 