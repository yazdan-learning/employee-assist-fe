import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { Link } from "react-router-dom";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import JobListGlobalFilter from "./GlobalSearchFilter";

// Column Filter
const Filter = ({
  column,
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <React.Fragment>
      <Col sm={4}>
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Col>
    </React.Fragment>
  );
};

interface TableContainerProps {
  columns?: any;
  data?: any;
  divClassName?: any;
  tableClass?: any;
  theadClass?: any;
  isBordered?: boolean;
  isGlobalFilter?: boolean;
  isPagination?: boolean;
  paginationWrapper?: string;
  SearchPlaceholder?: string;
  pagination?: string;
  handleUserClick?: any;
  buttonClass?: string;
  buttonName?: string;
  isAddButton?: boolean;
  isCustomPageSize?: boolean;
  isJobListGlobalFilter?: boolean;
  // Server-side props
  onSearch?: (value: string) => void;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  loading?: boolean;
}

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  pagination,
  buttonClass,
  buttonName,
  isAddButton,
  isCustomPageSize,
  handleUserClick,
  isJobListGlobalFilter,
  // Server-side props
  onSearch,
  onSort,
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  totalPages = 1,
  loading = false,
}: TableContainerProps) => {
  const [globalFilter, setGlobalFilter] = useState("");

  // Handle search with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) {
        onSearch(globalFilter);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [globalFilter, onSearch]);

  const table = useReactTable({
    columns,
    data,
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  const handleSort = (column: any) => {
    if (onSort && column.getCanSort()) {
      const currentSortDirection = column.getIsSorted();
      const nextSortDirection = !currentSortDirection
        ? "asc"
        : currentSortDirection === "asc"
        ? "desc"
        : "asc";
      onSort(column.id, nextSortDirection);
    }
  };

  return (
    <Fragment>
      <Row className="mb-2">
        {isCustomPageSize && (
          <Col sm={2}>
            <select
              className="form-select pageSize mb-2"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </Col>
        )}

        {isGlobalFilter && (
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="form-control search-box me-2 mb-2 d-inline-block"
            placeholder={SearchPlaceholder}
          />
        )}

        {isAddButton && (
          <Col sm={6}>
            <div className="text-sm-end">
              <Button
                type="button"
                className={buttonClass}
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus me-1"></i> {buttonName}
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className={divClassName}>
        {loading ? (
          <div className="text-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table hover className={tableClass} bordered={isBordered}>
            <thead className={theadClass}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={() => handleSort(header.column)}
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span>
                        {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                        {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {isPagination && (
          <Row>
            <Col sm={12} md={5}>
              <div className="dataTables_info">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
                entries
              </div>
            </Col>
            <Col sm={12} md={7}>
              <div className={paginationWrapper}>
                <ul className={pagination}>
                  <li
                    className={`paginate_button page-item previous ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <Link
                      to="#"
                      className="page-link"
                      onClick={() => onPageChange?.(currentPage - 1)}
                    >
                      <i className="mdi mdi-chevron-left"></i>
                    </Link>
                  </li>
                  {(() => {
                    const pages: (number | string)[] = [];
                    const showEllipsis = totalPages > 7;

                    // Always show first page
                    pages.push(1);

                    if (showEllipsis) {
                      if (currentPage <= 4) {
                        // Show first 5 pages + ellipsis + last page
                        for (let i = 2; i <= 5; i++) {
                          pages.push(i);
                        }
                        pages.push("...");
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 3) {
                        // Show first page + ellipsis + last 5 pages
                        pages.push("...");
                        for (let i = totalPages - 4; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
                        pages.push("...");
                        pages.push(currentPage - 1);
                        pages.push(currentPage);
                        pages.push(currentPage + 1);
                        pages.push("...");
                        pages.push(totalPages);
                      }
                    } else {
                      // Show all pages if total pages <= 7
                      for (let i = 2; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    }

                    return pages.map((page, index) => (
                      <li
                        key={index}
                        className={`paginate_button page-item ${
                          page === "..."
                            ? ""
                            : currentPage === page
                            ? "active"
                            : ""
                        }`}
                      >
                        {page === "..." ? (
                          <span className="page-link">...</span>
                        ) : (
                          <Link
                            to="#"
                            className="page-link"
                            onClick={() => onPageChange?.(page as number)}
                          >
                            {page}
                          </Link>
                        )}
                      </li>
                    ));
                  })()}
                  <li
                    className={`paginate_button page-item next ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <Link
                      to="#"
                      className="page-link"
                      onClick={() => onPageChange?.(currentPage + 1)}
                    >
                      <i className="mdi mdi-chevron-right"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Fragment>
  );
};

export default TableContainer;
