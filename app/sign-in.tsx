import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSessionStore } from "@/common/config/store";
import { useLogin } from "@/common/queries";

export default function SignIn() {
  const signIn = useSessionStore((state) => state.signIn);
  const loginMutation = useLogin();
  const [username, setUsername] = useState("");

  const trimmedUsername = username.trim();
  const canSignIn = trimmedUsername.length > 0 && !loginMutation.isPending;

  const handleSignIn = () => {
    if (!canSignIn) {
      return;
    }
    loginMutation.mutate(trimmedUsername, {
      onSuccess: (user) => {
        signIn(user.username);
      },
      onError: () =>
        Alert.alert("Sign in failed", "Please try again in a moment."),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Enter a username to sign in.</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="go"
        onSubmitEditing={handleSignIn}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          !canSignIn && styles.buttonDisabled,
        ]}
        disabled={!canSignIn}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
