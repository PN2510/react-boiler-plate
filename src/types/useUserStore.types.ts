import { Data, Query } from './common.types';

export type User = {
  id: number;
  userId: string;
  name: string;
  email: string;
  firebaseTokens?: string[];
  profilePic?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  userRole?: { roleId?: string; role?: { name?: string } }[];
  roleId?: string;
};

export interface UserQuery extends Query {
  name?: string;
}

export interface UserStoreType {
  users: Data<User>;
  fetchUsers: (query: UserQuery) => void;
  fetchEmployees: (query: UserQuery) => Promise<undefined | User[]>;
  addUser: (payload: User) => Promise<undefined | boolean>;
  editUser: (
    userId: string,
    payload: Partial<User>,
  ) => Promise<undefined | boolean>;
}
