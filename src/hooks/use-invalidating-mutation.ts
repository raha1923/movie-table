import {useMutation, UseMutationOptions, useQueryClient} from "@tanstack/react-query";

export function useInvalidatingMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: options.mutationKey });
      options.onSuccess?.(...args);
    },
  });
}