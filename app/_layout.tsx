import { useSessionStore } from "@/config/store";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const init = useSessionStore((state) => state.init);
  const username = useSessionStore((state) => state.username);
  const isLoading = useSessionStore((state) => state.isLoading);

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={Boolean(username)}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-post"
          options={{ presentation: "modal", title: "Add Post" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!Boolean(username)}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
