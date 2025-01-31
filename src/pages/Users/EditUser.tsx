import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../my-components/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, UserQuery } from '../../types/useUserStore.types';
import { useEffect } from 'react';
import { getModifiedFields } from '../../common/utils';
import { useUserStore } from '../../store/useUserStore';
import toast from 'react-hot-toast';

const validationSchema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email id is required').email(),
    isActive: yup.boolean(),
  })
  .required();

type Props = {
  query: UserQuery;
  skip: number;
  limit: number;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | undefined;
};

const EditUser = ({
  limit,
  query,
  skip,
  isEditModalOpen,
  setIsEditModalOpen,
  user,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const { editUser, fetchUsers } = useUserStore();

  const onSubmit = async (data: any) => {
    if (user?.userId) {
      const updatedData = getModifiedFields(
        {
          email: user.email,
          isActive: user.isActive,
          name: user.name,
        },
        data,
      );

      if (!Object.keys(updatedData)?.length) {
        toast.error('You have not made any changes!');
        return;
      }
      const success = await editUser(user?.userId, updatedData as User);
      if (success) {
        reset();
        setIsEditModalOpen(false);
        query.skip = skip;
        query.limit = limit;
        fetchUsers(query);
      }
    }
  };

  useEffect(() => {
    if (user) {
      const { name, email, isActive } = user;
      setValue('name', name);
      setValue('email', email);
      setValue('isActive', isActive);
    }
  }, [user]);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="w-[95%] max-w-2xl bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription className="text-xs">
            edit your user and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-fit max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col md:grid md:grid-cols-2 gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Name:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('name')}
              placeholder="Enter Project Name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Email id:</label>
            <input
              className="px-2 py-2.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('email')}
              placeholder="Enter Project Code"
            />
            <p className="text-red-500 text-[9px]">{errors?.email?.message}</p>
          </div>

          <div className="">
            <label className="w-fit flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="cursor-pointer"
              />
              Active user
            </label>
          </div>

          <button
            type="submit"
            className="p-2 my-2 bg-primary md:col-span-2 hover:bg-primary/90 rounded-md text-white"
          >
            Save User
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
