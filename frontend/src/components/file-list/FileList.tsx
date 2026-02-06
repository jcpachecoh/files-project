'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileApi, FileData } from '@/lib/api/files';
import {
  Download,
  Trash2,
  Edit,
  MoreVertical,
  FileIcon,
  Image as ImageIcon,
  FileText,
  File as FileGeneric,
} from 'lucide-react';

interface FileListProps {
  folderId?: string | null;
}

export function FileList({ folderId }: FileListProps) {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [menuOpenForFile, setMenuOpenForFile] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ['files', folderId],
    queryFn: async () => {
      const response = await fileApi.list({ folderId: folderId || undefined });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fileApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', folderId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => fileApi.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', folderId] });
      setEditingFileId(null);
      setNewFileName('');
    },
  });

  const handleDownload = async (file: FileData) => {
    try {
      const response = await fileApi.download(file.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRename = (file: FileData) => {
    setEditingFileId(file.id);
    setNewFileName(file.name);
    setMenuOpenForFile(null);
  };

  const handleSaveRename = (fileId: string) => {
    if (newFileName.trim()) {
      updateMutation.mutate({ id: fileId, name: newFileName.trim() });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    } else if (mimeType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (mimeType.includes('text')) {
      return <FileText className="w-8 h-8 text-gray-500" />;
    }
    return <FileGeneric className="w-8 h-8 text-gray-400" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FileIcon className="w-16 h-16 mb-4" />
        <p>No files in this folder</p>
        <p className="text-sm mt-2">Upload files to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative group"
        >
          {/* File Icon */}
          <div className="flex items-center justify-center mb-3">{getFileIcon(file.mimeType)}</div>

          {/* File Name */}
          {editingFileId === file.id ? (
            <div className="mb-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename(file.id);
                  if (e.key === 'Escape') {
                    setEditingFileId(null);
                    setNewFileName('');
                  }
                }}
                className="w-full px-2 py-1 text-sm border rounded"
                autoFocus
              />
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleSaveRename(file.id)}
                  className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingFileId(null);
                    setNewFileName('');
                  }}
                  className="flex-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h3 className="font-medium text-sm mb-2 truncate" title={file.name}>
              {file.name}
            </h3>
          )}

          {/* File Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>{formatFileSize(file.size)}</p>
            <p className="truncate" title={file.mimeType}>
              {file.mimeType}
            </p>
          </div>

          {/* Actions Menu */}
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setMenuOpenForFile(menuOpenForFile === file.id ? null : file.id)}
              className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpenForFile === file.id && (
              <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    handleDownload(file);
                    setMenuOpenForFile(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm text-left"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => handleRename(file)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-sm text-left"
                >
                  <Edit className="w-4 h-4" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${file.name}?`)) {
                      deleteMutation.mutate(file.id);
                    }
                    setMenuOpenForFile(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-sm text-left text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
