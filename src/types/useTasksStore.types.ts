import { Data, Query } from './common.types';

export type HistoryEvent = {
  id: number;
  eventType: string;
  details: {
    from: string;
    userId: string;
    to?: string;
    text?: string;
  };
  createdAt: string;
  updatedBy?: {
    name?: string;
    email: string;
    userId?: string;
  };
};

export type Task = {
  id: number;
  taskId: string;
  drawingTitle: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assignedToId: string;
  createdById: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: AssignedTo;
  createdBy?: CreatedBy;
  project?: Project;
  history?: HistoryEvent[];
  dueDate: string;
};

export type AssignedTo = {
  userId: string;
  email: string;
  name: string;
};

export type CreatedBy = {
  userId: string;
  email: string;
  name: string;
};

export interface Project {
  name: string;
  category?: string;
  clientEmailId?: string;
  clientName?: string;
}

export interface TaskQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
  accessLevel?: boolean;
  projectId?: string[];
  priority?: string[];
  status?: string[];
  createdAt?: { startDate?: string; endDate?: string };
}

export interface TaskActionQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
  accessLevel?: boolean;
  projectId?: string;
  priority?: string[];
  status?: string[];
}

export interface TaskStoreType {
  tasks: Data<Task>;
  fetchTasks: (query: TaskQuery) => void;
  addTask: (projectId: string, payload: Task) => Promise<boolean | undefined>;
  editTask: (
    taskId: string,
    projectId: string,
    payload: Partial<Task>,
  ) => Promise<boolean | undefined>;
  task: undefined | Task;
  fetchTaskByTaskId: (taskId: string) => void;
  performTaskAction: (
    taskId: string,
    projectId: string,
    payload: object,
    isSingleTask?: boolean,
  ) => Promise<boolean | undefined>;
}
