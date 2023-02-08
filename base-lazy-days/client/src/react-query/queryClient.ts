import { createStandaloneToast } from '@chakra-ui/react';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { theme } from '../theme';
import { queryKeys } from './constants';

const toast = createStandaloneToast({ theme });

function handleError(error: unknown): void {
  const title = error instanceof Error ? error.message : error;

  /// ////////////////////////////
  // NOTE: no toast.closeAll() //
  /// ////////////////////////////

  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
});

queryClient.setQueryDefaults([queryKeys.treatments], {
  staleTime: 1000 * 60,
});

export default queryClient;
