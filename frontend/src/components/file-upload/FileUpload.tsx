'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileApi } from '@/lib/api/files';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploadProps {
  folderId?: string | null;
}

export function FileUpload({ folderId }: FileUploadProps) {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => fileApi.upload(file, { folderId: folderId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', folderId] });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadMutation.mutate(file);
      });
    },
    [uploadMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        } ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2 font-medium">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-400">Maximum file size: 100MB</p>
              </div>
            )}
          </>
        )}
      </div>

      {uploadMutation.isError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          Failed to upload file. Please try again.
        </div>
      )}

      {uploadMutation.isSuccess && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
          File uploaded successfully!
        </div>
      )}
    </div>
  );
}
