'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '../../store/useTasksStore';
import { SendHorizontal } from 'lucide-react';
import {
  RolesEnum,
  TaskEvents,
  TaskStatus,
  TaskStatusColors,
} from '../../common/enums';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

const Task = () => {
  const { taskId } = useParams();
  const { user, authenticatedUserRoleId } = useLoginStore();
  const { task, fetchTaskByTaskId, performTaskAction } = useTaskStore();
  const [taskComment, setTaskComment] = useState<string>('');

  const [taskStatus, setTaskStatus] = useState<keyof typeof TaskStatus>(
    task?.status as keyof typeof TaskStatus,
  );

  // modal for a comment on rejection or completion of the task status
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [pendingStatus, setPendingStatus] = useState<
    keyof typeof TaskStatus | null
  >(null);

  useEffect(() => {
    if (taskId) {
      fetchTaskByTaskId(taskId);
    }
    return () => {};
  }, [taskId]);

  useEffect(() => {
    if (task?.status) {
      setTaskStatus(task.status as keyof typeof TaskStatus);
    }
  }, [task?.status]);

  if (!task) {
    return <div>Loading...</div>;
  }

  const handleComment = () => {

    const payload = {
      action: {
        eventType: TaskEvents.COMMENT,
        details: {
          from: user?.name,
          userId: user?.userId,
          text: taskComment,
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
    setTaskComment('');
  };
  const handleStatusChange = (value: string, comment?: string) => {
    const payload = {
      status: value,
      action: {
        eventType: TaskEvents.STATUS_CHANGE,
        details: {
          from: task.status,
          userId: user?.userId,
          to: value,
          ...(comment && { text: comment }),
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
  };

  const handleDescriptionSave = (value: string) => {
    performTaskAction(task.taskId!, task.projectId!, {
      description: value,
    });
  };
  const handleTitleSave = (value: string) => {
    performTaskAction(task.taskId!, task.projectId!, {
      drawingTitle: value,
    });
  };

  const handleModalSubmit = () => {
    if (
      TaskStatus[pendingStatus as keyof typeof TaskStatus] ===
        TaskStatus.REJECTED &&
      !comment.trim()
    ) {
      toast.error('Please provide a valid comment.', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setTaskStatus(pendingStatus as keyof typeof TaskStatus);
    pendingStatus !== task.status &&
      handleStatusChange(pendingStatus!, comment);
    setShowModal(false);
    setComment('');
    setPendingStatus(null);
  };
  return (
    <div className="w-full font-sans md:grid md:grid-cols-5 grow my-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="md:col-span-3">
        <div className="p-3 flex flex-col gap-3">
          <ConvertEditable
            data={task?.drawingTitle}
            element={
              <span className="text-black dark:text-white text-xl font-medium">
                {task?.drawingTitle}
              </span>
            }
            onSave={handleTitleSave}
          />
          <span className="text-xs">Description:</span>
          <div className="w-full p-5 rounded bg-slate-400/10">
            <ConvertEditable
              data={task?.description}
              element={
                <pre className="font-sans text-slate-600 w-full text-pretty dark:text-slate-400 text-xs md:text-sm break-words whitespace-break-spaces overflow-auto">
                  {task?.description}
                </pre>
              }
              onSave={handleDescriptionSave}
            />
          </div>
        </div>
        <div className="border-t p-3 border-slate-200 dark:border-slate-700 mt-2">
          <span className="text-xs">Comments</span>
          <div className="flex gap-2 items-center">
            <input
              value={taskComment}
              onChange={(e) => {
                setTaskComment(e.target.value!);
              }}
              className="w-full px-3 py-2 rounded bg-slate-400/10 placeholder:text-xs"
              placeholder="Add a comment..."
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
              onClick={handleComment}
              disabled={!taskComment.trim()}
            >
              <SendHorizontal className="text-white" />
            </button>
          </div>
          <TaskStatusHistory history={task.history ?? []} />
        </div>
      </div>
      <div className="p-3 md:col-span-2 border-l border-slate-200 dark:border-slate-700">
        <div className="flex flex-col gap-3">
          <Select
            value={taskStatus}
            onValueChange={(value: string) => {
              const isSelectOptionCompletedDisabled =
                [
                  RolesEnum.ARCHITECT,
                  RolesEnum.DRAUGHTSMAN,
                  RolesEnum.INTERIOR_DESIGNER,
                  RolesEnum.INTERN,
                ].includes(authenticatedUserRoleId as RolesEnum) &&
                [
                  'COMPLETED',
                  'REJECTED',
                  //  'ON_HOLD'
                ].includes(value);

              const isSelectOptionsDisabled =
                [
                  RolesEnum.ARCHITECT,
                  RolesEnum.DRAUGHTSMAN,
                  RolesEnum.INTERN,
                  RolesEnum.INTERIOR_DESIGNER,
                ].includes(authenticatedUserRoleId as RolesEnum) &&
                TaskStatus[task.status as keyof typeof TaskStatus] ===
                  TaskStatus.COMPLETED;

              if (isSelectOptionsDisabled) {
                toast.error(
                  `You don't have permission to change task's status once it is marked '${TaskStatus.COMPLETED}'`,
                  {
                    position: 'top-center',
                    duration: 3000,
                    className: 'bg-red-200 text-red-600 text-sm font-sans',
                  },
                );
                return;
              } else if (isSelectOptionCompletedDisabled) {
                toast.error(
                  `You don't have permission to mark task '${
                    TaskStatus[value as keyof typeof TaskStatus]
                  }'`,
                  {
                    position: 'top-center',
                    duration: 3000,
                    className: 'bg-red-200 text-red-600 text-sm font-sans',
                  },
                );
                return;
              }

              if (value === 'REJECTED' || value === 'COMPLETED') {
                setPendingStatus(value); // Store the selected status temporarily
                setShowModal(true); // Show the modal for comments
              } else {
                setTaskStatus(value as keyof typeof TaskStatus);
                value !== task.status && handleStatusChange(value);
              }
            }}
          >
            <SelectTrigger
              className={`w-[180px] text-sm font-medium focus:ring-0 border-0 ${
                TaskStatusColors[taskStatus as keyof typeof TaskStatus]?.bg
              } ${
                TaskStatusColors[taskStatus as keyof typeof TaskStatus]?.text
              }`}
            >
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
              <SelectGroup className="">
                <SelectLabel>Status</SelectLabel>
                {Object.entries(TaskStatus).flatMap(([key, status]) => (
                  <SelectItem
                    className="hover:bg-slate-200 rounded cursor-pointer focus:bg-slate-200"
                    key={key}
                    value={key}
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <TaskMetaInformation
            task={task}
            performTaskAction={performTaskAction}
          />
          <div className="border border-slate-300 dark:border-none dark:bg-slate-800 rounded-md p-3 flex flex-col gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Created {dayjs(task?.createdAt).format('DD MMM YYYY')} at{' '}
              {dayjs(task?.createdAt).format('hh:mm a')}
            </span>

            <span className="text-slate-500 dark:text-slate-400">
              Updated {dayjs(task?.updatedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for comment */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Provide a reason for{' '}
              {TaskStatus[pendingStatus as keyof typeof TaskStatus]}:
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white"
              rows={4}
              placeholder="Enter your comment here..."
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-sm"
                onClick={() => {
                  setShowModal(false);
                  setComment('');
                  setPendingStatus(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../my-components/Accordian';
import { Task as TaskType } from '../../types/useTasksStore.types';
import {
  ProjectCategory,
  ProjectCategoryColors,
  TaskPriority,
  TaskPriorityColors,
} from '../../common/enums';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../my-components/Select';
import TaskStatusHistory from './TaskStatusHistory';
import { useLoginStore } from '../../store/useLoginStore';
import { ConvertEditable } from '../../my-components/ConvertEditable';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { getEndDate } from '../../common/utils';

export const TaskMetaInformation = ({
  task,
  performTaskAction,
}: {
  task: TaskType;
  performTaskAction: (
    taskId: string,
    projectId: string,
    payload: object,
  ) => void;
}) => {
  const { user, authenticatedUserRoleId } = useLoginStore();

  const [taskPriority, setTaskPriority] = useState<keyof typeof TaskPriority>(
    task?.priority as keyof typeof TaskPriority,
  );
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(
    new Date(task?.dueDate),
  );
  useEffect(() => {
    if (task?.priority) {
      setTaskPriority(task.priority as keyof typeof TaskPriority);
    }
  }, [task?.priority]);

  const handlePriorityChange = (value: string) => {
    const payload = {
      priority: value,
      action: {
        eventType: TaskEvents.PRIORITY_CHANGE,
        details: {
          from: task.priority,
          userId: user?.userId,
          to: value,
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
  };

  const handleDueDateChange = (value: Date | null, _comment?: string) => {
    setTaskDueDate(value);
    const newDueDate = getEndDate(value?.toISOString()!);

    const payload = {
      dueDate: newDueDate,
      action: {
        eventType: TaskEvents.DUE_DATE_CHANGE,
        details: {
          from: task.dueDate,
          userId: user?.userId,
          to: newDueDate,
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
  };

  const dueDateTime = dayjs(task?.dueDate);
  const now = dayjs(new Date().toISOString());
  const isDelayed = now.isAfter(dueDateTime);
  const delayHours = isDelayed ? now.diff(dueDateTime, 'hour') : 0;
  return (
    <Accordion
      type="single"
      defaultValue="item-1"
      collapsible
      className="w-full"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border hover:no-underline border-slate-300 dark:border-slate-700 rounded-t-md dark:bg-slate-800 px-3 py-3">
          Details
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-3 gap-5 p-3 border border-slate-300 border-t-0 dark:border-slate-700 rounded-b-md">
          <span>Assignee</span>
          <span className="col-span-2">{task?.assignedTo?.name}</span>
          <span>Priority</span>

          <div className="col-span-2">
            <Select
              value={taskPriority}
              onValueChange={(value: keyof typeof TaskPriority) => {
                const isSelectOptionsDisabled =
                  [RolesEnum.ARCHITECT, RolesEnum.DRAUGHTSMAN].includes(
                    authenticatedUserRoleId as RolesEnum,
                  ) && task.createdById !== user?.userId;

                if (isSelectOptionsDisabled) {
                  toast.error(
                    `You don't have permission to change task's priority to '${TaskPriority[value]}'`,
                    {
                      position: 'top-center',
                      duration: 3000,
                      className: 'bg-red-200 text-red-600 text-sm font-sans',
                    },
                  );
                  return;
                }

                setTaskPriority(value);
                value !== task.status && handlePriorityChange(value);
              }}
            >
              <SelectTrigger
                className={`w-[100px] text-xs h-7 font-medium focus:ring-0 border-0 ${
                  TaskPriorityColors[taskPriority as keyof typeof TaskPriority]
                    ?.style
                }`}
              >
                <SelectValue placeholder="Select a Priority" className="p-0" />
              </SelectTrigger>
              <SelectContent className="border-0 p-0 bg-white dark:bg-slate-900 shadow-2xl">
                <SelectGroup className="">
                  <SelectLabel>Priority</SelectLabel>
                  {Object.entries(TaskPriority).flatMap(([key, priority]) => (
                    <SelectItem
                      className="hover:bg-slate-200 rounded cursor-pointer focus:bg-slate-200"
                      key={key}
                      value={key}
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <span>Project</span>
          <div className="col-span-2 flex gap-2">
            <span className="font-semibold">{task?.project?.name}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-xl ${
                ProjectCategoryColors[
                  task?.project?.category as keyof typeof ProjectCategory
                ]?.bg
              } ${
                ProjectCategoryColors[
                  task?.project?.category as keyof typeof ProjectCategory
                ]?.text
              }`}
            >
              {
                ProjectCategory[
                  task?.project?.category as keyof typeof ProjectCategory
                ]
              }
            </span>
          </div>

          <span>Reporter</span>
          <span className="col-span-2">{task?.createdBy?.name}</span>

          <span>Team</span>
          <span className="col-span-2">{task?.team?.name}</span>
          {isDelayed && (
            <>
              <span>Delayed by</span>
              <div className="col-span-2">
                <span className=" text-red-500 text-xs py-0.5 px-2 rounded-md bg-red-100 inline">
                  {delayHours} {delayHours > 1 ? 'hours' : 'hour'}
                </span>
              </div>
            </>
          )}

          <span>Due date</span>

          <div className="col-span-2">
            <DatePicker
              autoComplete="false"
              placeholderText="Select start date"
              className="w-full px-2 py-1 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              selected={taskDueDate ? new Date(taskDueDate) : null}
              onChange={(date: Date | null) => handleDueDateChange(date)}
              dateFormat="d/MM/yyyy"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
