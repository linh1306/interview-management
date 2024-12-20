/// <reference types="vite/client" />

interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode: string;
  data: T | null;
}

interface ApiListResponse<T> {
  success: boolean;
  message: string;
  errorCode: string;
  data: {
    results: T[] | [];
    metadata: {
      pageNumber: number;
      pageSize: number;
      totalPages: number;
      currentPage?: number;
    };
  };
}

interface ErrorResponse {
  message?: string;
  errorCode?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface SuspenseWrapperProps {
  children: ReactElement;
}

interface AsyncWrapperProps {
  loading: boolean;
  fulfilled: boolean;
  error?: unknown;
  children: React.JSX;
}

interface HelmetProps {
  title: string;
  description: string;
}

interface Query {
  limit?: number;
  page?: number;
  search?: string;
  filter?: string;
}

export interface RouteConfig {
  path: string;
  title: string;
  canActivate?: any;
  routeError?: string;
  component: React.ComponentType<any>;
}

export interface RouteCheck {
  route: string;
  validUser: boolean;
  isAdmin: boolean;
}
