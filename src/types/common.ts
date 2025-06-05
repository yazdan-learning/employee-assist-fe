// Base API Response Model
export interface BaseResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string | null;
  errors: string | null;
  data: T;
}

// List Request Model
export interface ListRequest {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

// List Response Model
export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type ListResponse<T> = BaseResponse<PaginatedData<T>>;

// Column Definition
export interface ColumnDef {
  header: string;
  accessorKey: string;
  enableColumnFilter: boolean;
  enableSorting: boolean;
} 