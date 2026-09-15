import { router } from "expo-router";
import { Text, View } from "react-native";

export default function AddPost() {
  return (
    <View>
      <Text onPress={() => router.back()}>Add Post</Text>
    </View>
  );
}
