import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { useSessionStore } from "@/common/config/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);
  const init = useSessionStore((state) => state.init);

  useEffect(() => {
    init().then(() => {
      SplashScreen.hide();
    });
  }, [init]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-post"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Add post",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
