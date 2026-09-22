import { useMutation } from "@tanstack/react-query";

import { login } from "./auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: (username: string) => login(username),
  });
}
