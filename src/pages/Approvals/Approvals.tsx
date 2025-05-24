import { useEffect, useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useApprovalStore } from '../../store/useApprovalStore';

import { TaskQuery, Task as TaskType } from '../../types/useTasksStore.types';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';
import {
  ProjectCategory,
  ProjectCategoryColors,
  RolesEnum,
  TaskPriority,
  TaskPriorityColors,
  TaskStatus,
  TaskStatusColors,
} from '../../common/enums';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeInfo, Mail } from 'lucide-react';
import { getEmail } from '../../common/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../my-components/Tooltip';

const Approvals = () => {
  const { authenticatedUserRoleId, permissionEntities, user } = useLoginStore();
  const { fetchApprovalResquests, approvals } = useApprovalStore();
  const navigate = useNavigate();
  const { fetchProjects, projects } = useProjectStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TaskQuery>({
    paginate: true,
    isActive: true,
    relation: true,
    accessLevel: true,
    priority: undefined,
    status: ['IN_REVIEW'],
  });

  useEffect(() => {
    fetchProjects({
      paginate: false,
      isActive: true,
      select: ['name', 'projectId'],
      ...(permissionEntities['projectId']?.at(0) == '*'
        ? {}
        : { projectId: permissionEntities['projectId'] }),
    });
  }, []);

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
        <Link
          title="view task details"
          to={`/tasks/${row?.taskId}`}
          className="underline decoration-blue-500 text-blue-500"
        >
          {row?.drawingTitle}
        </Link>
      ),
    },

    {
      key: 'priority',
      label: 'Priority',
      type: 'text',
      render: (row) => (
        <span
          className={`px-4 py-1 text-xs rounded-xl font-medium ${TaskPriorityColors[
            row?.priority as keyof typeof TaskPriority
          ]?.style} `}
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
            className={`px-2 py-0.5 text-xs rounded-xl ${ProjectCategoryColors[
              row?.project?.category as keyof typeof ProjectCategory
            ]?.bg} ${ProjectCategoryColors[
              row?.project?.category as keyof typeof ProjectCategory
            ]?.text}`}
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
        <span
          className={`px-2 py-0.5 text-xs rounded-xl ${TaskStatusColors[
            row?.status as keyof typeof TaskStatus
          ]?.bg} ${TaskStatusColors[row?.status as keyof typeof TaskStatus]
            ?.text}`}
        >
          {TaskStatus[row?.status as keyof typeof TaskStatus]}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      label:
        authenticatedUserRoleId === 'DIRECTOR'
          ? 'Employee Name'
          : 'Assigned to',
      type: 'element',
      render: (row) => <span>{row?.assignedTo?.name}</span>,
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => <span>{row?.createdBy?.name}</span>,
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
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      render: (row: TaskType) => (
        <div className="flex gap-2">
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (
      authenticatedUserRoleId &&
      [RolesEnum.ADMIN].includes(
        authenticatedUserRoleId as RolesEnum,
      )
    ) {
      navigate('/tasks');
    }
  }, [authenticatedUserRoleId]);

  return (
    <>
      {/* <Breadcrumb pageName="Approval" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <div className="flex gap-3 items-center mb-2">
          <label htmlFor="projects" className="text-sm">
            Projects:{' '}
            <select
              id="projects"
              defaultValue=""
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
              onChange={(e) => {
                if (e?.target?.value) {
                  _setQuery({
                    ...query,
                    projectId: [e.target.value],
                  });
                }
              }}
            >
              <option value="" disabled className="text-sm">
                Select Project
              </option>
              {projects?.data?.map((project) => (
                <option key={project?.projectId} value={project?.projectId}>
                  {project?.name}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="status" className="text-sm">
            Status:{' '}
            <select
              id="status"
              value={query.status}
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
              onChange={(e) => {
                if (e?.target?.value) {
                  _setQuery({
                    ...query,
                    status: [e.target.value],
                  });
                }
              }}
            >
              <option value="" disabled className="text-sm">
                Select Status
              </option>

              {Object.entries(TaskStatus)
                ?.filter(([key, status]) =>
                  [TaskStatus.IN_REVIEW, TaskStatus.COMPLETED].includes(status),
                )
                ?.map(([key, status]) => (
                  <option key={key} value={key}>
                    {status}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <Table
          name={'Approvals'}
          columns={columns}
          total={approvals.total}
          key={'approval-table'}
          query={query}
          pageable={true}
          data={approvals.data}
          fetch={fetchApprovalResquests}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Approvals;
