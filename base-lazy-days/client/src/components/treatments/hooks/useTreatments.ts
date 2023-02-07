import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import queryClient from '../../../react-query/queryClient';

async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const { data = [] } = useQuery([queryKeys.treatments], getTreatments);
  return data;
}

export function usePrefetchTreatments(): void {
  useEffect(() => {
    queryClient.prefetchQuery([queryKeys.treatments], getTreatments);
  }, []);
}
