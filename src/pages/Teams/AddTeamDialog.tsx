import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';
import AsyncSelect from 'react-select/async';

import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useState } from 'react';
import { ProjectQuery } from '../../types/useProjectStore.types';
import { useTeamStore } from '../../store/useTeamStore';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useCommonStore } from '../../store/useCommonStore';
import { UserRolesQuery } from '../../types/useUserRolesStore.types';

const validationSchema = yup.object().shape({
  name: yup.string().required('Team name is required'),
  teamLeadId: yup
    .object()
    .typeError('Team lead is required')
    .required('Team lead is required'),
});

type Props = { query: ProjectQuery; skip: number; limit: number };

const AddProjectDialog = ({ query, skip, limit }: Props) => {
  const { isDarkMode } = useCommonStore();
  const { fetchTeamLeads, addTeam, fetchTeams } = useTeamStore();
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
    const { teamLeadId } = data;
    data.teamLeadId = teamLeadId.value;

    const success = await addTeam(data);
    if (success) {
      reset();
      setIsModalOpen(false);

      query.skip = skip;
      query.limit = limit;
      fetchTeams(query);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          title="Add New Team"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
          <DialogDescription className="text-xs">
            Add your team and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-fit max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Team Name:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('name')}
              placeholder="Enter Team Name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
          </div>

          {/* <div className="flex flex-col">
            <label className="text-xs">Project:</label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                  defaultValue={projects?.data?.at(0)?.projectId}
                >
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
          </div> */}

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

          <button
            type="submit"
            className="p-2 my-2 bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Team
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
