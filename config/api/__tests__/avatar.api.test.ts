import { uploadAvatar } from "../avatar.api";

// Mock fetch at the global level
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the config to use a predictable URL
jest.mock("../config", () => ({
  API_URL: "http://localhost:3000",
}));

describe("uploadAvatar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sends PUT request to correct endpoint with FormData", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          avatarUrl: "http://localhost:3000/uploads/avatar-alice.jpg?t=123",
        }),
    });

    const result = await uploadAvatar("alice", "file:///photos/selfie.jpg");

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users/alice/avatar");
    expect(options.method).toBe("PUT");
    expect(options.body).toBeInstanceOf(FormData);

    expect(result.avatarUrl).toBe(
      "http://localhost:3000/uploads/avatar-alice.jpg?t=123"
    );
  });

  test("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      uploadAvatar("unknown", "file:///photos/selfie.jpg")
    ).rejects.toThrow("Failed to upload avatar");
  });

  test("encodes username in URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          avatarUrl: "http://localhost:3000/uploads/avatar-user%20name.jpg?t=123",
        }),
    });

    await uploadAvatar("user name", "file:///photos/selfie.jpg");

    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe("http://localhost:3000/users/user%20name/avatar");
  });
});
