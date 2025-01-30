import { useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useTeamStore } from '../../store/useTeamStore';
import { Team, TeamQuery } from '../../types/useTeamStore.types';
import AddTeamDialog from './AddTeamDialog';
import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';
import EditTeamDialog from './EditTeamDialog';

const Teams = () => {
  const { fetchTeams, teams, showMembers } = useTeamStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [team, setTeam] = useState<undefined | Team>(undefined);
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
      key: 'members',
      label: 'Asissitant Team Leads',
      type: 'element',
      render: (row) => (
        <div className="flex flex-col items-start">
          {row?.assistantTeamLeadIds?.length && !row?.assistantTeamLeadData ? (
            <button
              onClick={() => showMembers(row.id)}
              className="bg-slate-300 px-2 py-0.5 rounded-md text-black hover:bg-slate-200 dark:bg-black dark:text-white hover:dark:bg-slate-800"
            >
              Show Assistant Team Leads
            </button>
          ) : row?.assistantTeamLeadData?.length ? (
            row?.assistantTeamLeadData?.map((m) => (
              <span
                key={m.userId}
                className="py-0.5 px-2 my-0.5 bg-white dark:bg-slate-900/50 rounded-md"
              >
                {m.name} ({m.email})
              </span>
            ))
          ) : (
            <span>No Asissitant team leads</span>
          )}
        </div>
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
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      header: () => <div className="flex items-center gap-2">Action</div>,
      render: (row: Team) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditModalOpen(true);
              setTeam(row);
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
      {/* <Breadcrumb pageName="team" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <div className="flex items-center">
          <label
            className={`mr-2 cursor-pointer rounded-lg transition-all animate-pulse select-none ${
              !query.isActive
                ? 'bg-red-500 dark:bg-red-800 hover:bg-red-800'
                : 'bg-green-500 dark:bg-green-800 hover:bg-green-800'
            }   px-2 py-1 text-white text-xs`}
          >
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer hidden"
              defaultChecked={!query.isActive}
              onChange={(e) => {
                _setQuery({
                  ...query,
                  isActive: !e.target.checked,
                });
              }}
            />
            {query.isActive ? 'Archived' : 'Active'} Teams
          </label>
          <AddTeamDialog query={query} skip={skip} limit={limit} />
        </div>
        <EditTeamDialog
          query={query}
          skip={skip}
          limit={limit}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          team={team}
        />
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
