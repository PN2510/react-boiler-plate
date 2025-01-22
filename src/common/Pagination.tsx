import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type PropsType = {
  skip: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  total: number;
  name: string;
};

const Pagination = ({
  setSkip,
  skip,
  setLimit,
  limit,
  total,
  name,
}: PropsType) => {
  const totalPages = Math.ceil(total / limit); // Total number of pages
  const currentPage = Math.floor(skip / limit) + 1; // Current page index

  const paginatedButtons = [
    {
      onClick: () => setSkip(0),
      disabled: currentPage === 1, // Disabled if on the first page
      icon: <ChevronsLeft />,
    },
    {
      onClick: () => setSkip((prev) => Math.max(prev - limit, 0)),
      disabled: currentPage === 1, // Disabled if on the first page
      icon: <ChevronLeft />,
    },
    {
      onClick: () =>
        setSkip((prev) => Math.min(prev + limit, (totalPages - 1) * limit)),
      disabled: currentPage === totalPages, // Disabled if on the last page
      icon: <ChevronRight />,
    },
    {
      onClick: () => setSkip((totalPages - 1) * limit),
      disabled: currentPage === totalPages, // Disabled if on the last page
      icon: <ChevronsRight />,
    },
  ];

  return (
    <div className="w-full py-2 flex flex-col md:flex md:flex-row gap-2 mt-2 items-center justify-between">
      {/* Rows per page selector */}
      <div className="w-full lg:w-fit flex lg:flex lg:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-sm">Rows per page</span>
          <select
            name="rowsPerPage"
            className="rounded-md px-2 h-8 bg-slate-200 dark:bg-boxdark-2 cursor-pointer"
            value={limit}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setLimit(value);
              setSkip(0); // Reset to the first page on limit change
            }}
          >
            {[5, 10, 20, 30, 40, 50, 80, 100, 150].map((pageSize) => (
              <option value={pageSize} key={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <span className="px-4 py-1.5 text-sm rounded-md bg-slate-200 dark:bg-boxdark-2">
          Total {name}: {total}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="w-full flex lg:flex lg:w-fit lg:flex-row items-center justify-between md:justify-center gap-5 font-medium text-neutral-400 md:text-sm">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {paginatedButtons.map((button, index) => (
            <button
              key={index}
              disabled={button.disabled}
              onClick={button.onClick}
              className={`h-8 w-8 flex items-center justify-center bg-slate-200 dark:bg-boxdark-2 rounded-md ${
                button.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-slate-300'
              }`}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
