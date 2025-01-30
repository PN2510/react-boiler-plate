import { Controller, useForm } from 'react-hook-form';
import { Team, TeamQuery } from '../../types/useTeamStore.types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getModifiedFields } from '../../common/utils';
import { useTeamStore } from '../../store/useTeamStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../my-components/Modal';

import Select from 'react-select';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useCommonStore } from '../../store/useCommonStore';
import { UserRolesQuery } from '../../types/useUserRolesStore.types';
import { useEffect, useState } from 'react';

type Props = {
  query: TeamQuery;
  skip: number;
  limit: number;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  team: Team | undefined;
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Team name is required'),
  teamLeadId: yup.string().required('Team lead is required'),
  assistantTeamLeadId: yup
    .array()
    .of(yup.object().typeError('Assistant team lead is required')),
  isActive: yup.boolean(),
});

const EditTeamDialog = ({
  limit,
  query,
  skip,
  isEditModalOpen,
  setIsEditModalOpen,
  team,
}: Props) => {
  const { isDarkMode } = useCommonStore();
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

  const { editTeam, fetchTeams, fetchTeamLeads } = useTeamStore();

  const [teamLeads, setTeamLeads] = useState<
    { value: string; label: string }[]
  >([]);

  const [assistantTeamLeads, setAssistantTeamLeads] = useState<
    { value: string; label: string }[]
  >([]);

  const onSubmit = async (data: any) => {
    const { assistantTeamLeadId, ...rest } = data;

    if (assistantTeamLeadId?.length)
      rest.assistantTeamLeadIds = assistantTeamLeadId?.map(
        (option: any) => option.value,
      );

    if (team?.id) {
      const updatedData = getModifiedFields(team, rest);
      const success = await editTeam(team?.id, updatedData as Team);
      if (success) {
        reset();
        setIsEditModalOpen(false);
        query.skip = skip;
        query.limit = limit;
        fetchTeams(query);
      }
    }
  };

  const loadTeamLeadsOptions = async (roles: string[]) => {
    const query: UserRolesQuery = {
      paginate: false,
      roleId: roles,
      relation: true,
    };
    const data = await fetchTeamLeads(query);
    const formattedOptions = data.data.map((option) => ({
      value: option.userId,
      label: `${option?.user?.name} ( ${option?.user?.email} )`,
    }));

    return formattedOptions;
  };

  useEffect(() => {
    if (isEditModalOpen) {
      loadTeamLeadsOptions(['TEAM_LEAD']).then((data) => {
        setTeamLeads(data);
      });
      loadTeamLeadsOptions(['ASSISTANT_TEAM_LEAD']).then((data) => {
        setAssistantTeamLeads(data);
      });
    }

    return () => {
      setTeamLeads([]);
      setAssistantTeamLeads([]);
      reset();
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    if (team) {
      const { name, teamLeadId, assistantTeamLeadIds, isActive } = team;
      setValue('name', name);
      setValue('teamLeadId', teamLeadId);
      setValue('isActive', isActive);

      if (assistantTeamLeads?.length && assistantTeamLeadIds?.length) {
        const selectedOptions = assistantTeamLeads?.filter(
          (option) => assistantTeamLeadIds?.includes(option.value),
        );

        if (selectedOptions?.length) {
          setValue('assistantTeamLeadId', selectedOptions);
        }
      }
    }
  }, [team, teamLeads, assistantTeamLeads]);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription className="text-xs">
            Edit your team and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto min-h-fit max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
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

          <div className="flex flex-col">
            <label className="text-xs">Assistant Team Lead:</label>
            <Controller
              name="assistantTeamLeadId"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  {...field}
                  styles={isDarkMode ? darkModeStyles : lightModeStyles}
                  placeholder={
                    <span className="text-slate-500">
                      Select Assistant Team Lead
                    </span>
                  }
                  options={
                    assistantTeamLeads?.map((option) => ({
                      value: option.value,
                      label: option.label,
                    })) ?? []
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
              {errors?.assistantTeamLeadId?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Team Lead:</label>
            <select
              {...register('teamLeadId')}
              className="px-2 py-2 border-2 border-slate-300 dark:border-slate-600 bg-transparent rounded-md placeholder:text-slate-400"
            >
              <option value="" disabled>
                Select team lead
              </option>

              {teamLeads?.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-[9px]">
              {errors?.teamLeadId?.message}
            </p>
          </div>
          <div>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="cursor-pointer"
              />
              Active
            </label>
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
export default EditTeamDialog;
