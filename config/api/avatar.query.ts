import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSessionStore } from "@/config/store";
import { uploadAvatar } from "./avatar.api";
import { postsQueryKeys } from "./posts.query";

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const setAvatarUrl = useSessionStore((state) => state.setAvatarUrl);

  return useMutation({
    mutationFn: ({
      username,
      imageUri,
    }: {
      username: string;
      imageUri: string;
    }) => uploadAvatar(username, imageUri),
    onSuccess: (data) => {
      setAvatarUrl(data.avatarUrl);
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}
