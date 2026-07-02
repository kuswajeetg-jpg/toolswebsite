"use client";

import { useCallback, useState } from "react";

type FileUploadProps = {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  children: React.ReactNode;
};

export default function FileUpload({ accept, multiple, onChange, children }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onChange?.(files);
    },
    [onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={`border-2 rounded-xl p-10 text-center cursor-pointer relative transition ${
        dragging ? "border-blue-500 bg-blue-50" : "border-blue-200 hover:bg-blue-50"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) {
            onChange?.(Array.from(e.target.files));
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {children}
    </div>
  );
}
