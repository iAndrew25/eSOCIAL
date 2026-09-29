import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  size: number;
}

function getHueFromUsername(username: string): number {
  return (username.charCodeAt(0) * 37) % 360;
}

export function UserAvatar({ username, avatarUrl, size }: UserAvatarProps) {
  const letter = username.charAt(0).toUpperCase();
  const hue = getHueFromUsername(username);
  const borderRadius = size / 2;

  if (avatarUrl) {
    return (
      <Image
        source={avatarUrl}
        style={[
          styles.image,
          { width: size, height: size, borderRadius },
        ]}
        contentFit="cover"
        transition={200}
        testID="user-avatar-image"
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: `hsl(${hue}, 55%, 55%)`,
        },
      ]}
      testID="user-avatar-fallback"
    >
      <Text style={[styles.letter, { fontSize: size * 0.44 }]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#f0f0f0",
  },
  fallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  letter: {
    color: "#fff",
    fontWeight: "700",
  },
});
