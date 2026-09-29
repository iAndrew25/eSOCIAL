import React from "react";
import { render, screen } from "@testing-library/react-native";
import { UserAvatar } from "../user-avatar";

describe("UserAvatar", () => {
  test("renders fallback with initial when no avatarUrl", async () => {
    await render(<UserAvatar username="bob" avatarUrl={null} size={40} />);

    expect(screen.getByTestId("user-avatar-fallback")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
  });

  test("renders image when avatarUrl is provided", async () => {
    await render(
      <UserAvatar
        username="bob"
        avatarUrl="http://example.com/bob.jpg"
        size={40}
      />
    );

    expect(screen.getByTestId("user-avatar-image")).toBeTruthy();
  });

  test("snapshot — fallback avatar", async () => {
    const tree = await render(
      <UserAvatar username="carol" avatarUrl={null} size={60} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("snapshot — image avatar", async () => {
    const tree = await render(
      <UserAvatar
        username="carol"
        avatarUrl="http://example.com/carol.jpg"
        size={60}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
