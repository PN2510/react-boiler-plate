export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected',
  ON_HOLD = 'On Hold',
  IN_REVIEW = 'In Review',
}

export const TaskStatusColors = {
  PENDING: {
    text: 'text-white',
    bg: 'bg-orange-600', // Blue represents a fresh or new task
  },
  IN_PROGRESS: {
    text: 'text-white',
    bg: 'bg-yellow-600', // Yellow represents active work or ongoing progress
  },
  REJECTED: {
    text: 'text-white',
    bg: 'bg-red-600', // Yellow represents active work or ongoing progress
  },
  COMPLETED: {
    text: 'text-white',
    bg: 'bg-green-600', // Green represents a successfully completed task
  },
  ON_HOLD: {
    text: 'text-white',
    bg: 'bg-slate-600', // Gray represents tasks that are paused or pending
  },
  IN_REVIEW: {
    text: 'text-white',
    bg: 'bg-blue-600', // Red represents tasks that have been cancelled or abandoned
  },
};

// export enum ProjectStatus {
//   NEW = 'New',
//   IN_PROGRESS = 'In Progress',
//   COMPLETED = 'Completed',
//   CANCELLED = 'Cancelled',
//   ON_HOLD = 'On Hold',
// }

// export const ProjectStatusColors = {
//   NEW: {
//     text: 'text-white',
//     bg: 'bg-sky-500', // Blue represents a fresh or new task
//   },
//   IN_PROGRESS: {
//     text: 'text-white',
//     bg: 'bg-yellow-500', // Yellow represents active work or ongoing progress
//   },
//   COMPLETED: {
//     text: 'text-white',
//     bg: 'bg-green-500', // Green represents a successfully completed task
//   },
//   ON_HOLD: {
//     text: 'text-white',
//     bg: 'bg-slate-500', // Gray represents tasks that are paused or pending
//   },
//   CANCELLED: {
//     text: 'text-white',
//     bg: 'bg-red-500', // Red represents tasks that have been cancelled or abandoned
//   },
// };

export enum ProjectStatus {
  ON_GOING = 'On Going',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
}

export const ProjectStatusColors = {
  ON_GOING: {
    text: 'text-white',
    bg: 'bg-sky-500', // Blue represents a fresh or new task
  },
  COMPLETED: {
    text: 'text-white',
    bg: 'bg-green-500', // Green represents a successfully completed task
  },
  ON_HOLD: {
    text: 'text-white',
    bg: 'bg-slate-500', // Gray represents tasks that are paused or pending
  },
};

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export const TaskPriorityColors = {
  HIGH: {
    name: 'High',
    style: 'text-red-500 bg-red-100',
  },
  MEDIUM: {
    name: 'Medium',
    style: 'text-yellow-500 dark:text-yellow-500 bg-yellow-100',
  },
  LOW: {
    name: 'Low',
    style: 'text-green-500 bg-green-100',
  },
};

export enum ProjectPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum ProjectCategory {
  A = 'A',
  'A+' = 'A+',
  'AA' = 'AA',
  'AA++' = 'AA+',
}

export const ProjectCategoryColors = {
  A: {
    text: 'text-sky-900',
    bg: 'bg-green-100', // Blue represents a fresh or new task
  },
  'A+': {
    text: 'text-sky-900',
    bg: 'bg-yellow-200', // Yellow represents active work or ongoing progress
  },
  AA: {
    text: 'text-white',
    bg: 'bg-orange-300', // Green represents a successfully completed task
  },
  'AA++': {
    text: 'text-white',
    bg: 'bg-red-500', // Gray represents tasks that are paused or pending
  },
};

export enum AccessModules {
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  PERMISSIONS = 'PERMISSIONS',
  USER_ROLES = 'USER_ROLES',
  ROLES = 'ROLES',
  PROJECTS = 'PROJECTS',
  TASKS = 'TASKS',
  TEAMS = 'TEAMS',
}

export enum AccessMethods {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = '*',
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return 'bg-yellow-500';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-500';
    case TaskStatus.COMPLETED:
      return 'bg-green-500';
    case TaskStatus.ON_HOLD:
      return 'bg-red-500';
    case TaskStatus.IN_REVIEW:
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}

export enum TaskEvents {
  'STATUS_CHANGE' = 'STATUS_CHANGE',
  'COMMENT' = 'COMMENT',
  'PRIORITY_CHANGE' = 'PRIORITY_CHANGE',
  'ASSIGNEE_CHANGE' = 'ASSIGNEE_CHANGE',
  'DUE_DATE_CHANGE' = 'DUE_DATE_CHANGE',
}

export enum RolesEnum {
  'DIRECTOR' = 'DIRECTOR',
  'TEAM_LEAD' = 'TEAM_LEAD',
  'ADMIN' = 'ADMIN',
  'ASSISTANT_TEAM_LEAD' = 'ASSISTANT_TEAM_LEAD',
  'DRAUGHTSMAN' = 'DRAUGHTSMAN',
  'ARCHITECT' = 'ARCHITECT',
  'INTERN' = 'INTERN',
}

export const EMAIL_REGEXP =
  /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:\\[\x01-\x09\x0b\x0c\x0e-\x7f]|[^"\\\r\n])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:[^\x00-\x20\x7f-\xff]+)\]))/;

