import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useState } from 'react';
import {
  EMAIL_REGEXP,
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
  RolesEnum,
} from '../../common/enums';
import { ProjectQuery } from '../../types/useProjectStore.types';
import AsyncSelect from 'react-select/async';
import { useCommonStore } from '../../store/useCommonStore';
import { UserRolesQuery } from '../../types/useUserRolesStore.types';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useTeamStore } from '../../store/useTeamStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useLoginStore } from '../../store/useLoginStore';

const validationSchema = yup.object().shape({
  name: yup.string().required('title is required'),
  projectCode: yup.string().required('Project code is required'),
  clientName: yup.string().required('Client name is required'),
  constructionArea: yup.string().required('Construction Area is required'),
  clientEmailId: yup
    .string()
    .test('is-valid-emails', 'Invalid client email provided', (value) => {
      if (!value) return true; // Allow empty values if it's not required
      const emails = value.split(',').map((email) => email.trim());
      const emailRegex = EMAIL_REGEXP; // Basic email regex
      return emails.every((email) => emailRegex.test(email));
    }),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Project location is required'),
  companyName: yup.string(),
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

type Props = { query: ProjectQuery; skip: number; limit: number };

const AddProjectDialog = ({ limit, query, skip }: Props) => {
  const { isDarkMode } = useCommonStore();
  const { authenticatedUserRoleId } = useLoginStore();
  const { fetchTeamLeads } = useTeamStore();
  const { addProject, fetchProjects } = useProjectStore();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      priority: ProjectPriority.MEDIUM.toUpperCase(),
      category: ProjectCategory.A.toUpperCase(),
    },
  });

  const onSubmit = async (data: any) => {
    data.teamLeadId = data.teamLeadId.value;
    const success = await addProject(data);

    if (success) {
      reset();
      setIsModalOpen(false);

      query.skip = skip;
      query.limit = limit;
      fetchProjects(query);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTeamLeadsOptions = async (inputValue: string = '') => {
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

    return formattedOptions;
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <SecondaryButton
          onClick={() => {
            setIsModalOpen(true);
            reset();
          }}
          className="py-1 my-1"
          type="button"
          title="Add New Project"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-2xl bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription className="text-xs">
            Add your project and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] md:h-fit max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col md:grid md:grid-cols-2 gap-2 text-xs"
        >
          <div className="flex flex-col gap-2 md:col-span-1 md:gap-3">
            <div className="flex flex-col">
              <label className="text-xs">Project Name:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                {...register('name')}
                placeholder="Enter Project Name"
              />
              <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs">Project Code:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
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
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
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
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                {...register('clientEmailId')}
                placeholder="Enter Client Email id"
              />
              <p className="text-red-500 text-[9px]">
                {errors?.clientEmailId?.message}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs">Project location:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                {...register('location')}
                placeholder="Enter Project location"
              />
              <p className="text-red-500 text-[9px]">
                {errors?.location?.message}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs">Project construction area:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                {...register('constructionArea')}
                placeholder="Enter Project Construction Area"
              />
              <p className="text-red-500 text-[9px]">
                {errors?.constructionArea?.message}
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
          </div>
          <div className="flex flex-col gap-2 md:col-span-1 md:gap-3">
            <div className="flex flex-col">
              <label className="text-xs">Description:</label>
              <input
                className="px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
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
              <label className="text-xs">Start Date:</label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Select Start Date"
                    className="w-full px-2 py-[10px] rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                    {...field}
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
            <div className="flex flex-col">
              <label className="text-xs">Category:</label>
              <select
                {...register('category')}
                className="py-[9px] px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
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
                className="py-[9px] px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
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

              <p className="text-red-500 text-[9px]">
                {errors?.status?.message}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="p-2 my-2 bg-primary hover:bg-primary/90 rounded-md text-white md:col-span-2 md:h-10"
          >
            Save Project
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
