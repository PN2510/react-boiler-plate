import dayjs from 'dayjs';
import { TaskStatus } from '../../common/enums';

type TaskLabelWrapperProps = {
  linkComponent: JSX.Element;
  dueDate: string;
  status?: keyof typeof TaskStatus;
};

const TaskLabelWrapper = ({
  linkComponent,
  dueDate,
}: TaskLabelWrapperProps) => {
  const dueDateTime = dayjs(dueDate);
  const now = dayjs(new Date().toISOString());
  const isDelayed = now.isAfter(dueDateTime);
  // const delayHours = isDelayed ? now.diff(dueDateTime, 'hour') : 0;

  return (
    <div className="relative py-1 pl-6">
      {linkComponent}
      {isDelayed && (
        <span className="animate-pulse select-none text-white text-[6px] px-1 py-0 m-0 leading-3 rounded bg-red-500/80 dark:bg-red-500/50 absolute top-0 -left-2">
          Delayed
        </span>
      )}
    </div>
  );
};

// by {delayHours} {delayHours > 1 ? 'hours' : 'hour'}

export default TaskLabelWrapper;
