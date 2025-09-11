// lib/utils/error-handler.ts

import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ErrorResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    errorMessage?: string;
    showToast?: boolean;
    onError?: (error: unknown) => void;
  }
): Promise<ErrorResponse<T>> {
  try {
    const data = await operation();
    return { data };
  } catch (error: unknown) {
    console.error('Operation failed:', error);
    
    const errorObj = error as Error & { code?: string; details?: unknown };
    const errorMessage = options?.errorMessage || errorObj?.message || 'An unexpected error occurred';
    
    if (options?.showToast !== false) {
      toast.error(errorMessage);
    }
    
    if (options?.onError) {
      options.onError(error);
    }
    
    return {
      error: {
        message: errorMessage,
        code: errorObj?.code,
        details: errorObj?.details
      }
    };
  }
}

export function handleSupabaseError(error: unknown): string {
  const errorObj = error as Error & { code?: string };
  if (errorObj?.code === '23505') {
    return 'This record already exists';
  }
  if (errorObj?.code === '23503') {
    return 'Cannot delete this record as it is referenced by other data';
  }
  if (errorObj?.code === '42501') {
    return 'You do not have permission to perform this action';
  }
  if (errorObj?.code === 'PGRST116') {
    return 'Record not found';
  }
  return errorObj?.message || 'Database operation failed';
}