// Mock expo-image — it's a native module not available in the test environment
jest.mock("expo-image", () => {
  const mockReact = require("react");
  const { View } = require("react-native");
  return {
    Image: (props) =>
      mockReact.createElement(View, { ...props, testID: props.testID }),
  };
});

// Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
  }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: "file:///mock/avatar.jpg" }],
  }),
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => {
  const mockReact = require("react");
  const { Text } = require("react-native");
  return {
    FontAwesome: (props) =>
      mockReact.createElement(Text, { testID: props.testID }, props.name),
  };
});
