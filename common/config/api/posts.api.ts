import { FeedItem } from "@/common/types";

import { API_URL } from "./config";

export type CreatePostInput = {
  username: string;
  description: string;
  imageUri?: string;
};

export async function fetchPosts(username?: string): Promise<FeedItem[]> {
  const query = username ? `?username=${encodeURIComponent(username)}` : "";
  const response = await fetch(`${API_URL}/posts${query}`);
  if (!response.ok) {
    throw new Error("Failed to load posts");
  }
  return response.json();
}

export async function createPost(input: CreatePostInput): Promise<FeedItem> {
  const formData = new FormData();
  formData.append("username", input.username);
  formData.append("description", input.description);

  if (input.imageUri) {
    const fileName = input.imageUri.split("/").pop() ?? "photo.jpg";
    const extension = fileName.split(".").pop()?.toLowerCase();
    const type = extension ? `image/${extension}` : "image";
    // React Native's FormData accepts this { uri, name, type } shape for files.
    formData.append("image", {
      uri: input.imageUri,
      name: fileName,
      type,
    } as unknown as Blob);
  }

  // Let fetch set the multipart Content-Type (with boundary) automatically.
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
}

export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
}
