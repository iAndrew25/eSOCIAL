import { FeedCard } from "@/common/components/feed-card/feed-card";
import { useSessionStore } from "@/common/config/store";
import { FeedItem } from "@/common/types";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const FEED: FeedItem[] = [
  {
    id: "1",
    username: "andrei",
    description: "First post!",
    imageUrl: "https://loremflickr.com/800/600",
  },
  { id: "2", username: "maria", description: "No picture on this one" },
  { id: "3", username: "john", description: "This is a test description" },
  {
    id: "4",
    username: "jane",
    imageUrl: "https://loremflickr.com/800/700",
    description: "This is a test description",
  },
];

export default function Index() {
  const session = useSessionStore((state) => state.session);
  const router = useRouter();

  return (
    <FlatList
      data={FEED}
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
