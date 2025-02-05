export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
} 