import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { FeedCard } from "@/common/components/feed-card/feed-card";
import { usePosts } from "@/config/api/posts.query";
import { useSessionStore } from "@/config/store";

export default function Profile() {
  const username = useSessionStore((state) => state.username);
  const signOut = useSessionStore((state) => state.signOut);
  const { data: myPosts = [] } = usePosts(username ?? undefined);

  return (
    <FlatList
      data={myPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard item={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>{username}&apos;s profile</Text>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.pressed,
            ]}
            onPress={signOut}
          >
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </Pressable>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  heading: {
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
  signOutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
