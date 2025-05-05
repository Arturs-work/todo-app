import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  TextField,
  Box,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PushPinIcon from '@mui/icons-material/PushPin';
import { format } from 'date-fns';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, itemIndex?: number) => void;
  onUpdate: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newItemText, setNewItemText] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const completedStyle = {
    textDecoration: 'line-through',
    color: 'text.disabled',
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTask = { ...editedTask, title: e.target.value };
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTask = { ...editedTask, content: e.target.value };
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
  };

  const handleChecklistItemChange = (index: number, newValue: string) => {
    if (task.type === 'checklist') {
      const newContent = [...(task.content as string[])];
      newContent[index] = newValue;
      const updatedTask = { ...editedTask, content: newContent };
      setEditedTask(updatedTask);
      onUpdate(updatedTask);
    }
  };

  const handleAddItem = () => {
    if (task.type === 'checklist' && newItemText.trim()) {
      const newContent = [...(task.content as string[]), newItemText.trim()];
      const newCompletedItems = [...(task.completedItems || []), false];
      const updatedTask = { 
        ...editedTask, 
        content: newContent,
        completedItems: newCompletedItems
      };
      setEditedTask(updatedTask);
      onUpdate(updatedTask);
      setNewItemText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <Card 
      ref={cardRef}
      sx={{ 
        mb: 1,
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
        background: task.pinned ? 'linear-gradient(45deg, rgba(255,0,0,0.05), rgba(255,0,0,0.02))' : 'none'
      }}
    >
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {isEditing ? (
            <TextField
              autoFocus
              fullWidth
              value={editedTask.title}
              onChange={handleTitleChange}
              variant="standard"
            />
          ) : (
            <Typography 
              variant="h6" 
              component="div"
              onClick={handleEdit}
              sx={{ cursor: 'pointer', flex: 1 }}
            >
              {task.title}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={task.pinned ? "Unpin task" : "Pin task"}>
              <IconButton 
                onClick={() => onUpdate({ ...task, pinned: !task.pinned })}
                size="small"
                color={task.pinned ? "error" : "default"}
              >
                <PushPinIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton onClick={() => onDelete(task.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ mt: 1 }}>
          {task.type === 'text' ? (
            isEditing ? (
              <TextField
                fullWidth
                multiline
                value={editedTask.content as string}
                onChange={handleContentChange}
                variant="outlined"
                size="large"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Box 
                onClick={handleEdit}
                sx={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-wrap' }}
                >
                  {task.content as string}
                </Typography>
              </Box>
            )
          ) : (
            <List>
              {(isEditing ? editedTask.content : task.content).map((item, index) => {
                const isCompleted = task.completedItems ? task.completedItems[index] : false;
                return (
                  <ListItem 
                    key={index} 
                    dense
                    sx={{ px: 0 }}
                  >
                    <Checkbox
                      edge="start"
                      checked={isCompleted}
                      onChange={() => onToggleComplete(task.id, index)}
                    />
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={item}
                        onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                        variant="standard"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <ListItemText 
                        primary={item} 
                        sx={isCompleted ? completedStyle : {}}
                        onClick={handleEdit}
                      />
                    )}
                  </ListItem>
                );
              })}
              {isEditing && (
                <ListItem dense sx={{ px: 0 }}>
                  <TextField
                    fullWidth
                    placeholder="Add new item"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="standard"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    InputProps={{
                      endAdornment: (
                        <IconButton 
                          size="small" 
                          onClick={handleAddItem}
                          disabled={!newItemText.trim()}
                        >
                        <AddIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </ListItem>
              )}
            </List>
          )}
        </Box>
        
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
        >
          Created: {format(task.createdAt, 'MMM d, yyyy HH:mm')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 