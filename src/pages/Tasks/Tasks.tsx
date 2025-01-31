import { useEffect, useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTaskStore } from '../../store/useTasksStore';
import { TaskQuery, Task as TaskType } from '../../types/useTasksStore.types';
import AddTaskDialog from './AddTaskDialog';
import {
  TaskStatusColors,
  TaskStatus,
  ProjectCategoryColors,
  ProjectCategory,
  TaskPriority,
  TaskPriorityColors,
  TaskEvents,
  RolesEnum,
} from '../../common/enums';
import { BadgeInfo, Mail, Send, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';
import { getEmail } from '../../common/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../my-components/Tooltip';
import TaskLabelWrapper from './TaskLabelWrapper';
import TaskFilters from './TaskFilters';
import { useTeamStore } from '../../store/useTeamStore';
import dayjs from 'dayjs';
const Tasks = () => {
  const { authenticatedUserRoleId, user } = useLoginStore();
  const { fetchTasks, tasks, performTaskAction, deleteTask } = useTaskStore();
  const { fetchProjects } = useProjectStore();
  const { fetchTeams } = useTeamStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    relation: true,
    accessLevel: true,
    priority: undefined,
    status: getInitialStatusFilterArray(authenticatedUserRoleId),
  });

  useEffect(() => {
    fetchProjects({
      paginate: false,
      isActive: true,
      select: ['name', 'projectId'],
    });
  }, []);

  const handleStatusChange = async (task: TaskType, value: string) => {
    const payload = {
      status: value,
      action: {
        eventType: TaskEvents.STATUS_CHANGE,
        details: {
          from: task.status,
          userId: user?.userId,
          to: value,
        },
      },
    };

    const success = await performTaskAction(
      task.taskId!,
      task.projectId!,
      payload,
      false,
    );
    if (success) fetchTasks({ ...query, skip, limit, paginate: true });
  };

  const handleDeleteTask = async (taskId: string, projectId: string) => {
    const success = await deleteTask(taskId, projectId);
    if (success) {
      fetchTasks({ ...query, skip, limit, paginate: true });
    }
  };

  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'drawingTitle',
      label: 'Title',
      type: 'element',
      render: (row: TaskType) => (
        <TaskLabelWrapper
          linkComponent={
            <Link
              title="view task details"
              to={`/tasks/${row?.taskId}`}
              className="underline decoration-blue-500 text-blue-500"
            >
              {row?.drawingTitle}
            </Link>
          }
          dueDate={row?.dueDate}
          status={row?.status as keyof typeof TaskStatus}
        />
      ),
    },
    // {
    //   key: 'description',
    //   label: 'Description',
    //   type: 'element',
    //   render: (row: TaskType) => (
    //     <span className="block max-w-70">
    //       {row?.description?.length > 100
    //         ? `${row?.description?.slice(0, 99)}...`
    //         : row?.description}
    //     </span>
    //   ),
    // },
    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
      render: (row) => (
        <span
          className={`px-4 py-0.5 text-xs rounded-xl font-medium ${
            TaskPriorityColors[row?.priority as keyof typeof TaskPriority]
              ?.style
          }`}
        >
          {TaskPriority[row?.priority as keyof typeof TaskPriority]}
        </span>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      type: 'element',
      render: (row) => (
        <div className="flex gap-2">
          <span
            className={`px-2 py-0.5 text-xs rounded-xl ${
              ProjectCategoryColors[
                row?.project?.category as keyof typeof ProjectCategory
              ]?.bg
            } ${
              ProjectCategoryColors[
                row?.project?.category as keyof typeof ProjectCategory
              ]?.text
            }`}
          >
            {
              ProjectCategory[
                row?.project?.category as keyof typeof ProjectCategory
              ]
            }
          </span>
          <span>{row?.project?.name}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'element',
      render: (row) => (
        <div
          className={`w-18 px-2 min-w-fit py-0.5 text-xs rounded-xl ${
            TaskStatusColors[row?.status as keyof typeof TaskStatus]?.bg
          } ${TaskStatusColors[row?.status as keyof typeof TaskStatus]?.text}`}
        >
          {TaskStatus[row?.status as keyof typeof TaskStatus]}
        </div>
      ),
    },
    {
      key: 'assignedTo',
      label:
        authenticatedUserRoleId === 'DIRECTOR'
          ? 'Employee Name'
          : 'Assigned to',
      type: 'element',
      render: (row) => <span className="text-xs">{row?.assignedTo?.name}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'element',
      render: (row) => (
        <div>
          <p className="text-xs">{dayjs(row?.dueDate).format('DD/MM/YYYY')}</p>
        </div>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => (
        <div>
          <p> {row?.createdBy?.name}</p>
          <p className="text-[10px]">
            {dayjs(row?.createdAt).format('DD/MM/YYYY hh:mm a')}
          </p>
        </div>
      ),
    },
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      header: () => (
        <div className="flex items-center gap-2">
          Action
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BadgeInfo size={14} />
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-slate-700 dark:text-white shadow-xl">
                <ul className="">
                  <li>
                    <Mail size={14} className="inline mr-3" />
                    <span>
                      Once task is completed, you can send it to concern
                      individual via email
                    </span>
                  </li>
                  <li>
                    <Send size={14} className="inline mr-3" />
                    <span>
                      Once task is done by assignee, they can send it for review
                    </span>
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      render: (row: TaskType) => (
        <div className="flex gap-2">
          {user?.userId === row.assignedToId && row?.status !== 'IN_REVIEW' && (
            <button
              title="send task to review"
              onClick={() => {
                handleStatusChange(row, 'IN_REVIEW');
              }}
              className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Send size={14} />
            </button>
          )}

          {row.status === 'COMPLETED' && (
            <a
              target="_blank"
              href={getEmail({
                recipient: row?.project?.clientEmailId,
                projectName: row?.project?.name,
                name: user?.name ?? '',
                subject: `${row?.project?.name} - ${row?.drawingTitle}`,
                title: row?.drawingTitle ?? '',
              })}
              rel="noopener noreferrer"
            >
              <button
                title="Send Email"
                className="flex items-center justify-center p-1.5 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Mail size={14} />
              </button>
            </a>
          )}

          {[RolesEnum.ADMIN, RolesEnum.DIRECTOR].includes(
            authenticatedUserRoleId as RolesEnum,
          ) && (
            <button
              title="delete task"
              onClick={() => {
                handleDeleteTask(row?.taskId, row?.projectId);
              }}
              className="flex items-center justify-center p-1.5 rounded-full text-white  hover:bg-red-600 bg-red-500"
            >
              <Trash size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchTeams({
      paginate: false,
      isActive: true,
      relation: true,
    });
  }, []);

  return (
    <>
      {/* <Breadcrumb pageName="Tasks" /> */}
      <div className="w-full max-w-full flex flex-col rounded-md h-full">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <TaskFilters query={query} setQuery={_setQuery} />
          <AddTaskDialog limit={limit} query={query} skip={skip} />
        </div>
        <Table
          name={'Tasks'}
          columns={columns}
          total={tasks.total}
          key={'task-table'}
          query={query}
          pageable={true}
          data={tasks.data}
          fetch={fetchTasks}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Tasks;

export function getInitialStatusFilterArray(role: string) {
  switch (role) {
    case RolesEnum.DIRECTOR:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED'].includes(status),
      );
    case RolesEnum.ADMIN:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED'].includes(status),
      );
    case RolesEnum.TEAM_LEAD:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED', 'IN_REVIEW'].includes(status),
      );
    case RolesEnum.ASSISTANT_TEAM_LEAD:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED', 'IN_REVIEW'].includes(status),
      );
    case RolesEnum.ARCHITECT:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED'].includes(status),
      );

    case RolesEnum.DRAUGHTSMAN:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED'].includes(status),
      );

    case RolesEnum.INTERN:
      return Object.keys(TaskStatus).filter(
        (status) => !['COMPLETED'].includes(status),
      );

    default:
      return undefined;
  }
}
