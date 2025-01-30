import { useEffect, useState } from 'react';
import Table, { ColumnDef } from '../../common/Table';
import { useProjectStore } from '../../store/useProjectStore';
import {
  Project as ProjectType,
  ProjectQuery,
} from '../../types/useProjectStore.types';
import AddProjectDialog from './AddProjectDialog';
import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';
import EditProjectDialog from './EditProjectDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../my-components/Tooltip';
import useDebounce from '../../hooks/useDebounce';
import { ProjectStatus } from '../../common/enums';

const Project = () => {
  const { fetchProjects, projects } = useProjectStore();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, _setQuery] = useState<ProjectQuery>({
    paginate: true,
    isActive: true,
    relation: true,
    status: [Object.keys(ProjectStatus).at(0) as keyof typeof ProjectStatus],
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [project, setProject] = useState<undefined | ProjectType>(undefined);
  const columns: ColumnDef[] = [
    {
      key: 'sr_no',
      label: 'Sr No',
      type: 'sr_no',
    },
    {
      key: 'name',
      label: 'Project/Project Code',
      type: 'element',
      render: (row) => (
        <div>
          <p>
            {row?.name} ({row?.projectCode})
          </p>
        </div>
      ),
    },
    {
      key: 'clientName',
      label: 'Client',
      type: 'element',
      render: (row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{row?.clientName}</TooltipTrigger>
            <TooltipContent className="bg-white dark:bg-slate-700 dark:text-white shadow-xl">
              <p>{row?.clientEmailId?.split(',').join(', ')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    // {
    //   key: 'description',
    //   label: 'Description',
    //   type: 'element',
    //   render: (row) => <p className="max-w-[200px]">{row?.description}</p>,
    // },
    {
      key: 'location',
      label: 'Location',
      type: 'element',
      render: (row) => <p className="max-w-[200px]">{row?.location}</p>,
    },
    // {
    //   key: 'teamLead',
    //   label: 'Project Lead',
    //   type: 'element',
    //   render: (row) => <p className="max-w-[200px]">{row?.teamLead?.name}</p>,
    // },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
    },

    // {
    //   key: 'priority',
    //   label: 'Priority',
    //   type: 'text',
    // },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   type: 'element',
    //   render: (row) => (
    //     <p
    //       className={`px-1 text-center text-[11px] rounded-xl ${ProjectStatusColors[
    //         row?.status as keyof typeof ProjectStatus
    //       ]?.bg} ${ProjectStatusColors[
    //         row?.status as keyof typeof ProjectStatus
    //       ]?.text}`}
    //     >
    //       {ProjectStatus[row?.status as keyof typeof ProjectStatus]}
    //     </p>
    //   ),
    // },
    {
      key: 'createdBy',
      label: 'Created By',
      type: 'element',
      render: (row) => <span>{row?.createdBy?.name}</span>,
    },
    {
      key: 'startDate',
      label: 'Started on',
      type: 'element',
      render: (row) => (
        <span>{dayjs(row?.startDate).format('DD MMM YYYY')}</span>
      ),
    },
    {
      key: 'Action',
      label: 'Action',
      type: 'element',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsEditModalOpen(true);
              setProject(row);
            }}
            className="p-2 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Pencil size={15} />
          </button>
          {/* <button
            title="Copy Project ID to clipboard (this will help you to add projectId in Roles and Permissions -> User Roles section) while assigning the role"
            onClick={async () => {
              const success = await copyToClipboard(row?.projectId);
              if (success) {
                toast.success('Copied to clipboard');
              } else {
                toast.error('Failed to copy to clipboard');
              }
            }}
            className="p-2 rounded-full dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Copy size={15} />
          </button> */}
        </div>
      ),
    },
  ];

  const [searchText, setSearchText] = useDebounce<string>('');
  const [searchTextClinetName, setSearchTextClinetName] =
    useDebounce<string>('');

  useEffect(() => {
    if (searchText) {
      _setQuery({
        ...query,
        name: searchText,
      });
    } else {
      _setQuery({
        ...query,
        name: undefined,
      });
    }
  }, [searchText]);

  useEffect(() => {
    if (searchTextClinetName) {
      _setQuery({
        ...query,
        clientName: searchTextClinetName,
      });
    } else {
      _setQuery({
        ...query,
        clientName: undefined,
      });
    }
  }, [searchTextClinetName]);

  return (
    <>
      {/* <Breadcrumb pageName="Project" /> */}
      <div className="w-full max-w-full flex flex-col items-end rounded-md h-full">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Search by project name"
              className="py-1 px-4 rounded-md border border-slate-300 placeholder:text-sm dark:border-slate-600 placeholder:text-slate-400 dark:bg-slate-900"
              value={searchText}
              onChange={(e) => {
                const text = e.target?.value;
                setSearchText(text);
              }}
            />
            <input
              type="text"
              placeholder="Search by client name"
              className="py-1 px-4 rounded-md border border-slate-300 placeholder:text-sm dark:border-slate-600 placeholder:text-slate-400 dark:bg-slate-900"
              value={searchTextClinetName}
              onChange={(e) => {
                const text = e.target?.value;
                setSearchTextClinetName(text);
              }}
            />
            <select
              onChange={(e) => {
                const value = e.target.value;
                 _setQuery({
                  ...query,
                  status: [value],
                });
              }}
              className="py-1 px-2 rounded-md border text-sm placeholder:text-sm border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
            >
              <option value="" disabled className="text-sm">
                Select status
              </option>

              {Object.entries(ProjectStatus).map(([key, status]) => (
                <option key={status} value={key} className="text-sm">
                  {status}
                </option>
              ))}
            </select>
          </div>
          <AddProjectDialog query={query} skip={skip} limit={limit} />
        </div>
        <EditProjectDialog
          query={query}
          skip={skip}
          limit={limit}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          project={project}
        />

        <Table
          columns={columns}
          total={projects.total}
          key={'project-table'}
          query={query}
          pageable={true}
          data={projects.data}
          fetch={fetchProjects}
          skip={skip}
          setSkip={setSkip}
          limit={limit}
          setLimit={setLimit}
          name={'Projects'}
        />
      </div>
    </>
  );
};
export default Project;
