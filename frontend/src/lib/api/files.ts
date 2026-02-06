import { apiClient } from './client';

export interface FileData {
  id: string;
  name: string;
  folderId: string | null;
  userId: string;
  size: number;
  mimeType: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export const fileApi = {
  upload: (file: File, data: { name?: string; folderId?: string }) => {
    const formData = new FormData();
    formData.append('file', file as any);
    if (data.name) formData.append('name', data.name);
    if (data.folderId) formData.append('folderId', data.folderId);

    return apiClient.post<FileData>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  list: (params?: {
    folderId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => apiClient.get<FileData[]>('/files', { params }),

  download: (id: string) =>
    apiClient.get(`/files/${id}/download`, { responseType: 'blob' }),

  update: (id: string, data: { name: string }) =>
    apiClient.put<FileData>(`/files/${id}`, data),

  move: (id: string, data: { targetFolderId?: string }) =>
    apiClient.put<FileData>(`/files/${id}/move`, data),

  delete: (id: string) =>
    apiClient.delete(`/files/${id}`),
};
