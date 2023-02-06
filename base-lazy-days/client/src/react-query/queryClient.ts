import { createStandaloneToast } from '@chakra-ui/react';
import { QueryCache, QueryClient } from '@tanstack/react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  const title = error instanceof Error ? error.message : error;

  /// ////////////////////////////
  // NOTE: no toast.closeAll() //
  /// ////////////////////////////

  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

export default new QueryClient({
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
});
