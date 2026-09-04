import { API_URL } from "./config";

export type User = {
  username: string;
};

export async function login(username: string): Promise<User> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    throw new Error("Failed to log in");
  }
  const data: { user: User; created: boolean } = await response.json();
  return data.user;
}
