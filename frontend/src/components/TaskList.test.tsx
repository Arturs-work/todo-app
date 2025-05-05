import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import { Task } from '../types/Task';
import { useSocket } from '../context/SocketContext';

// Mock the socket context
jest.mock('../context/SocketContext', () => ({
  useSocket: jest.fn()
}));

// Mock the SortableTask component
jest.mock('./SortableTask', () => {
  return function MockSortableTask({ task, onDelete, onToggleComplete, onUpdate }: any) {
    return (
      <div data-testid={`task-${task.id}`}>
        <div>{task.title}</div>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <button onClick={() => onToggleComplete(task.id)}>Toggle Complete</button>
        <button onClick={() => onUpdate({ ...task, title: 'Updated Title' })}>Update</button>
      </div>
    );
  };
});

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      type: 'text',
      title: 'Test Task 1',
      content: 'Test Content 1',
      completedItems: [],
      pinned: false,
      order: 0,
      boardId: 'board1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      type: 'checklist',
      title: 'Test Task 2',
      content: ['Item 1', 'Item 2'],
      completedItems: [false, false],
      pinned: false,
      order: 1,
      boardId: 'board1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockOnTasksChange = jest.fn();
  const mockOnTaskUpdated = jest.fn();
  const mockOnTaskDeleted = jest.fn();

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue({
      socket: {},
      isConnected: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(
      <TaskList
        tasks={[]}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    render(
      <TaskList
        tasks={[]}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByText('No tasks yet. Create one using the + button!')).toBeInTheDocument();
  });

  it('renders tasks', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByTestId('task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-2')).toBeInTheDocument();
  });

  it('handles task deletion', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });
    
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    
    expect(mockOnTaskDeleted).toHaveBeenCalledWith('1');
  });

  it('handles task completion toggle', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });
    
    const toggleButton = screen.getAllByText('Toggle Complete')[0];
    fireEvent.click(toggleButton);
    
    expect(mockOnTaskUpdated).toHaveBeenCalledWith(expect.objectContaining({
      id: '1'
    }));
  });

  it('handles task update', async () => {
    render(
      <TaskList
        tasks={mockTasks}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });
    
    const updateButton = screen.getAllByText('Update')[0];
    fireEvent.click(updateButton);
    
    expect(mockOnTaskUpdated).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      title: 'Updated Title'
    }));
  });

  it('shows offline message when disconnected', async () => {
    (useSocket as jest.Mock).mockReturnValue({
      socket: {},
      isConnected: false
    });

    render(
      <TaskList
        tasks={mockTasks}
        onTasksChange={mockOnTasksChange}
        onTaskUpdated={mockOnTaskUpdated}
        onTaskDeleted={mockOnTaskDeleted}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    }, { timeout: 1500 });

    expect(screen.getByText("It looks like you're offline. You can keep editing the notes and we will try to sync them when you're back online.")).toBeInTheDocument();
  });
}); 