import { Platform } from "react-native";

// Android emulators can't reach the host machine via `localhost` (that points
// at the emulator itself). The host loopback is exposed at `10.0.2.2` instead.
const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${defaultHost}:3000`;

// Uploaded images are stored as host-relative paths (e.g. `/uploads/x.jpg`) so
// each device resolves them against its own reachable base URL. Absolute URLs
// (like the seeded https images) are returned untouched.
export function resolveImageUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_URL}${url}`;
}
