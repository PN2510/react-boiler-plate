import { create } from 'zustand';
import { ApprovalStoreType } from '../types/useApprovalStore.types';
import API from '../common/api';
import { TASKS_APPROVALS } from '../common/endpoints';
import { TaskQuery } from '../types/useTasksStore.types';
import { replaceUrlParams } from '../common/utils';

export const useApprovalStore = create<ApprovalStoreType>((set) => ({
  approvals: { data: [], limit: 10, skip: 0, total: 0 },
  fetchApprovalResquests: async (query: TaskQuery) => {
    try {
      const res = await API.get(replaceUrlParams(TASKS_APPROVALS, query), {
        params: query,
      });
      set({ approvals: res.data });
    } catch (error) {
      // console.log('fetchApprovalResquests: ~ error:', error);
    }
  },
}));
