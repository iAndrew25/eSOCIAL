import { StyleSheet, Text, View } from "react-native";

type EmptyPlaceholderProps = {
  message: string;
};

export function EmptyPlaceholder({ message }: EmptyPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
