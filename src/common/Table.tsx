import { useEffect, useState } from 'react';
import Pagination from './Pagination';

export type ColumnType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'element'
  | 'sr_no';

export interface ColumnDef {
  key: string;
  label: string;
  type: ColumnType;
  header?: () => JSX.Element;
  render?: (row: any) => JSX.Element;
}

export interface TableType<T> {
  data: T[];
  columns: ColumnDef[];
  skip: number;
  limit: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  pageable?: boolean;
  fetch?: (query: any) => void;
  query?: any;
  total: number;
  name: string;
}

function Table<T>(props: TableType<T>) {
  const [pageNo] = useState(1);

  const {
    data,
    limit,
    setLimit,
    setSkip,
    skip,
    columns,
    pageable,
    fetch,
    query,
    total,
    name,
  } = props;

  useEffect(() => {
    if (fetch && query) {
      query.skip = skip;
      query.limit = limit;
      fetch(query);
    }
  }, [fetch, query, skip, limit]);

  return (
    <div className="bg-white shadow-md dark:bg-boxdark p-5 rounded w-full">
      <div className="overflow-auto max-h-[65vh] scrollbar">
        <table className="border-collapse w-full min-w-full">
          <thead className="border">
            <tr className="sticky top-0 text-sm" style={{ zIndex: 1 }}>
              {columns?.map((column: ColumnDef, columnIndex: number, array) => (
                <TableHeader
                  {...column}
                  key={column.key}
                  unique={column.key}
                  columnIndex={columnIndex}
                  lastIndex={array.length - 1}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {total ? (
              data?.map((item: T, rowIndex: number) => (
                <tr
                  className="hover:bg-slate-200 dark:hover:bg-slate-800"
                  key={rowIndex}
                >
                  {columns?.map((column: ColumnDef, columnIndex: number) => (
                    <TableData
                      key={rowIndex + column.key}
                      item={item}
                      column={column}
                      rowIndex={rowIndex}
                      columnIndex={columnIndex}
                      skip={skip}
                      pageNo={pageNo}
                    />
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns?.length}
                  className="h-30 py-2 px-2 border-2 text-sm border-white dark:border-boxdark bg-slate-50 dark:bg-boxdark-2/50"
                >
                  <div className=" h-30 flex items-center justify-center">
                    {name} not found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageable && (
        <Pagination
          limit={limit}
          setLimit={setLimit}
          skip={skip}
          setSkip={setSkip}
          total={total}
          name={name}
        />
      )}
    </div>
  );
}

export default Table;

const TableHeader = (
  props: ColumnDef & { unique: string; columnIndex: number; lastIndex: number },
) => {
  const { label, header, unique, columnIndex, lastIndex } = props;
  return (
    <th
      key={unique}
      className={`py-3 px-2 border-2 dark:bg-boxdark-2 bg-slate-200 text-start border-white dark:border-boxdark ${
        columnIndex === 0
          ? 'rounded-tl-xl'
          : columnIndex === lastIndex
          ? 'rounded-tr-xl'
          : ''
      }`}
    >
      {header ? header() : <span className="">{label}</span>}
    </th>
  );
};

const TableData = (props: any) => {
  const { column, item, rowIndex, pageNo, skip } = props;

  return (
    <td
      key={rowIndex + column.key}
      className={`py-2 px-2 border-2 text-sm border-white dark:border-boxdark bg-slate-50 dark:bg-boxdark-2/50`}
    >
      {column.type == 'sr_no'
        ? rowIndex + 1 * (pageNo - 1) * 10 + 1 + skip
        : column?.render
        ? column.render(item)
        : item[column.key]}
    </td>
  );
};
