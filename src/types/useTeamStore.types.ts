import { Data, Query } from './common.types';
import { User } from './useUserStore.types';
import { UserRolesQuery } from './useUserRolesStore.types';

export type Team = {
  id: string;
  name: string;
  createdById?: string;
  teamLeadId: string;
  teamLead?: TeamLead;
  updatedAt?: Date;
  createdAt?: Date;
  assistantTeamLeadIds?: string[];
  assistantTeamLeadData?: string;
  isActive: boolean;
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
  showMembers: (teamId: string) => void;
  editTeam: (
    teamId: string,
    payload: Partial<Team>,
  ) => Promise<undefined | boolean>;
}
