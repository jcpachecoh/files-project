'use client';

import { useState } from 'react';
import { FolderTree } from '@/components/folder-tree/FolderTree';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { FileList } from '@/components/file-list/FileList';
import { LocalBrowser } from '@/components/local-browser/LocalBrowser';
import { HardDrive, Cloud } from 'lucide-react';

type ViewMode = 'cloud' | 'local';

export default function Home() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cloud');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - only show for cloud mode */}
      {viewMode === 'cloud' && (
        <FolderTree onFolderSelect={setSelectedFolderId} selectedFolderId={selectedFolderId} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">File System Management</h1>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('cloud')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  viewMode === 'cloud'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Cloud className="w-4 h-4" />
                Cloud Storage
              </button>
              <button
                onClick={() => setViewMode('local')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  viewMode === 'local'
                    ? 'bg-white shadow-sm text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                Local Files
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {viewMode === 'cloud' ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Upload Files</h2>
                <FileUpload folderId={selectedFolderId} />
              </section>

              {/* File List */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  {selectedFolderId ? 'Files in this folder' : 'All Files'}
                </h2>
                <FileList folderId={selectedFolderId} />
              </section>
            </div>
          ) : (
            <LocalBrowser />
          )}
        </main>
      </div>
    </div>
  );
}
