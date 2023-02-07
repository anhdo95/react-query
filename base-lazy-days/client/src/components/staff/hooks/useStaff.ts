import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  const [filter, setFilter] = useState('all');

  const filterSelectFn = useCallback(
    (staff) => filterByTreatment(staff, filter),
    [filter],
  );

  const { data: staff = [] } = useQuery([queryKeys.staff], getStaff, {
    select: filter !== 'all' && filterSelectFn,
  });

  return { staff, filter, setFilter };
}
