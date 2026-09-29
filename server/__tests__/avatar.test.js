const path = require("path");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  app._resetState();
});

describe("POST /login", () => {
  test("returns avatarUrl field for existing user", async () => {
    const res = await request(app).post("/login").send({ username: "alice" });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("avatarUrl");
    expect(res.body.user.avatarUrl).toBeNull();
  });

  test("returns avatarUrl field for new user", async () => {
    const res = await request(app).post("/login").send({ username: "newuser" });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("avatarUrl");
    expect(res.body.user.avatarUrl).toBeNull();
  });
});

describe("PUT /users/:username/avatar", () => {
  test("uploads avatar and returns avatarUrl", async () => {
    const testImage = path.join(__dirname, "fixtures", "test-avatar.jpg");

    const res = await request(app)
      .put("/users/alice/avatar")
      .attach("avatar", testImage);

    expect(res.status).toBe(200);
    expect(res.body.avatarUrl).toMatch(/\/uploads\/avatar-alice\.jpg\?t=\d+/);
  });

  test("returns 404 for unknown user", async () => {
    const testImage = path.join(__dirname, "fixtures", "test-avatar.jpg");

    const res = await request(app)
      .put("/users/unknown/avatar")
      .attach("avatar", testImage);

    expect(res.status).toBe(404);
  });

  test("returns 400 when no file is provided", async () => {
    const res = await request(app).put("/users/alice/avatar").send();

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No image file provided");
  });
});

describe("GET /posts", () => {
  test("includes avatarUrl in each post", async () => {
    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    for (const post of res.body) {
      expect(post).toHaveProperty("avatarUrl");
    }
  });

  test("reflects updated avatar in posts after upload", async () => {
    const testImage = path.join(__dirname, "fixtures", "test-avatar.jpg");

    // Upload avatar for alice
    await request(app).put("/users/alice/avatar").attach("avatar", testImage);

    // Fetch posts — alice's posts should have the new avatarUrl
    const res = await request(app).get("/posts");
    const alicePosts = res.body.filter((p) => p.username === "alice");

    expect(alicePosts.length).toBeGreaterThan(0);
    for (const post of alicePosts) {
      expect(post.avatarUrl).toMatch(/\/uploads\/avatar-alice\.jpg\?t=\d+/);
    }
  });

  test("returns null avatarUrl for users without avatar", async () => {
    const res = await request(app).get("/posts");
    const bobPosts = res.body.filter((p) => p.username === "bob");

    expect(bobPosts.length).toBeGreaterThan(0);
    for (const post of bobPosts) {
      expect(post.avatarUrl).toBeNull();
    }
  });
});
