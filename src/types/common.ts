// Base API Response Model
export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
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
export interface ListResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  message?: string;
}

// Column Definition
export interface ColumnDef {
  header: string;
  accessorKey: string;
  enableColumnFilter: boolean;
  enableSorting: boolean;
} 