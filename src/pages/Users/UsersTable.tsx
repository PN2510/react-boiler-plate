import dayjs from 'dayjs';
import Table, { ColumnDef } from '../../common/Table';
import { useState } from 'react';
import { UserQuery } from '../../types/useUserRolesStore.types';
import { useUserStore } from '../../store/useUserStore';
import { UsersLinks } from './Users';
import { User } from '../../types/useUserStore.types';
import { Pencil } from 'lucide-react';
import EditUser from './EditUser';

const UsersTable = () => {
  const { fetchUsers, users } = useUserStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<UserQuery>({
    paginate: true,
    isActive: true,
    relation: true,
  });

  const [user, setUser] = useState<undefined | User>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      key: 'email',
      label: 'Email ID',
      type: 'text',
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => (
        <>
          {row?.createdBy ? (
            <span>
              {row?.createdBy?.name} <br /> ({row?.createdBy?.email})
            </span>
          ) : (
            <span> You </span>
          )}
        </>
      ),
    },
    {
      key: 'userRole',
      label: 'Role',
      type: 'element',
      render: (row) => <span>{row?.userRole?.at(0)?.role?.name ?? '-'}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created on',
      type: 'element',
      render: (row) => (
        <span>{dayjs(row?.createdAt).format('DD MMM YYYY')}</span>
      ),
    },
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      header: () => <div className="flex items-center gap-2">Action</div>,
      render: (row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditModalOpen(true);
              setUser(row);
            }}
            className="p-2 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Pencil size={15} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="flex flex-col sm:flex-row">
        <UsersLinks />
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer hidden"
            id="showSuspended"
            defaultChecked={!query.isActive}
            onChange={(e) => {
              _setQuery({
                ...query,
                isActive: !e.target.checked,
              });
            }}
          />
          <label
            htmlFor="showSuspended"
            className={`mr-2 cursor-pointer rounded-lg transition-all animate-pulse select-none ${
              !query.isActive
                ? 'bg-red-500 dark:bg-red-800 hover:bg-red-800'
                : 'bg-green-500 dark:bg-green-800 hover:bg-green-800'
            }   px-2 py-1 text-white text-xs`}
          >
            {!query.isActive ? 'Inactive' : 'Active'} Users
          </label>
        </div>
      </div>
      <EditUser
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        limit={limit}
        query={query}
        skip={skip}
        user={user}
      />
      <Table
        name={'Users'}
        columns={columns}
        total={users.total}
        key={'user-table'}
        query={query}
        pageable={true}
        data={users.data}
        fetch={fetchUsers}
        skip={skip}
        setSkip={setSkip}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default UsersTable;
