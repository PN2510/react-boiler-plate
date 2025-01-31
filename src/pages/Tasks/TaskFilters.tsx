import { RolesEnum, TaskPriority, TaskStatus } from '../../common/enums';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';
import { TaskQuery } from '../../types/useTasksStore.types';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useTeamStore } from '../../store/useTeamStore';
import { getInitialStatusFilterArray } from './Tasks';
import { useUserStore } from '../../store/useUserStore';
import AsyncSelect from 'react-select/async';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useCommonStore } from '../../store/useCommonStore';

type TaskFiltersPropType = {
  query: TaskQuery;
  setQuery: (query: TaskQuery) => void;
};

const TaskFilters = ({ setQuery, query }: TaskFiltersPropType) => {
  const { authenticatedUserRoleId } = useLoginStore();
  const { isDarkMode } = useCommonStore();
  const { projects } = useProjectStore();
  const { teams } = useTeamStore();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    setQuery({
      ...query,
      createdAt: {
        startDate: handleDate(start, 'start'),
        endDate: handleDate(end, 'end'),
      },
    });
  };

  const handleDate = (date: string, type: 'start' | 'end') => {
    const localDate = dayjs(date);
    if (type === 'end') {
      return localDate.endOf('day').toISOString();
    } else {
      return localDate.startOf('day').toISOString();
    }
  };
  const { fetchEmployees } = useUserStore();
  const loadEmployeeOptions = async (inputValue: string) => {
    const query: any = {
      isActive: true,
      paginate: false, // Enable pagination
      select: ['name', 'userId'],
    };
    if (inputValue) {
      query['name'] = inputValue;
    }
    const res = await fetchEmployees(query);
    const options = res?.data?.map((user) => ({
      value: user.userId,
      label: user.name,
    }));

    return options;
  };

  return (
    <div className="mb-2 flex flex-row flex-wrap gap-4">
      <label htmlFor="priority" className="text-sm">
        <p>Priority:</p>
        <select
          id="priority"
          value={query.priority ? query.priority[0] : ''}
          className="rounded-md border-2 border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
          onChange={(e) => {
            if (e?.target?.value) {
              if (e.target.value === 'RESET') {
                setQuery({ ...query, priority: undefined });
              } else {
                setQuery({ ...query, priority: [e.target.value] });
              }
            }
          }}
        >
          <option value="RESET" className="text-sm">
            Select Priority
          </option>

          {Object.entries(TaskPriority).map(([key, priority]) => (
            <option key={key} value={key}>
              {priority}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="status" className="text-sm">
        <p>Status:</p>
        <select
          id="status"
          value={
            query.status && query.status?.length == 1
              ? query.status[0]
              : 'RESET'
          }
          className="rounded-md border-2 border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
          onChange={(e) => {
            if (e?.target?.value) {
              if (e.target.value === 'RESET') {
                setQuery({
                  ...query,
                  status: getInitialStatusFilterArray(authenticatedUserRoleId),
                });
              } else {
                setQuery({
                  ...query,
                  status: [e.target.value],
                });
              }
            }
          }}
        >
          <option value="RESET" className="text-sm">
            Select Status
          </option>
          {Object.entries(TaskStatus)?.map(([key, status]) => (
            <option key={key} value={key}>
              {status}
            </option>
          ))}
        </select>
      </label>

      {[RolesEnum.DIRECTOR, RolesEnum.TEAM_LEAD].includes(
        authenticatedUserRoleId as RolesEnum,
      ) && (
        <label htmlFor="projects" className="text-sm">
          <p>Projects:</p>
          <select
            id="projects"
            value={query.projectId ? query.projectId[0] : ''}
            className="rounded-md border-2 border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
            onChange={(e) => {
              if (e?.target?.value) {
                if (e.target.value === 'RESET') {
                  setQuery({ ...query, projectId: undefined });
                } else {
                  setQuery({
                    ...query,
                    projectId: [e.target.value],
                  });
                }
              }
            }}
          >
            <option value="RESET" className="text-sm">
              Select Project
            </option>

            {projects?.data?.map((project) => (
              <option key={project?.projectId} value={project?.projectId}>
                {project?.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label htmlFor="status" className="text-sm ">
        <p>Date:</p>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText="Select a date"
          className="rounded-md border-2 border-slate-300 bg-transparent px-2 py-1 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900"
        />
      </label>
      {[RolesEnum.DIRECTOR, RolesEnum.ADMIN].includes(
        authenticatedUserRoleId as RolesEnum,
      ) && (
        <label htmlFor="team" className="text-sm">
          <p>Team:</p>
          <select
            id="team"
            value={query.teamId ? query.teamId[0] : ''}
            className="rounded-md border-2 border-slate-300 bg-transparent px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
            onChange={(e) => {
              if (e?.target?.value) {
                if (e.target.value === 'RESET') {
                  setQuery({ ...query, teamId: undefined });
                } else {
                  setQuery({
                    ...query,
                    teamId: [e.target.value],
                  });
                }
              }
            }}
          >
            <option value="RESET" className="text-sm">
              Select Team
            </option>
            {teams?.data?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {[RolesEnum.DIRECTOR, RolesEnum.ADMIN].includes(
        authenticatedUserRoleId as RolesEnum,
      ) && (
        <label htmlFor="employee" className="text-sm">
          <p>Employee:</p>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadEmployeeOptions as any}
            styles={isDarkMode ? darkModeStyles : lightModeStyles}
            placeholder={
              <span className="text-slate-500">Select Employee</span>
            }
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={(selected: any) => {
              setQuery({
                ...query,
                assignedToId: selected ? [selected['value']] : undefined,
              });
            }}
          />
        </label>
      )}
    </div>
  );
};

export default TaskFilters;
