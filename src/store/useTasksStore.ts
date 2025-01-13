import { create } from 'zustand';
import { Task, TaskQuery, TaskStoreType } from '../types/useTasksStore.types';
import API from '../common/api';
import { TASKS } from '../common/endpoints';
import { replaceUrlParams } from '../common/utils';
import toast from 'react-hot-toast';

export const useTaskStore = create<TaskStoreType>((set, get) => ({
  tasks: { data: [], limit: 10, skip: 0, total: 0 },
  task: undefined,
  fetchTasks: async (query: TaskQuery) => {
    try {
      const res = await API.get(
        replaceUrlParams(TASKS, { ...query, projectId: '*' }),
        {
          params: query,
        },
      );
      set({ tasks: res.data });
    } catch (error) {
      // console.log('fetchTasks: ~ error:', error);
    }
  },
  addTask: async (projectId: string, payload: Task) => {
    try {
      const res = await API.post(
        replaceUrlParams(TASKS, { projectId }),
        payload,
      );
      if (res.status == 201) {
        toast.success('Task created successfully');
        return true;
      }
      toast.error('Task could not be created!');
      return false;
    } catch (error) {
      toast.error('Task could not be created!');
      // console.log('addTask: ~ error:', error);
      return false;
    }
  },
  editTask: async (
    taskId: string,
    projectId: string,
    payload: Partial<Task>,
  ) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${TASKS}/:taskId`, { projectId, taskId }),
        payload,
      );
      if (res.status == 201) {
        toast.success('Task edited successfully');
        return true;
      }
      toast.error('Task could not be edited!');
      return false;
    } catch (error) {
      toast.error('Task could not be edited!');
      // console.log('editTask: ~ error:', error);
      return false;
    }
  },
  fetchTaskByTaskId: async (taskId: string) => {
    try {
      const res = await API.get(
        replaceUrlParams(`${TASKS}/:taskId`, { taskId }),
        {
          params: {
            relation: true,
          },
        },
      );
      set({ task: res.data });
    } catch (error) {
      console.log('fetchTaskByTaskId: ~ error:', error);
    }
  },
  performTaskAction: async (
    taskId: string,
    projectId: string,
    payload: object, 
    isSingleTask: boolean=true
  ) => {
    try {
      const res = await API.patch(
        replaceUrlParams(`${TASKS}/:taskId`, { taskId, projectId }),
        payload,
      );
      if(isSingleTask){
        get().fetchTaskByTaskId(taskId);
      }
      if(res.status == 200){
        return true
      }
      return false
    } catch (error) {
      console.log('fetchTaskByTaskId: ~ error:', error);
      return false
    }
  },
}));
