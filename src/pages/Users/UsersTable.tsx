import dayjs from 'dayjs';
import Table, { ColumnDef } from '../../common/Table';
import { useState } from 'react';
import { UserQuery } from '../../types/useUserRolesStore.types';
import { useUserStore } from '../../store/useUserStore';
import { UsersLinks } from './Users';

const UsersTable = () => {
  const { fetchUsers, users } = useUserStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<UserQuery>({
    paginate: true,
    isActive: true,
    relation: true,
  });

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
  ];
  return (
    <>
      <UsersLinks />
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
