import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus, Trash2 } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useEffect, useState } from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import { useUserRolesStore } from '../../store/useUserRolesStore';
import { usePermissionStore } from '../../store/usePermissionStore';
import { extractVariablesFromUrls } from '../../common/utils';
import AsyncSelect from 'react-select/async';
import { useLoginStore } from '../../store/useLoginStore';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import { useCommonStore } from '../../store/useCommonStore';
import { useTeamStore } from '../../store/useTeamStore';
import { UserRolesQuery } from '../../types/useUserRolesStore.types';

const validationSchema = yup.object().shape({
  roleId: yup.string().required('roleId is required').trim(),
  userId: yup
    .object()
    .typeError('User is required')
    .required('User is required'),
  permissionEntities: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required('key is required').trim(),
        value: yup.string().required('Value is required').trim(),
      }),
    )
    .test('unique-keys', 'Role entity keys must be unique', (value) => {
      if (!value) return true; // Skip validation if the array is empty or undefined
      const keys = value.map((item) => item.key);
      return new Set(keys).size === keys.length; // Ensure all keys are unique
    }),
  isDefault: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
});

type Props = { query: UserRolesQuery; skip: number; limit: number };

const AddUserRoleDialog = ({ query, skip, limit }: Props) => {
  const { isDarkMode } = useCommonStore();
  const { addUserRoles, fetchUserRoles } = useUserRolesStore();
  const { fetchPermissions, permissions } = usePermissionStore();
  const { fetchRoles, roles } = useRoleStore();
  const { fetchMembers } = useTeamStore();
  const {
    control,
    register,
    resetField,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      permissionEntities: [
        {
          key: '',
          value: '',
        },
      ],
      isDefault: true,
      isActive: true,
    },
  });

  const {
    fields: permissionEntities,
    append: appendPermissionEntities,
    remove: removePermissionEntities,
  } = useFieldArray({
    control,
    name: 'permissionEntities',
  });

  const roleId = watch('roleId');

  const onSubmit = async (data: any) => {
    const convertedObject = transformObject(data);

    if (convertedObject) {
      const success = await addUserRoles(convertedObject);
      if (success) {
        reset();
        setIsModalOpen(false);

        query.skip = skip;
        query.limit = limit;
        fetchUserRoles(query);
      }
    }
  };

  function transformObject(input: any): any {
    return {
      roleId: input.roleId,
      userId: input.userId.value,
      permissionEntities: input.permissionEntities.reduce(
        (prevValue, currentValue) => {
          return {
            ...prevValue,
            [currentValue.key]: currentValue.value?.split(','),
          };
        },
        {},
      ),
      isDefault: input.isDefault,
      isActive: input.isActive,
    };
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      reset();
      fetchRoles({
        paginate: false,
        select: ['roleId', 'name', 'permissionIds'],
      });
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (roles?.total) {
      setValue('roleId', roles.data.at(0)?.roleId!);
    }
  }, [roles]);

  useEffect(() => {
    if (permissions?.total) {
      const permissionUrls = permissions.data?.map((p) => p.apiScopes)?.flat();
      const permissionEntities = extractVariablesFromUrls(permissionUrls);
      setValue('permissionEntities', permissionEntities);
    }
  }, [permissions]);

  useEffect(() => {
    if (roleId) {
      const { permissionIds } = roles.data.find((r) => r.roleId === roleId)!;
      if (permissionIds?.length) {
        if (!permissionIds.includes('ALL_ACCESS')) {
          fetchPermissions({
            paginate: false,
            isActive: true,
            name: permissionIds,
          });
        } else {
          resetField('permissionEntities', { defaultValue: [] });
        }
      }
    }
  }, [roleId]);

  const { authenticatedUserRoleId, user } = useLoginStore();
  const loadMembersOptions = async (inputValue: string = '') => {
    const query: any = {
      paginate: false,
      relation: true,
      unassingedUsers: true,
      // select: ['userId', 'name', 'email'],
    };
    if (inputValue) query['name'] = inputValue;

    let formattedOptions;

    if (!['TEAM_LEAD', 'DIRECTOR'].includes(authenticatedUserRoleId)) {
      formattedOptions = [
        {
          value: user?.userId!,
          label: `${user?.name}`,
        },
      ];
    } else {
      const data = await fetchMembers(query);
      formattedOptions = data.data.map((option) => {
        const role = option['userRole']?.at(0)?.role?.name ?? '';
        return {
          value: option.userId,
          label: `${option.name} ${role ? `(${role})` : ''} `,
        };
      });
    }

    return formattedOptions;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <SecondaryButton
          onClick={() => setIsModalOpen(true)}
          className="py-1 my-1"
          type="button"
          title="Assign Role to User"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Assign Role to a User</DialogTitle>
          <DialogDescription className="text-xs">
            Assign the role to a user and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Role ID:</label>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                  defaultValue={roles?.data?.at(0)?.roleId}
                  placeholder="Select role name"
                >
                  {roles?.data?.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">{errors?.roleId?.message}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Assignee:</label>
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  defaultOptions
                  loadOptions={loadMembersOptions as any}
                  styles={isDarkMode ? darkModeStyles : lightModeStyles}
                  placeholder={
                    <span className="text-slate-500">Select user</span>
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={(selected) => field.onChange(selected)}
                />
              )}
            />
            <p className="text-red-500 text-[9px]">{errors?.userId?.message}</p>
          </div>

          <div>
            <label>Permission Entities:</label>

            {permissionEntities.map((field, index) => (
              <div key={field.id} className="mb-1">
                <div className="flex items-center gap-2">
                  {/* Input for Endpoint */}

                  <input
                    {...register(`permissionEntities.${index}.key` as const)}
                    className="w-1/4 md:w-1/3 px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                    placeholder="Enter key"
                  />

                  <textarea
                    {...register(`permissionEntities.${index}.value` as const)}
                    placeholder="Enter value"
                    rows={1}
                    className="flex-grow px-2 py-2 overflow-y-auto rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                  />

                  <button
                    type="button"
                    className="rounded-full bg-red-500 h-6 w-6 flex items-center justify-center text-white"
                    onClick={() => removePermissionEntities(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-red-500 text-[9px]">
                  {errors?.permissionEntities?.length ? (
                    <span className="flex gap-2">
                      {errors?.permissionEntities?.at(index) &&
                        Object.keys(
                          errors?.permissionEntities?.at(index) as any,
                        ).map((key, ind) => (
                          <span key={ind} className="w-1/3">
                            {
                              (errors?.permissionEntities?.at(index) as any)?.[
                                key
                              ]?.message
                            }
                          </span>
                        ))}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
            <p className="text-red-500 text-[9px]">
              {errors.permissionEntities?.message ??
                errors.permissionEntities?.root?.message}
            </p>
            <SecondaryButton
              className="mt-1"
              type="button"
              title=" Add Role Entity"
              icon={<CirclePlus size={15} />}
              onClick={
                () => appendPermissionEntities({ key: '', value: '' }) // Default new scope values
              }
            />
          </div>

          <div className="flex gap-5">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isDefault')}
                className="cursor-pointer"
              />
              Default
            </label>
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
            Assign Role To User
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserRoleDialog;
