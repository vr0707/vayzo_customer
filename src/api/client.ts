import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import { getToken } from '@/storage/token-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL?.trim();
export const hasApiUrl = Boolean(API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      message:
        axiosError.response?.data?.message ??
        axiosError.message ??
        'Something went wrong. Please try again.',
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
  };
}

async function unwrap<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
  const response = await request;
  return response.data;
}

export const api = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return unwrap<T>(apiClient.get<T>(url, config));
  },

  post<T, TBody = unknown>(url: string, data?: TBody, config?: AxiosRequestConfig) {
    return unwrap<T>(apiClient.post<T>(url, data, config));
  },

  put<T, TBody = unknown>(url: string, data?: TBody, config?: AxiosRequestConfig) {
    return unwrap<T>(apiClient.put<T>(url, data, config));
  },

  patch<T, TBody = unknown>(url: string, data?: TBody, config?: AxiosRequestConfig) {
    return unwrap<T>(apiClient.patch<T>(url, data, config));
  },

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return unwrap<T>(apiClient.delete<T>(url, config));
  },
};
