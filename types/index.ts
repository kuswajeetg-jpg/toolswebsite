export interface BaseToolState {
  isProcessing: boolean;
}

export interface FileUploadState<TFile extends File = File> {
  file: TFile | null;
  preview: string | null;
}

export interface ProcessingResult<TResult = unknown> {
  result: TResult;
  url: string;
}

export interface FileSizeInfo {
  name: string;
  size: number;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes.toFixed(1)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
