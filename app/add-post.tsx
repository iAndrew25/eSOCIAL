import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSessionStore } from "@/common/config/store";
import { useAddPost } from "@/common/queries";

export default function AddPost() {
  const username = useSessionStore((state) => state.session);
  const addPost = useAddPost();

  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const trimmedDescription = description.trim();
  const canPost =
    (trimmedDescription.length > 0 || !!imageUri) && !addPost.isPending;

  const addPicture = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to add an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddPost = () => {
    if (!canPost) {
      return;
    }
    addPost.mutate(
      {
        username: username ?? "unknown",
        description: trimmedDescription,
        imageUri: imageUri ?? undefined,
      },
      {
        onSuccess: () => router.back(),
        onError: () =>
          Alert.alert("Error", "Failed to add post. Please try again."),
      },
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={({ pressed }) => [
          styles.galleryButton,
          pressed && styles.pressed,
        ]}
        onPress={addPicture}
      >
        <Text style={styles.galleryButtonText}>Add picture</Text>
      </Pressable>

      {imageUri ? (
        <Image
          style={styles.preview}
          source={imageUri}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.postButton,
          pressed && styles.pressed,
          !canPost && styles.postButtonDisabled,
        ]}
        disabled={!canPost}
        onPress={handleAddPost}
      >
        <Text style={styles.postButtonText}>
          {addPost.isPending ? "Adding..." : "Add post"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  galleryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  galleryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  postButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
