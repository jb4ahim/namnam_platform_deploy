export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_PAGE: 1,
  DEFAULT_SORT_ORDER: 'ASC' as const,
  
  HEADERS: {
    X_TOTAL_COUNT: 'x-total-count',
    X_PAGE: 'x-page',
    X_PAGE_SIZE: 'x-page-size',
    X_TOTAL_PAGES: 'x-total-pages',
  },
  
  METADATA_KEYS: {
    ROLES: 'roles',
    IS_PUBLIC: 'isPublic',
    CURRENT_USER: 'currentUser',
  },
} as const;

export const HTTP_STATUS_MESSAGES = {
  200: 'Success',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
} as const;