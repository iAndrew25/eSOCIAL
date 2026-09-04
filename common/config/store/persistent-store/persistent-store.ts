import * as SecureStore from "expo-secure-store";

export async function getPersistentItemAsync(
  key: string,
): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function setPersistentItemAsync(
  key: string,
  value: string | null,
) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}
