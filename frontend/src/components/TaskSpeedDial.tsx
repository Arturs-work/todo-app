import React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const actions = [
  { icon: <AddIcon />, name: 'Add Task' },
  { icon: <EditIcon />, name: 'Edit Task' },
  { icon: <DeleteIcon />, name: 'Delete Task' },
];

const TaskSpeedDial: React.FC = () => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  );
};

export default TaskSpeedDial; 