import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useUserRolesStore } from '../../store/useUserRolesStore';
import {
  UserRoles as UserRolesType,
  UserRolesQuery,
} from '../../types/useUserRolesStore.types';
import AddUserRoleDialog from './AddUserRoleDialog';
const UserRoles = () => {
  const { fetchUserRoles, userRoles } = useUserRolesStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<UserRolesQuery>({
    paginate: true,
    isActive: true,
    isDefault: true,
    relation: true,
  });
  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'roleId',
      label: 'Role id',
      type: 'text',
    },
    {
      key: 'role.name',
      label: 'Role Name',
      type: 'element',
      render: (row: UserRolesType) => (
        <div className="flex flex-col items-start">
          <span className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md">
            {row.role?.name}
          </span>
        </div>
      ),
    },
    {
      key: 'role.user.name',
      label: 'Email ID ( Name )',
      type: 'element',
      render: (row: UserRolesType) => (
        <div className="flex flex-col items-start">
          <span className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md">
            {row?.user?.email} ( {row?.user?.name} )
          </span>
        </div>
      ),
    },
    {
      key: 'row.role.permissionIds',
      label: 'Permission ids',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.role?.permissionIds?.map(
            (permission: string, index: number) => (
              <span
                key={index}
                className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
              >
                {++index}. {permission}
              </span>
            ),
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Active',
      type: 'element',
      render: (row) => <>{row?.isActive ? 'Yes' : 'No'}</>,
    },
  ];

  return (
    <>
      {/* <Breadcrumb pageName="UserRoles" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddUserRoleDialog limit={limit} query={query} skip={skip} />
        <Table
          name={'User roles'}
          columns={columns}
          total={userRoles.total}
          key={'user-roles-table'}
          query={query}
          pageable={true}
          data={userRoles.data}
          fetch={fetchUserRoles}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default UserRoles;
