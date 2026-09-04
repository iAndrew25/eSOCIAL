import { Image } from "expo-image";
import { Pressable, StyleSheet, Text } from "react-native";

import { resolveImageUrl } from "@/common/config/api";
import { FeedItem } from "@/common/types";

const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

type FeedCardProps = {
  item: FeedItem;
  onLongPress?: () => void;
};

export function FeedCard({ item, onLongPress }: FeedCardProps) {
  const hasImage = !!item.imageUrl;

  return (
    <Pressable
      style={styles.card}
      onLongPress={onLongPress}
      disabled={!onLongPress}
    >
      <Text style={[styles.username, !hasImage && styles.usernameNoImage]}>
        {item.username}
      </Text>
      {hasImage ? (
        <Image
          style={styles.image}
          source={resolveImageUrl(item.imageUrl)}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={200}
        />
      ) : null}
      <Text
        style={[styles.description, !hasImage && styles.descriptionNoImage]}
      >
        {item.description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  usernameNoImage: {
    paddingBottom: 2,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f0f0f0",
  },
  description: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  descriptionNoImage: {
    paddingTop: 0,
  },
});
