import React from 'react';
import { Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface AlertProps {
    type: 'error' | 'warning' | 'info' | 'success';
    message?: string;
}

const AlertMessage: React.FC<AlertProps> = ({ type, message }) => {
    return (
        <Alert icon={<ErrorIcon fontSize="inherit" />} severity={type}>
            {message || 'Much wow'}
        </Alert>
    );
}

export default AlertMessage;