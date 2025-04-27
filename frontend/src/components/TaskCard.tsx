import React from 'react';
import { Card, CardContent, Typography, Checkbox, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, itemIndex?: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete }) => {
  const completedStyle = {
    textDecoration: 'line-through',
    color: 'text.disabled',
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="div"
          >
            {task.title}
          </Typography>
          <IconButton onClick={() => onDelete(task.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </div>
        
        {task.type === 'text' ? (
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            {task.content as string}
          </Typography>
        ) : (
          <List>
            {(task.content as string[]).map((item, index) => {
              const isCompleted = task.completedItems ? task.completedItems[index] : false;
              return (
                <ListItem key={index} dense>
                  <Checkbox
                    edge="start"
                    checked={isCompleted}
                    onChange={() => onToggleComplete(task.id, index)}
                  />
                  <ListItemText 
                    primary={item} 
                    sx={isCompleted ? completedStyle : {}}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
        
        <Typography variant="caption" color="text.secondary">
          Created: {task.createdAt.toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 