import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinBoard: (boardId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState('default');

  const joinBoard = (boardId: string) => {
    if (socket) {
      socket.emit('joinBoard', boardId);
      setCurrentBoardId(boardId);
    }
  };

  useEffect(() => {
    // Connect to the backend socket server
    const socketInstance = io(import.meta.env.VITE_API_URL);

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);

      if (currentBoardId) {
        joinBoard(currentBoardId);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinBoard }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext; 