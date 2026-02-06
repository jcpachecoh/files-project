import { apiClient } from './client';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const folderApi = {
  create: (data: { name: string; parentId?: string }) =>
    apiClient.post<Folder>('/folders', data),

  list: (params?: { parentId?: string; limit?: number; offset?: number }) =>
    apiClient.get<Folder[]>('/folders', { params }),

  update: (id: string, data: { name: string }) =>
    apiClient.put<Folder>(`/folders/${id}`, data),

  move: (id: string, data: { targetFolderId?: string }) =>
    apiClient.put<Folder>(`/folders/${id}/move`, data),

  delete: (id: string) =>
    apiClient.delete(`/folders/${id}`),
};
