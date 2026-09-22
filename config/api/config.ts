import { Platform } from "react-native";

// Android emulators can't reach the host machine via `localhost` (that points
// at the emulator itself). The host loopback is exposed at `10.0.2.2` instead.
const defaultHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_URL = `http://${defaultHost}:3000`;
