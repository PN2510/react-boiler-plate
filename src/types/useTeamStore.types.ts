import { Data, Query } from './common.types';
import { User } from './useUserStore.types';
import { UserRolesQuery } from './useUserRolesStore.types';

export type Team = {
  id: string;
  projectId: string;
  name: string;
  members: string[];
  membersData?: Member[];
  createdById?: string;
  teamLeadId?: string;
  updatedAt?: Date;
  createdAt?: Date;
  project?: Project;
  teamLead?: TeamLead;
};

export type Member = {
  userId: string;
  email: string;
  name: string;
  userRole?: { roleId?: string; role?: { name: string } }[];
};

export type CreatedBy = {
  userId: string;
  email: string;
  name: string;
};
export type TeamLead = {
  userId: string;
  email: string;
  name: string;
};
export type Project = {
  projectId: string;
  name: string;
};

export interface TeamQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
}
export interface MemberQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  relation?: boolean;
}

interface TeamLeadOptionType {
  roleId: string;
  userId: string;
  user?: Member;
}

export interface TeamStoreType {
  teams: Data<Team>;
  fetchTeams: (query: TeamQuery) => void;
  addTeam: (payload: Team) => Promise<undefined | boolean>;
  fetchMembers: (query: MemberQuery) => Promise<Data<Member>>;
  fetchTaskMembers: (query: MemberQuery) => Promise<Data<User>>;
  fetchTeamLeads: (query: UserRolesQuery) => Promise<Data<TeamLeadOptionType>>;
}
