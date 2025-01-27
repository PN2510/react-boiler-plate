import {
  ArrowRight,
  ArrowRightCircle,
  Hourglass,
  MessageCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import {
  TaskEvents,
  TaskPriority,
  TaskPriorityColors,
  TaskStatus,
  TaskStatusColors,
} from '../../common/enums';
import { HistoryEvent } from '../../types/useTasksStore.types';

interface TaskStatusHistoryProps {
  history: HistoryEvent[];
}

export default function TaskStatusHistory({ history }: TaskStatusHistoryProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="w-full py-5">
      <div className="relative">
        {sortedHistory.map((event, index) => (
          <div key={event.id} className="mb-8 flex">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`rounded-full p-1 flex items-center justify-center ${getEventIcon(
                  event,
                )?.bg} text-white`}
              >
                {getEventIcon(event)?.icon}
              </div>
              {index < sortedHistory.length - 1 && (
                <div className="h-full w-0.5 bg-gray-300 mt-2"></div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-400/10 p-2 rounded-lg shadow-md flex-grow">
              {getEventComponent(event)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getEventComponent(event: HistoryEvent) {
  switch (event.eventType) {
    case TaskEvents.STATUS_CHANGE:
      return <StatusChangeEvent event={event} />;
    case TaskEvents.PRIORITY_CHANGE:
      return <PriorityChangeEvent event={event} />;
    case TaskEvents.COMMENT:
      return <CommentEvent event={event} />;
    case TaskEvents.DUE_DATE_CHANGE:
      return <DueDateChanged event={event} />;
    default:
      return null;
  }
}
function getEventIcon(event: HistoryEvent) {
  switch (event.eventType) {
    case TaskEvents.STATUS_CHANGE:
      return {
        bg: 'bg-blue-500',
        icon: <ArrowRightCircle className="w-4 h-4" />,
      };
    case TaskEvents.PRIORITY_CHANGE:
      return {
        bg: 'bg-violet-500',
        icon: <ArrowRightCircle className="w-4 h-4" />,
      };
    case TaskEvents.COMMENT:
      return {
        bg: 'bg-green-500',
        icon: <MessageCircle className="w-4 h-4" />,
      };
    case TaskEvents.DUE_DATE_CHANGE:
      return {
        bg: 'bg-yellow-500',
        icon: <Hourglass className="w-4 h-4" />,
      };
    default:
      return null;
  }
}

function StatusChangeEvent({ event }: { event: HistoryEvent }) {
  const fromStatus = TaskStatus[event.details.from as keyof typeof TaskStatus];
  const toStatus = TaskStatus[event.details.to as keyof typeof TaskStatus];

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold mb-1">
          Status changed {event?.updatedBy?.name ? 'by ' : ''}
          <span
            className="bg-slate-200 dark:bg-slate-950 px-1 text-black dark:text-white rounded-md cursor-pointer"
            title={event?.updatedBy?.email}
          >
            {event?.updatedBy?.name ? `@${event?.updatedBy?.name}` : ''}
          </span>
        </p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-0.5 rounded text-white text-xs ${
            TaskStatusColors[event.details.from as keyof typeof TaskStatus].bg
          }`}
        >
          {fromStatus}
          {/* ${getStatusColor(fromStatus)}  */}
        </span>
        <ArrowRightCircle className="w-4 h-4 text-gray-500" />
        <span
          className={`px-2 py-0.5 rounded text-white text-xs ${
            TaskStatusColors[event.details.to as keyof typeof TaskStatus].bg
          }`}
        >
          {toStatus}
        </span>
      </div>
      {event?.details?.text && (
        <pre className="mt-2 text-xs italic bg-gray-100 rounded bg-slate-200/30 dark:bg-slate-500/30 p-2 break-words whitespace-break-spaces overflow-y-auto max-h-60 scrollbar">
          "{event.details.text}"
        </pre>
      )}
    </div>
  );
}
function PriorityChangeEvent({ event }: { event: HistoryEvent }) {
  const fromPriority =
    TaskPriority[event.details.from as keyof typeof TaskPriority];

  const toPriority =
    TaskPriority[event.details.to as keyof typeof TaskPriority];

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold mb-1">
          Priority changed {event?.updatedBy?.name ? 'by ' : ''}
          <span
            className="bg-slate-200 dark:bg-slate-950 px-1 text-black dark:text-white rounded-md cursor-pointer"
            title={event?.updatedBy?.email}
          >
            {event?.updatedBy?.name ? `@${event?.updatedBy?.name}` : ''}
          </span>
        </p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            TaskPriorityColors[event.details.from as keyof typeof TaskPriority]
              .style
          }`}
        >
          {fromPriority}
        </span>
        <ArrowRightCircle className="w-4 h-4 text-gray-500" />
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            TaskPriorityColors[event.details.to as keyof typeof TaskPriority]
              .style
          }`}
        >
          {toPriority}
        </span>
      </div>
      {event?.details?.text && (
        <div className="mt-2 px-2 py-1 rounded-md italic text-xs bg-slate-200 dark:bg-slate-800">
          "{event.details.text}"
        </div>
      )}
    </div>
  );
}

function CommentEvent({ event }: { event: HistoryEvent }) {
  return (
    <div className="font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold mb-1">
          Comment {event?.updatedBy?.name ? 'by ' : ''}
          <span
            className="bg-slate-200 dark:bg-slate-950 px-1 text-black dark:text-white rounded-md cursor-pointer"
            title={event?.updatedBy?.email}
          >
            {event?.updatedBy?.name ? `@${event?.updatedBy?.name}` : ''}
          </span>
        </p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>

      <pre className="text-xs italic bg-gray-100 rounded bg-slate-200/30 dark:bg-slate-500/30 p-2 break-words whitespace-break-spaces overflow-y-auto max-h-60 scrollbar">
        {event.details.text}
      </pre>
    </div>
  );
}
function DueDateChanged({ event }: { event: HistoryEvent }) {
  return (
    <div className="font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold mb-1">
          Due Date changed {event?.updatedBy?.name ? 'by ' : ''}
          <span
            className="bg-slate-200 dark:bg-slate-950 px-1 text-black dark:text-white rounded-md cursor-pointer"
            title={event?.updatedBy?.email}
          >
            {event?.updatedBy?.name ? `@${event?.updatedBy?.name}` : ''}
          </span>
        </p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>

      <div className="text-xs flex items-center italic bg-gray-100 rounded bg-slate-200/30 dark:bg-slate-500/30 p-2 break-words whitespace-break-spaces overflow-y-auto max-h-60 scrollbar">
        {dayjs(event.details.from).format('DD MMM YYYY hh:mm: a')}{' '}
        <ArrowRight className="w-4 h-4 mx-2" />
        {dayjs(event.details.to).format('DD MMM YYYY hh:mm: a')}
      </div>
    </div>
  );
}
