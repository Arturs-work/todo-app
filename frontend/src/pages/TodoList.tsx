import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  updatedAt: Date;
}

const socket: Socket = io('http://localhost:4000');

const TodoList: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('todo:updated', (data: Todo) => {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === data.id ? data : todo
        )
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('todo:updated');
    };
  }, []);

  const handleTodoUpdate = (todoData: Todo): void => {
    socket.emit('todo:update', todoData);
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>Connection status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <div className="todos">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleTodoUpdate({ ...todo, completed: !todo.completed })}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList; 