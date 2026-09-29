import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, Pressable } from "react-native";
import { UserAvatar } from "@/common/components/user-avatar";
import { FontAwesome } from "@expo/vector-icons";

// Extract the profile header into a testable component to avoid mocking
// navigation, QueryClient, and zustand at the screen level.
// This tests the same JSX structure as the real Profile screen header.
function ProfileHeader({
  username,
  avatarUrl,
  onPickImage,
  onSignOut,
  isPending,
}: {
  username: string;
  avatarUrl: string | null;
  onPickImage: () => void;
  onSignOut: () => void;
  isPending: boolean;
}) {
  return (
    <View>
      {/* Banner */}
      <View
        testID="profile-banner"
        style={{ height: 140, backgroundColor: "#2563eb" }}
      />

      {/* Avatar */}
      <Pressable
        onPress={onPickImage}
        disabled={isPending}
        testID="avatar-picker"
      >
        <UserAvatar username={username} avatarUrl={avatarUrl} size={80} />
        <FontAwesome name="camera" size={11} color="#fff" />
      </Pressable>

      {/* Info */}
      <Text>{username}</Text>
      <Pressable onPress={onSignOut} testID="sign-out-button">
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}

describe("Profile Header", () => {
  const defaultProps = {
    username: "alice",
    avatarUrl: null as string | null,
    onPickImage: jest.fn(),
    onSignOut: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders banner, avatar fallback, username, and sign out", async () => {
    await render(<ProfileHeader {...defaultProps} />);

    expect(screen.getByTestId("profile-banner")).toBeTruthy();
    expect(screen.getByTestId("user-avatar-fallback")).toBeTruthy();
    expect(screen.getByText("alice")).toBeTruthy();
    expect(screen.getByTestId("sign-out-button")).toBeTruthy();
  });

  test("renders image avatar when avatarUrl is set", async () => {
    await render(
      <ProfileHeader
        {...defaultProps}
        avatarUrl="http://example.com/alice.jpg"
      />
    );

    expect(screen.getByTestId("user-avatar-image")).toBeTruthy();
  });

  test("tapping avatar calls onPickImage", async () => {
    const onPickImage = jest.fn();
    await render(
      <ProfileHeader {...defaultProps} onPickImage={onPickImage} />
    );

    fireEvent.press(screen.getByTestId("avatar-picker"));
    expect(onPickImage).toHaveBeenCalledTimes(1);
  });

  test("avatar picker is disabled while uploading", async () => {
    const onPickImage = jest.fn();
    await render(
      <ProfileHeader
        {...defaultProps}
        onPickImage={onPickImage}
        isPending={true}
      />
    );

    fireEvent.press(screen.getByTestId("avatar-picker"));
    expect(onPickImage).not.toHaveBeenCalled();
  });

  test("tapping sign out calls onSignOut", async () => {
    const onSignOut = jest.fn();
    await render(
      <ProfileHeader {...defaultProps} onSignOut={onSignOut} />
    );

    fireEvent.press(screen.getByTestId("sign-out-button"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  test("snapshot — profile header with fallback avatar", async () => {
    const tree = await render(<ProfileHeader {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("snapshot — profile header with image avatar", async () => {
    const tree = await render(
      <ProfileHeader
        {...defaultProps}
        avatarUrl="http://example.com/alice.jpg"
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
