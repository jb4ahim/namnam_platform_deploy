export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: IApiResponseMeta;
  errors?: IApiError[];
  timestamp: string;
  path: string;
  statusCode: number;
}

export interface IApiResponseMeta {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface IApiError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}