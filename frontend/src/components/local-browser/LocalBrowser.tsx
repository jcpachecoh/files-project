'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { localFilesApi, LocalFileItem } from '@/lib/api/local-files';
import {
  Folder,
  File as FileIcon,
  Home,
  ChevronRight,
  Download,
  Loader2,
  HardDrive,
} from 'lucide-react';

export function LocalBrowser() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [pathInput, setPathInput] = useState<string>('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['localFiles', currentPath],
    queryFn: async () => {
      const response = await localFilesApi.list(currentPath || undefined);
      return response.data;
    },
  });

  const handleNavigate = (item: LocalFileItem) => {
    if (item.isDirectory) {
      setCurrentPath(item.path);
      setPathInput(item.path);
    }
  };

  const handleGoHome = () => {
    setCurrentPath('');
    setPathInput('');
  };

  const handlePathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPath(pathInput);
  };

  const handleDownload = async (item: LocalFileItem) => {
    try {
      const response = await localFilesApi.download(item.path);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '-';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getParentPath = (path: string): string => {
    if (!path) return '';
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return parts.join('/');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Local File Browser</h2>
        </div>

        {/* Path Input */}
        <form onSubmit={handlePathSubmit} className="flex gap-2">
          <button
            type="button"
            onClick={handleGoHome}
            className="px-3 py-2 bg-white border rounded hover:bg-gray-50 transition-colors"
            title="Go to home directory"
          >
            <Home className="w-4 h-4 text-gray-600" />
          </button>
          <input
            type="text"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="Enter path or leave empty for home directory..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Browse
          </button>
        </form>

        {/* Current Path Display */}
        {data?.currentPath && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <span className="font-medium">Current:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {data.currentPath}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
            <p className="font-medium">Error loading files</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : 'Failed to load directory'}
            </p>
          </div>
        )}

        {data && !isLoading && (
          <div className="space-y-1">
            {/* Parent Directory Link */}
            {currentPath && (
              <button
                onClick={() => {
                  const parentPath = getParentPath(currentPath);
                  setCurrentPath(parentPath);
                  setPathInput(parentPath);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-left"
              >
                <Folder className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span className="font-medium text-gray-700">..</span>
              </button>
            )}

            {/* File/Folder List */}
            {!data.items || data.items.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>This directory is empty</p>
              </div>
            ) : (
              data.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors group"
                >
                  {item.isDirectory ? (
                    <Folder className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}

                  <button
                    onClick={() => handleNavigate(item)}
                    className="flex-1 text-left truncate"
                    disabled={!item.isDirectory}
                  >
                    <span className="text-gray-800 hover:text-blue-600 font-medium">
                      {item.name}
                    </span>
                  </button>

                  <span className="text-sm text-gray-500 w-20 text-right">
                    {formatFileSize(item.size)}
                  </span>

                  {!item.isDirectory && (
                    <button
                      onClick={() => handleDownload(item)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      title="Download file"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  )}

                  {item.isDirectory && (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
