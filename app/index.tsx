import { FeedCard } from "@/common/components/feed-card/feed-card";
import { FeedItem } from "@/common/types";
import { FlatList, StyleSheet } from "react-native";

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
  return (
    <FlatList
      data={FEED}
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
});
