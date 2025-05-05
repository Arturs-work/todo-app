import { useEffect, useState } from 'react';
import { Task } from '../types/Task';
import { useSocket } from '../context/SocketContext';

const STORAGE_KEY = 'todo-app-tasks';

export function useTaskSync(boardId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingChanges, setPendingChanges] = useState({
    create: [] as Task[],
    update: [] as Task[],
    delete: [] as string[],
  });

  const { socket, isConnected, currentBoardId, joinBoard } = useSocket();

  useEffect(() => {
    // Join the board room when the boardId changes
    if (boardId !== currentBoardId) {
      joinBoard(boardId);
    }
  }, [boardId, currentBoardId, joinBoard]);

  // Load tasks from localStorage on initial mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Sync pending changes when connection is restored
  useEffect(() => {
    if (isConnected && socket) {
      pendingChanges.create.forEach(task => socket.emit('createTask', task));
      pendingChanges.update.forEach(task => socket.emit('updateTask', task));
      pendingChanges.delete.forEach(id => socket.emit('deleteTask', id));
      setPendingChanges({ create: [], update: [], delete: [] });
    }
  }, [isConnected, socket, pendingChanges]);

  useEffect(() => {
    if (!socket) return;

    // Listen for initial tasks to load
    socket.on('tasks', setTasks);

    // Listen for task creation events
    socket.on('taskCreated', task => setTasks(prev => [...prev, task]));

    // Listen for task update events
    socket.on('taskUpdated', task =>
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)).sort((a, b) => a.order - b.order))
    );

    // Listen for task deletion events
    socket.on('taskDeleted', id =>
      setTasks(prev => prev.filter(t => t.id !== id))
    );

    return () => {
      socket.off('tasks');
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [socket]);

  const handleCreate = (task: Task) => {
    if (socket && isConnected) {
        socket.emit('createTask', { ...task, boardId });
      } else {
        // Add to local state and pending changes
        setTasks(prevTasks => [...prevTasks, task]);
        setPendingChanges(prev => ({
          ...prev,
          create: [...prev.create, { ...task, boardId }]
        }));
      }
  };

  const handleUpdate = (task: Task) => {
    if (socket && isConnected) {
        socket.emit('updateTask', { ...task, boardId });
      } else {
        // Update local state and add to pending changes
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === task.id ? task : t)
        );
        setPendingChanges(prev => ({
          ...prev,
          update: [...prev.update, { ...task, boardId }]
        }));
      }
  };

  const handleDelete = (taskId: string) => {
    if (socket && isConnected) {
        socket.emit('deleteTask', { id: taskId, boardId });
      } else {
        // Update local state and add to pending changes
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        setPendingChanges(prev => ({
          ...prev,
          delete: [...prev.delete, taskId]
        }));
      }
  };

  return { tasks, setTasks, handleCreate, handleUpdate, handleDelete };
}