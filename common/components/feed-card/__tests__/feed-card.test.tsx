import React from "react";
import { render, screen } from "@testing-library/react-native";
import { FeedCard } from "../feed-card";

describe("FeedCard", () => {
  const baseItem = {
    id: "1",
    username: "alice",
    description: "Hello world",
  };

  test("renders fallback avatar when avatarUrl is null", async () => {
    await render(<FeedCard item={{ ...baseItem, avatarUrl: null }} />);

    expect(screen.getByTestId("user-avatar-fallback")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("alice")).toBeTruthy();
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  test("renders image avatar when avatarUrl is provided", async () => {
    await render(
      <FeedCard
        item={{ ...baseItem, avatarUrl: "http://example.com/avatar.jpg" }}
      />
    );

    expect(screen.getByTestId("user-avatar-image")).toBeTruthy();
    expect(screen.getByText("alice")).toBeTruthy();
  });

  test("renders post image when imageUrl is provided", async () => {
    await render(
      <FeedCard
        item={{
          ...baseItem,
          imageUrl: "http://example.com/photo.jpg",
          avatarUrl: null,
        }}
      />
    );

    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  test("snapshot — card with avatar and image", async () => {
    const tree = await render(
      <FeedCard
        item={{
          ...baseItem,
          avatarUrl: "http://example.com/avatar.jpg",
          imageUrl: "http://example.com/photo.jpg",
        }}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("snapshot — card with fallback avatar, no image", async () => {
    const tree = await render(
      <FeedCard item={{ ...baseItem, avatarUrl: null }} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
