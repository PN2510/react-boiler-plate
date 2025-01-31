import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../my-components/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  EMAIL_REGEXP,
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
  RolesEnum,
} from '../../common/enums';
import { Project, ProjectQuery } from '../../types/useProjectStore.types';
import AsyncSelect from 'react-select/async';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useCommonStore } from '../../store/useCommonStore';
import { UserRolesQuery } from '../../types/useUserRolesStore.types';
import { useTeamStore } from '../../store/useTeamStore';
import { getModifiedFields } from '../../common/utils';
import { useLoginStore } from '../../store/useLoginStore';

const validationSchema = yup.object().shape({
  name: yup.string().required('title is required'),
  description: yup.string().required('Description is required'),
  projectCode: yup.string().required('Project code is required'),
  clientName: yup.string().required('Client name is required'),
  companyName: yup.string(),
  clientEmailId: yup
    .string()
    .test('is-valid-emails', 'Invalid client email provided', (value) => {
      if (!value) return true; // Allow empty values if it's not required
      const emails = value.split(',').map((email) => email.trim());
      const emailRegex = EMAIL_REGEXP; // Basic email regex
      return emails.every((email) => emailRegex.test(email));
    }),

  location: yup.string().required('Project location is required'),
  status: yup
    .mixed()
    .oneOf(Object.keys(ProjectStatus))
    .required('Status is required'),
  priority: yup
    .mixed()
    .oneOf(Object.keys(ProjectPriority))
    .required('Priority is required'),
  category: yup
    .mixed()
    .oneOf(Object.keys(ProjectCategory))
    .required('Category is required'),
  startDate: yup
    .date()
    .required('Start Date is required')
    .typeError('Invalid date'),
  teamLeadId: yup
    .object()
    .typeError('Team lead is required')
    .required('Team lead is required'),
});

type Props = {
  query: ProjectQuery;
  skip: number;
  limit: number;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project | undefined;
};

const EditProjectDialog = ({
  limit,
  query,
  skip,
  isEditModalOpen,
  setIsEditModalOpen,
  project,
}: Props) => {
  const { authenticatedUserRoleId } = useLoginStore();
  const { editProject, fetchProjects } = useProjectStore();
  const { isDarkMode } = useCommonStore();
  const { fetchTeamLeads } = useTeamStore();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    data.teamLeadId = data.teamLeadId.value;

    if (project?.projectId) {
      const updatedData = getModifiedFields(project, data);
      const success = await editProject(
        project?.projectId,
        updatedData as Project,
      );

      if (success) {
        reset();
        setIsEditModalOpen(false);

        query.skip = skip;
        query.limit = limit;
        fetchProjects(query);
      }
    }
  };

  useEffect(() => {
    if (project) {
      const {
        category,
        status,
        priority,
        name,
        description,
        startDate,
        projectCode,
        clientName,
        clientEmailId,
        location,
        companyName,
      } = project;
      setValue('name', name);
      setValue('category', category);
      setValue('description', description);
      setValue('priority', priority);
      setValue('startDate', new Date(startDate));
      setValue('status', status);
      setValue('projectCode', projectCode);
      setValue('clientName', clientName);
      setValue('clientEmailId', clientEmailId);
      setValue('location', location);
      setValue('companyName', companyName ?? '');
    }
  }, [project]);

  const loadTeamLeadsOptions = async (_inputValue: string = '') => {
    const query: UserRolesQuery = {
      paginate: false,
      roleId: ['TEAM_LEAD'],
      relation: true,
    };
    const data = await fetchTeamLeads(query);
    const formattedOptions = data.data.map((option) => ({
      value: option.userId,
      label: `${option?.user?.name} ( ${option?.user?.email} )`,
    }));

    if (project)
      setValue(
        'teamLeadId',
        formattedOptions.filter((f) => f.value == project.teamLeadId).at(0)!,
      );

    return formattedOptions;
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="w-[95%] max-w-2xl bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription className="text-xs">
            edit your project and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col md:grid md:grid-cols-2 gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Project Name:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('name')}
              placeholder="Enter Project Name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Project Code:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('projectCode')}
              placeholder="Enter Project Code"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.projectCode?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Client Name:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('clientName')}
              placeholder="Enter Client Name"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.clientName?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Client Email ID:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('clientEmailId')}
              placeholder="Enter Client email id"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.clientEmailId?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Project location:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('location')}
              placeholder="Enter Project location"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.location?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Description:</label>
            <input
              className="px-2 py-2.5 rounded-md md:col-span-2 border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('description')}
              placeholder="Enter description"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.description?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Team Lead:</label>
            <Controller
              name="teamLeadId"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadTeamLeadsOptions as any}
                  styles={isDarkMode ? darkModeStyles : lightModeStyles}
                  placeholder={
                    <span className="text-slate-500">Select team lead</span>
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={(selected) => {
                    field.onChange(selected);
                  }}
                />
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.teamLeadId?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Status:</label>
            <select
              {...register('status')}
              className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
            >
              {Object.entries(ProjectStatus).map(([key, status]) => (
                <option key={status} value={key}>
                  {status}
                </option>
              ))}
            </select>

            <p className="text-red-500 text-[9px]">{errors?.status?.message}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Category:</label>

            <select
              {...register('category')}
              className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
            >
              {Object.entries(ProjectCategory).map(([key, category]) => (
                <option key={category} value={key}>
                  {category}
                </option>
              ))}
            </select>

            <p className="text-red-500 text-[9px]">
              {errors?.category?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Priority:</label>

            <select
              {...register('priority')}
              className="py-2.5 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
            >
              {Object.entries(ProjectPriority).map(([key, priority]) => (
                <option key={priority} value={key}>
                  {priority}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-[9px]">
              {errors?.priority?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Start Date:</label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent disabled:dark:bg-slate-800  disabled:cursor-not-allowed"
                  {...field}
                  placeholderText="Select start date"
                  disabled
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="yyyy/MM/dd"
                />
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.startDate?.message}
            </p>
          </div>

          {authenticatedUserRoleId === RolesEnum.DIRECTOR && (
            <div className="flex flex-col">
              <label className="text-xs">Company Name:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                {...register('companyName')}
                placeholder="Enter Company Name"
              />
              <p className="text-red-500 text-[9px]">
                {errors?.companyName?.message}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="p-2 my-2 bg-primary md:col-span-2 hover:bg-primary/90 rounded-md text-white"
          >
            Save Project
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
