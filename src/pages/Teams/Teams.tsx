import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTeamStore } from '../../store/useTeamStore';
import { TeamQuery } from '../../types/useTeamStore.types';
import AddTeamDialog from './AddTeamDialog';
import dayjs from 'dayjs';

const Teams = () => {
  const { fetchTeams, teams, showMembers } = useTeamStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<TeamQuery>({
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
    // {
    //   key: 'project',
    //   label: 'Project',
    //   type: 'element',
    //   render: (row) => <p className="max-w-[200px]">{row?.project?.name}</p>,
    // },
    {
      key: 'members',
      label: 'Members',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.members?.length && !row?.membersData ? (
            <button
              onClick={() => showMembers(row.id)}
              className="bg-slate-300 px-2 py-0.5 rounded-md text-black hover:bg-slate-200 dark:bg-black dark:text-white hover:dark:bg-slate-800"
            >
              Show Members
            </button>
          ) : (
            row?.membersData?.map((m) => (
              <span
                key={m.userId}
                className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
              >
                {m.name} ({m.email})
              </span>
            ))
          )}
        </div>
        // <p className="max-w-[200px]">{JSON.stringify(row?.members)}</p>
      ),
    },
    {
      key: 'teamLeadId',
      label: 'Team lead',
      type: 'element',
      render: (row) => (
        <span>
          {row?.teamLead?.name} <br /> ({row?.teamLead?.email})
        </span>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => (
        <span>
          {row?.createdBy?.name} <br /> ({row?.createdBy?.email})
        </span>
      ),
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
      {/* <Breadcrumb pageName="team" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <AddTeamDialog query={query} skip={skip} limit={limit} />

        <Table
          name={'Teams'}
          columns={columns}
          total={teams.total}
          key={'team-table'}
          query={query}
          pageable={true}
          data={teams.data}
          fetch={fetchTeams}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
};
export default Teams;
