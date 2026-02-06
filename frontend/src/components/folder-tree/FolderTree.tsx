'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folderApi, Folder } from '@/lib/api/folders';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderPlus } from 'lucide-react';

interface FolderTreeProps {
  onFolderSelect?: (folderId: string | null) => void;
  selectedFolderId?: string | null;
}

export function FolderTree({ onFolderSelect, selectedFolderId }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [creatingFolderParentId, setCreatingFolderParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const queryClient = useQueryClient();

  const { data: rootFolders } = useQuery({
    queryKey: ['folders', null],
    queryFn: async () => {
      const response = await folderApi.list({ parentId: undefined });
      return response.data;
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (data: { name: string; parentId?: string }) => folderApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['folders', variables.parentId || null] });
      setCreatingFolderParentId(null);
      setNewFolderName('');
    },
  });

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = (parentId: string | null) => {
    if (newFolderName.trim()) {
      createFolderMutation.mutate({
        name: newFolderName.trim(),
        ...(parentId && { parentId }),
      });
    }
  };

  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black">Folders</h2>
        <button
          onClick={() => setCreatingFolderParentId(null)}
          className="p-1 hover:bg-gray-200 rounded"
          title="Create root folder"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Root level create folder input */}
      {creatingFolderParentId === null && (
        <div className="mb-2 flex gap-1">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder(null);
              if (e.key === 'Escape') {
                setCreatingFolderParentId(undefined as any);
                setNewFolderName('');
              }
            }}
            placeholder="New folder..."
            className="flex-1 px-2 py-1 text-sm border rounded"
            autoFocus
          />
          <button
            onClick={() => handleCreateFolder(null)}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      )}

      {/* Root folder - shows all files */}
      <div
        className={`flex items-center gap-2 px-2 py-1.5 mb-1 rounded cursor-pointer hover:bg-gray-200 ${
          selectedFolderId === null ? 'bg-blue-100' : ''
        }`}
        onClick={() => onFolderSelect?.(null)}
      >
        <FolderIcon className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-black">All Files</span>
      </div>

      <div className="space-y-1">
        {rootFolders?.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            level={0}
            expanded={expandedFolders.has(folder.id)}
            selected={selectedFolderId === folder.id}
            onToggle={() => toggleFolder(folder.id)}
            onSelect={() => onFolderSelect?.(folder.id)}
            creatingSubFolder={creatingFolderParentId === folder.id}
            onCreateSubFolder={() => setCreatingFolderParentId(folder.id)}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            handleCreateFolder={handleCreateFolder}
            cancelCreate={() => {
              setCreatingFolderParentId(undefined as any);
              setNewFolderName('');
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface FolderItemProps {
  folder: Folder;
  level: number;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  creatingSubFolder: boolean;
  onCreateSubFolder: () => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  handleCreateFolder: (parentId: string | null) => void;
  cancelCreate: () => void;
}

function FolderItem({
  folder,
  level,
  expanded,
  selected,
  onToggle,
  onSelect,
  creatingSubFolder,
  onCreateSubFolder,
  newFolderName,
  setNewFolderName,
  handleCreateFolder,
  cancelCreate,
}: FolderItemProps) {
  const { data: subFolders } = useQuery({
    queryKey: ['folders', folder.id],
    queryFn: async () => {
      const response = await folderApi.list({ parentId: folder.id });
      return response.data;
    },
    enabled: expanded,
  });

  return (
    <div>
      <div className="flex items-center group">
        <div
          className={`flex-1 flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-200 ${
            selected ? 'bg-blue-100' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={onSelect}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="hover:bg-gray-300 rounded p-0.5 text-black"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <FolderIcon className="w-4 h-4 text-yellow-600" />
          <span className="text-sm flex-1 text-black">{folder.name}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateSubFolder();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded mr-2"
          title="Create subfolder"
        >
          <FolderPlus className="w-3 h-3" />
        </button>
      </div>

      {expanded && (
        <div>
          {creatingSubFolder && (
            <div className="flex gap-1 my-1" style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder(folder.id);
                  if (e.key === 'Escape') cancelCreate();
                }}
                placeholder="New folder..."
                className="flex-1 px-2 py-1 text-sm border rounded"
                autoFocus
              />
              <button
                onClick={() => handleCreateFolder(folder.id)}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          )}
          {subFolders?.map((subFolder) => (
            <FolderItem
              key={subFolder.id}
              folder={subFolder}
              level={level + 1}
              expanded={false}
              selected={false}
              onToggle={() => {}}
              onSelect={() => {}}
              creatingSubFolder={false}
              onCreateSubFolder={() => {}}
              newFolderName=""
              setNewFolderName={() => {}}
              handleCreateFolder={() => {}}
              cancelCreate={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
