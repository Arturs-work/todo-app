export type TaskType = 'text' | 'checklist';

export interface Task {
  type: TaskType;
  title: string;
  content: string | string[];
  completedItems?: boolean[];
  pinned?: boolean;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
} 