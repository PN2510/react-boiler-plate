import { Data, Query } from './common.types';
import { User } from './useUserStore.types';
import { Roles } from './useRoleStore.types';

export type UserRoles = {
  id: number;
  roleId: string;
  userId: string;
  permissionEntities: Record<string, string>;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: Pick<Roles, 'name' | 'permissionIds' | 'roleId'>;
  user?: Pick<User, 'name' | 'email' | 'userId'>;
};

export interface UserRolesQuery extends Query {
  name?: string[];
  roleId?: string[];
  isDefault?: boolean;
  relation?: boolean;
}
export interface UserQuery extends Query {
  name?: string;
  roleId?: string[];
  isDefault?: boolean;
  relation?: boolean;
}

export interface UserRolesStoreType {
  userRoles: Data<UserRoles>;
  fetchUserRoles: (query: UserRolesQuery) => void;
  fetchUsers: (query: UserQuery) => void;
  addUserRoles: (payload: UserRoles) => Promise<boolean | undefined>;
}
