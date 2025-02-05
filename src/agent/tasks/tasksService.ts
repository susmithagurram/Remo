import { dynamoDBService } from '../../utils/dynamoDBService';
import { Task, TaskUpdate } from './types';

class TasksService {
  private static instance: TasksService;
  private tasks: Map<string, Task[]> = new Map();

  private constructor() {}

  static getInstance(): TasksService {
    if (!TasksService.instance) {
      TasksService.instance = new TasksService();
    }
    return TasksService.instance;
  }

  async loadUserTasks(userId: string): Promise<void> {
    console.log('Loading tasks for user:', userId);
    const tasks = await dynamoDBService.getTasks(userId);
    console.log('Loaded tasks:', tasks);
    this.tasks.set(userId, tasks);
  }

  async createTask(userId: string, title: string, description?: string): Promise<Task> {
    const timestamp = Date.now();
    const task: Task = {
      id: `task_${timestamp}`,
      userId,
      title,
      description,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDBService.saveTask(task);
    await this.loadUserTasks(userId); // Reload tasks
    return task;
  }

  async updateTask(userId: string, taskId: string, updates: TaskUpdate): Promise<Task> {
    const task = await dynamoDBService.getTask(userId, taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: Date.now(),
      completedAt: updates.status === 'completed' ? Date.now() : task.completedAt,
    };

    await dynamoDBService.saveTask(updatedTask);
    await this.loadUserTasks(userId);
    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const result = await dynamoDBService.deleteTask(userId, taskId);
    await this.loadUserTasks(userId);
    return result;
  }

  async listTasks(userId: string): Promise<Task[]> {
    await this.loadUserTasks(userId);
    return this.tasks.get(userId) || [];
  }
}

export const tasksService = TasksService.getInstance(); 