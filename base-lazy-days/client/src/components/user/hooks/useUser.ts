import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import queryClient from '../../../react-query/queryClient';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      signal,
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const { data: user } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: ({ signal }) => getUser(user, signal),
    initialData: getStoredUser,
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    setStoredUser(newUser);
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.setQueryData([queryKeys.user], null);
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
    clearStoredUser();
  }

  return { user, updateUser, clearUser };
}
