export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: Meta;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponse {
  status: 'error';
  error: {
    code: number;
    message: string;
    details?: ErrorDetail[];
  };
}
