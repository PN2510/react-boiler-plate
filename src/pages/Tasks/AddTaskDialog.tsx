import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/useTasksStore';
import {
  AccessMethods,
  AccessModules,
  TaskPriority,
  TaskStatus,
} from '../../common/enums';
import renderWithAccessControl from '../../common/access-control';
import { useProjectStore } from '../../store/useProjectStore';

import { useTeamStore } from '../../store/useTeamStore';
import { TaskQuery } from '../../types/useTasksStore.types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { User } from '../../types/useUserStore.types';
import { getEndDate } from '../../common/utils';

const validationSchema = yup.object().shape({
  drawingTitle: yup.string().required('Title is required'),
  description: yup.string().max(1000, 'Maximum 1000 characters allowed'),
  projectId: yup.string().required('Project is required'),
  teamId: yup.string().required('Team is required'),
  priority: yup
    .mixed()
    .oneOf(Object.keys(TaskPriority))
    .required('Priority is required'),
  assignedToId: yup
    .string()
    .typeError('Assignee is required')
    .required('Assignee is required'),
  dueDate: yup
    .date()
    .required('Due date is required')
    .typeError('Invalid date'),
});

type Props = { query: TaskQuery; skip: number; limit: number };

const AddTaskDialog = ({ query, skip, limit }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskMembers, setTaskMembers] =
    useState<{ value: string; label: string }[]>();
  const { addTask, fetchTasks } = useTaskStore();
  const { fetchTaskMembers, teams } = useTeamStore();
  const { fetchProjects, projects } = useProjectStore();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    data.status = TaskStatus.PENDING.toUpperCase();

    data.dueDate = getEndDate(data.dueDate);
    const { projectId, ...rest } = data;

    const success = await addTask(projectId, rest);

    if (success) {
      reset();
      setIsModalOpen(false);

      query.skip = skip;
      query.limit = limit;
      fetchTasks(query);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      reset();
      fetchProjects({
        paginate: false,
        select: ['projectId', 'name'],
      });
      loadMembersOptions();
    }
  }, [isModalOpen]);

  async function loadMembersOptions() {
    const query: any = {
      paginate: false,
      relation: true,
      projectId: '*',
    };
    const data = await fetchTaskMembers(query);
    setTaskMembers(
      data.data.map((option: User & { role?: string }) => {
        const role = option?.['role'];
        return {
          value: option.userId,
          label: `${option?.['name']} ${role ? `(${role})` : ''}`,
        };
      }),
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {renderWithAccessControl(
        <DialogTrigger asChild>
          <SecondaryButton
            onClick={() => setIsModalOpen(true)}
            className="py-1 w-fit text-xs md:text-base"
            type="button"
            title="Add New Task"
            icon={<CirclePlus size={15} />}
          />
        </DialogTrigger>,
        AccessModules.TASKS,
        AccessMethods.UPDATE,
        '',
      )}

      <DialogContent className="w-[95%] md:w-1/2 max-w-2xl bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription className="text-xs">
            Add your task and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 md:grid md:grid-cols-2 gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Title:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('drawingTitle')}
              placeholder="Enter Drawing title"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.drawingTitle?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Project:</label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                  // defaultValue={projects?.data?.at(0)?.projectId}
                  defaultValue={''}
                >
                  <option value="" disabled className="text-xs">
                    Select Project
                  </option>
                  {projects?.data?.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.projectId?.message}
            </p>
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-xs">Description:</label>
            <textarea
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('description')}
              placeholder="Enter description"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.description?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Assignee:</label>
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  defaultValue=""
                  className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  <option value="" disabled className="text-xs">
                    Select Assignee
                  </option>
                  {taskMembers?.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.assignedToId?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Priority:</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  defaultValue=""
                  className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  <option value="" disabled className="text-xs">
                    Select Priority
                  </option>
                  {Object.entries(TaskPriority).map(([key, priority]) => (
                    <option key={key} value={key}>
                      {priority}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.priority?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Due Date:</label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  autoComplete="false"
                  placeholderText="Select start date"
                  className="w-full px-2 py-[11px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                  {...field}
                  minDate={new Date()}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="yyyy/MM/dd"
                />
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.dueDate?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Team:</label>

            <Controller
              name="teamId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  defaultValue=""
                  placeholder="Select Team"
                  className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  <option value="" disabled className="text-slate-500">
                    Select Team
                  </option>
                  {teams?.data?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">{errors?.teamId?.message}</p>
          </div>
          <button
            type="submit"
            className="col-span-2 p-2 my-2 block bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Task
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
