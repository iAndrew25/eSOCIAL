import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { FeedCard } from "@/common/components/feed-card/feed-card";
import { UserAvatar } from "@/common/components/user-avatar";
import { useUploadAvatar } from "@/config/api/avatar.query";
import { usePosts } from "@/config/api/posts.query";
import { useSessionStore } from "@/config/store";

export default function Profile() {
  const username = useSessionStore((state) => state.username);
  const avatarUrl = useSessionStore((state) => state.avatarUrl);
  const signOut = useSessionStore((state) => state.signOut);
  const { data: myPosts = [] } = usePosts(username ?? undefined);
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to change your profile picture."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && username) {
      uploadAvatar({ username, imageUri: result.assets[0].uri });
    }
  };

  return (
    <FlatList
      data={myPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard item={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerOverlay} />
          </View>

          {/* Avatar overlapping the banner */}
          <View style={styles.avatarRow}>
            <Pressable
              onPress={pickImage}
              disabled={isPending}
              style={({ pressed }) => [pressed && styles.pressed]}
              testID="avatar-picker"
            >
              <View style={styles.avatarRing}>
                <UserAvatar
                  username={username ?? "?"}
                  avatarUrl={avatarUrl}
                  size={80}
                />
              </View>
              <View style={styles.cameraBadge}>
                <FontAwesome name="camera" size={11} color="#fff" />
              </View>
            </Pressable>
          </View>

          {/* Name + sign out */}
          <View style={styles.infoRow}>
            <Text style={styles.username}>{username}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.signOutButton,
                pressed && styles.pressedBtn,
              ]}
              onPress={signOut}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={<Text>No posts yet</Text>}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },
  header: {
    marginBottom: 8,
  },
  banner: {
    height: 140,
    backgroundColor: "#2563eb",
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  avatarRow: {
    alignItems: "center",
    marginTop: -44,
  },
  avatarRing: {
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 44,
    overflow: "hidden",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    flexShrink: 1,
  },
  signOutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 12,
  },
  signOutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
  pressedBtn: {
    opacity: 0.8,
  },
});
