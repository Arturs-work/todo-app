export type TaskType = 'text' | 'checklist';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  content: string | string[];
  createdAt: Date;
  completedItems?: boolean[];
} 