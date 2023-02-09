import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import jsonpatch from 'fast-json-patch';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import queryClient from '../../../react-query/queryClient';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<void> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  return axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
}

export function usePatchUser(): UseMutateFunction<void, unknown, User> {
  const toast = useCustomToast();
  const { user, updateUser } = useUser();
  const { mutate } = useMutation({
    mutationFn: (newUser: User) => patchUserOnServer(newUser, user),
    onMutate: async (newUser: User) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries([queryKeys.user]);

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData([queryKeys.user]) as User;

      // Optimistically update to the new value
      updateUser(newUser);

      // Return a context object with the snapshotted value
      return { previousUser };
    },
    // It's the good practice to always refetch after error or success
    onError: (error, newUser, context) => {
      updateUser(context.previousUser);
      toast({
        title: 'Update failed, restoring the previous values',
        status: 'error',
      });
    },
    onSuccess: () => {
      toast({
        title: 'User updated!',
        status: 'success',
      });
    },
    // If the mutation fails, use the context returned from `onMutate` to rollback
    onSettled: () => queryClient.invalidateQueries([queryKeys.user]),
  });

  return mutate;
}
