import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPost,
  deletePost,
  fetchPosts,
  type CreatePostInput,
} from "@/common/config/api";

export const postsQueryKeys = {
  all: ["posts"] as const,
  byUser: (username: string) => ["posts", username] as const,
};

export function usePosts(username?: string) {
  return useQuery({
    queryKey: username ? postsQueryKeys.byUser(username) : postsQueryKeys.all,
    queryFn: () => fetchPosts(username),
  });
}

export function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}

export function useRemovePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}
