import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,
      gcTime:               1000 * 60 * 10,
      retry:                2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Erreur inattendue';
        console.error(msg); // Plus tard brancher à un Toast system
      },
    },
  },
});
