
import { QueryClient } from "@tanstack/react-query";
import { toast } from 'sonner';

// Create the queryClient with enhanced security options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Add security related settings
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - replaced cacheTime which is deprecated
      // Fix: Using meta.onError instead of onSettled for v5 React Query
      meta: {
        onError: (error: unknown) => {
          console.error('Query error:', error);
          toast.error('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        }
      }
    },
    mutations: {
      // Fix: Using meta.onError instead of onSettled for v5 React Query
      meta: {
        onError: (error: unknown) => {
          console.error('Mutation error:', error);
          toast.error('Ошибка сохранения данных. Пожалуйста, попробуйте снова.');
        }
      }
    }
  },
});
