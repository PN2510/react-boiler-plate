import { create } from 'zustand';
import { User, UserQuery, UserStoreType } from '../types/useUserStore.types';
import API from '../common/api';
import { USERS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';

export const useUserStore = create<UserStoreType>((set) => ({
  users: { data: [], limit: 10, skip: 0, total: 0 },
  fetchUsers: async (query: UserQuery) => {
    try {
      const res = await API.get(replaceUrlParams(USERS, query), {
        params: query,
      });
      set({ users: res.data });
    } catch (error) {
      // console.log('fetchUsers: ~ error:', error);
    }
  },
  fetchEmployees: async (query: UserQuery) => {
    try {
      const res = await API.get(replaceUrlParams(USERS, query), {
        params: query,
      });
      return res.data;
    } catch (error) {
      // console.log('fetchUsers: ~ error:', error);
    }
  },
  addUser: async (payload: User) => {
    try {
      const res = await API.post(USERS, payload);

      if (res.status == 201) {
        toast.success('User added successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(
        error?.['response']?.data?.message ?? 'User could not be added!',
      );
      // console.log('addUser: ~ error:', error);
      return false;
    }
  },
  editUser: async (userId: string, payload: Partial<User>) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${USERS}/:userId`, { userId }),
        payload,
      );

      if (res.status == 200) {
        toast.success('User edited successfully');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(
        error?.['response']?.data?.message ?? 'User could not be edited!',
      );
      // console.log('addUser: ~ error:', error);
      return false;
    }
  },
}));
