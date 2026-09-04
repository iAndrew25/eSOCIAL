import { useMutation } from "@tanstack/react-query";

import { login } from "@/common/config/api";

export function useLogin() {
  return useMutation({
    mutationFn: (username: string) => login(username),
  });
}
