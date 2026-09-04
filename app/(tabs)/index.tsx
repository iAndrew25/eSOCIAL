import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyPlaceholder } from "@/common/components/empty-placeholder";
import { FeedCard } from "@/common/components/feed-card";
import { useSessionStore } from "@/common/config/store";
import { usePosts } from "@/common/queries";

export default function Index() {
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const {
    data: items = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = usePosts();

  const emptyMessage = isLoading
    ? "Loading posts..."
    : isError
      ? "Couldn't load the feed. Pull to retry."
      : "No posts in the feed yet.";

  return (
    <FlatList
      data={items}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>{session}&apos;s feed</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/add-post")}
          >
            <Text style={styles.addButtonText}>Add post</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => <FeedCard item={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyPlaceholder message={emptyMessage} />}
      contentContainerStyle={styles.content}
      refreshing={isFetching}
      onRefresh={refetch}
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
  addButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
