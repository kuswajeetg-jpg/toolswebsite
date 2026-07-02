import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/toast/ToastContext";

export function useToastError() {
  const { showToast } = useToast();
  return useCallback(
    (message: string, ...rest: unknown[]) => {
      console.error(message, ...rest);
      showToast(message || "Something went wrong.", "error");
    },
    [showToast]
  );
}

export function useToastSuccess() {
  const { showToast } = useToast();
  return useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast]
  );
}
