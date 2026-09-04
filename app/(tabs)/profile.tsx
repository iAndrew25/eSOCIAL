import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyPlaceholder } from "@/common/components/empty-placeholder";
import { FeedCard } from "@/common/components/feed-card";
import { useSessionStore } from "@/common/config/store";
import { usePosts, useRemovePost } from "@/common/queries";

export default function Profile() {
  const username = useSessionStore((state) => state.session);
  const signOut = useSessionStore((state) => state.signOut);
  const {
    data: myPosts = [],
    isLoading,
    isError,
  } = usePosts(username ?? undefined);
  const removePost = useRemovePost();

  const emptyMessage = isLoading
    ? "Loading posts..."
    : isError
      ? "Couldn't load your posts."
      : "You have no posts yet.";

  const confirmRemove = (id: string) => {
    Alert.alert("Remove post", "Are you sure you want to remove this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removePost.mutate(id),
      },
    ]);
  };

  return (
    <FlatList
      data={myPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FeedCard item={item} onLongPress={() => confirmRemove(item.id)} />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>{username}&apos;s profile</Text>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </Pressable>
        </View>
      }
      ListEmptyComponent={<EmptyPlaceholder message={emptyMessage} />}
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
