import { ROLES, TaskPriority, TaskStatus } from '../../common/enums';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../my-components/Accordian';
import { useLoginStore } from '../../store/useLoginStore';
import { useProjectStore } from '../../store/useProjectStore';
import { TaskQuery } from '../../types/useTasksStore.types';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useTeamStore } from '../../store/useTeamStore';
import { getInitialStatusFilterArray } from './Tasks';

type TaskFiltersPropType = {
  query: TaskQuery;
  setQuery: (query: TaskQuery) => void;
};

const TaskFilters = ({ setQuery, query }: TaskFiltersPropType) => {
  const { authenticatedUserRoleId } = useLoginStore();
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

  return (
    <Accordion
      type="single"
      defaultValue="item-1"
      collapsible
      className="flex-grow"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border hover:no-underline border-slate-300 dark:border-slate-700 rounded-t-md dark:bg-slate-800 px-3 py-3">
          Task Filters
        </AccordionTrigger>
        <AccordionContent className="p-3 border border-slate-300 border-t-0 dark:border-slate-700 rounded-b-md flex gap-5 flex-wrap">
          <label htmlFor="priority" className="text-sm">
            <p>Priority:</p>
            <select
              id="priority"
              value={query.priority ? query.priority[0] : ''}
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
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
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
              onChange={(e) => {
                if (e?.target?.value) {
                  if (e.target.value === 'RESET') {
                    setQuery({
                      ...query,
                      status: getInitialStatusFilterArray(
                        authenticatedUserRoleId,
                      ),
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

          {[ROLES.DIRECTOR, ROLES.TEAM_LEAD].includes(
            authenticatedUserRoleId as ROLES,
          ) && (
            <label htmlFor="projects" className="text-sm">
              <p>Projects:</p>
              <select
                id="projects"
                value={query.projectId ? query.projectId[0] : ''}
                className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
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
              className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900 placeholder:text-slate-500"
            />
          </label>
          {[ROLES.DIRECTOR].includes(authenticatedUserRoleId as ROLES) && (
            <label htmlFor="team" className="text-sm">
              <p>Team:</p>
              <select
                id="team"
                value={query.teamId ? query.teamId[0] : ''}
                className="py-1 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TaskFilters;
