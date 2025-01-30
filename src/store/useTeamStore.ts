import { create } from 'zustand';
import {
  MemberQuery,
  Team,
  TeamQuery,
  TeamStoreType,
} from '../types/useTeamStore.types';
import API from '../common/api';
import { TASKS, TEAMS, USER_ROLES, USERS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';
import { UserRolesQuery } from '../types/useUserRolesStore.types';
import { TaskQuery } from '../types/useTasksStore.types';

export const useTeamStore = create<TeamStoreType>((set, get) => ({
  teams: { data: [], limit: 10, skip: 0, total: 0 },
  fetchTeams: async (query: TeamQuery) => {
    try {
      const res = await API.get(replaceUrlParams(TEAMS, query), {
        params: query,
      });
      set({ teams: res.data });
    } catch (error) {
      // console.log('fetchTeams: ~ error:', error);
    }
  },
  addTeam: async (payload: Team) => {
    try {
      // TODO:
      // payload.createdById get the user id from sub or state
      const res = await API.post(TEAMS, payload);

      if (res.status == 201) {
        toast.success('Team added successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Team could not be added!');
      // console.log('addTeam: ~ error:', error);
      return false;
    }
  },
  fetchMembers: async (query: MemberQuery) => {
    try {
      const { data } = await API.get(USERS, {
        params: query,
      });
      return data;
    } catch (error) {
      // console.log('fetchMembers: ~ error:', error);
      return { data: [], limit: query.limit, skip: query.skip, total: 0 };
    }
  },
  fetchTaskMembers: async (query: TaskQuery) => {
    try {
      const { data } = await API.get(
        replaceUrlParams(`${TASKS}/members`, query),
        {
          params: query,
        },
      );
      return data;
    } catch (error) {
      // console.log('fetchMembers: ~ error:', error);
      return { data: [], limit: query.limit, skip: query.skip, total: 0 };
    }
  },
  // fetchTaskMembers: async (query: MemberQuery) => {
  //   try {
  //     const { data } = await API.get(USER_ROLES, {
  //       params: query,
  //     });
  //     return data;
  //   } catch (error) {
  //     console.log('fetchMembers: ~ error:', error);
  //     return { data: [], limit: query.limit, skip: query.skip, total: 0 };
  //   }
  // },

  fetchTeamLeads: async (query: UserRolesQuery) => {
    try {
      const { data } = await API.get(USER_ROLES, {
        params: query,
      });
      return data;
    } catch (error) {
      // console.log('fetchTeamLeads: ~ error:', error);
      return { data: [], limit: query.limit, skip: query.skip, total: 0 };
    }
  },
  showMembers: async (teamId: string) => {
    try {
      const res = await API.get(
        replaceUrlParams(`${TEAMS}/:teamId/assistants`, { teamId }),
      );
      const currentTeams = get().teams;
      const newTeams = currentTeams.data.map((t) =>
        t.id == teamId
          ? {
              ...t,
              assistantTeamLeadData: res.data?.data,
            }
          : t,
      );
      currentTeams.data = newTeams;
      set({ teams: currentTeams });
    } catch (error) {
      console.log('🚀 ~ fetchTeams: ~ error:', error);
    }
  },

  editTeam: async (teamId, payload) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${TEAMS}/:teamId`, { teamId }),
        payload,
      );
      if (res.status == 200) {
        toast.success('Team edited successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Team could not be edited!');
      // console.log('addTeam: ~ error:', error);
      return false;
    }
  },
}));
