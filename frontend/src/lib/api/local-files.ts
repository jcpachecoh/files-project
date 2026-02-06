import { apiClient } from './client';

export interface LocalFileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modifiedAt?: string;
}

export interface LocalFilesResponse {
  currentPath: string;
  items: LocalFileItem[];
}

export const localFilesApi = {
  list: (path?: string) =>
    apiClient.get<LocalFilesResponse>('/local/files', {
      params: path ? { path } : undefined,
    }),

  download: (path: string) =>
    apiClient.get('/local/download', {
      params: { path },
      responseType: 'blob',
    }),
};
