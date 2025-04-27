import AddIcon from '@mui/icons-material/Add';
import Checklist from '@mui/icons-material/Checklist';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextFields from '@mui/icons-material/TextFields';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Task, TaskType } from '../types/Task';

interface TaskCreatorProps {
  onTaskCreated: (task: Task) => void;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ onTaskCreated }) => {
  const [open, setOpen] = useState(false);
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const handleOpen = (type: TaskType) => {
    setTaskType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskType(null);
    setTitle('');
    setContent('');
    setChecklistItems([]);
    setNewItem('');
  };

  const handleAddChecklistItem = () => {
    if (newItem.trim()) {
      setChecklistItems([...checklistItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!taskType || !title) return;

    const newTask: Task = {
      id: Date.now().toString(),
      type: taskType,
      title,
      content: taskType === 'text' ? content : checklistItems,
      createdAt: new Date(),
      completedItems: taskType === 'checklist' 
        ? new Array((taskType === 'checklist' ? checklistItems : []).length).fill(false) 
        : undefined,
    };

    onTaskCreated(newTask);
    handleClose();
  };

  const actions = [
    { icon: <TextFields />, name: 'Text', onClick: () => handleOpen('text') },
    { icon: <Checklist />, name: 'List', onClick: () => handleOpen('checklist') }
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Add new task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create {taskType === 'text' ? 'Text' : 'Checklist'} Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          {taskType === 'text' ? (
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <>
              <TextField
                margin="dense"
                label="Add Item"
                fullWidth
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddChecklistItem}>
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
              
              <List>
                {checklistItems.map((item, index) => (
                  <ListItem key={index} dense>
                    <Checkbox
                      edge="start"
                      disabled
                      checked={false}
                    />
                    <ListItemText primary={item} />
                    <IconButton edge="end" onClick={() => handleRemoveChecklistItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCreator; 