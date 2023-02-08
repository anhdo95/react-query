import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { user } = useUser();

  const { data: userAppointments = [] } = useQuery({
    queryKey: [queryKeys.userAppointments],
    queryFn: () => getUserAppointments(user),
    enabled: !!user,
  });

  return userAppointments;
}
