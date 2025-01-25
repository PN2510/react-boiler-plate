import { Data, Query } from './common.types';

export type Project = {
  projectId: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  startDate: string;
  endDate?: string;
  createdById?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  projectCode: string;
  clientName: string;
  clientEmailId?: string;
  constructionArea: string;
  location: string;
  teamLeadId: string;
  teamLead?: {
    name?: string;
    email?: string;
    userId?: string;
  };
};

export type CreatedBy = {
  userId: string;
  email: string;
  name: string;
};

export interface ProjectQuery extends Query {
  name?: string[];
  isDefault?: boolean;
  projectId?: string[];
}

export interface ProjectStoreType {
  projects: Data<Project>;
  fetchProjects: (query: ProjectQuery) => void;
  addProject: (payload: Project) => Promise<boolean | undefined>;
  editProject: (
    projectId: string,
    payload: Project,
  ) => Promise<boolean | undefined>;
}
