import { API_URL } from "./config";

export async function uploadAvatar(
  username: string,
  imageUri: string
): Promise<{ avatarUrl: string }> {
  const fileName = imageUri.split("/").pop() ?? "avatar.jpg";
  const extension = fileName.split(".").pop()?.toLowerCase();
  const type = extension ? `image/${extension}` : "image/jpeg";

  const formData = new FormData();
  formData.append("avatar", {
    uri: imageUri,
    name: fileName,
    type,
  } as unknown as Blob);

  const response = await fetch(`${API_URL}/users/${encodeURIComponent(username)}/avatar`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload avatar");
  }

  return response.json();
}
